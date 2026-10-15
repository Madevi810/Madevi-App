/**
 * BundleService — "Bundel Ongkir Tetangga" (INOVASI-20261014-0940 IDE 2).
 *
 * Patungan ongkir berbasis kota: user satu kota mengelompokkan item wishlist
 * afiliasi ke satu "bundel" (maks 5 orang). Estimasi ongkir dibagi rata
 * antar anggota; tiap orang tetap checkout sendiri lewat link marketplace
 * masing-masing. TIDAK ADA uang yang lewat Madevi — murni koordinasi.
 *
 * Aturan:
 *   - createBundle(): kota wajib dari daftar tetap; pembuat otomatis jadi
 *     anggota #1.
 *   - joinBundle(): tolak jika PENUH/DITUTUP atau user sudah di bundel lain
 *     yang TERBUKA di kota yang sama (hindari double-slot).
 *   - estimateSaving(): (ongkir_satuan × n − ongkir_bundel) ÷ n, dari tabel
 *     tarif statis admin; SELALU label "estimasi simulasi".
 *   - autoClose(): n = slot_maks → status PENUH; tidak ada transaksi.
 *   - leaveBundle(): hanya sebelum PENUH; slot terbuka lagi.
 */

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';

/** Slot maksimum per bundel (aturan ide: maks 5 orang). */
export const BUNDLE_SLOT_MAX = 5;

/**
 * Tabel tarif ongkir statis per kota (dikelola admin, SIMULASI berlabel
 * jujur — angka pasti mengikuti marketplace). ongkir_satuan = kirim 1 paket,
 * ongkir_bundel = kirim n paket sekaligus ke kota yang sama.
 */
export interface ShippingTariff {
  city: string;
  singleFee: number;
  bundleFee: number;
}

export const SHIPPING_TARIFFS: readonly ShippingTariff[] = [
  { city: 'Jakarta', singleFee: 15000, bundleFee: 22000 },
  { city: 'Bandung', singleFee: 12000, bundleFee: 18000 },
  { city: 'Surabaya', singleFee: 14000, bundleFee: 21000 },
  { city: 'Yogyakarta', singleFee: 13000, bundleFee: 19500 },
  { city: 'Semarang', singleFee: 13000, bundleFee: 20000 },
  { city: 'Medan', singleFee: 20000, bundleFee: 32000 },
  { city: 'Palembang', singleFee: 18000, bundleFee: 28000 },
  { city: 'Makassar', singleFee: 22000, bundleFee: 35000 },
  { city: 'Denpasar', singleFee: 17000, bundleFee: 26000 },
  { city: 'Balikpapan', singleFee: 21000, bundleFee: 33000 },
  { city: 'Pontianak', singleFee: 22000, bundleFee: 34000 },
  { city: 'Manado', singleFee: 24000, bundleFee: 38000 },
];

/** Daftar kota yang tersedia untuk bundel (dari tabel tarif). */
export const BUNDLE_CITIES: readonly string[] = SHIPPING_TARIFFS.map((t) => t.city);

/**
 * Estimasi hemat ongkir per orang (SIMULASI).
 *
 * Rumus: (ongkir_satuan × n − ongkir_bundel) ÷ n
 *
 * n = jumlah anggota aktual (bila 0/1 → hemat 0). Bilangan negatif
 * dibulatkan ke 0 — paling tidak bundel tidak merugikan.
 */
export function estimateSaving(
  tariff: ShippingTariff | undefined,
  memberCount: number,
): number {
  if (!tariff || memberCount < 1) return 0;
  const n = Math.min(memberCount, BUNDLE_SLOT_MAX);
  const total = tariff.singleFee * n - tariff.bundleFee;
  return Math.max(0, Math.round(total / n));
}

export interface BundleItemInput {
  name: string;
  price: number;
  link: string;
}

export interface BundleItemRow {
  id: string;
  userId: string;
  userName: string | null;
  /** True bila item ini milik viewer yang login. */
  mine: boolean;
  product: { name: string; price: number; link: string };
}

export interface BundleRow {
  id: string;
  city: string;
  status: string;
  slotMaks: number;
  memberCount: number;
  savingPerMember: number;
  createdByMe: boolean;
  createdAt: string;
  items: BundleItemRow[];
}

