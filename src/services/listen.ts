/**
 * ListenService — "Giliran Dengar" (INOVASI-20261014-1045 IDE 1).
 *
 * Sesi curhat terstruktur berbasis giliran: pembicara didengar selama
 * 20 menit, pendengar hanya boleh merespons dengan refleksi empati
 * (REFLEKSI/SEMANGAT). SARAN ditolak di service layer bila pembicara
 * belum membuka "Saya butuh saran" (needs_advice = false).
 *
 * Aturan:
 *   - createSession(): 1 sesi aktif per user per 6 jam; topic lolos
 *     filter blocked-words INSTRUKSI-03.
 *   - joinAsListener(): maks 12 pendengar per sesi.
 *   - submitResponse(): kind=SARAN → tolak jika needs_advice=false;
 *     body maks 280 karakter; rate limit 20 respons/jam.
 *   - toggleNeedsAdvice(): hanya pembicara; perubahan tampil sebagai
 *     baris timeline inline (bukan popup).
 *   - closeExpiredSessions(): job simulasi — sesi lewat 20 menit → SELESAI.
 *
 * Semua helper validasi PURE agar dapat diuji unit test tanpa DB.
 */

import { createHmac, randomUUID } from 'node:crypto';

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import type { Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import { findBlockedWord } from '@/server/moderation/blocked-words';
import { LISTEN_MAX_LISTENERS } from '@/contracts/social';

/** Durasi sesi 20 menit (aturan ide). */
export const LISTEN_SESSION_MINUTES = 20;

/** Maksimum pendengar per sesi — re-export dari kontrak agar konsisten. */
export { LISTEN_MAX_LISTENERS };

/** 1 sesi dibuka per user per 6 jam. */
export const LISTEN_SESSION_COOLDOWN_HOURS = 6;

/** Maksimum respons per user per jam. */
export const LISTEN_RESPONSES_PER_HOUR = 20;

/** Maksimum karakter per respons (bukan Twitter-isme, cegah monolog). */
export const LISTEN_RESPONSE_MAX_CHARS = 280;

/** 6 template refleksi empati sekali-klik (dari RENCANA 1045). */
export const EMPATHY_TEMPLATES: readonly string[] = [
  'Kedengarannya ini berat sekali buatmu.',
  'Aku dengar kamu merasa …',
  'Terima kasih sudah berani cerita.',
  'Wajar kalau kamu merasa seperti itu.',
  'Aku ada di sini, aku mendengarkanmu.',
  'Itu pasti tidak mudah untukmu.',
];

export type ListenResponseKind = 'REFLEKSI' | 'SEMANGAT' | 'SARAN';

export interface ListenSessionInput {
  topic: string;
  isAnonymous: boolean;
}

export interface ListenSessionRow {
  id: string;
  speakerId: string;
  speakerName: string | null;
  topic: string;
  isAnonymous: boolean;
  needsAdvice: boolean;
  status: string;
  listenerCount: number;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  mine: boolean;
}

export interface ListenResponseRow {
  id: string;
  sessionId: string;
  listenerId: string;
  listenerName: string | null;
  kind: ListenResponseKind;
  body: string;
  createdAt: string;
}

/**
 * Validasi respons: kind SARAN hanya boleh jika needs_advice aktif.
 * PURE — dasar unit test "menolak SARAN saat needs_advice=false".
 */
export function assertResponseAllowed(input: {
  kind: ListenResponseKind;
  needsAdvice: boolean;
}): void {
  if (input.kind === 'SARAN' && !input.needsAdvice) {
    throw new ApiError(
      'VALIDATION_FAILED',
      'Pembicara belum membuka mode saran. Saat ini hanya refleksi empati.',
    );
  }
}

/** True bila body respons valid (panjang). */
export function isValidResponseBody(body: string): boolean {
  const len = body.trim().length;
  return len >= 2 && len <= LISTEN_RESPONSE_MAX_CHARS;
}

export class ListenService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
    private readonly now: () => Date = () => new Date(),
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /** Buka sesi curhat baru. */
  async createSession(
    principal: Principal,
    input: ListenSessionInput,
  ): Promise<ListenSessionRow> {
    const topic = input.topic.trim();
    if (topic.length < 5 || topic.length > 200) {
      throw new ApiError('VALIDATION_FAILED', 'Topik antara 5 dan 200 karakter');
    }
    const blocked = findBlockedWord(topic);
    if (blocked) throw new ApiError('ACCESS_DENIED', 'Objek tidak aman');

    const now = this.now();
    return inTransaction(this.pool, async (client) => {
      // 1 sesi aktif per 6 jam.
      const recent = await client.query<{ id: string }>(
        `SELECT id FROM ${this.schema}.listen_sessions
          WHERE speaker_id = $1
            AND created_at >= now() - interval '${LISTEN_SESSION_COOLDOWN_HOURS} hours'`,
        [principal.id],
      );
      if (recent.rows[0]) {
        throw new ApiError('RATE_LIMITED', 'Batas 1 sesi per 6 jam tercapai');
      }

      const insert = await client.query(
        `INSERT INTO ${this.schema}.listen_sessions
           (speaker_id, topic, is_anonymous, status, starts_at, ends_at)
         VALUES ($1, $2, $3, 'BERJALAN', $4, $4 + interval '${LISTEN_SESSION_MINUTES} minutes')
         RETURNING id, topic, is_anonymous, needs_advice, status, listener_count,
                   starts_at, ends_at, created_at`,
        [principal.id, topic, input.isAnonymous, now],
      );
      const row = insert.rows[0];
      if (!row) throw new ApiError('INTERNAL_ERROR', 'Gagal membuat sesi');
      const speaker = await client.query<{ display_name: string | null }>(
        `SELECT display_name FROM ${this.schema}.principals
          WHERE id = $1 AND deleted_at IS NULL`,
        [principal.id],
      );
      return {
        id: row.id,
        speakerId: principal.id,
        speakerName: row.is_anonymous ? null : speaker.rows[0]?.display_name ?? null,
        topic: row.topic,
        isAnonymous: row.is_anonymous,
        needsAdvice: row.needs_advice,
        status: row.status,
        listenerCount: row.listener_count,
        startsAt: row.starts_at,
        endsAt: row.ends_at,
        createdAt: row.created_at,
        mine: true,
      };
    });
  }

  /** Gabung sebagai pendengar (maks 12). */
  async joinAsListener(
    principal: Principal,
    sessionId: string,
  ): Promise<{ joined: boolean; listenerCount: number }> {
    return inTransaction(this.pool, async (client) => {
      const session = await client.query<{ status: string; listener_count: number }>(
        `SELECT status, listener_count FROM ${this.schema}.listen_sessions
          WHERE id = $1`,
        [sessionId],
      );
      const row = session.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Sesi tidak ditemukan');
      if (row.status === 'SELESAI') {
        throw new ApiError('VALIDATION_FAILED', 'Sesi sudah selesai');
      }
      if (row.listener_count >= LISTEN_MAX_LISTENERS) {
        throw new ApiError('VALIDATION_FAILED', 'Sesuai aturan, pendengar sudah penuh');
      }
      // Pendengar dicatat sebagai baris listener placeholder: kita simpan
      // keanggotaan lewat listen_responses pertama (pendengar yang
      // merespons otomatis tercatat). Counter naik saat join.
      const updated = await client.query<{ listener_count: number }>(
        `UPDATE ${this.schema}.listen_sessions
            SET listener_count = listener_count + 1
          WHERE id = $1 AND listener_count < $2
        RETURNING listener_count`,
        [sessionId, LISTEN_MAX_LISTENERS],
      );
      if (!updated.rows[0]) {
        throw new ApiError('VALIDATION_FAILED', 'Pendengar sudah penuh');
      }
      await client.query(
        `INSERT INTO ${this.schema}.listen_session_listeners (session_id, listener_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [sessionId, principal.id],
      );
      return { joined: true, listenerCount: updated.rows[0].listener_count };
    });
  }

  /** Kirim respons (REFLEKSI/SEMANGAT/SARAN). */
  async submitResponse(
    principal: Principal,
    sessionId: string,
    kind: ListenResponseKind,
    body: string,
  ): Promise<ListenResponseRow> {
    if (!isValidResponseBody(body)) {
      throw new ApiError(
        'VALIDATION_FAILED',
        `Respons antara 2 dan ${LISTEN_RESPONSE_MAX_CHARS} karakter`,
      );
    }
    const text = body.trim();
    const blocked = findBlockedWord(text);
    if (blocked) throw new ApiError('ACCESS_DENIED', 'Objek tidak aman');

    return inTransaction(this.pool, async (client) => {
      const session = await client.query<{
        status: string;
        needs_advice: boolean;
        speaker_id: string;
      }>(`SELECT status, needs_advice, speaker_id FROM ${this.schema}.listen_sessions
           WHERE id = $1`, [sessionId]);
      const row = session.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Sesi tidak ditemukan');
      if (row.status === 'SELESAI') {
        throw new ApiError('VALIDATION_FAILED', 'Sesi sudah selesai — tidak bisa menambah respons');
      }

      // Validasi fase: SARAN dilarang kecuali needs_advice aktif.
      assertResponseAllowed({ kind, needsAdvice: row.needs_advice });

      // Rate limit: 20 respons/jam per user.
      const rate = await client.query<{ n: number }>(
        `SELECT COUNT(*)::int AS n FROM ${this.schema}.listen_responses
          WHERE listener_id = $1 AND created_at >= now() - interval '1 hour'`,
        [principal.id],
      );
      if ((rate.rows[0]?.n ?? 0) >= LISTEN_RESPONSES_PER_HOUR) {
        throw new ApiError('RATE_LIMITED', `Batas ${LISTEN_RESPONSES_PER_HOUR} respons per jam tercapai`);
      }

      const insert = await client.query(
        `INSERT INTO ${this.schema}.listen_responses
           (session_id, listener_id, response_kind, body)
         VALUES ($1, $2, $3, $4)
         RETURNING id, session_id, response_kind, body, created_at`,
        [sessionId, principal.id, kind, text],
      );
      const created = insert.rows[0];
      if (!created) throw new ApiError('INTERNAL_ERROR', 'Gagal menyimpan respons');
      const listener = await client.query<{ display_name: string | null }>(
        `SELECT display_name FROM ${this.schema}.principals
          WHERE id = $1 AND deleted_at IS NULL`,
        [principal.id],
      );
      return {
        id: created.id,
        sessionId: created.session_id,
        listenerId: principal.id,
        listenerName: listener.rows[0]?.display_name ?? null,
        kind: created.response_kind,
        body: created.body,
        createdAt: created.created_at,
      };
    });
  }

  /** Pembicara toggle "Saya butuh saran". */
  async toggleNeedsAdvice(
    principal: Principal,
    sessionId: string,
  ): Promise<{ needsAdvice: boolean }> {
    return inTransaction(this.pool, async (client) => {
      const session = await client.query<{ speaker_id: string; status: string }>(
        `SELECT speaker_id, status FROM ${this.schema}.listen_sessions WHERE id = $1`,
        [sessionId],
      );
      const row = session.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Sesi tidak ditemukan');
      if (row.speaker_id !== principal.id) {
        throw new ApiError('ACCESS_DENIED', 'Hanya pembicara yang bisa mengubah pengaturan ini');
      }
      if (row.status === 'SELESAI') {
        throw new ApiError('VALIDATION_FAILED', 'Sesi sudah selesai');
      }
      const updated = await client.query<{ needs_advice: boolean }>(
        `UPDATE ${this.schema}.listen_sessions
            SET needs_advice = NOT needs_advice
          WHERE id = $1
        RETURNING needs_advice`,
        [sessionId],
      );
      return { needsAdvice: updated.rows[0]?.needs_advice ?? false };
    });
  }

  /** Daftar sesi (BERJALAN dulu, lalu SELESAI). */
  async listSessions(input: { limit?: number; includeFinished?: boolean } = {}) {
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const statusFilter = input.includeFinished
      ? `status IN ('BERJALAN', 'SELESAI')`
      : `status = 'BERJALAN'`;
    const result = await this.pool.query(
      `SELECT s.id, s.speaker_id, s.topic, s.is_anonymous, s.needs_advice,
              s.status, s.listener_count, s.starts_at, s.ends_at, s.created_at,
              p.display_name AS speaker_name
         FROM ${this.schema}.listen_sessions s
         LEFT JOIN ${this.schema}.principals p ON p.id = s.speaker_id
        WHERE ${statusFilter}
        ORDER BY (status = 'BERJALAN') DESC, created_at DESC, id DESC
        LIMIT $1`,
      [limit],
    );
    return result.rows.map((r) => ({
      id: r.id,
      speakerId: r.speaker_id,
      speakerName: r.is_anonymous ? null : r.speaker_name ?? null,
      topic: r.topic,
      isAnonymous: r.is_anonymous,
      needsAdvice: r.needs_advice,
      status: r.status,
      listenerCount: r.listener_count,
      startsAt: r.starts_at,
      endsAt: r.ends_at,
      createdAt: r.created_at,
      mine: false,
    }));
  }

  /** Baca sesi + seluruh respons kronologis. */
  async readSession(
    sessionId: string,
    viewerPrincipalId: string | null,
  ): Promise<{
    session: ListenSessionRow;
    responses: ListenResponseRow[];
  } | null> {
    const sessionRes = await this.pool.query(
      `SELECT s.id, s.speaker_id, s.topic, s.is_anonymous, s.needs_advice,
              s.status, s.listener_count, s.starts_at, s.ends_at, s.created_at,
              p.display_name AS speaker_name
         FROM ${this.schema}.listen_sessions s
         LEFT JOIN ${this.schema}.principals p ON p.id = s.speaker_id
        WHERE s.id = $1`,
      [sessionId],
    );
    const s = sessionRes.rows[0];
    if (!s) return null;

    const responses = await this.pool.query(
      `SELECT r.id, r.session_id, r.listener_id, r.response_kind, r.body, r.created_at,
              p.display_name AS listener_name
         FROM ${this.schema}.listen_responses r
         LEFT JOIN ${this.schema}.principals p ON p.id = r.listener_id
        WHERE r.session_id = $1
        ORDER BY r.created_at ASC, r.id ASC`,
      [sessionId],
    );

    return {
      session: {
        id: s.id,
        speakerId: s.speaker_id,
        speakerName: s.is_anonymous ? null : s.speaker_name ?? null,
        topic: s.topic,
        isAnonymous: s.is_anonymous,
        needsAdvice: s.needs_advice,
        status: s.status,
        listenerCount: s.listener_count,
        startsAt: s.starts_at,
        endsAt: s.ends_at,
        createdAt: s.created_at,
        mine: viewerPrincipalId !== null && s.speaker_id === viewerPrincipalId,
      },
      responses: responses.rows.map((r) => ({
        id: r.id,
        sessionId: r.session_id,
        listenerId: r.listener_id,
        listenerName: r.listener_name ?? null,
        kind: r.response_kind,
        body: r.body,
        createdAt: r.created_at,
      })),
    };
  }

  /**
   * Job simulasi (label jujur): tutup sesi yang sudah lewat 20 menit.
   * Dipanggil operator server, bukan cron betulan. Mengembalikan jumlah
   * sesi yang ditutup untuk audit.
   */
  async closeExpiredSessions(): Promise<number> {
    return inTransaction(this.pool, async (client) => {
      const result = await client.query(
        `UPDATE ${this.schema}.listen_sessions
            SET status = 'SELESAI'
          WHERE status = 'BERJALAN' AND ends_at IS NOT NULL AND ends_at < now()
        RETURNING id`,
      );
      return result.rowCount ?? 0;
    });
  }
}

/** HMAC voter/petition key helper (dipakai Sidang & Petisi juga). */
export function hashVoter(key: string, payload: string): string {
  return createHmac('sha256', key).update(payload).digest('hex');
}

export { randomUUID };
