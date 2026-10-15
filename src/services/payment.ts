import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { Pool } from 'pg';

import { inTransaction } from '@/db/transaction';
import { quotedSchema } from '@/db/schema-name';
import {
  calculatePackageTransition,
  AccessService,
  type EntitlementTier,
  type PurchasablePackage,
} from '@/services/access';

/**
 * Paket Madevi (01-KEPUTUSAN-AKTIF-MADEVI, P06):
 *   FREE    — lima trial Tools total + brosur School
 *   PLUS    — Tools penuh Rp25.000 seumur hidup
 *   PRO     — School + Tools Rp75.000 seumur hidup
 *   UPGRADE — pemilik Plus membayar Rp50.000 naik ke Pro
 *   LOVE    — grant Admin, default setara Pro (tidak dijual)
 */
export type PackageKind = 'FREE' | 'PLUS' | 'PRO' | 'UPGRADE' | 'LOVE';

/** Harga SELALU dari payment_settings (server), tidak pernah dari UI (04). */
const PACKAGE_PRICE_KEYS: Record<Exclude<PackageKind, 'FREE' | 'LOVE'>, string> = {
  PLUS: 'PLUS_PRICE',
  PRO: 'PRO_PRICE',
  UPGRADE: 'UPGRADE_PLUS_TO_PRO',
};

export class PaymentService {
  private readonly schema: string;
  private readonly rawSchema: string;

