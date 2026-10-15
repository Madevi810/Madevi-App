import { randomUUID } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';

import { ApiError } from '@/api/errors';
import type { Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';

export type EntitlementTier = 'FREE' | 'PLUS' | 'PRO' | 'LOVE';
export type PurchasablePackage = 'PLUS' | 'PRO' | 'UPGRADE';

export const DEFAULT_PRICES = {
  PLUS: 25_000,
  PRO: 75_000,
  UPGRADE: 50_000,
} as const;

export interface PackageTransitionResult {
  allowed: boolean;
  effectivePackage: PurchasablePackage;
  price: number;
  reason?: string;
}

export interface AccessSummary {
  tier: EntitlementTier;
  toolsTrialRemaining: number | null;
  toolsTrialTotal: number;
  canAccessTools: boolean;
  canAccessSchool: boolean;
  hasLifetimeAccess: boolean;
}

export interface ToolsTrialResult {
  allowed: boolean;
  consumedTrial: boolean;
  remaining: number | null;
}

/**
 * Kalkulasi transisi paket dan rekonsiliasi harga di server.
 * Menegakkan aturan bebas dark pattern dan anti-double-charging:
 * - Pemilik Plus yang memilih Pro otomatis dikenakan Upgrade (selisih tepat Rp50.000).
 * - Pemilik Pro atau Love tidak dapat membeli paket komersial.
 * - Downgrade tidak diizinkan.
 */
export function calculatePackageTransition(
  currentTier: EntitlementTier,
  requestedPackage: PurchasablePackage,
): PackageTransitionResult {
  if (currentTier === 'LOVE') {
    return {
      allowed: false,
      effectivePackage: requestedPackage,
      price: 0,
      reason: 'Akun Anda memiliki akses Love (setara Pro). Tidak perlu melakukan pembelian paket.',
    };
  }

  if (currentTier === 'PRO') {
    return {
      allowed: false,
      effectivePackage: requestedPackage,
      price: 0,
      reason: 'Anda sudah memiliki paket Pro (akses penuh School dan seluruh Tools).',
    };
  }

  if (currentTier === 'PLUS') {
    if (requestedPackage === 'PLUS') {
      return {
        allowed: false,
        effectivePackage: 'PLUS',
        price: 0,
        reason: 'Anda sudah memiliki paket Plus.',
      };
    }
    // Pengguna Plus yang meminta PRO atau UPGRADE dikenakan selisih tepat Rp50.000 tanpa tagihan ganda
    return {
      allowed: true,
      effectivePackage: 'UPGRADE',
      price: DEFAULT_PRICES.UPGRADE,
    };
  }

  // Pengguna FREE
  if (requestedPackage === 'UPGRADE') {
    return {
      allowed: false,
      effectivePackage: 'UPGRADE',
      price: 0,
      reason: 'Upgrade hanya tersedia bagi pengguna yang telah memiliki paket Plus.',
    };
  }

  return {
    allowed: true,
    effectivePackage: requestedPackage,
    price: requestedPackage === 'PRO' ? DEFAULT_PRICES.PRO : DEFAULT_PRICES.PLUS,
  };
}

export class AccessService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
    private readonly now: () => Date = () => new Date(),
  ) {
    this.schema = quotedSchema(schemaName.replace(/^"|"$/g, ''));
  }

  /**
   * Mengambil paket entitlement aktif saat ini dari principal_entitlement_current.
   */
  async getCurrentEntitlement(principalId: string): Promise<EntitlementTier> {
    const res = await this.pool.query<{ entitlement: string }>(
      `SELECT entitlement FROM ${this.schema}.principal_entitlement_current WHERE principal_id = $1 LIMIT 1`,
      [principalId],
    );
    const row = res.rows[0];
    if (row && (row.entitlement === 'PLUS' || row.entitlement === 'PRO' || row.entitlement === 'LOVE')) {
      return row.entitlement as EntitlementTier;
    }
    return 'FREE';
  }

  /**
   * Menghasilkan ringkasan akses komprehensif untuk antarmuka pengguna.
   */
  async getAccessSummary(principalId: string): Promise<AccessSummary> {
    const tier = await this.getCurrentEntitlement(principalId);
    const principalRow = await this.pool.query<{
      tools_trial_remaining: number | null;
      tools_trial_total: number;
    }>(
      `SELECT tools_trial_remaining, tools_trial_total FROM ${this.schema}.principals WHERE id = $1`,
      [principalId],
    );
    const p = principalRow.rows[0];
    const trialTotal = p?.tools_trial_total ?? 5;
    const trialRemaining = p?.tools_trial_remaining ?? trialTotal;

    const hasLifetimeAccess = tier === 'PLUS' || tier === 'PRO' || tier === 'LOVE';
    const canAccessTools = hasLifetimeAccess || trialRemaining > 0;
    const canAccessSchool = tier === 'PRO' || tier === 'LOVE';

    return {
      tier,
      toolsTrialRemaining: hasLifetimeAccess ? null : trialRemaining,
      toolsTrialTotal: trialTotal,
      canAccessTools,
      canAccessSchool,
      hasLifetimeAccess,
    };
  }

  /**
   * Pencatatan atomik perubahan hak akses ke entitlement_ledger (append-only),
   * pembaruan principal_entitlement_current, sinkronisasi legacy kolom principals,
   * dan pencatatan audit event ke madevi_access_events.
   */
  async recordEntitlementChange(
    client: PoolClient,
    input: {
      principalId: string;
      entitlement: EntitlementTier;
      changeKind: 'INITIAL_FREE' | 'PURCHASE' | 'UPGRADE' | 'GRANT_LOVE' | 'REVOKED';
      source: 'SYSTEM' | 'PAYMENT' | 'ADMIN_MANUAL';
      paymentOrderId?: string | null;
      amountMinor?: number | null;
      currency?: string;
      reason: string;
      grantedBy?: string | null;
      loveRestrictionNote?: string;
    },
  ) {
    const ledgerId = randomUUID();
    const eventId = randomUUID();
    const now = this.now();

    // 1. Insert ke ledger append-only
    await client.query(
      `INSERT INTO ${this.schema}.entitlement_ledger (
        id, principal_id, entitlement, change_kind, source, payment_order_id,
        amount_minor, currency, reason, granted_by, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        ledgerId,
        input.principalId,
        input.entitlement,
        input.changeKind,
        input.source,
        input.paymentOrderId ?? null,
        input.amountMinor ?? null,
        input.currency ?? 'IDR',
        input.reason.slice(0, 500),
        input.grantedBy ?? null,
        now,
      ],
    );

    // 2. Upsert ke principal_entitlement_current
    await client.query(
      `INSERT INTO ${this.schema}.principal_entitlement_current (
        principal_id, entitlement, ledger_entry_id, love_restriction_note, updated_at
      ) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (principal_id) DO UPDATE SET
        entitlement = EXCLUDED.entitlement,
        ledger_entry_id = EXCLUDED.ledger_entry_id,
        love_restriction_note = EXCLUDED.love_restriction_note,
        updated_at = EXCLUDED.updated_at`,
      [input.principalId, input.entitlement, ledgerId, input.loveRestrictionNote ?? '', now],
    );

    // 3. Sinkronkan legacy status pada principals
    const legacyStatus = input.entitlement === 'FREE' ? 'NONE' : 'PAID';
    await client.query(
      `UPDATE ${this.schema}.principals
          SET entitlement_status = $2, updated_at = $3
        WHERE id = $1`,
      [input.principalId, legacyStatus, now],
    );

    // 4. Audit event di madevi_access_events
    const eventKind =
      input.changeKind === 'GRANT_LOVE'
        ? 'LOVE_GRANTED'
        : input.changeKind === 'PURCHASE' || input.changeKind === 'UPGRADE'
          ? 'PAYMENT_COMPLETED'
          : 'ENTITLEMENT_CHANGED';

    await client.query(
      `INSERT INTO ${this.schema}.madevi_access_events (
        id, principal_id, event_kind, detail, performed_by, created_at
      ) VALUES ($1, $2, $3, $4::jsonb, $5, $6)`,
      [
        eventId,
        input.principalId,
        eventKind,
        JSON.stringify({
          entitlement: input.entitlement,
          changeKind: input.changeKind,
          source: input.source,
          reason: input.reason,
          ledgerId,
          paymentOrderId: input.paymentOrderId ?? null,
        }),
        input.grantedBy ?? null,
        now,
      ],
    );

    return { ledgerId, eventId, entitlement: input.entitlement };
  }

  /**
   * Reservasi trial tools secara atomik dan idempoten sebelum eksekusi.
   */
  async reserveToolsTrial(
    principal: Principal,
    toolId: string,
    idempotencyKey: string,
  ): Promise<ToolsTrialResult> {
    return inTransaction(this.pool, async (client) => {
      // 1. Kunci baris akun principal
      const account = await client.query<{
        approval_status: string;
        entitlement_status: string;
        tools_trial_total: number;
        tools_trial_remaining: number | null;
      }>(
        `SELECT approval_status, entitlement_status, tools_trial_total, tools_trial_remaining
           FROM ${this.schema}.principals WHERE id = $1 FOR UPDATE`,
        [principal.id],
      );
      const row = account.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Akun tidak ditemukan');
      if (row.approval_status !== 'APPROVED') {
        throw new ApiError('ACCESS_DENIED', 'Akun belum disetujui');
      }

      // 2. Periksa apakah paket aktif adalah PLUS, PRO, atau LOVE
      const ent = await client.query<{ entitlement: string }>(
        `SELECT entitlement FROM ${this.schema}.principal_entitlement_current WHERE principal_id = $1`,
        [principal.id],
      );
      const currentTier = ent.rows[0]?.entitlement;
      if (currentTier === 'PLUS' || currentTier === 'PRO' || currentTier === 'LOVE') {
        return { allowed: true, consumedTrial: false, remaining: null };
      }

      // 3. Inisialisasi counter trial bila belum terisi
      if (row.tools_trial_remaining === null) {
        await client.query(
          `UPDATE ${this.schema}.principals
              SET tools_trial_remaining = tools_trial_total,
                  tools_trial_setup_at = $2
            WHERE id = $1`,
          [principal.id, this.now()],
        );
        row.tools_trial_remaining = row.tools_trial_total;
      }

      // 4. Kuota habis
      if (row.tools_trial_remaining <= 0) {
        return { allowed: false, consumedTrial: false, remaining: 0 };
      }

      // 5. Cek idempotensi reservasi sebelumnya
      const existing = await client.query<{ status: string }>(
        `SELECT status FROM ${this.schema}.tools_trial_reservations
          WHERE principal_id = $1 AND idempotency_key = $2 FOR UPDATE`,
        [principal.id, idempotencyKey],
      );
      const prior = existing.rows[0];
      if (prior) {
        if (prior.status !== 'RELEASED') {
          return {
            allowed: true,
            consumedTrial: prior.status === 'COMMITTED',
            remaining: row.tools_trial_remaining,
          };
        }
      }

      // 6. Simpan reservasi baru / update jika sebelumnya RELEASED
      const reservationId = randomUUID();
      await client.query(
        `INSERT INTO ${this.schema}.tools_trial_reservations
            (id, principal_id, idempotency_key, tool_kind, status, reserved_at)
         VALUES ($1, $2, $3, $4, 'RESERVED', $5)
         ON CONFLICT (principal_id, idempotency_key) DO UPDATE
            SET status = 'RESERVED',
                tool_kind = EXCLUDED.tool_kind,
                reserved_at = EXCLUDED.reserved_at,
                released_at = NULL
          WHERE tools_trial_reservations.status = 'RELEASED'`,
        [reservationId, principal.id, idempotencyKey, toolId, this.now()],
      );

      return {
        allowed: true,
        consumedTrial: false,
        remaining: row.tools_trial_remaining,
      };
    });
  }

  /**
   * Commit pengurangan trial tools setelah eksekusi alat berhasil.
   */
  async commitToolsTrial(
    principal: Principal,
    toolId: string,
    idempotencyKey: string,
  ): Promise<{ consumedTrial: boolean; remaining: number | null }> {
    return inTransaction(this.pool, async (client) => {
      // 1. Periksa apakah paket adalah PLUS, PRO, atau LOVE
      const ent = await client.query<{ entitlement: string }>(
        `SELECT entitlement FROM ${this.schema}.principal_entitlement_current WHERE principal_id = $1`,
        [principal.id],
      );
      const currentTier = ent.rows[0]?.entitlement;
      if (currentTier === 'PLUS' || currentTier === 'PRO' || currentTier === 'LOVE') {
        return { consumedTrial: false, remaining: null };
      }

      // 2. Kunci reservasi
      const reservation = await client.query<{ id: string; status: string }>(
        `SELECT id, status FROM ${this.schema}.tools_trial_reservations
          WHERE principal_id = $1 AND idempotency_key = $2 FOR UPDATE`,
        [principal.id, idempotencyKey],
      );
      const res = reservation.rows[0];
      if (!res) throw new ApiError('NOT_FOUND', 'Reservasi trial tidak ditemukan');
      if (res.status === 'COMMITTED') {
        const pr = await client.query<{ tools_trial_remaining: number }>(
          `SELECT tools_trial_remaining FROM ${this.schema}.principals WHERE id = $1`,
          [principal.id],
        );
        return { consumedTrial: false, remaining: pr.rows[0]?.tools_trial_remaining ?? 0 };
      }
      if (res.status === 'RELEASED') {
        throw new ApiError('VALIDATION_FAILED', 'Reservasi sudah dilepaskan');
      }

      // 3. Kunci akun dan kurangi counter trial
      const account = await client.query<{ tools_trial_remaining: number }>(
        `SELECT tools_trial_remaining FROM ${this.schema}.principals WHERE id = $1 FOR UPDATE`,
        [principal.id],
      );
      const remaining = account.rows[0]?.tools_trial_remaining ?? 0;
      if (remaining <= 0) {
        await client.query(
          `UPDATE ${this.schema}.tools_trial_reservations
              SET status = 'RELEASED', released_at = $3
            WHERE id = $1 AND idempotency_key = $2`,
          [res.id, idempotencyKey, this.now()],
        );
        return { consumedTrial: false, remaining: 0 };
      }

      const nextRemaining = remaining - 1;
      await client.query(
        `UPDATE ${this.schema}.principals SET tools_trial_remaining = $2 WHERE id = $1`,
        [principal.id, nextRemaining],
      );

      // 4. Update status reservasi menjadi COMMITTED
      await client.query(
        `UPDATE ${this.schema}.tools_trial_reservations
            SET status = 'COMMITTED', committed_at = $3
          WHERE id = $1 AND idempotency_key = $2`,
        [res.id, idempotencyKey, this.now()],
      );

      // 5. Catat audit event
      await client.query(
        `INSERT INTO ${this.schema}.madevi_access_events (
          id, principal_id, event_kind, detail, performed_by, created_at
        ) VALUES ($1, $2, 'TRIAL_CONSUMED', $3::jsonb, $4, $5)`,
        [
          randomUUID(),
          principal.id,
          JSON.stringify({ toolId, idempotencyKey, remaining: nextRemaining }),
          principal.id,
          this.now(),
        ],
      );

      return { consumedTrial: true, remaining: nextRemaining };
    });
  }

  /**
   * Lepaskan reservasi trial jika validasi input atau proses gagal.
   */
  async releaseToolsTrial(principal: Principal, idempotencyKey: string) {
    return inTransaction(this.pool, async (client) => {
      const reservation = await client.query<{ id: string; status: string; tool_kind: string }>(
        `SELECT id, status, tool_kind FROM ${this.schema}.tools_trial_reservations
          WHERE principal_id = $1 AND idempotency_key = $2 FOR UPDATE`,
        [principal.id, idempotencyKey],
      );
      const res = reservation.rows[0];
      if (!res || res.status === 'COMMITTED' || res.status === 'RELEASED') return;

      await client.query(
        `UPDATE ${this.schema}.tools_trial_reservations
            SET status = 'RELEASED', released_at = $3
          WHERE id = $1 AND idempotency_key = $2`,
        [res.id, idempotencyKey, this.now()],
      );

      await client.query(
        `INSERT INTO ${this.schema}.madevi_access_events (
          id, principal_id, event_kind, detail, performed_by, created_at
        ) VALUES ($1, $2, 'TRIAL_REFUNDED', $3::jsonb, $4, $5)`,
        [
          randomUUID(),
          principal.id,
          JSON.stringify({ toolId: res.tool_kind, idempotencyKey }),
          principal.id,
          this.now(),
        ],
      );
    });
  }

  /**
   * Bantuan akses manual Love oleh Admin (default setara Pro).
   */
  async grantLove(
    adminPrincipal: Principal,
    targetPrincipalId: string,
    reason: string,
    restrictionNote = '',
  ) {
    if (adminPrincipal.role !== 'OWNER') {
      throw new ApiError('ACCESS_DENIED', 'Hanya Admin yang dapat memberikan akses bantuan Love');
    }
    const cleanReason = reason.trim();
    if (cleanReason.length < 10) {
      throw new ApiError('VALIDATION_FAILED', 'Alasan bantuan Love minimal 10 karakter');
    }

    return inTransaction(this.pool, async (client) => {
      return this.recordEntitlementChange(client, {
        principalId: targetPrincipalId,
        entitlement: 'LOVE',
        changeKind: 'GRANT_LOVE',
        source: 'ADMIN_MANUAL',
        reason: cleanReason,
        grantedBy: adminPrincipal.id,
        loveRestrictionNote: restrictionNote,
      });
    });
  }

  /**
   * Koreksi atau pencabutan akses oleh Admin (audit trail append-only).
   */
  async revokeOrCorrect(
    adminPrincipal: Principal,
    targetPrincipalId: string,
    newTier: EntitlementTier,
    reason: string,
  ) {
    if (adminPrincipal.role !== 'OWNER') {
      throw new ApiError('ACCESS_DENIED', 'Hanya Admin yang dapat mengoreksi hak akses');
    }
    const cleanReason = reason.trim();
    if (cleanReason.length < 10) {
      throw new ApiError('VALIDATION_FAILED', 'Alasan koreksi akses minimal 10 karakter');
    }

    return inTransaction(this.pool, async (client) => {
      return this.recordEntitlementChange(client, {
        principalId: targetPrincipalId,
        entitlement: newTier,
        changeKind: 'REVOKED',
        source: 'ADMIN_MANUAL',
        reason: cleanReason,
        grantedBy: adminPrincipal.id,
      });
    });
  }
}
