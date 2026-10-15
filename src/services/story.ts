/**
 * StoryService — Dongeng Bareng (INOVASI-20261014-0940 IDE 1).
 *
 * Cerita fiksi bersambung bergiliran: satu utas cerita dibuka siapa saja,
 * tiap member mengajukan bab lanjutan (maks 300 kata), komunitas vote,
 * bab dengan vote terbanyak tiap pekan otomatis jadi "kanon".
 *
 * Aturan:
 *   - 1 ajuan aktif per user per utas (AJUAN yang belum ARSIP/KANON).
 *   - 1 vote per user per bab (idempoten; bisa cabut vote).
 *   - Kanonisasi mingguan: MAX(vote_count) per utas per pekan; tie → bab
 *     lebih awal (created_at ASC); ajian lain minggu itu → ARSIP.
 *   - vote_count = COUNT(*) dari story_votes (anti-balik, tidak di-increment).
 *   - Filter kata otomatis sebelum simpan (reuse INSTRUKSI-03 item #1).
 *   - Laporkan bab reuse pipeline moderasi INSTRUKSI-03.
 *
 * Job mingguan (canonizeWeekly) disediakan sebagai method yang dipanggil
 * cron server — SIMULASI berlabel jujur, bukan cron betulan.
 */

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import type { Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import { findBlockedWord } from '@/server/moderation/blocked-words';
import { countWords } from '@/services/kindness';

export const STORY_GENRES: readonly {
  key: string;
  labelId: string;
  labelEn: string;
}[] = [
  { key: 'HOROR', labelId: 'Horor', labelEn: 'Horror' },
  { key: 'KOMEDI', labelId: 'Komedi', labelEn: 'Comedy' },
  { key: 'DRAMA', labelId: 'Drama', labelEn: 'Drama' },
  { key: 'FANTASI', labelId: 'Fantasi', labelEn: 'Fantasy' },
  { key: 'PETUALANGAN', labelId: 'Petualangan', labelEn: 'Adventure' },
  { key: 'ROMANSA', labelId: 'Romansa', labelEn: 'Romance' },
  { key: 'LAINNYA', labelId: 'Lainnya', labelEn: 'Other' },
];

export const STORY_CHAPTER_LIMITS = {
  maxWords: 300,
  minWords: 10,
  maxBodyLength: 2400,
  minBodyLength: 20,
} as const;

const GENRE_SET = new Set(STORY_GENRES.map((g) => g.key));

/** Nomor pekan ISO-like sederhana: tahun-minggu dari timestamp. */
export function weekNumber(date: Date = new Date()): number {
  const msInWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor(date.getTime() / msInWeek);
}

export interface StoryThreadInput {
  title: string;
  synopsis: string;
  genre: string;
}

export interface StoryThreadRow {
  id: string;
  title: string;
  synopsis: string;
  genre: string;
  createdBy: string;
  authorName: string;
  status: string;
  canonChapterCount: number;
  createdAt: string;
  /** True bila viewer adalah pembuat utas (untuk tombol tutup utas). */
  mine: boolean;
}

export interface StoryChapterRow {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  body: string;
  voteCount: number;
  isCanon: boolean;
  status: string;
  weekNumber: number;
  createdAt: string;
  myVote: boolean;
}

export class StoryService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
    private readonly now: () => Date = () => new Date(),
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /** Buat utas cerita baru (siapa saja member boleh). */
  async createThread(
    principal: Principal,
    input: StoryThreadInput,
  ): Promise<StoryThreadRow> {
    const title = input.title.trim();
    const synopsis = input.synopsis.trim();

    if (title.length < 3 || title.length > 120) {
      throw new ApiError('VALIDATION_FAILED', 'Judul antara 3 dan 120 karakter');
    }
    if (synopsis.length < 10 || synopsis.length > 500) {
      throw new ApiError('VALIDATION_FAILED', 'Sinopsis antara 10 dan 500 karakter');
    }
    if (!GENRE_SET.has(input.genre)) {
      throw new ApiError('VALIDATION_FAILED', 'Genre tidak valid');
    }

    const blocked = findBlockedWord(`${title} ${synopsis}`);
    if (blocked) {
      throw new ApiError('ACCESS_DENIED', 'Objek tidak aman');
    }

    return inTransaction(this.pool, async (client) => {
      const insert = await client.query(
        `INSERT INTO ${this.schema}.story_threads (title, synopsis, genre, created_by)
         VALUES ($1, $2, $3, $4)
         RETURNING id, title, synopsis, genre, created_by, status, created_at`,
        [title, synopsis, input.genre, principal.id],
      );
      const row = insert.rows[0];
      if (!row) throw new ApiError('INTERNAL_ERROR', 'Gagal membuat utas');
      const author = await client.query<{ display_name: string | null }>(
        `SELECT display_name FROM ${this.schema}.principals
          WHERE id = $1 AND deleted_at IS NULL`,
        [principal.id],
      );
      return {
        id: row.id,
        title: row.title,
        synopsis: row.synopsis,
        genre: row.genre,
        createdBy: row.created_by,
        authorName: author.rows[0]?.display_name ?? 'Member',
        status: row.status,
        canonChapterCount: 0,
        createdAt: row.created_at,
        mine: row.created_by === principal.id,
      };
    });
  }

  /** Daftar utas (filter genre + status). */
  async listThreads(input: { genre?: string; status?: string; limit?: number } = {}) {
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (input.genre) {
      params.push(input.genre);
      conditions.push(`t.genre = $${params.length}`);
    }
    if (input.status) {
      params.push(input.status);
      conditions.push(`t.status = $${params.length}`);
    } else {
      conditions.push(`t.status = 'TERBUKA'`);
    }
    params.push(limit);
    const sql = `
      SELECT t.id, t.title, t.synopsis, t.genre, t.created_by, t.status, t.created_at,
             p.display_name AS author_name,
             (SELECT COUNT(*)::int FROM ${this.schema}.story_chapters c
               WHERE c.thread_id = t.id AND c.is_canon = true) AS canon_chapter_count
        FROM ${this.schema}.story_threads t
        LEFT JOIN ${this.schema}.principals p ON p.id = t.created_by
       WHERE ${conditions.join(' AND ')}
       ORDER BY t.created_at DESC, t.id DESC
       LIMIT $${params.length}`;
    const result = await this.pool.query(sql, params);
    return result.rows.map((r) => ({
      id: r.id,
      title: r.title,
      synopsis: r.synopsis,
      genre: r.genre,
      createdBy: r.created_by,
      authorName: r.author_name ?? 'Member',
      status: r.status,
      canonChapterCount: r.canon_chapter_count ?? 0,
      createdAt: r.created_at,
    }));
  }

  /** Ajukan bab lanjutan (maks 300 kata, 1 ajuan aktif per user per utas). */
  async submitChapter(
    principal: Principal,
    threadId: string,
    body: string,
  ): Promise<StoryChapterRow> {
    const text = body.trim();
    const words = countWords(text);
    if (words < STORY_CHAPTER_LIMITS.minWords || words > STORY_CHAPTER_LIMITS.maxWords) {
      throw new ApiError(
        'VALIDATION_FAILED',
        `Bab antara ${STORY_CHAPTER_LIMITS.minWords} dan ${STORY_CHAPTER_LIMITS.maxWords} kata`,
      );
    }
    if (
      text.length < STORY_CHAPTER_LIMITS.minBodyLength ||
      text.length > STORY_CHAPTER_LIMITS.maxBodyLength
    ) {
      throw new ApiError('VALIDATION_FAILED', 'Panjang bab tidak valid');
    }

    // Filter kata otomatis sebelum simpan (reuse INSTRUKSI-03 item #1).
    const blocked = findBlockedWord(text);
    if (blocked) {
      throw new ApiError('ACCESS_DENIED', 'Objek tidak aman');
    }

    return inTransaction(this.pool, async (client) => {
      // Utas harus TERBUKA.
      const thread = await client.query<{ status: string }>(
        `SELECT status FROM ${this.schema}.story_threads WHERE id = $1`,
        [threadId],
      );
      if (!thread.rows[0]) throw new ApiError('NOT_FOUND', 'Utas tidak ditemukan');
      if (thread.rows[0].status !== 'TERBUKA') {
        throw new ApiError('VALIDATION_FAILED', 'Utas sudah ditutup');
      }

      // 1 ajuan aktif per user per utas.
      const existing = await client.query(
        `SELECT 1 FROM ${this.schema}.story_chapters
          WHERE thread_id = $1 AND author_id = $2 AND status = 'AJUAN'`,
        [threadId, principal.id],
      );
      if (existing.rows[0]) {
        throw new ApiError('IDEMPOTENCY_CONFLICT', 'Anda sudah punya ajuan aktif di utas ini');
      }

      const week = weekNumber(this.now());
      const insert = await client.query(
        `INSERT INTO ${this.schema}.story_chapters
           (thread_id, author_id, body, week_number)
         VALUES ($1, $2, $3, $4)
         RETURNING id, thread_id, author_id, body, is_canon, status, week_number, created_at`,
        [threadId, principal.id, text, week],
      );
      const row = insert.rows[0];
      if (!row) throw new ApiError('INTERNAL_ERROR', 'Gagal menyimpan bab');
      const author = await client.query<{ display_name: string | null }>(
        `SELECT display_name FROM ${this.schema}.principals
          WHERE id = $1 AND deleted_at IS NULL`,
        [principal.id],
      );
      return {
        id: row.id,
        threadId: row.thread_id,
        authorId: row.author_id,
        authorName: author.rows[0]?.display_name ?? 'Member',
        body: row.body,
        voteCount: 0,
        isCanon: row.is_canon,
        status: row.status,
        weekNumber: row.week_number,
        createdAt: row.created_at,
        myVote: false,
      };
    });
  }

  /** Baca utas: bab kanon berurutan + ajian pekan berjalan. */
  async readThread(
    threadId: string,
    viewerPrincipalId: string | null,
  ): Promise<{
    thread: StoryThreadRow;
    canonChapters: StoryChapterRow[];
    pendingChapters: StoryChapterRow[];
  } | null> {
    const threadResult = await this.pool.query(
      `SELECT t.id, t.title, t.synopsis, t.genre, t.created_by, t.status, t.created_at,
              p.display_name AS author_name,
              (SELECT COUNT(*)::int FROM ${this.schema}.story_chapters c
                WHERE c.thread_id = t.id AND c.is_canon = true) AS canon_chapter_count
         FROM ${this.schema}.story_threads t
         LEFT JOIN ${this.schema}.principals p ON p.id = t.created_by
        WHERE t.id = $1`,
      [threadId],
    );
    const t = threadResult.rows[0];
    if (!t) return null;

    const chapters = await this.pool.query(
      `SELECT c.id, c.thread_id, c.author_id, c.body, c.is_canon, c.status,
              c.week_number, c.created_at,
              p.display_name AS author_name,
              (SELECT COUNT(*)::int FROM ${this.schema}.story_votes v
                WHERE v.chapter_id = c.id) AS vote_count,
              ${viewerPrincipalId ? `EXISTS(SELECT 1 FROM ${this.schema}.story_votes v
                  WHERE v.chapter_id = c.id AND v.voter_id = $2)` : 'false'} AS my_vote
         FROM ${this.schema}.story_chapters c
         LEFT JOIN ${this.schema}.principals p ON p.id = c.author_id
        WHERE c.thread_id = $1
        ORDER BY c.is_canon DESC, c.week_number ASC, c.created_at ASC`,
      viewerPrincipalId ? [threadId, viewerPrincipalId] : [threadId],
    );

    const mapRow = (r: (typeof chapters.rows)[number]): StoryChapterRow => ({
      id: r.id,
      threadId: r.thread_id,
      authorId: r.author_id,
      authorName: r.author_name ?? 'Member',
      body: r.body,
      voteCount: r.vote_count ?? 0,
      isCanon: r.is_canon,
      status: r.status,
      weekNumber: r.week_number,
      createdAt: r.created_at,
      myVote: r.my_vote ?? false,
    });

    return {
      thread: {
        id: t.id,
        title: t.title,
        synopsis: t.synopsis,
        genre: t.genre,
        createdBy: t.created_by,
        authorName: t.author_name ?? 'Member',
        status: t.status,
        canonChapterCount: t.canon_chapter_count ?? 0,
        createdAt: t.created_at,
        mine: t.created_by === viewerPrincipalId,
      },
      canonChapters: chapters.rows.filter((r) => r.is_canon).map(mapRow),
      pendingChapters: chapters.rows
        .filter((r) => !r.is_canon && r.status === 'AJUAN')
        .map(mapRow),
    };
  }

  /** Vote bab (idempoten: 1 vote per user per bab; toggle untuk cabut). */
  async voteChapter(
    principal: Principal,
    chapterId: string,
  ): Promise<{ voted: boolean; voteCount: number }> {
    return inTransaction(this.pool, async (client) => {
      const chapter = await client.query<{ id: string }>(
        `SELECT id FROM ${this.schema}.story_chapters WHERE id = $1`,
        [chapterId],
      );
      if (!chapter.rows[0]) throw new ApiError('NOT_FOUND', 'Bab tidak ditemukan');

      const existing = await client.query<{ id: string }>(
        `SELECT id FROM ${this.schema}.story_votes
          WHERE chapter_id = $1 AND voter_id = $2`,
        [chapterId, principal.id],
      );
      if (existing.rows[0]) {
        await client.query(
          `DELETE FROM ${this.schema}.story_votes WHERE id = $1`,
          [existing.rows[0].id],
        );
      } else {
        await client.query(
          `INSERT INTO ${this.schema}.story_votes (chapter_id, voter_id)
           VALUES ($1, $2)`,
          [chapterId, principal.id],
        );
      }
      const count = await client.query<{ n: number }>(
        `SELECT COUNT(*)::int AS n FROM ${this.schema}.story_votes WHERE chapter_id = $1`,
        [chapterId],
      );
      return {
        voted: !existing.rows[0],
        voteCount: count.rows[0]?.n ?? 0,
      };
    });
  }

  /**
   * Kanonisasi mingguan (SIMULASI cron berlabel jujur — dipanggiloperator
   * server, bukan cron betulan). Tiap pekan: pilih bab AJUAN dengan vote
   * terbanyak per utas TERBUKA → is_canon=1, status KANON; ajian lain
   * minggu itu → ARSIP (tetap bisa dibaca). Tie → bab lebih awal.
   *
   * Pure-query; mengembalikan ringkasan per utas untuk audit.
   */
  async canonizeWeekly(
    week: number = weekNumber(new Date()),
  ): Promise<Array<{ threadId: string; canonChapterId: string | null }>> {
    return inTransaction(this.pool, async (client) => {
      // Kandidat: bab AJUAN di pekan ini pada utas TERBUKA.
      const candidates = await client.query(
        `SELECT c.id, c.thread_id,
                (SELECT COUNT(*)::int FROM ${this.schema}.story_votes v
                  WHERE v.chapter_id = c.id) AS vote_count,
                c.created_at
           FROM ${this.schema}.story_chapters c
           JOIN ${this.schema}.story_threads t ON t.id = c.thread_id
          WHERE c.status = 'AJUAN' AND c.week_number = $1 AND t.status = 'TERBUKA'
          ORDER BY c.thread_id, vote_count DESC, c.created_at ASC`,
        [week],
      );

      const byThread = new Map<string, { id: string; voteCount: number; createdAt: string }[]>();
      for (const row of candidates.rows) {
        const list = byThread.get(row.thread_id) ?? [];
        list.push({ id: row.id, voteCount: row.vote_count, createdAt: row.created_at });
        byThread.set(row.thread_id, list);
      }

      const summary: Array<{ threadId: string; canonChapterId: string | null }> = [];
      for (const [threadId, list] of byThread) {
        // Tie → bab lebih awal (created_at ASC) — urutan query sudah menjamin.
        const winner = list[0];
        if (!winner) {
          summary.push({ threadId, canonChapterId: null });
          continue;
        }
        await client.query(
          `UPDATE ${this.schema}.story_chapters
              SET is_canon = true, status = 'KANON'
            WHERE id = $1`,
          [winner.id],
        );
        // Ajian lain minggu itu di utas ini → ARSIP (tetap bisa dibaca).
        await client.query(
          `UPDATE ${this.schema}.story_chapters
              SET status = 'ARSIP'
            WHERE thread_id = $1 AND week_number = $2
              AND status = 'AJUAN' AND id <> $3`,
          [threadId, week, winner.id],
        );
        summary.push({ threadId, canonChapterId: winner.id });
      }
      return summary;
    });
  }

  /** Tutup utas (hanya pembuat utas). */
  async closeThread(principal: Principal, threadId: string) {
    return inTransaction(this.pool, async (client) => {
      const result = await client.query(
        `UPDATE ${this.schema}.story_threads
            SET status = 'SELESAI'
          WHERE id = $1 AND created_by = $2 AND status = 'TERBUKA'
        RETURNING id`,
        [threadId, principal.id],
      );
      if (!result.rows[0]) {
        throw new ApiError('NOT_FOUND', 'Utas tidak ditemukan atau bukan milik Anda');
      }
      return { id: result.rows[0].id };
    });
  }
}