export class BundleService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /** Bentuk bundel baru (kota dari daftar tetap; pembuat = anggota #1). */
  async createBundle(
    principalId: string,
    input: { city: string; item: BundleItemInput },
  ): Promise<BundleRow> {
    const city = input.city.trim();
    if (!BUNDLE_CITIES.includes(city)) {
      throw new ApiError('VALIDATION_FAILED', 'Kota tidak terdaftar');
    }
    if (!input.item.name.trim() || input.item.price < 0 || !input.item.link.trim()) {
      throw new ApiError('VALIDATION_FAILED', 'Item tidak valid');
    }

    return inTransaction(this.pool, async (client) => {
      // Pembuat tidak boleh sudah di bundel TERBUKA lain di kota yang sama.
      const existing = await client.query(
        `SELECT b.id FROM ${this.schema}.shipping_bundles b
          JOIN ${this.schema}.bundle_items i ON i.bundle_id = b.id
         WHERE b.city = $1 AND b.status = 'TERBUKA' AND i.user_id = $2`,
        [city, principalId],
      );
      if (existing.rows[0]) {
        throw new ApiError('IDEMPOTENCY_CONFLICT', 'Anda sudah tergabung di bundel terbuka di kota ini');
      }

      const bundle = await client.query(
        `INSERT INTO ${this.schema}.shipping_bundles (city, created_by)
         VALUES ($1, $2)
         RETURNING id, city, status, slot_maks, created_at`,
        [city, principalId],
      );
      const b = bundle.rows[0];
      if (!b) throw new ApiError('INTERNAL_ERROR', 'Gagal membuat bundel');

      await client.query(
        `INSERT INTO ${this.schema}.bundle_items (bundle_id, user_id, product_snapshot)
         VALUES ($1, $2, $3)`,
        [
          b.id,
          principalId,
          JSON.stringify({
            name: input.item.name.trim(),
            price: input.item.price,
            link: input.item.link.trim(),
          }),
        ],
      );

      const me = await client.query<{ display_name: string | null }>(
        `SELECT display_name FROM ${this.schema}.principals
          WHERE id = $1 AND deleted_at IS NULL`,
        [principalId],
      );

      return {
        id: b.id,
        city: b.city,
        status: b.status,
        slotMaks: b.slot_maks,
        memberCount: 1,
        savingPerMember: 0,
        createdByMe: true,
        createdAt: b.created_at,
        items: [
          {
            id: 'seed',
            userId: principalId,
            userName: me.rows[0]?.display_name ?? null,
            mine: true,
            product: {
              name: input.item.name.trim(),
              price: input.item.price,
              link: input.item.link.trim(),
            },
          },
        ],
      };
    });
  }

  /** Gabung bundel terbuka (tolak jika PENUH/DITUTUP atau double-slot). */
  async joinBundle(
    principalId: string,
    bundleId: string,
    item: BundleItemInput,
  ): Promise<BundleRow> {
    if (!item.name.trim() || item.price < 0 || !item.link.trim()) {
      throw new ApiError('VALIDATION_FAILED', 'Item tidak valid');
    }

    return inTransaction(this.pool, async (client) => {
      const bundle = await client.query(
        `SELECT id, city, status, slot_maks, created_by, created_at
           FROM ${this.schema}.shipping_bundles WHERE id = $1`,
        [bundleId],
      );
      const b = bundle.rows[0];
      if (!b) throw new ApiError('NOT_FOUND', 'Bundel tidak ditemukan');
      if (b.status === 'DITUTUP') {
        throw new ApiError('VALIDATION_FAILED', 'Bundel sudah ditutup');
      }

      const members = await client.query(
        `SELECT i.user_id, p.display_name, i.product_snapshot
           FROM ${this.schema}.bundle_items i
           LEFT JOIN ${this.schema}.principals p ON p.id = i.user_id
          WHERE i.bundle_id = $1`,
        [bundleId],
      );
      if (members.rows.some((r) => r.user_id === principalId)) {
        throw new ApiError('IDEMPOTENCY_CONFLICT', 'Anda sudah tergabung di bundel ini');
      }
      if (members.rows.length >= b.slot_maks) {
        // autoClose: n = slot_maks → status PENUH.
        await client.query(
          `UPDATE ${this.schema}.shipping_bundles SET status = 'PENUH' WHERE id = $1`,
          [bundleId],
        );
        throw new ApiError('VALIDATION_FAILED', 'Bundel sudah penuh');
      }

      await client.query(
        `INSERT INTO ${this.schema}.bundle_items (bundle_id, user_id, product_snapshot)
         VALUES ($1, $2, $3)`,
        [
          bundleId,
          principalId,
          JSON.stringify({
            name: item.name.trim(),
            price: item.price,
            link: item.link.trim(),
          }),
        ],
      );

      // autoClose: anggota mencapai slot_maks → PENUH.
      const count = members.rows.length + 1;
      if (count >= b.slot_maks) {
        await client.query(
          `UPDATE ${this.schema}.shipping_bundles SET status = 'PENUH' WHERE id = $1`,
          [bundleId],
        );
      }

      const tariff = SHIPPING_TARIFFS.find((t) => t.city === b.city);
      const updated = members.rows.map((r) => ({
        id: r.user_id,
        userId: r.user_id,
        userName: r.display_name ?? null,
        mine: r.user_id === principalId,
        product: r.product_snapshot as { name: string; price: number; link: string },
      }));
      const me = await client.query<{ display_name: string | null }>(
        `SELECT display_name FROM ${this.schema}.principals
          WHERE id = $1 AND deleted_at IS NULL`,
        [principalId],
      );
      updated.push({
        id: principalId,
        userId: principalId,
        userName: me.rows[0]?.display_name ?? null,
        mine: true,
        product: {
          name: item.name.trim(),
          price: item.price,
          link: item.link.trim(),
        },
      });

      return {
        id: b.id,
        city: b.city,
        status: count >= b.slot_maks ? 'PENUH' : b.status,
        slotMaks: b.slot_maks,
        memberCount: count,
        savingPerMember: estimateSaving(tariff, count),
        createdByMe: b.created_by === principalId,
        createdAt: b.created_at,
        items: updated,
      };
    });
  }

  /** Keluar dari bundel (hanya sebelum PENUH; slot terbuka lagi). */
  async leaveBundle(principalId: string, bundleId: string) {
    return inTransaction(this.pool, async (client) => {
      const bundle = await client.query(
        `SELECT id, status FROM ${this.schema}.shipping_bundles WHERE id = $1`,
        [bundleId],
      );
      const b = bundle.rows[0];
      if (!b) throw new ApiError('NOT_FOUND', 'Bundel tidak ditemukan');
      if (b.status === 'PENUH') {
        throw new ApiError('VALIDATION_FAILED', 'Bundel sudah penuh — tidak bisa keluar');
      }
      const result = await client.query(
        `DELETE FROM ${this.schema}.bundle_items
          WHERE bundle_id = $1 AND user_id = $2
        RETURNING id`,
        [bundleId, principalId],
      );
      if (!result.rows[0]) {
        throw new ApiError('NOT_FOUND', 'Anda tidak tergabung di bundel ini');
      }
      // Bila bundel jadi kosong → tutup.
      const remaining = await client.query(
        `SELECT COUNT(*)::int AS n FROM ${this.schema}.bundle_items WHERE bundle_id = $1`,
        [bundleId],
      );
      if ((remaining.rows[0]?.n ?? 0) === 0) {
        await client.query(
          `UPDATE ${this.schema}.shipping_bundles
              SET status = 'DITUTUP', closed_at = now() WHERE id = $1`,
          [bundleId],
        );
      }
      return { id: bundleId, left: true };
    });
  }

  /** Daftar bundel (filter kota; default TERBUKA). */
  async listBundles(
    principalId: string | null,
    input: { city?: string; status?: string } = {},
  ): Promise<BundleRow[]> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (input.city) {
      params.push(input.city);
      conditions.push(`b.city = $${params.length}`);
    }
    if (input.status) {
      params.push(input.status);
      conditions.push(`b.status = $${params.length}`);
    } else {
      conditions.push(`b.status <> 'DITUTUP'`);
    }
    const sql = `
      SELECT b.id, b.city, b.status, b.slot_maks, b.created_by, b.created_at
        FROM ${this.schema}.shipping_bundles b
       ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
       ORDER BY b.created_at DESC, b.id DESC`;
    const bundles = await this.pool.query(sql, params);

    const rows: BundleRow[] = [];
    for (const b of bundles.rows) {
      const members = await this.pool.query(
        `SELECT i.user_id, p.display_name, i.product_snapshot
           FROM ${this.schema}.bundle_items i
           LEFT JOIN ${this.schema}.principals p ON p.id = i.user_id
          WHERE i.bundle_id = $1
          ORDER BY i.created_at ASC`,
        [b.id],
      );
      const tariff = SHIPPING_TARIFFS.find((t) => t.city === b.city);
      rows.push({
        id: b.id,
        city: b.city,
        status: b.status,
        slotMaks: b.slot_maks,
        memberCount: members.rows.length,
        savingPerMember: estimateSaving(tariff, members.rows.length),
        createdByMe: principalId !== null && b.created_by === principalId,
        createdAt: b.created_at,
        items: members.rows.map((r) => ({
          id: r.user_id,
          userId: r.user_id,
          userName: r.display_name ?? null,
          /** Tandai keanggotaan viewer (bukan nama dummy). */
          mine: principalId !== null && r.user_id === principalId,
          product: r.product_snapshot as { name: string; price: number; link: string },
        })),
      });
    }
    return rows;
  }
}
