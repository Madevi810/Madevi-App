/**
 * SidangService — "Sidang Warga" (INOVASI-20261014-1145 IDE 1, grup Line).
 *
 * Protokol musyawarah formal 3 fase: TANYA (klarifikasi) → SANGGAH
 * (argumen kontra wajib) → VOTING (anonim, berkuorum) → keputusan
 * tercatat permanen di arsip grup.
 *
 * Aturan:
 *   - createSidang(): maks 2 sidang aktif per grup; judul/deskripsi
 *     lolos filter blocked-words INSTRUKSI-03.
 *   - addArgument(): kind dibatasi per fase aktif (TANYA→TANYA/JAWAB,
 *     SANGGAH→SANGGAH/DUKUNG); pelanggaran ditolak dengan pesan jelas.
 *   - advancePhase(): hanya pembuat usulan/admin grup; Voting TIDAK
 *     boleh dibuka sebelum >= 2 argumen SANGGAH tercatat (anti ruang gema).
 *   - castVote(): anonim via voter_hash = HMAC(secret, user_id:session_id);
 *     1 suara per anggota (UNIQUE); hanya di fase VOTING.
 *   - closeVoting(): dipicu timer — partisipasi < kuorum_pct → DIBATALKAN,
 *     >= kuorum → SELESAI. Hasil only shown after close (anti-bandwagon).
 *   - voteCount = COUNT(*) (anti-balik, tidak di-increment).
 *
 * Timer fase simulasi (label jujur): TANYA 24 jam, SANGGAH 24 jam,
 * VOTING 48 jam — dihitung server-side.
 */

import { createHmac } from 'node:crypto';
import {
  allowedArgumentKinds,
  type SidangArgumentKind,
  type SidangPhase,
} from '@/contracts/social';

