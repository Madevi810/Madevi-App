/**
 * ClinicService — "Klinik Ide" (INOVASI-20261014-1145 IDE 2, Sosial Karya).
 *
 * Protokol kritik karya 3 fase: BERTANYA (hanya pertanyaan) → MEMBEDAH
 * (hanya saran konstruktif berpola) → APRESIASI (vote Pilihan Klinik +
 * komentar bebas). kind feedback divalidasi terhadap fase aktif;
 * pelanggaran DITOLAK sistem (bukan dihapus admin).
 *
 * Aturan:
 *   - openClinic(): 1 klinik aktif per karya; hanya untuk post KARYA.
 *   - addFeedback(): kind=PERTANYAAN hanya di BERTANYA, kind=SARAN hanya
 *     di MEMBEDAH, kind=APRESIASI hanya di APRESIASI; 422 + pesan panduan.
 *   - advanceClinicPhase(): hanya pemilik karya; urutan ditegakkan.
 *   - castClinicVote(): 1 vote per user, hanya di fase APRESIASI.
 *   - closeClinic(): job simulasi → SELESAI; vote direkap untuk daftar
 *     "Disorot Klinik" mingguan.
 *   - Rate limit: 15 feedback/jam per user.
 *
 * Timer fase simulasi (label jujur): BERTANYA 2 hari, MEMBEDAH 3 hari,
 * APRESIASI 2 hari — server-side.
 */

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import type { Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import { findBlockedWord } from '@/server/moderation/blocked-words';

/** Durasi fase default (hari). */
export const CLINIC_PHASE_DAYS: Readonly<Record<string, number>> = {
  BERTANYA: 2,
  MEMBEDAH: 3,
  APRESIASI: 2,
};

/** Maksimum feedback per user per jam. */
export const CLINIC_FEEDBACK_PER_HOUR = 15;

/** Template komentar berpemandu per fase (sekali-klik, opsional). */
export const CLINIC_TEMPLATES: Readonly<Record<string, readonly string[]>> = {
  BERTANYA: [
    'Apa yang menginspirasimu membuat karya ini?',
    'Untuk siapa karya ini ditujukan?',
    'Bagian mana yang paling kamu suka dari prosesnya?',
    'Apa kendang terbesar yang kamu hadapi?',
  ],
  MEMBEDAH: [
    'Agar berhasil, coba …',
    'Yang kuat dari karya ini …',
    'Satu hal yang bisa dipertajam …',
    'Bagian ini bisa lebih kuat kalau …',
  ],
  APRESIASI: [
    'Terima kasih sudah berbagi karya ini.',
    'Karya ini memberi perspektif baru.',
    'Keberanianmu mempublikasikan ini menginspirasi.',
  ],
};

export type ClinicPhase = 'BERTANYA' | 'MEMBEDAH' | 'APRESIASI';
export type ClinicFeedbackKind = 'PERTANYAAN' | 'SARAN' | 'APRESIASI';

/** Kind feedback yang diperbolehkan per fase. PURE — dasar unit test. */
export function allowedFeedbackKind(phase: ClinicPhase): readonly ClinicFeedbackKind[] {
  switch (phase) {
    case 'BERTANYA':
      return ['PERTANYAAN'];
    case 'MEMBEDAH':
      return ['SARAN'];
    case 'APRESIASI':
      return ['APRESIASI'];
  }
}

/** Pesan panduan saat kind feedback melanggar fase. PURE. */
export function phaseGuidanceMessage(phase: ClinicPhase, isId = true): string {
  switch (phase) {
    case 'BERTANYA':
      return isId ? 'Fase BERTANYA: tulis sebagai pertanyaan' : 'Phase BERTANYA: write as a question';
    case 'MEMBEDAH':
      return isId
        ? 'Fase MEMBEDAH: tulis saran konstruktif berpola "agar berhasil…"'
        : 'Phase MEMBEDAH: write constructive advice starting with "to succeed…"';
    case 'APRESIASI':
      return isId ? 'Fase APRESIASI: tulis apresiasi' : 'Phase APRESIASI: write appreciation';
  }
}

export class ClinicService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
    private readonly now: () => Date = () => new Date(),
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /** Buka klinik untuk sebuah karya (hanya post KARYA, 1 aktif per karya). */
  async openClinic(principal: Principal, postId: string) {
    return inTransaction(this.pool, async (client) => {
      const post = await client.query<{ post_type: string; principal_id: string; status: string }>(
        `SELECT post_type, principal_id, status FROM ${this.schema}.social_posts
          WHERE id = $1 AND deleted_at IS NULL`,
        [postId],
      );
      const row = post.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Karya tidak ditemukan');
      if (row.post_type !== 'KARYA') {
        throw new ApiError('VALIDATION_FAILED', 'Klinik hanya untuk karya (bukan curhat)');
      }
      if (row.principal_id !== principal.id) {
        throw new ApiError('ACCESS_DENIED', 'Hanya pemilik karya yang bisa membuka klinik');
      }
      if (row.status !== 'PUBLISHED') {
        throw new ApiError('VALIDATION_FAILED', 'Karya belum diterbitkan');
      }

      const existing = await client.query(
        `SELECT 1 FROM ${this.schema}.clinic_sessions
          WHERE post_id = $1 AND status <> 'SELESAI'`,
        [postId],
      );
      if (existing.rows[0]) {
        throw new ApiError('IDEMPOTENCY_CONFLICT', 'Karya ini sudah punya klinik aktif');
      }

      const phaseEnd = new Date(
        this.now().getTime() + CLINIC_PHASE_DAYS.BERTANYA * 24 * 60 * 60 * 1000,
      );
      const insert = await client.query(
        `INSERT INTO ${this.schema}.clinic_sessions (post_id, status, phase_ends_at, created_by)
         VALUES ($1, 'BERTANYA', $2, $3)
         RETURNING id, status, phase_ends_at, created_at`,
        [postId, phaseEnd, principal.id],
      );
      const created = insert.rows[0];
      if (!created) throw new ApiError('INTERNAL_ERROR', 'Gagal membuka klinik');
      return {
        id: created.id,
        postId,
        status: created.status,
        phaseEndsAt: created.phase_ends_at,
        createdAt: created.created_at,
      };
    });
  }

  /** Tambah feedback (kind divalidasi terhadap fase aktif). */
  async addFeedback(
    principal: Principal,
    sessionId: string,
    kind: ClinicFeedbackKind,
    body: string,
  ) {
    const text = body.trim();
    if (text.length < 5 || text.length > 500) {
      throw new ApiError('VALIDATION_FAILED', 'Feedback antara 5 dan 500 karakter');
    }
    const blocked = findBlockedWord(text);
    if (blocked) throw new ApiError('ACCESS_DENIED', 'Objek tidak aman');

    return inTransaction(this.pool, async (client) => {
      const session = await client.query<{ status: string }>(
        `SELECT status FROM ${this.schema}.clinic_sessions WHERE id = $1`,
        [sessionId],
      );
      const row = session.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Klinik tidak ditemukan');
      if (row.status === 'SELESAI') {
        throw new ApiError('VALIDATION_FAILED', 'Klinik sudah selesai');
      }
      const allowed = allowedFeedbackKind(row.status as ClinicPhase);
      if (!allowed.includes(kind)) {
        throw new ApiError('VALIDATION_FAILED', phaseGuidanceMessage(row.status as ClinicPhase));
      }

      // Rate limit: 15 feedback/jam per user.
      const rate = await client.query<{ n: number }>(
        `SELECT COUNT(*)::int AS n FROM ${this.schema}.clinic_feedback
          WHERE author_id = $1 AND created_at >= now() - interval '1 hour'`,
        [principal.id],
      );
      if ((rate.rows[0]?.n ?? 0) >= CLINIC_FEEDBACK_PER_HOUR) {
        throw new ApiError('RATE_LIMITED', `Batas ${CLINIC_FEEDBACK_PER_HOUR} feedback per jam tercapai`);
      }

      const insert = await client.query(
        `INSERT INTO ${this.schema}.clinic_feedback (session_id, author_id, kind, body)
         VALUES ($1, $2, $3, $4)
         RETURNING id, kind, body, created_at`,
        [sessionId, principal.id, kind, text],
      );
      const created = insert.rows[0];
      const author = await client.query<{ display_name: string | null }>(
        `SELECT display_name FROM ${this.schema}.principals
          WHERE id = $1 AND deleted_at IS NULL`,
        [principal.id],
      );
      return {
        id: created.id,
        kind: created.kind,
        body: created.body,
        createdAt: created.created_at,
        authorName: author.rows[0]?.display_name ?? null,
      };
    });
  }

  /** Maju fase (hanya pemilik karya). */
  async advanceClinicPhase(principal: Principal, sessionId: string) {
    return inTransaction(this.pool, async (client) => {
      const session = await client.query<{
        status: string;
        post_id: string;
        created_by: string;
      }>(`SELECT status, post_id, created_by FROM ${this.schema}.clinic_sessions
           WHERE id = $1`, [sessionId]);
      const row = session.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Klinik tidak ditemukan');
      if (row.status === 'SELESAI') {
        throw new ApiError('VALIDATION_FAILED', 'Klinik sudah selesai');
      }

      // Hanya pemilik karya (pembuat klinik).
      if (row.created_by !== principal.id) {
        throw new ApiError('ACCESS_DENIED', 'Hanya pemilik karya yang bisa memajukan fase');
      }

      const nextPhase: Record<string, string> = {
        BERTANYA: 'MEMBEDAH',
        MEMBEDAH: 'APRESIASI',
      };
      const next = nextPhase[row.status];
      if (!next) {
        // APRESIASI → closeClinic() yang menangani.
        return { status: row.status };
      }
      const phaseEnd = new Date(
        this.now().getTime() + CLINIC_PHASE_DAYS[next] * 24 * 60 * 60 * 1000,
      );
      const updated = await client.query(
        `UPDATE ${this.schema}.clinic_sessions
            SET status = $2, phase_ends_at = $3
          WHERE id = $1 AND status = $4
        RETURNING status`,
        [sessionId, next, phaseEnd, row.status],
      );
      return { status: updated.rows[0]?.status ?? next };
    });
  }

  /** Vote Pilihan Klinik (1x per user, hanya di fase APRESIASI). */
  async castClinicVote(principal: Principal, sessionId: string) {
    return inTransaction(this.pool, async (client) => {
      const session = await client.query<{ status: string }>(
        `SELECT status FROM ${this.schema}.clinic_sessions WHERE id = $1`,
        [sessionId],
      );
      const row = session.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Klinik tidak ditemukan');
      if (row.status !== 'APRESIASI') {
        throw new ApiError(
          'VALIDATION_FAILED',
          'Voting hanya dibuka di fase APRESIASI',
        );
      }
      const insert = await client.query(
        `INSERT INTO ${this.schema}.clinic_votes (session_id, voter_id)
         VALUES ($1, $2)
         ON CONFLICT (session_id, voter_id) DO NOTHING
         RETURNING id`,
        [sessionId, principal.id],
      );
      if (!insert.rows[0]) {
        throw new ApiError('IDEMPOTENCY_CONFLICT', 'Vote Anda sudah tercatat');
      }
      return { id: insert.rows[0].id, voted: true };
    });
  }

  /** Tutup klinik (job simulasi): SELESAI + rekap vote. */
  async closeClinic(sessionId: string) {
    return inTransaction(this.pool, async (client) => {
      const session = await client.query<{ status: string; post_id: string }>(
        `SELECT status, post_id FROM ${this.schema}.clinic_sessions WHERE id = $1`,
        [sessionId],
      );
      const row = session.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Klinik tidak ditemukan');
      if (row.status === 'SELESAI') {
        throw new ApiError('VALIDATION_FAILED', 'Klinik sudah selesai');
      }
      await client.query(
        `UPDATE ${this.schema}.clinic_sessions SET status = 'SELESAI', closed_at = now()
          WHERE id = $1`,
        [sessionId],
      );
      const votes = await client.query<{ n: number }>(
        `SELECT COUNT(*)::int AS n FROM ${this.schema}.clinic_votes WHERE session_id = $1`,
        [sessionId],
      );
      return { sessionId, postId: row.post_id, votes: votes.rows[0]?.n ?? 0 };
    });
  }

  /** Job simulasi: klinik yang lewat phase_ends_at maju otomatis. */
  async advanceExpiredPhases(): Promise<number> {
    return inTransaction(this.pool, async (client) => {
      const expired = await client.query(
        `SELECT id, status FROM ${this.schema}.clinic_sessions
          WHERE phase_ends_at IS NOT NULL AND phase_ends_at < now()
            AND status <> 'SELESAI'`,
      );
      let moved = 0;
      for (const row of expired.rows) {
        const nextPhase: Record<string, string> = {
          BERTANYA: 'MEMBEDAH',
          MEMBEDAH: 'APRESIASI',
        };
        const next = nextPhase[row.status];
        if (!next) {
          // APRESIASI lewat tenggat → tutup klinik.
          await client.query(
            `UPDATE ${this.schema}.clinic_sessions
                SET status = 'SELESAI', closed_at = now()
              WHERE id = $1`,
            [row.id],
          );
          moved += 1;
          continue;
        }
        await client.query(
          `UPDATE ${this.schema}.clinic_sessions
              SET status = $2,
                  phase_ends_at = now() + (${CLINIC_PHASE_DAYS[next]} * interval '1 day')
            WHERE id = $1`,
          [row.id, next],
        );
        moved += 1;
      }
      return moved;
    });
  }

  /** Daftar klinik per status. */
  async listClinics(input: { limit?: number; status?: string } = {}) {
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const conditions = input.status ? [`c.status = $1`] : [`c.status <> 'SELESAI'`];
    const params: unknown[] = input.status ? [input.status, limit] : [limit];
    const sql = `
      SELECT c.id, c.post_id, c.status, c.phase_ends_at, c.created_at, c.created_by,
             (SELECT COUNT(*)::int FROM ${this.schema}.clinic_votes v
               WHERE v.session_id = c.id) AS vote_count,
             (SELECT COUNT(*)::int FROM ${this.schema}.clinic_feedback f
               WHERE f.session_id = c.id) AS feedback_count
        FROM ${this.schema}.clinic_sessions c
       WHERE ${conditions.join(' AND ')}
       ORDER BY c.created_at DESC, c.id DESC LIMIT $${params.length}`;
    const result = await this.pool.query(sql, params);
    return result.rows.map((r) => ({
      id: r.id,
      postId: r.post_id,
      status: r.status,
      phaseEndsAt: r.phase_ends_at,
      createdAt: r.created_at,
      createdBy: r.created_by,
      voteCount: r.vote_count ?? 0,
      feedbackCount: r.feedback_count ?? 0,
    }));
  }

  /** Baca klinik + feedback (dikelompokkan per fase). */
  async readClinic(sessionId: string) {
    const sessionRes = await this.pool.query(
      `SELECT c.id, c.post_id, c.status, c.phase_ends_at, c.created_at, c.created_by,
              p.body AS post_body, p.author_id AS post_author_id,
              pp.display_name AS post_author_name
         FROM ${this.schema}.clinic_sessions c
         JOIN ${this.schema}.social_posts p ON p.id = c.post_id
         LEFT JOIN ${this.schema}.principals pp ON pp.id = p.author_id
        WHERE c.id = $1`,
      [sessionId],
    );
    const s = sessionRes.rows[0];
    if (!s) return null;

    const feedback = await this.pool.query(
      `SELECT f.id, f.author_id, f.kind, f.body, f.created_at,
              p.display_name AS author_name
         FROM ${this.schema}.clinic_feedback f
         LEFT JOIN ${this.schema}.principals p ON p.id = f.author_id
        WHERE f.session_id = $1 ORDER BY f.created_at ASC, f.id ASC`,
      [sessionId],
    );
    const votes = await this.pool.query<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM ${this.schema}.clinic_votes WHERE session_id = $1`,
      [sessionId],
    );

    return {
      session: {
        id: s.id,
        postId: s.post_id,
        status: s.status,
        phaseEndsAt: s.phase_ends_at,
        createdAt: s.created_at,
        createdBy: s.created_by,
        postBody: s.post_body,
        postAuthorName: s.post_author_name ?? null,
      },
      feedback: feedback.rows.map((r) => ({
        id: r.id,
        kind: r.kind,
        body: r.body,
        authorName: r.author_name ?? null,
        createdAt: r.created_at,
      })),
      voteCount: votes.rows[0]?.n ?? 0,
    };
  }
}