  constructor(
    private pool: Pool,
    schemaName: string = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {
    this.rawSchema = schemaName.replace(/^"|"$/g, '');
    this.schema = quotedSchema(this.rawSchema);
  }

  /**
   * Buat order pembayaran untuk paket Madevi (P06).
   *
   * Harga SELALU dihitung server dari `payment_settings` — UI tidak boleh
   * menjadi sumber kebenaran harga (`04`). `packageKind` memilih key:
   *   PLUS  -> PLUS_PRICE         (Rp25.000, Tools seumur hidup)
   *   PRO   -> PRO_PRICE          (Rp75.000, School + Tools)
   *   UPGRADE -> UPGRADE_PLUS_TO_PRO (Rp50.000, Plus -> Pro)
   *
   * Eligibility upgrade (hanya pemilik Plus) diperiksa di sini, jadi mengubah
   * request UI tidak bisa membeli paket yang tidak berhak.
   */
  async createOrder(
    principalId: string,
    options: { packageKind?: PackageKind; promoCode?: string } = {},
  ) {
    const requested = options.packageKind ?? 'PLUS';
    if (requested === 'FREE' || requested === 'LOVE') {
      throw new Error(`Paket tidak dapat dibeli: ${requested}`);
    }

    const current = await this.currentPackage(principalId);
    const transition = calculatePackageTransition(
      current as EntitlementTier,
      requested as PurchasablePackage,
    );
    if (!transition.allowed) {
      throw new Error(transition.reason ?? `Pembelian paket ${requested} tidak diizinkan`);
    }

    const effectivePackage = transition.effectivePackage;
    const priceKey = PACKAGE_PRICE_KEYS[effectivePackage];
    if (!priceKey) throw new Error(`Paket tidak dikenal: ${effectivePackage}`);

    const configured = await this.pool.query<{ amount: string }>(
      `SELECT amount FROM ${this.schema}.payment_settings
        WHERE key = $1 AND active = true LIMIT 1`,
      [priceKey],
    );
    const basePrice =
      configured.rows[0]?.amount !== undefined
        ? Number(configured.rows[0].amount)
        : transition.price;
    if (!Number.isSafeInteger(basePrice) || basePrice < 0)
      throw new Error(`Harga untuk paket ${effectivePackage} belum dikonfigurasi Admin`);

    let discountAmount = 0;
    let promoId = null;

    if (options.promoCode) {
      const promoCheck = await this.pool.query(
        `SELECT id, discount_type, discount_value, max_uses, current_uses FROM ${this.schema}.payment_promos 
         WHERE code = $1 AND start_at <= NOW() AND end_at >= NOW()`,
        [options.promoCode],
      );
      if (promoCheck.rowCount && promoCheck.rowCount > 0) {
        const promo = promoCheck.rows[0];
        if (promo.max_uses === 0 || promo.current_uses < promo.max_uses) {
          promoId = promo.id;
          if (promo.discount_type === 'PERCENT') {
            discountAmount = basePrice * (promo.discount_value / 100);
          } else {
            discountAmount = promo.discount_value;
          }

          await this.pool.query(
            `UPDATE ${this.schema}.payment_promos
                SET current_uses = current_uses + 1
              WHERE id = $1
                AND (max_uses = 0 OR current_uses < max_uses)`,
            [promo.id],
          );
        }
      }
    }

    const finalPrice = Math.max(0, basePrice - discountAmount);
    const orderId = randomUUID();

    await this.pool.query(
      `INSERT INTO ${this.schema}.payment_orders (
        id, principal_id, base_price, promo_id, discount_amount, final_price, status, is_simulation, package_kind
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [orderId, principalId, basePrice, promoId, discountAmount, finalPrice, 'CREATED', true, effectivePackage],
    );

    return { id: orderId, packageKind: effectivePackage, basePrice, discountAmount, finalPrice, status: 'CREATED' };
  }

  /**
   * Paket saat ini menurut ledger (0021). FREE bila belum ada entri — UI
   * memakai ini untuk menjelaskan paket saat ini + jalur upgrade (P06).
   */
  async currentPackage(principalId: string): Promise<PackageKind> {
    const result = await this.pool.query<{ entitlement: string }>(
      `SELECT entitlement FROM ${this.schema}.principal_entitlement_current
        WHERE principal_id = $1 LIMIT 1`,
      [principalId],
    );
    const entitlement = result.rows[0]?.entitlement;
    if (entitlement === 'PLUS' || entitlement === 'PRO' || entitlement === 'LOVE') {
      return entitlement;
    }
    return 'FREE';
  }

  /**
   * Konfirmasi pembayaran manual oleh Owner (lokal).
   * Menggantikan webhook gateway eksternal yang tidak tersedia di Madevi lokal.
   * Hanya bisa dipanggil Owner melalui endpoint terotorisasi (CSRF + signature).
   */
  async handleManualConfirmation(orderId: string, providerEventId: string) {
    const existing = await this.pool.query(
      `SELECT id FROM ${this.schema}.payment_orders WHERE provider_event_id = $1`,
      [providerEventId],
    );
    if (existing.rowCount && existing.rowCount > 0) {
      return { status: 'PAID', codeIssued: false, message: 'Idempotent hit' };
    }

    const order = await this.pool.query<{
      id: string;
      principal_id: string;
      status: string;
      package_kind: string | null;
    }>(
      `SELECT id, principal_id, status, package_kind FROM ${this.schema}.payment_orders WHERE id = $1`,
      [orderId],
    );
    if (!order.rowCount) throw new Error('Order not found');

    if (order.rows[0].status === 'PAID') return { status: 'PAID', codeIssued: false };

    await this.pool.query(
      `UPDATE ${this.schema}.payment_orders SET status = 'PAID', provider_event_id = $2 WHERE id = $1`,
      [orderId, providerEventId],
    );

    const pkgKind = order.rows[0].package_kind;
    const targetEntitlement = pkgKind === 'PLUS' ? 'PLUS' : 'PRO';

    const codeId = randomUUID();
    const code = randomBytes(12).toString('base64url');
    const codeHash = hashCode(code);

    await this.pool.query(
      `INSERT INTO ${this.schema}.payment_codes (
        id, code_hash, code_type, principal_id, order_id, expires_at, target_entitlement
      ) VALUES ($1, $2, $3, $4, $5, NOW() + INTERVAL '7 days', $6)`,
      [codeId, codeHash, 'AKSES', order.rows[0].principal_id, orderId, targetEntitlement],
    );

    return { status: 'PAID', codeIssued: true, code };
  }

  /** Compatibility name for the local simulation/integration contract. */
  async handleWebhookMock(orderId: string, eventId: string) {
    return this.handleManualConfirmation(orderId, eventId);
  }

  async redeemCode(principalId: string, codeStr: string) {
    return inTransaction(this.pool, async (client) => {
      const check = await client.query<{
        id: string;
        status: string;
        expires_at: Date;
        code_type: string;
        order_id: string | null;
        target_entitlement: string | null;
        private_reason: string | null;
      }>(
        `SELECT id, status, expires_at, code_type, order_id, target_entitlement, private_reason
           FROM ${this.schema}.payment_codes
          WHERE code_hash = $1 AND principal_id = $2 FOR UPDATE`,
        [hashCode(codeStr), principalId],
      );
      if (!check.rowCount) throw new Error('Invalid code');

      const code = check.rows[0];
      if (code.status !== 'ISSUED') throw new Error('Code already redeemed or revoked');
      if (new Date(code.expires_at) < new Date()) throw new Error('Code expired');

      const frozen = await client.query<{ is_frozen: boolean }>(
        `SELECT COALESCE(is_frozen, false) AS is_frozen
           FROM ${this.schema}.entitlements
          WHERE principal_id = $1
          LIMIT 1`,
        [principalId],
      );
      if (frozen.rows[0]?.is_frozen) throw new Error('Akses akun sedang ditinjau Admin');

      await client.query(
        `UPDATE ${this.schema}.payment_codes SET status = 'REDEEMED', redeemed_at = NOW() WHERE id = $1`,
        [code.id],
      );

      // Tentukan target entitlement
      let targetTier: EntitlementTier = 'PRO';
      let changeKind: 'PURCHASE' | 'UPGRADE' | 'GRANT_LOVE' = 'PURCHASE';
      let source: 'PAYMENT' | 'ADMIN_MANUAL' = 'PAYMENT';
      let amountMinor: number | null = null;

      if (code.code_type === 'BANTUAN' || code.target_entitlement === 'LOVE') {
        targetTier = 'LOVE';
        changeKind = 'GRANT_LOVE';
        source = 'ADMIN_MANUAL';
      } else {
        if (code.target_entitlement === 'PLUS') targetTier = 'PLUS';
        else targetTier = 'PRO';

        if (code.order_id) {
          const ord = await client.query<{ package_kind: string | null; final_price: string }>(
            `SELECT package_kind, final_price FROM ${this.schema}.payment_orders WHERE id = $1`,
            [code.order_id],
          );
          if (ord.rows[0]?.package_kind === 'UPGRADE') {
            changeKind = 'UPGRADE';
          }
          amountMinor = ord.rows[0] ? Number(ord.rows[0].final_price) : null;
        }
      }

      // Catat ke ledger dan update entitlement aktif secara atomik
      const accessService = new AccessService(this.pool, this.rawSchema);
      await accessService.recordEntitlementChange(client, {
        principalId,
        entitlement: targetTier,
        changeKind,
        source,
        paymentOrderId: code.order_id,
        amountMinor,
        reason: code.private_reason || `Redeem kode ${code.code_type} paket ${targetTier}`,
      });

      // Backward compatibility dengan tabel entitlements legacy
      await client.query(
        `INSERT INTO ${this.schema}.entitlements (id, principal_id, has_lifetime_access, access_granted_at) 
         VALUES ($1, $2, true, NOW())
         ON CONFLICT (principal_id) DO UPDATE SET has_lifetime_access = true, access_granted_at = NOW()`,
        [randomUUID(), principalId],
      );

      return { success: true, entitlement: targetTier };
    });
  }

  // BANTUAN Admin: kode sekali pakai tanpa order, alasan privat, kedaluwarsa 7 hari.
  // Tidak melewati persetujuan wali (O-01 tetap gerbang aktivasi anak nyata).
  async issueGrant(issuerOwnerId: string, targetPrincipalId: string, reason: string) {
    const text = reason?.trim() ?? '';
    if (text.length < 10 || text.length > 1000) throw new Error('Alasan bantuan 10–1000 karakter');
    const target = await this.pool.query(`SELECT id FROM ${this.schema}.principals WHERE id = $1`, [
      targetPrincipalId,
    ]);
    if (!target.rowCount) throw new Error('Akun target tidak ditemukan');
    const codeId = randomUUID();
    // Kode plaintext hanya dikembalikan SEKALI ke Admin; server menyimpan hash.
    // Sebelumnya plaintext dibuang sehingga kode tidak pernah bisa diredeem.
    const code = randomBytes(12).toString('base64url');
    const codeHash = hashCode(code);
    await this.pool.query(
      `INSERT INTO ${this.schema}.payment_codes (
        id, code_hash, code_type, principal_id, order_id, private_reason, expires_at, target_entitlement
      ) VALUES ($1, $2, 'BANTUAN', $3, NULL, $4, NOW() + INTERVAL '7 days', 'LOVE')`,
      [codeId, codeHash, targetPrincipalId, text],
    );
    void issuerOwnerId;
    return { id: codeId, code, expiresInDays: 7 };
  }

  // Terbit ulang: cabut kode lama (REVOKED) lalu terbitkan pengganti 7 hari. Tanpa bayar ulang.
  async reissueCode(principalId: string, oldCodeId: string) {
    const check = await this.pool.query(
      `SELECT id, code_type, order_id, private_reason FROM ${this.schema}.payment_codes WHERE id = $1 AND principal_id = $2`,
      [oldCodeId, principalId],
    );
    const old = check.rows[0] as
      | {
          id: string;
          code_type: 'AKSES' | 'BANTUAN';
          order_id: string | null;
          private_reason: string;
        }
      | undefined;
    if (!old) throw new Error('Kode tidak ditemukan');
    const codeId = randomUUID();
    // Kode plaintext hanya dikembalikan SEKALI ke Admin; server menyimpan hash.
    const code = randomBytes(12).toString('base64url');
    const codeHash = hashCode(code);
    await this.pool.query(
      `UPDATE ${this.schema}.payment_codes SET status = 'REVOKED' WHERE id = $1`,
      [old.id],
    );
    await this.pool.query(
      `INSERT INTO ${this.schema}.payment_codes (id, code_hash, code_type, principal_id, order_id, private_reason, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '7 days')`,
      [codeId, codeHash, old.code_type, principalId, old.order_id, old.private_reason ?? ''],
    );
    return { id: codeId, code, expiresInDays: 7 };
  }

  // Sengketa/chargeback lokal: order FROZEN + entitlement beku (artikel terkunci).
  // Sosial tetap aktif (tidak disentuh). Admin review lanjutan.
  async recordChargeback(orderId: string, reason: string) {
    const text = reason?.trim() ?? '';
    if (text.length < 5) throw new Error('Alasan sengketa minimal 5 karakter');
    const order = await this.pool.query(
      `SELECT id, principal_id, status FROM ${this.schema}.payment_orders WHERE id = $1`,
      [orderId],
    );
    if (!order.rowCount) throw new Error('Order tidak ditemukan');
    await this.pool.query(
      `UPDATE ${this.schema}.payment_orders SET status = 'FROZEN' WHERE id = $1`,
      [orderId],
    );
    await this.pool.query(
      `INSERT INTO ${this.schema}.entitlements (id, principal_id, is_frozen)
       VALUES ($1, $2, true)
       ON CONFLICT (principal_id) DO UPDATE SET is_frozen = true`,
      [randomUUID(), order.rows[0].principal_id],
    );
    return { orderId, status: 'FROZEN' as const };
  }
}

function hashCode(value: string) {
  return createHash('sha256').update(value).digest('hex');
}
