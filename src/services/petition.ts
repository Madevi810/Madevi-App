/**
 * PetitionService — "Petisi Katalog" (INOVASI-20261014-1245 IDE 2, Shop).
 *
 * Pengguna mengusulkan produk afiliasi untuk masuk katalog Shop; usulan
 * divote; usulan yang memenuhi target masuk antrian moderasi pemilik.
 * Setiap usulan wajib membawa link afiliasi marketplace (tidak boleh
 * mengarang produk).
 *
 * Aturan:
 *   - createPetition(): nama produk, link marketplace, kategori, alasan;
 *     lolos blocked-words; maks 3 usulan aktif per user; 1 usulan aktif
 *     per user per nama produk.
 *   - votePetition(): 1 suara per user (UNIQUE constraint), idempoten.
 *   - closePetition(): job simulasi — vote ≥ target → DIKIRIM ke antrean
 *     moderasi pemilik; < target → DITOLAK.
 *   - listPetitions(): filter status, urut vote terbanyak.
 *
 * Target vote default 50 (simulasi). Status: MENUNGGU → DIKIRIM/DITOLAK.
 */

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import type { Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import { findBlockedWord } from '@/server/moderation/blocked-words';

/** Target vote minimum agar usulan diteruskan ke moderasi pemilik. */
export const PETITION_TARGET_VOTES = 50;

/** Maksimum usulan aktif per user (status MENUNGGU). */
export const PETITION_MAX_ACTIVE_PER_USER = 3;

/** Marketplace resmi yang diizinkan untuk link afiliasi. */
export const PETITION_MARKETPLACES: readonly string[] = [
  'tokopedia.com',
  'shopee.co.id',
  'bukalapak.com',
  'lazada.co.id',
  'tokped.link',
  'shp.ee',
];

/** Status usulan. */
export type PetitionStatus = 'MENUNGGU' | 'DIKIRIM' | 'DITOLAK';

/** Validasi link marketplace. PURE — dasar unit test. */
export function isValidMarketplaceLink(
  link: string,
  allowed: readonly string[] = PETITION_MARKETPLACES,
): boolean {
  try {
    const url = new URL(link.trim());
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    return allowed.some((m) => host === m || host.endsWith('.' + m));
  } catch {
    return false;
  }
}

/** Hitung status akhir usulan dari jumlah vote. PURE. */
export function petitionOutcome(
  votes: number,
  target: number = PETITION_TARGET_VOTES,
): { status: PetitionStatus; message: string } {
  if (votes >= target) {
    return { status: 'DIKIRIM', message: 'Usulan diteruskan ke moderasi pemilik katalog' };
  }
  return { status: 'DITOLAK', message: 'Usulan tidak mencapai target vote' };
}

export interface PetitionInput {
  productName: string;
  link: string;
  category: string;
  reason: string;
}

interface PetitionRow {
  id: string;
  product_name: string;
  link: string;
  category: string;
  reason: string;
  status: string;
  target_votes: number;
  created_at: Date;
  created_by: string;
  closed_at: Date | null;
  created_by_name: string | null;
  vote_count: number;
}

export class PetitionService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
    private readonly target: number = PETITION_TARGET_VOTES,
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /** Buat usulan produk baru. */
  async createPetition(principal: Principal, input: PetitionInput) {
    const productName = input.productName.trim();
    if (productName.length < 3 || productName.length > 120) {
      throw new ApiError('VALIDATION_FAILED', 'Nama produk antara 3 dan 120 karakter');
    }
    if (!isValidMarketplaceLink(input.link)) {
      throw new ApiError(
        'VALIDATION_FAILED',
        'Link harus dari marketplace resmi (Tokopedia/Shopee/Bukalapak/Lazada)',
      );
    }
    const category = input.category.trim();
    if (category.length < 2 || category.length > 40) {
      throw new ApiError('VALIDATION_FAILED', 'Kategori antara 2 dan 40 karakter');
    }
    const reason = input.reason.trim();
    if (reason.length < 10 || reason.length > 500) {
      throw new ApiError('VALIDATION_FAILED', 'Alasan antara 10 dan 500 karakter');
    }
    const blocked = findBlockedWord(`${productName} ${category} ${reason}`);
    if (blocked) throw new ApiError('ACCESS_DENIED', 'Objek tidak aman');

    return inTransaction(this.pool, async (client) => {
      // Maks 3 usulan aktif per user.
      const active = await client.query<{ n: number }>(
        `SELECT COUNT(*)::int AS n FROM ${this.schema}.product_petitions
          WHERE created_by = $1 AND status = 'MENUNGGU'`,
        [principal.id],
      );
      if ((active.rows[0]?.n ?? 0) >= PETITION_MAX_ACTIVE_PER_USER) {
        throw new ApiError(
          'IDEMPOTENCY_CONFLICT',
          `Batas ${PETITION_MAX_ACTIVE_PER_USER} usulan aktif per user tercapai`,
        );
      }
      // 1 usulan aktif per user per nama produk.
      const dup = await client.query(
        `SELECT 1 FROM ${this.schema}.product_petitions
          WHERE created_by = $1 AND LOWER(product_name) = LOWER($2)
            AND status = 'MENUNGGU'`,
        [principal.id, productName],
      );
      if (dup.rows[0]) {
        throw new ApiError('IDEMPOTENCY_CONFLICT', 'Usulan untuk produk ini masih aktif');
      }

      const insert = await client.query(
        `INSERT INTO ${this.schema}.product_petitions
           (product_name, link, category, reason, status, target_votes, created_by)
         VALUES ($1, $2, $3, $4, 'MENUNGGU', $5, $6)
         RETURNING id, product_name, link, category, reason, status, target_votes, created_at`,
        [productName, input.link.trim(), category, reason, this.target, principal.id],
      );
      const row = insert.rows[0];
      if (!row) throw new ApiError('INTERNAL_ERROR', 'Gagal membuat usulan');
      return {
        id: row.id,
        productName: row.product_name,
        link: row.link,
        category: row.category,
        reason: row.reason,
        status: row.status,
        targetVotes: row.target_votes,
        createdAt: row.created_at,
        createdBy: principal.id,
      };
    });
  }

  /** Vote usulan (1 suara per user, idempoten). */
  async votePetition(petitionId: string, principal: Principal) {
    return inTransaction(this.pool, async (client) => {
      const petition = await client.query<{ status: string }>(
        `SELECT status FROM ${this.schema}.product_petitions WHERE id = $1`,
        [petitionId],
      );
      const row = petition.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Usulan tidak ditemukan');
      if (row.status !== 'MENUNGGU') {
        throw new ApiError('VALIDATION_FAILED', 'Usulan sudah ditutup');
      }
      const insert = await client.query(
        `INSERT INTO ${this.schema}.petition_votes (petition_id, voter_id)
         VALUES ($1, $2)
         ON CONFLICT (petition_id, voter_id) DO NOTHING
         RETURNING id`,
        [petitionId, principal.id],
      );
      if (!insert.rows[0]) {
        throw new ApiError('IDEMPOTENCY_CONFLICT', 'Anda sudah memberi suara');
      }
      return { id: insert.rows[0].id, voted: true };
    });
  }

  /** Tutup usulan: vote >= target → DIKIRIM, < target → DITOLAK. */
  async closePetition(petitionId: string) {
    return inTransaction(this.pool, async (client) => {
      const petition = await client.query<{ status: string; target_votes: number }>(
        `SELECT status, target_votes FROM ${this.schema}.product_petitions WHERE id = $1`,
        [petitionId],
      );
      const row = petition.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Usulan tidak ditemukan');
      if (row.status !== 'MENUNGGU') {
        throw new ApiError('VALIDATION_FAILED', 'Usulan sudah ditutup');
      }
      const votes = await client.query<{ n: number }>(
        `SELECT COUNT(*)::int AS n FROM ${this.schema}.petition_votes
          WHERE petition_id = $1`,
        [petitionId],
      );
      const total = votes.rows[0]?.n ?? 0;
      const outcome = petitionOutcome(total, row.target_votes);
      await client.query(
        `UPDATE ${this.schema}.product_petitions
            SET status = $2, closed_at = now()
          WHERE id = $1`,
        [petitionId, outcome.status],
      );
      return {
        petitionId,
        votes: total,
        status: outcome.status,
        message: outcome.message,
      };
    });
  }

  /** Daftar usulan (filter status, urut vote terbanyak). */
  async listPetitions(input: { limit?: number; status?: PetitionStatus } = {}) {
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const status = input.status?.trim().toUpperCase();
    const statusList = status ? [status] : null;
    const result = await this.pool.query(
      `SELECT pt.id, pt.product_name, pt.link, pt.category, pt.reason, pt.status,
              pt.target_votes, pt.created_at, pt.created_by, pt.closed_at,
              pp.display_name AS created_by_name,
              (SELECT COUNT(*)::int FROM ${this.schema}.petition_votes v
                WHERE v.petition_id = pt.id) AS vote_count
         FROM ${this.schema}.product_petitions pt
         LEFT JOIN ${this.schema}.principals pp ON pp.id = pt.created_by
        WHERE ($1::text[] IS NULL OR pt.status = ANY($1::text[]))
        ORDER BY (pt.status = 'MENUNGGU') DESC, vote_count DESC, pt.created_at DESC
        LIMIT $2`,
      [statusList, limit],
    );
    return result.rows.map((r: PetitionRow) => ({
      id: r.id,
      productName: r.product_name,
      link: r.link,
      category: r.category,
      reason: r.reason,
      status: r.status as PetitionStatus,
      targetVotes: r.target_votes,
      createdAt: r.created_at,
      createdBy: r.created_by,
      createdByName: r.created_by_name ?? null,
      closedAt: r.closed_at,
      voteCount: r.vote_count ?? 0,
    }));
  }

  /** Job simulasi: tutup usulan yang lewat tenggat 7 hari. */
  async closeExpiredPetitions(): Promise<number> {
    return inTransaction(this.pool, async (client) => {
      const expired = await client.query(
        `SELECT id FROM ${this.schema}.product_petitions
          WHERE status = 'MENUNGGU'
            AND created_at < now() - interval '7 days'`,
      );
      let closed = 0;
      for (const row of expired.rows) {
        try {
          await this.closePetitionDAO(client, row.id);
          closed += 1;
        } catch {
          /* lewati */
        }
      }
      return closed;
    });
  }

  /** Versi closePetition yang berjalan di dalam client transaction. */
  private async closePetitionDAO(client: import('pg').PoolClient, petitionId: string) {
    const petition = await client.query<{ status: string; target_votes: number }>(
      `SELECT status, target_votes FROM ${this.schema}.product_petitions WHERE id = $1`,
      [petitionId],
    );
    const row = petition.rows[0];
    if (!row || row.status !== 'MENUNGGU') return;
    const votes = await client.query<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM ${this.schema}.petition_votes WHERE petition_id = $1`,
      [petitionId],
    );
    const total = votes.rows[0]?.n ?? 0;
    const outcome = petitionOutcome(total, row.target_votes);
    await client.query(
      `UPDATE ${this.schema}.product_petitions SET status = $2, closed_at = now() WHERE id = $1`,
      [petitionId, outcome.status],
    );
  }
}