export { allowedArgumentKinds, type SidangArgumentKind, type SidangPhase };

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import type { Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import { findBlockedWord } from '@/server/moderation/blocked-words';

/** Kuorum default: 60% anggota aktif grup. */
export const SIDANG_QUORUM_DEFAULT = 60;

/** Maksimum sidang aktif per grup. */
export const SIDANG_MAX_ACTIVE_PER_GROUP = 2;

/** Syarat minimum argumen SANGGAH sebelum voting bisa dibuka. */
export const SIDANG_MIN_SANGGAH = 2;

/** Durasi fase default (jam): TANYA 24, SANGGAH 24, VOTING 48. */
export const SIDANG_PHASE_HOURS: Readonly<Record<string, number>> = {
  TANYA: 24,
  SANGGAH: 24,
  VOTING: 48,
};

/** Anggota aktif = login 30 hari terakhir (simulasi). */
export const SIDANG_ACTIVE_MEMBER_DAYS = 30;

export type SidangVoteChoice = 'SETUJU' | 'TOLAK' | 'ABSTAIN';

export interface SidangInput {
  groupId: string;
  title: string;
  description: string;
  quorumPct?: number;
}

/** Voting tidak boleh dibuka sebelum >= 2 argumen SANGGAH. PURE. */
export function canOpenVoting(sanggahCount: number): boolean {
  return sanggahCount >= SIDANG_MIN_SANGGAH;
}

/** Hitung suara sah: SETUJU+TOLAK+ABSTAIN; partisipasi = total / anggota. */
export function quorumMet(
  votes: { SETUJU: number; TOLAK: number; ABSTAIN: number },
  activeMembers: number,
  quorumPct: number,
): boolean {
  if (activeMembers <= 0) return false;
  const total = votes.SETUJU + votes.TOLAK + votes.ABSTAIN;
  return total / activeMembers >= quorumPct / 100;
}

/** Pembuat voter_hash anonim: HMAC(secret, user_id:session_id). */
export function makeVoterHash(secret: string, userId: string, sessionId: string): string {
  return createHmac('sha256', secret).update(`${userId}:${sessionId}`).digest('hex');
}

export class SidangService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
    private readonly now: () => Date = () => new Date(),
    private readonly secret: string = process.env.MADEVI_VOTER_SECRET ?? 'madevi-local-voter-secret',
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /** Buat usulan sidang baru (fase awal TANYA). */
  async createSidang(principal: Principal, input: SidangInput) {
    const title = input.title.trim();
    const description = input.description.trim();
    if (title.length < 5 || title.length > 120) {
      throw new ApiError('VALIDATION_FAILED', 'Judul antara 5 dan 120 karakter');
    }
    if (description.length < 10 || description.length > 1000) {
      throw new ApiError('VALIDATION_FAILED', 'Deskripsi antara 10 dan 1000 karakter');
    }
    const quorumPct = input.quorumPct ?? SIDANG_QUORUM_DEFAULT;
    if (quorumPct < 1 || quorumPct > 100) {
      throw new ApiError('VALIDATION_FAILED', 'Kuorum antara 1 dan 100 persen');
    }
    const blocked = findBlockedWord(`${title} ${description}`);
    if (blocked) throw new ApiError('ACCESS_DENIED', 'Objek tidak aman');

    return inTransaction(this.pool, async (client) => {
      // Maks 2 sidang aktif per grup.
      const active = await client.query<{ id: string }>(
        `SELECT id FROM ${this.schema}.sidang_sessions
          WHERE group_id = $1 AND status NOT IN ('SELESAI', 'DIBATALKAN')`,
        [input.groupId],
      );
      if (active.rows.length >= SIDANG_MAX_ACTIVE_PER_GROUP) {
        throw new ApiError(
          'IDEMPOTENCY_CONFLICT',
          `Batas ${SIDANG_MAX_ACTIVE_PER_GROUP} sidang aktif per grup tercapai`,
        );
      }
      // Pembuat harus anggota aktif grup (bukan sembarang orang).
      const member = await client.query(
        `SELECT 1 FROM ${this.schema}.group_memberships
          WHERE group_id = $1 AND principal_id = $2 AND status = 'ACTIVE'`,
        [input.groupId, principal.id],
      );
      if (!member.rows[0]) {
        throw new ApiError('ACCESS_DENIED', 'Hanya anggota aktif grup yang bisa mengajukan sidang');
      }

      const phaseEnd = new Date(
        this.now().getTime() + SIDANG_PHASE_HOURS.TANYA * 60 * 60 * 1000,
      );
      const insert = await client.query(
        `INSERT INTO ${this.schema}.sidang_sessions
           (group_id, title, description, status, quorum_pct, phase_ends_at, created_by)
         VALUES ($1, $2, $3, 'TANYA', $4, $5, $6)
         RETURNING id, title, description, status, quorum_pct, phase_ends_at,
                   created_at, created_by`,
        [input.groupId, title, description, quorumPct, phaseEnd, principal.id],
      );
      const row = insert.rows[0];
      if (!row) throw new ApiError('INTERNAL_ERROR', 'Gagal membuat sidang');
      const author = await client.query<{ display_name: string | null }>(
        `SELECT display_name FROM ${this.schema}.principals
          WHERE id = $1 AND deleted_at IS NULL`,
        [principal.id],
      );
      return {
        id: row.id,
        groupId: input.groupId,
        title: row.title,
        description: row.description,
        status: row.status,
        quorumPct: row.quorum_pct,
        phaseEndsAt: row.phase_ends_at,
        createdAt: row.created_at,
        createdBy: row.created_by,
        createdByName: author.rows[0]?.display_name ?? null,
      };
    });
  }

  /** Tambah argumen (kind dibatasi per fase aktif). */
  async addArgument(
    principal: Principal,
    sessionId: string,
    kind: SidangArgumentKind,
    body: string,
  ) {
    const text = body.trim();
    if (text.length < 5 || text.length > 500) {
      throw new ApiError('VALIDATION_FAILED', 'Argumen antara 5 dan 500 karakter');
    }
    const blocked = findBlockedWord(text);
    if (blocked) throw new ApiError('ACCESS_DENIED', 'Objek tidak aman');

    return inTransaction(this.pool, async (client) => {
      const session = await client.query<{ status: string }>(
        `SELECT status FROM ${this.schema}.sidang_sessions WHERE id = $1`,
        [sessionId],
      );
      const row = session.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Sidang tidak ditemukan');
      if (row.status === 'SELESAI' || row.status === 'DIBATALKAN') {
        throw new ApiError('VALIDATION_FAILED', 'Sidang sudah ditutup');
      }
      const allowed = allowedArgumentKinds(row.status as SidangPhase);
      if (!allowed.includes(kind)) {
        throw new ApiError(
          'VALIDATION_FAILED',
          `Fase ${row.status}: hanya argumen ${allowed.join('/')} yang diperbolehkan`,
        );
      }

      // Rate limit: 30 argumen per jam per user (reuse pola INSTRUKSI-03).
      const rate = await client.query<{ n: number }>(
        `SELECT COUNT(*)::int AS n FROM ${this.schema}.sidang_arguments
          WHERE author_id = $1 AND created_at >= now() - interval '1 hour'`,
        [principal.id],
      );
      if ((rate.rows[0]?.n ?? 0) >= 30) {
        throw new ApiError('RATE_LIMITED', 'Batas 30 argumen per jam tercapai');
      }

      const insert = await client.query(
        `INSERT INTO ${this.schema}.sidang_arguments (session_id, author_id, kind, body)
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

  /** Maju fase (hanya pembuat usulan atau admin grup). */
  async advancePhase(principal: Principal, sessionId: string) {
    return inTransaction(this.pool, async (client) => {
      const session = await client.query<{
        status: string;
        created_by: string;
        group_id: string;
      }>(`SELECT status, created_by, group_id FROM ${this.schema}.sidang_sessions
           WHERE id = $1`, [sessionId]);
      const row = session.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Sidang tidak ditemukan');
      if (row.status === 'SELESAI' || row.status === 'DIBATALKAN') {
        throw new ApiError('VALIDATION_FAILED', 'Sidang sudah ditutup');
      }

      // Hanya pembuat usulan atau admin grup.
      const isAdmin = row.created_by === principal.id || (await this.isGroupAdmin(
        client,
        row.group_id,
        principal.id,
      ));
      if (!isAdmin) {
        throw new ApiError('ACCESS_DENIED', 'Hanya pembuat usulan atau admin grup');
      }

      if (row.status === 'TANYA') {
        const phaseEnd = new Date(
          this.now().getTime() + SIDANG_PHASE_HOURS.SANGGAH * 60 * 60 * 1000,
        );
        const updated = await client.query(
          `UPDATE ${this.schema}.sidang_sessions
              SET status = 'SANGGAH', phase_ends_at = $2
            WHERE id = $1 AND status = 'TANYA'
          RETURNING status`,
          [sessionId, phaseEnd],
        );
        return { status: updated.rows[0]?.status ?? 'SANGGAH' };
      }

      if (row.status === 'SANGGAH') {
        // Syarat: >= 2 argumen SANGGAH sebelum voting dibuka.
        const sanggah = await client.query<{ n: number }>(
          `SELECT COUNT(*)::int AS n FROM ${this.schema}.sidang_arguments
            WHERE session_id = $1 AND kind = 'SANGGAH'`,
          [sessionId],
        );
        if (!canOpenVoting(sanggah.rows[0]?.n ?? 0)) {
          throw new ApiError(
            'VALIDATION_FAILED',
            `Voting belum bisa dibuka: butuh minimal ${SIDANG_MIN_SANGGAH} argumen sanggah`,
          );
        }
        const phaseEnd = new Date(
          this.now().getTime() + SIDANG_PHASE_HOURS.VOTING * 60 * 60 * 1000,
        );
        const updated = await client.query(
          `UPDATE ${this.schema}.sidang_sessions
              SET status = 'VOTING', phase_ends_at = $2
            WHERE id = $1 AND status = 'SANGGAH'
          RETURNING status`,
          [sessionId, phaseEnd],
        );
        return { status: updated.rows[0]?.status ?? 'VOTING' };
      }

      // VOTING → closeVoting() yang menangani.
      return { status: row.status };
    });
  }

  /** Submit suara anonim (hanya di fase VOTING). */
  async castVote(
    principal: Principal,
    sessionId: string,
    choice: SidangVoteChoice,
  ) {
    return inTransaction(this.pool, async (client) => {
      const session = await client.query<{ status: string }>(
        `SELECT status FROM ${this.schema}.sidang_sessions WHERE id = $1`,
        [sessionId],
      );
      const row = session.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Sidang tidak ditemukan');
      if (row.status !== 'VOTING') {
        throw new ApiError('VALIDATION_FAILED', 'Voting belum dibuka atau sudah ditutup');
      }
      const voterHash = makeVoterHash(this.secret, principal.id, sessionId);
      const insert = await client.query(
        `INSERT INTO ${this.schema}.sidang_votes (session_id, voter_hash, choice)
         VALUES ($1, $2, $3)
         ON CONFLICT (session_id, voter_hash) DO NOTHING
         RETURNING id`,
        [sessionId, voterHash, choice],
      );
      if (!insert.rows[0]) {
        throw new ApiError('IDEMPOTENCY_CONFLICT', 'Suara Anda sudah tercatat');
      }
      return { id: insert.rows[0].id, voted: true };
    });
  }

  /** Tutup voting (dipicu timer fase): hitung kuorum → SELESAI/DIBATALKAN. */
  async closeVoting(sessionId: string): Promise<{
    status: 'SELESAI' | 'DIBATALKAN';
    votes: { SETUJU: number; TOLAK: number; ABSTAIN: number };
  }> {
    return inTransaction(this.pool, async (client) => {
      const session = await client.query<{
        status: string;
        group_id: string;
        quorum_pct: number;
      }>(`SELECT status, group_id, quorum_pct FROM ${this.schema}.sidang_sessions
           WHERE id = $1`, [sessionId]);
      const row = session.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Sidang tidak ditemukan');
      if (row.status !== 'VOTING') {
        throw new ApiError('VALIDATION_FAILED', 'Sidang tidak dalam fase voting');
      }

      const votes = await client.query(
        `SELECT choice, COUNT(*)::int AS n FROM ${this.schema}.sidang_votes
          WHERE session_id = $1 GROUP BY choice`,
        [sessionId],
      );
      const tally = { SETUJU: 0, TOLAK: 0, ABSTAIN: 0 } as Record<SidangVoteChoice, number>;
      for (const v of votes.rows) tally[v.choice as SidangVoteChoice] = v.n;

      const activeMembers = await this.countActiveMembers(client, row.group_id);
      const met = quorumMet(tally, activeMembers, row.quorum_pct);

      const status = met ? 'SELESAI' : 'DIBATALKAN';
      await client.query(
        `UPDATE ${this.schema}.sidang_sessions
            SET status = $2, closed_at = now()
          WHERE id = $1`,
        [sessionId, status],
      );
      return { status, votes: tally };
    });
  }

  /** Daftar sidang per grup. */
  async listSidang(groupId: string, input: { limit?: number; includeClosed?: boolean } = {}) {
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const statusFilter = input.includeClosed
      ? `status NOT IN ('DIBATALKAN')`
      : `status NOT IN ('SELESAI', 'DIBATALKAN')`;
    const result = await this.pool.query(
      `SELECT s.id, s.title, s.description, s.status, s.quorum_pct, s.phase_ends_at,
              s.created_at, s.created_by, s.closed_at,
              p.display_name AS created_by_name,
              (SELECT COUNT(*)::int FROM ${this.schema}.sidang_arguments a
                WHERE a.session_id = s.id) AS argument_count
         FROM ${this.schema}.sidang_sessions s
         LEFT JOIN ${this.schema}.principals p ON p.id = s.created_by
        WHERE s.group_id = $1 AND ${statusFilter}
        ORDER BY (s.status IN ('TANYA', 'SANGGAH', 'VOTING')) DESC, s.created_at DESC
        LIMIT $2`,
      [groupId, limit],
    );
    return result.rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      status: r.status,
      quorumPct: r.quorum_pct,
      phaseEndsAt: r.phase_ends_at,
      createdAt: r.created_at,
      createdBy: r.created_by,
      createdByName: r.created_by_name ?? null,
      closedAt: r.closed_at,
      argumentCount: r.argument_count ?? 0,
    }));
  }

  /** Baca sidang + argumen (difilter per fase) + hasil jika sudah tutup. */
  async readSidang(sessionId: string) {
    const sessionRes = await this.pool.query(
      `SELECT s.id, s.group_id, s.title, s.description, s.status, s.quorum_pct,
              s.phase_ends_at, s.created_at, s.created_by, s.closed_at,
              p.display_name AS created_by_name
         FROM ${this.schema}.sidang_sessions s
         LEFT JOIN ${this.schema}.principals p ON p.id = s.created_by
        WHERE s.id = $1`,
      [sessionId],
    );
    const s = sessionRes.rows[0];
    if (!s) return null;

    const arguments_ = await this.pool.query(
      `SELECT a.id, a.author_id, a.kind, a.body, a.created_at,
              p.display_name AS author_name
         FROM ${this.schema}.sidang_arguments a
         LEFT JOIN ${this.schema}.principals p ON p.id = a.author_id
        WHERE a.session_id = $1 ORDER BY a.created_at ASC, a.id ASC`,
      [sessionId],
    );
    const votes = await this.pool.query(
      `SELECT choice, COUNT(*)::int AS n FROM ${this.schema}.sidang_votes
        WHERE session_id = $1 GROUP BY choice`,
      [sessionId],
    );
    const tally = { SETUJU: 0, TOLAK: 0, ABSTAIN: 0 } as Record<SidangVoteChoice, number>;
    for (const v of votes.rows) tally[v.choice as SidangVoteChoice] = v.n;

    return {
      session: {
        id: s.id,
        groupId: s.group_id,
        title: s.title,
        description: s.description,
        status: s.status,
        quorumPct: s.quorum_pct,
        phaseEndsAt: s.phase_ends_at,
        createdAt: s.created_at,
        createdBy: s.created_by,
        createdByName: s.created_by_name ?? null,
        closedAt: s.closed_at,
      },
      arguments: arguments_.rows.map((r) => ({
        id: r.id,
        kind: r.kind,
        body: r.body,
        authorName: r.author_name ?? null,
        createdAt: r.created_at,
      })),
      // Hasil hanya ditampilkan setelah voting ditutup (anti-bandwagon).
      result: s.status === 'SELESAI' || s.status === 'DIBATALKAN' ? tally : null,
    };
  }

  /** Job simulasi: maju fase yang sudah lewat phase_ends_at. */
  async advanceExpiredPhases(): Promise<number> {
    return inTransaction(this.pool, async (client) => {
      const expired = await client.query(
        `SELECT id, status FROM ${this.schema}.sidang_sessions
          WHERE phase_ends_at IS NOT NULL AND phase_ends_at < now()
            AND status NOT IN ('SELESAI', 'DIBATALKAN')`,
      );
      let moved = 0;
      for (const row of expired.rows) {
        try {
          await client.query(
            `UPDATE ${this.schema}.sidang_sessions
                SET status = $2,
                    phase_ends_at = CASE WHEN $2 = 'VOTING'
                      THEN now() + interval '${SIDANG_PHASE_HOURS.VOTING} hours'
                      WHEN $2 = 'SANGGAH'
                      THEN now() + interval '${SIDANG_PHASE_HOURS.SANGGAH} hours'
                      ELSE phase_ends_at END
              WHERE id = $1`,
            [row.id, row.status === 'TANYA' ? 'SANGGAH' : 'VOTING'],
          );
          moved += 1;
        } catch {
          /* trigger guard menolak (mis. sanggah < 2) → biarkan, coba lagi nanti */
        }
      }
      return moved;
    });
  }

  private async isGroupAdmin(client: import('pg').PoolClient, groupId: string, principalId: string) {
    const result = await client.query(
      `SELECT 1 FROM ${this.schema}.group_memberships
        WHERE group_id = $1 AND principal_id = $2
          AND status = 'ACTIVE' AND decided_by = principal_id`,
      [groupId, principalId],
    );
    return Boolean(result.rows[0]);
  }

  private async countActiveMembers(client: import('pg').PoolClient, groupId: string) {
    const result = await client.query<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM ${this.schema}.group_memberships m
         JOIN ${this.schema}.principals p ON p.id = m.principal_id
        WHERE m.group_id = $1 AND m.status = 'ACTIVE'
          AND p.deleted_at IS NULL`,
      [groupId],
    );
    return result.rows[0]?.n ?? 0;
  }
}
