/**
 * DuelService — "Duel Produk" (INOVASI-20261014-1045 IDE 2, Shop affiliate).
 *
 * Komparasi head-to-head antara DUA produk afilasi sejenis: kartu pro/kontra
 * per produk yang diisi komunitas, member memilih pemenang dengan alasan
 * wajib >= 30 karakter (anti-asal-klik), pemenang mendapat badge
 * "Pilihan Komunitas" di katalog Shop.
 *
 * Aturan:
 *   - createDuel(): kurator/admin; kedua produk HARUS dari katalog afiliasi
 *     existing (DILARANG mengarang produk); duel aktif 7 hari.
 *   - addDuelPoint(): body >= 20 karakter, lolos filter blocked-words,
 *     rate limit 10 poin/jam per user.
 *   - castVote(): 1 vote per user per duel, reason >= 30 karakter;
 *     alasan tampil publik (transparansi).
 *   - closeDuel(): job simulasi — saat ends_at tiba, pemenang = produk
 *     dengan vote terbanyak (tie → tidak ada pemenang).
 *   - flagSuspiciousVotes(): lonjakan vote dari akun baru < 5 menit →
 *     antrean moderasi kategori spam.
 */

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import type { Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import { findBlockedWord } from '@/server/moderation/blocked-words';

/** Durasi duel default (7 hari). */
export const DUEL_DEFAULT_DAYS = 7;

/** Alasan vote minimal (anti-asal-klik). */
export const DUEL_VOTE_REASON_MIN = 30;

/** Poin pro/kontra minimal. */
export const DUEL_POINT_MIN = 20;

/** Maks poin per user per jam. */
export const DUEL_POINTS_PER_HOUR = 10;

/** Rentang deteksi lonjakan vote mencurigakan. */
export const DUEL_SUSPICION_WINDOW_MINUTES = 5;

export interface DuelInput {
  title: string;
  productAId: string;
  productBId: string;
}

export interface DuelProductView {
  id: string;
  title: string;
  imageUrl: string;
  originalPrice: number;
  currency: string;
  externalUrl: string;
  isWinner: boolean;
  voteCount: number;
  proCount: number;
  contraCount: number;
}

export interface DuelRow {
  id: string;
  title: string;
  status: string;
  endsAt: string;
  products: [DuelProductView, DuelProductView];
  myVote: string | null;
}

/** Validasi reason vote: >= 30 karakter. PURE — dasar unit test. */
export function isValidVoteReason(reason: string): boolean {
  return reason.trim().length >= DUEL_VOTE_REASON_MIN;
}

/** Validasi poin pro/kontra: >= 20 karakter. PURE. */
export function isValidDuelPoint(body: string): boolean {
  return body.trim().length >= DUEL_POINT_MIN;
}

/** True bila product duel valid (keduanya berbeda, dari katalog). */
export function isValidDuelPair(aId: string, bId: string): boolean {
  return aId !== bId && aId.length > 0 && bId.length > 0;
}

export class DuelService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
    private readonly now: () => Date = () => new Date(),
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /** Buat duel baru (kurator/admin). Produk dari katalog existing. */
  async createDuel(principal: Principal, input: DuelInput): Promise<DuelRow> {
    const title = input.title.trim();
    if (title.length < 5 || title.length > 120) {
      throw new ApiError('VALIDATION_FAILED', 'Judul duel antara 5 dan 120 karakter');
    }
    if (!isValidDuelPair(input.productAId, input.productBId)) {
      throw new ApiError('VALIDATION_FAILED', 'Dua produk yang berbeda wajib');
    }
    const blocked = findBlockedWord(title);
    if (blocked) throw new ApiError('ACCESS_DENIED', 'Objek tidak aman');

    return inTransaction(this.pool, async (client) => {
      // Kedua produk harus ada di katalog afiliasi (PUBLISHED).
      const products = await client.query(
        `SELECT id, title, image_url, original_price, currency, external_url
           FROM ${this.schema}.ebelanja_products
          WHERE id = ANY($1) AND lifecycle_status = 'PUBLISHED'`,
        [[input.productAId, input.productBId]],
      );
      if (products.rows.length !== 2) {
        throw new ApiError('NOT_FOUND', 'Salah satu produk tidak ditemukan di katalog');
      }

      const endsAt = new Date(this.now().getTime() + DUEL_DEFAULT_DAYS * 24 * 60 * 60 * 1000);
      const insert = await client.query(
        `INSERT INTO ${this.schema}.product_duels
           (title, product_a_id, product_b_id, status, ends_at, created_by)
         VALUES ($1, $2, $3, 'TERBUKA', $4, $5)
         RETURNING id, title, status, ends_at`,
        [title, input.productAId, input.productBId, endsAt, principal.id],
      );
      const row = insert.rows[0];
      if (!row) throw new ApiError('INTERNAL_ERROR', 'Gagal membuat duel');

      const byId = new Map(products.rows.map((p) => [p.id, p]));
      const make = (id: string): DuelProductView => {
        const p = byId.get(id)!;
        return {
          id: p.id,
          title: p.title,
          imageUrl: p.image_url,
          originalPrice: Number(p.original_price),
          currency: p.currency,
          externalUrl: p.external_url,
          isWinner: false,
          voteCount: 0,
          proCount: 0,
          contraCount: 0,
        };
      };
      return {
        id: row.id,
        title: row.title,
        status: row.status,
        endsAt: row.ends_at,
        products: [make(input.productAId), make(input.productBId)],
        myVote: null,
      };
    });
  }

  /** Tambah poin pro/kontra pada satu produk (komunitas). */
  async addDuelPoint(
    principal: Principal,
    duelId: string,
    productId: string,
    side: 'PRO' | 'KONTRA',
    body: string,
  ) {
    if (!isValidDuelPoint(body)) {
      throw new ApiError('VALIDATION_FAILED', `Poin minimal ${DUEL_POINT_MIN} karakter`);
    }
    const text = body.trim();
    const blocked = findBlockedWord(text);
    if (blocked) throw new ApiError('ACCESS_DENIED', 'Objek tidak aman');

    return inTransaction(this.pool, async (client) => {
      const duel = await client.query<{ status: string; product_a_id: string; product_b_id: string }>(
        `SELECT status, product_a_id, product_b_id FROM ${this.schema}.product_duels WHERE id = $1`,
        [duelId],
      );
      const row = duel.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Duel tidak ditemukan');
      if (row.status !== 'TERBUKA') {
        throw new ApiError('VALIDATION_FAILED', 'Duel sudah selesai');
      }
      if (productId !== row.product_a_id && productId !== row.product_b_id) {
        throw new ApiError('VALIDATION_FAILED', 'Produk bukan peserta duel ini');
      }

      // Rate limit: 10 poin/jam per user.
      const rate = await client.query<{ n: number }>(
        `SELECT COUNT(*)::int AS n FROM ${this.schema}.duel_points
          WHERE author_id = $1 AND created_at >= now() - interval '1 hour'`,
        [principal.id],
      );
      if ((rate.rows[0]?.n ?? 0) >= DUEL_POINTS_PER_HOUR) {
        throw new ApiError('RATE_LIMITED', `Batas ${DUEL_POINTS_PER_HOUR} poin per jam tercapai`);
      }

      const insert = await client.query(
        `INSERT INTO ${this.schema}.duel_points (duel_id, product_id, side, body, author_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, side, body, created_at`,
        [duelId, productId, side, text, principal.id],
      );
      return insert.rows[0];
    });
  }

  /** Vote pemenang dengan alasan wajib (1x per user per duel). */
  async castVote(
    principal: Principal,
    duelId: string,
    chosenProductId: string,
    reason: string,
  ) {
    if (!isValidVoteReason(reason)) {
      throw new ApiError(
        'VALIDATION_FAILED',
        `Alasan vote minimal ${DUEL_VOTE_REASON_MIN} karakter`,
      );
    }
    const blocked = findBlockedWord(reason);
    if (blocked) throw new ApiError('ACCESS_DENIED', 'Objek tidak aman');

    return inTransaction(this.pool, async (client) => {
      const duel = await client.query<{
        status: string;
        product_a_id: string;
        product_b_id: string;
      }>(`SELECT status, product_a_id, product_b_id FROM ${this.schema}.product_duels
          WHERE id = $1`, [duelId]);
      const row = duel.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Duel tidak ditemukan');
      if (row.status !== 'TERBUKA') {
        throw new ApiError('VALIDATION_FAILED', 'Duel sudah selesai');
      }
      if (chosenProductId !== row.product_a_id && chosenProductId !== row.product_b_id) {
        throw new ApiError('VALIDATION_FAILED', 'Produk bukan peserta duel ini');
      }

      const insert = await client.query(
        `INSERT INTO ${this.schema}.duel_votes (duel_id, voter_id, chosen_product_id, reason)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (duel_id, voter_id) DO NOTHING
         RETURNING id`,
        [duelId, principal.id, chosenProductId, reason.trim()],
      );
      if (!insert.rows[0]) {
        throw new ApiError('IDEMPOTENCY_CONFLICT', 'Anda sudah vote di duel ini');
      }
      return { id: insert.rows[0].id, voted: true };
    });
  }

  /** Daftar duel (TERBUKA dulu). */
  async listDuels(input: { limit?: number; status?: string } = {}) {
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const conditions = input.status ? [`d.status = $1`] : [`d.status IN ('TERBUKA', 'SELESAI')`];
    const params: unknown[] = input.status ? [input.status, limit] : [limit];
    const sql = `
      SELECT d.id, d.title, d.status, d.ends_at, d.winner_id,
             d.product_a_id, d.product_b_id
        FROM ${this.schema}.product_duels d
       WHERE ${conditions.join(' AND ')}
       ORDER BY (d.status = 'TERBUKA') DESC, d.created_at DESC, d.id DESC
       LIMIT $${params.length}`;
    const duels = await this.pool.query(sql, params);

    const rows: DuelRow[] = [];
    for (const d of duels.rows) {
      const products = await this.pool.query(
        `SELECT p.id, p.title, p.image_url, p.original_price, p.currency, p.external_url
           FROM ${this.schema}.ebelanja_products p
          WHERE p.id = ANY($1)`,
        [[d.product_a_id, d.product_b_id]],
      );
      const byId = new Map(products.rows.map((p) => [p.id, p]));
      if (!byId.has(d.product_a_id) || !byId.has(d.product_b_id)) continue;
      const counts = await this.pool.query(
        `SELECT chosen_product_id, COUNT(*)::int AS n
           FROM ${this.schema}.duel_votes WHERE duel_id = $1 GROUP BY chosen_product_id`,
        [d.id],
      );
      const points = await this.pool.query(
        `SELECT product_id, side, COUNT(*)::int AS n
           FROM ${this.schema}.duel_points WHERE duel_id = $1 GROUP BY product_id, side`,
        [d.id],
      );
      const make = (id: string): DuelProductView => {
        const p = byId.get(id)!;
        const vote = counts.rows.find((c) => c.chosen_product_id === id)?.n ?? 0;
        return {
          id: p.id,
          title: p.title,
          imageUrl: p.image_url,
          originalPrice: Number(p.original_price),
          currency: p.currency,
          externalUrl: p.external_url,
          isWinner: d.status === 'SELESAI' && d.winner_id === id,
          voteCount: vote,
          proCount: points.rows.find((r) => r.product_id === id && r.side === 'PRO')?.n ?? 0,
          contraCount: points.rows.find((r) => r.product_id === id && r.side === 'KONTRA')?.n ?? 0,
        };
      };
      rows.push({
        id: d.id,
        title: d.title,
        status: d.status,
        endsAt: d.ends_at,
        products: [make(d.product_a_id), make(d.product_b_id)],
        myVote: null,
      });
    }
    return rows;
  }

  /** Baca duel + poin per produk. */
  async readDuel(duelId: string, viewerPrincipalId: string | null) {
    const duels = await this.pool.query(
      `SELECT d.id, d.title, d.status, d.ends_at, d.winner_id,
              d.product_a_id, d.product_b_id
         FROM ${this.schema}.product_duels d WHERE d.id = $1`,
      [duelId],
    );
    const d = duels.rows[0];
    if (!d) return null;
    const products = await this.pool.query(
      `SELECT p.id, p.title, p.image_url, p.original_price, p.currency, p.external_url
         FROM ${this.schema}.ebelanja_products p WHERE p.id = ANY($1)`,
      [[d.product_a_id, d.product_b_id]],
    );
    const byId = new Map(products.rows.map((p) => [p.id, p]));
    const points = await this.pool.query(
      `SELECT dp.id, dp.product_id, dp.side, dp.body, dp.author_id, dp.created_at,
              p.display_name AS author_name
         FROM ${this.schema}.duel_points dp
         LEFT JOIN ${this.schema}.principals p ON p.id = dp.author_id
        WHERE dp.duel_id = $1 ORDER BY dp.created_at ASC`,
      [duelId],
    );
    const votes = await this.pool.query(
      `SELECT chosen_product_id, COUNT(*)::int AS n
         FROM ${this.schema}.duel_votes WHERE duel_id = $1 GROUP BY chosen_product_id`,
      [duelId],
    );
    const myVote = viewerPrincipalId
      ? await this.pool.query(
          `SELECT chosen_product_id FROM ${this.schema}.duel_votes
            WHERE duel_id = $1 AND voter_id = $2`,
          [duelId, viewerPrincipalId],
        )
      : null;

    const make = (id: string): DuelProductView => {
      const p = byId.get(id);
      const vote = votes.rows.find((c) => c.chosen_product_id === id)?.n ?? 0;
      return {
        id,
        title: p?.title ?? '—',
        imageUrl: p?.image_url ?? '',
        originalPrice: Number(p?.original_price ?? 0),
        currency: p?.currency ?? 'IDR',
        externalUrl: p?.external_url ?? '',
        isWinner: d.status === 'SELESAI' && d.winner_id === id,
        voteCount: vote,
        proCount: points.rows.filter((r) => r.product_id === id && r.side === 'PRO').length,
        contraCount: points.rows.filter((r) => r.product_id === id && r.side === 'KONTRA').length,
      };
    };
    return {
      duel: {
        id: d.id,
        title: d.title,
        status: d.status,
        endsAt: d.ends_at,
        products: [make(d.product_a_id), make(d.product_b_id)] as [DuelProductView, DuelProductView],
        myVote: myVote?.rows[0]?.chosen_product_id ?? null,
      },
      points: points.rows.map((r) => ({
        id: r.id,
        productId: r.product_id,
        side: r.side,
        body: r.body,
        authorName: r.author_name ?? null,
        createdAt: r.created_at,
      })),
    };
  }

  /**
   * Job simulasi (label jujur): tutup duel yang sudah lewat ends_at.
   * Pemenang = produk dengan vote terbanyak; tie → winner_id NULL
   * (seri, tidak ada Pilihan Komunitas).
   */
  async closeExpiredDuels(): Promise<Array<{ duelId: string; winnerId: string | null }>> {
    return inTransaction(this.pool, async (client) => {
      const expired = await client.query(
        `SELECT id FROM ${this.schema}.product_duels
          WHERE status = 'TERBUKA' AND ends_at < now()`,
      );
      const summary: Array<{ duelId: string; winnerId: string | null }> = [];
      for (const row of expired.rows) {
        const counts = await client.query(
          `SELECT chosen_product_id, COUNT(*)::int AS n
             FROM ${this.schema}.duel_votes WHERE duel_id = $1 GROUP BY chosen_product_id`,
          [row.id],
        );
        let winnerId: string | null = null;
        if (counts.rows.length > 0) {
          const sorted = [...counts.rows].sort((a, b) => b.n - a.n);
          if (sorted.length === 1 || sorted[0].n > sorted[1].n) {
            winnerId = sorted[0].chosen_product_id;
          }
        }
        await client.query(
          `UPDATE ${this.schema}.product_duels SET status = 'SELESAI', winner_id = $2
            WHERE id = $1 AND status = 'TERBUKA'`,
          [row.id, winnerId],
        );
        summary.push({ duelId: row.id, winnerId });
      }
      return summary;
    });
  }

  /**
   * Deteksi lonjakan vote mencurigakan: >= 5 vote dalam 5 menit dari akun
   * yang dibuat < 24 jam. Mengembalikan daftar voter untuk review admin
   * (antrean moderasi kategori spam, reuse INSTRUKSI-03).
   */
  async flagSuspiciousVotes(): Promise<Array<{
    duelId: string;
    voterId: string;
    votesInWindow: number;
  }>> {
    const result = await this.pool.query(
      `SELECT v.duel_id, v.voter_id, COUNT(*)::int AS n
         FROM ${this.schema}.duel_votes v
         JOIN ${this.schema}.principals p ON p.id = v.voter_id
        WHERE p.created_at >= now() - interval '24 hours'
          AND v.created_at >= now() - interval '${DUEL_SUSPICION_WINDOW_MINUTES} minutes'
        GROUP BY v.duel_id, v.voter_id
       HAVING COUNT(*) >= 5`,
    );
    return result.rows.map((r) => ({
      duelId: r.duel_id,
      voterId: r.voter_id,
      votesInWindow: r.n,
    }));
  }
}
