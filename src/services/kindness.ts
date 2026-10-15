/**
 * KindnessService — Peta Kebaikan (INOVASI-20261014-0841 IDE 2).
 *
 * Kontra-narasi positif berbasis bukti: kebaikan nyata per kota.
 *
 * Domain:
 *   - Laporan masuk dengan status ANTRI; hanya admin yang menyetujui
 *     (TAYANG) atau menolak (DITOLAK) lewat antrean moderasi (reuse
 *     pipeline INSTRUKSI-03: filter kata otomatis + antrean admin).
 *   - Kota dari daftar tetap (dropdown terkunci) — tanpa alamat detail.
 *   - Pelapor boleh anonim; nama pelaku kebaikan tidak wajib.
 *   - Tidak ada ranking antar-kota (tampil alfabetis).
 */

import { randomUUID } from 'node:crypto';

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import type { Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import { findBlockedWord } from '@/server/moderation/blocked-words';
import {
  KINDNESS_CATEGORIES,
  KINDNESS_CITIES,
  kindnessReporterLabel,
} from '@/contracts/social';

export { KINDNESS_CATEGORIES, KINDNESS_CITIES, kindnessReporterLabel };

/** Kota tetap yang tersedia di dropdown (mencegah input alamat bebas). */


export interface KindnessReportInput {
  title: string;
  story: string;
  city: string;
  category: string;
  isAnonymous: boolean;
}

export interface KindnessReportRow {
  id: string;
  title: string;
  story: string;
  city: string;
  category: string;
  isAnonymous: boolean;
  reporterName: string | null;
  photoUrl: string | null;
  status: string;
  createdAt: string;
}

const CITY_SET = new Set(KINDNESS_CITIES.map((c) => c.toLocaleLowerCase('id-ID')));
const CATEGORY_SET = new Set(KINDNESS_CATEGORIES.map((c) => c.key));

/**
 * Hitung jumlah kata dari body bab (aturan maks 300 kata).
 * Dipisah spasi; bahasa Indonesia tidak memakai tanda hubung sebagai pemisah.
 */
export function countWords(body: string): number {
  const trimmed = body.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export class KindnessService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
    private readonly now: () => Date = () => new Date(),
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /**
   * Buat laporan kebaikan. Validasi ketat + filter kata otomatis sebelum
   * simpan. Status awal selalu ANTRI (harus lewat review admin).
   */
  async createReport(
    principal: Principal,
    input: KindnessReportInput,
  ): Promise<KindnessReportRow> {
    const title = input.title.trim();
    const story = input.story.trim();
    const city = input.city.trim();

    if (title.length < 3 || title.length > 120) {
      throw new ApiError('VALIDATION_FAILED', 'Judul antara 3 dan 120 karakter');
    }
    if (story.length < 10 || story.length > 500) {
      throw new ApiError('VALIDATION_FAILED', 'Cerita antara 10 dan 500 karakter');
    }
    if (!CITY_SET.has(city.toLocaleLowerCase('id-ID'))) {
      throw new ApiError('VALIDATION_FAILED', 'Kota tidak terdaftar');
    }
    if (!CATEGORY_SET.has(input.category)) {
      throw new ApiError('VALIDATION_FAILED', 'Kategori tidak valid');
    }

    // Filter kata otomatis (reuse INSTRUKSI-03 item #1).
    const blocked = findBlockedWord(`${title} ${story}`);
    if (blocked) {
      throw new ApiError('ACCESS_DENIED', 'Objek tidak aman');
    }

    const canonicalCity =
      KINDNESS_CITIES.find((c) => c.toLocaleLowerCase('id-ID') === city.toLocaleLowerCase('id-ID')) ??
      city;

    const result = await inTransaction(this.pool, async (client) => {
      const insert = await client.query(
        `INSERT INTO ${this.schema}.kindness_report
           (reporter_id, title, story, city, category, is_anonymous, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'ANTRI')
         RETURNING id, title, story, city, category, is_anonymous, photo_url,
                   status, created_at`,
        [
          principal.id,
          title,
          story,
          canonicalCity,
          input.category,
          input.isAnonymous,
        ],
      );
      return insert.rows[0];
    });
    if (!result) throw new ApiError('INTERNAL_ERROR', 'Gagal menyimpan laporan');

    const reporter = await this.pool.query<{ display_name: string | null }>(
      `SELECT display_name FROM ${this.schema}.principals
        WHERE id = $1 AND deleted_at IS NULL`,
      [principal.id],
    );

    return {
      id: result.id,
      title: result.title,
      story: result.story,
      city: result.city,
      category: result.category,
      isAnonymous: result.is_anonymous,
      reporterName: input.isAnonymous ? null : reporter.rows[0]?.display_name ?? null,
      photoUrl: result.photo_url,
      status: result.status,
      createdAt: result.created_at,
    };
  }

  /** Daftar laporan TAYANG terbaru lintas kota (20 per halaman). */
  async listApproved(input: { cursor?: string; limit?: number; city?: string } = {}) {
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const conditions = [`k.status = 'TAYANG'`];
    const params: unknown[] = [];
    if (input.city) {
      params.push(input.city);
      conditions.push(`k.city = $${params.length}`);
    }
    if (input.cursor) {
      params.push(input.cursor);
      conditions.push(`k.created_at < $${params.length}`);
    }
    params.push(limit + 1);
    const sql = `
      SELECT k.id, k.title, k.story, k.city, k.category, k.is_anonymous,
             k.photo_url, k.created_at,
             p.display_name AS reporter_name
        FROM ${this.schema}.kindness_report k
        LEFT JOIN ${this.schema}.principals p ON p.id = k.reporter_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY k.created_at DESC, k.id DESC
       LIMIT $${params.length}`;
    const result = await this.pool.query(sql, params);
    const rows = result.rows.slice(0, limit);
    const nextCursor =
      result.rows.length > limit ? (rows[rows.length - 1]?.created_at as string) ?? null : null;
    return {
      items: rows.map((r) => ({
        id: r.id,
        title: r.title,
        story: r.story,
        city: r.city,
        category: r.category,
        isAnonymous: r.is_anonymous,
        reporterName: r.is_anonymous ? null : r.reporter_name ?? null,
        photoUrl: r.photo_url,
        createdAt: r.created_at,
      })),
      nextCursor,
    };
  }

  /** Daftar laporan ANTRI untuk antrean moderasi admin. */
  async listPending(input: { limit?: number } = {}) {
    const limit = Math.min(Math.max(input.limit ?? 50, 1), 200);
    const result = await this.pool.query(
      `SELECT k.id, k.title, k.story, k.city, k.category, k.is_anonymous,
              k.photo_url, k.created_at,
              p.display_name AS reporter_name
         FROM ${this.schema}.kindness_report k
         LEFT JOIN ${this.schema}.principals p ON p.id = k.reporter_id
        WHERE k.status = 'ANTRI'
        ORDER BY k.created_at ASC, k.id ASC
        LIMIT $1`,
      [limit],
    );
    return result.rows.map((r) => ({
      id: r.id,
      title: r.title,
      story: r.story,
      city: r.city,
      category: r.category,
      isAnonymous: r.is_anonymous,
      reporterName: r.reporter_name ?? null,
      photoUrl: r.photo_url,
      createdAt: r.created_at,
    }));
  }

  /** Setujui laporan → TAYANG (admin only). */
  async approveReport(reportId: string) {
    return inTransaction(this.pool, async (client) => {
      const result = await client.query(
        `UPDATE ${this.schema}.kindness_report
            SET status = 'TAYANG'
          WHERE id = $1 AND status = 'ANTRI'
        RETURNING id`,
        [reportId],
      );
      if (!result.rows[0]) {
        throw new ApiError('NOT_FOUND', 'Laporan tidak ditemukan atau sudah diproses');
      }
      return { id: result.rows[0].id };
    });
  }

  /** Tolak laporan → DITOLAK (admin only). */
  async rejectReport(reportId: string) {
    return inTransaction(this.pool, async (client) => {
      const result = await client.query(
        `UPDATE ${this.schema}.kindness_report
            SET status = 'DITOLAK'
          WHERE id = $1 AND status = 'ANTRI'
        RETURNING id`,
        [reportId],
      );
      if (!result.rows[0]) {
        throw new ApiError('NOT_FOUND', 'Laporan tidak ditemukan atau sudah diproses');
      }
      return { id: result.rows[0].id };
    });
  }

  /** Jumlah kebaikan TAYANG per kota (bulan berjalan). Alfabetis, tanpa ranking. */
  async cityCounts(): Promise<Array<{ city: string; count: number }>> {
    const result = await this.pool.query(
      `SELECT city, COUNT(*)::int AS count
         FROM ${this.schema}.kindness_report
        WHERE status = 'TAYANG'
          AND created_at >= date_trunc('month', now())
        GROUP BY city
        ORDER BY city ASC`,
    );
    return result.rows.map((r) => ({ city: r.city, count: r.count }));
  }
}
