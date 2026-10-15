import { randomUUID } from 'node:crypto';

import type { Pool, PoolClient } from 'pg';

import { ApiError } from '@/api/errors';
import { requireApproved } from '@/api/policy';
import type { ModerationDecision, Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import { LINE_RATE_LIMITS } from '@/server/moderation/blocked-words';
import { appendAuditEvent } from '@/services/audit';
import { LocalModerationEngine, ModerationService } from '@/services/moderation';

type Assessment = 'UNASSESSED' | 'SAFE' | 'UNSAFE';
type ModeratedState = 'PENDING_MODERATION' | 'QUARANTINED' | 'PUBLISHED' | 'REJECTED';

export class SocialService {
  private readonly schema: string;
  private readonly moderation: ModerationService;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
    moderator: ModerationDecision = new LocalModerationEngine(),
    private readonly now: () => Date = () => new Date(),
  ) {
    this.schema = quotedSchema(schemaName);
    this.moderation = new ModerationService(pool, schemaName, moderator, now);
  }

  /**
   * L05: feed kronologis viewer-aware dengan DTO kanonis.
   * - Hanya PUBLISHED + SAFE + grup APPROVED (atau tanpa grup).
   * - Post grup hanya untuk anggota aktif (viewer dikenal); tamu hanya post non-grup.
   * - Pasangan block dua-arah dan author yang di-mute viewer disembunyikan di query.
   */
  async listFeed(
    input: {
      cursor?: string;
      limit?: number;
      groupId?: string;
      principalId?: string;
    } = {},
  ) {
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const cursor = decodeCursor(input.cursor);
    const values: unknown[] = [limit + 1];
    const filters = [
      `p.status = 'PUBLISHED'`,
      `p.moderation_status = 'SAFE'`,
      `(p.group_id IS NULL OR EXISTS (SELECT 1 FROM ${this.schema}.public_groups g WHERE g.id=p.group_id AND g.status='APPROVED'))`,
    ];
    if (input.groupId) {
      values.push(input.groupId);
      filters.push(`p.group_id = $${values.length}`);
    }
    if (input.principalId) {
      values.push(input.principalId);
      const pIdx = values.length;
      // Block dua-arah di query (G-02); mute satu-arah disembunyikan dari viewer (G-04).
      filters.push(
        `NOT EXISTS (
          SELECT 1 FROM ${this.schema}.social_blocks sb
          WHERE (sb.blocker_principal_id = $${pIdx} AND sb.blocked_principal_id = p.principal_id)
             OR (sb.blocker_principal_id = p.principal_id AND sb.blocked_principal_id = $${pIdx})
        )`,
        `NOT EXISTS (
          SELECT 1 FROM ${this.schema}.social_mutes sm
          WHERE sm.muter_principal_id = $${pIdx} AND sm.muted_principal_id = p.principal_id
        )`,
        // Post grup hanya terlihat anggota aktif (G-08).
        `(p.group_id IS NULL OR EXISTS (
          SELECT 1 FROM ${this.schema}.group_memberships m
          WHERE m.group_id = p.group_id AND m.principal_id = $${pIdx} AND m.status = 'ACTIVE'
        ))`,
        `pr.social_status = 'ENABLED'`,
      );
    } else {
      // Tamu: tanpa post grup dan tanpa author non-aktif.
      filters.push(`p.group_id IS NULL`, `pr.social_status = 'ENABLED'`);
    }
    if (cursor) {
      values.push(cursor.createdAt, cursor.id);
      filters.push(`(p.created_at, p.id) < ($${values.length - 1}, $${values.length})`);
    }
    const viewer = input.principalId ?? null;
    const result = await this.pool.query(
      `SELECT p.id, p.principal_id, p.group_id, p.body, p.link_url, p.audience_policy,
              p.status, p.created_at, pr.display_name, pr.username,
              COALESCE((SELECT jsonb_agg(jsonb_build_object(
                'id', so.id, 'mediaType', so.media_type, 'sizeBytes', so.size_bytes)
                ORDER BY a.position)
                FROM ${this.schema}.social_post_attachments a
                JOIN ${this.schema}.storage_objects so ON so.id = a.storage_object_id
                WHERE a.post_id = p.id AND so.storage_state = 'ACTIVE'
                  AND so.assessment_status = 'SAFE' AND so.deleted_at IS NULL), '[]') AS attachments,
              (SELECT count(*)::int FROM ${this.schema}.social_comments c
                WHERE c.post_id = p.id AND c.status = 'PUBLISHED') AS comment_count,
              (SELECT count(*)::int FROM ${this.schema}.social_reactions r
                WHERE r.post_id = p.id) AS reaction_count,
              (SELECT r.reaction FROM ${this.schema}.social_reactions r
                WHERE r.post_id = p.id AND r.principal_id = $${values.length + 1}) AS my_reaction,
              EXISTS (SELECT 1 FROM ${this.schema}.saved_social_posts s
                WHERE s.post_id = p.id AND s.principal_id = $${values.length + 1}) AS is_saved
         FROM ${this.schema}.social_posts p
         JOIN ${this.schema}.principals pr ON pr.id = p.principal_id
        WHERE ${filters.join(' AND ')}
        ORDER BY p.created_at DESC, p.id DESC LIMIT $1`,
      [...values, viewer],
    );
    const rows = result.rows.slice(0, limit);
    const last = rows.at(-1) as { created_at?: Date; id?: string } | undefined;
    return {
      items: rows.map((row) => this.toPostView(row, viewer)),
      nextCursor:
        result.rows.length > limit && last?.created_at && last.id
          ? encodeCursor(last.created_at, last.id)
          : null,
    };
  }

  /** Proyeksi baris feed menjadi DTO kanonis (tanpa field moderasi internal). */
  private toPostView(
    row: {
      id: string;
      principal_id: string;
      group_id: string | null;
      body: string;
      link_url: string | null;
      status: string;
      created_at: Date;
      display_name: string;
      username: string;
      attachments: unknown;
      comment_count: number;
      reaction_count: number;
      my_reaction: string | null;
      is_saved: boolean;
    },
    viewerId: string | null,
  ) {
    const attachments = Array.isArray(row.attachments)
      ? (row.attachments as Array<{ id: string; mediaType: string; sizeBytes: number | string }>)
          .filter((a) => a && typeof a.id === 'string')
          .map((a) => ({ id: a.id, mediaType: a.mediaType, sizeBytes: Number(a.sizeBytes) }))
      : [];
    return {
      id: row.id,
      body: row.body,
      linkUrl: row.link_url,
      groupId: row.group_id,
      authorId: row.principal_id,
      authorName: row.display_name,
      authorUsername: row.username,
      createdAt: new Date(row.created_at).toISOString(),
      status: row.status as 'PUBLISHED' | 'PENDING_MODERATION' | 'QUARANTINED',
      attachments,
      attachmentCount: attachments.length,
      commentCount: Number(row.comment_count),
      reactionCount: Number(row.reaction_count),
      myReaction: viewerId ? row.my_reaction : null,
      isSaved: viewerId ? Boolean(row.is_saved) : false,
      mine: viewerId === row.principal_id,
    };
  }

  async createPost(
    principal: Principal,
    input: {
      body?: string;
      linkUrl?: string;
      attachmentIds?: string[];
      groupId?: string;
      audiencePolicy?: 'ADULT_PUBLIC' | 'CHILD_FIXTURE_ONLY';
      /** Tipe postingan: KARYA (ide/karya) atau CURHAT (isi hati/masalah). */
      postType?: 'KARYA' | 'CURHAT';
      /** Mode anonim: hanya boleh untuk CURHAT. Identitas tetap tercatat server-side. */
      anonymous?: boolean;
    },
  ) {
    this.requireSocial(principal);
    await this.assertPostRateLimit(principal);
    const postType: 'KARYA' | 'CURHAT' =
      input.postType === 'CURHAT' ? 'CURHAT' : 'KARYA';
    // Anonim hanya untuk curhat (lihat constraint social_posts_anonymous_scope_check).
    const anonymous = Boolean(input.anonymous) && postType === 'CURHAT';
    const body = cleanText(input.body ?? '', 10_000, true);
    const linkUrl = optionalWebUrl(input.linkUrl);
    const attachments = uniqueIds(input.attachmentIds ?? [], 10);
    if (!body && !linkUrl && attachments.length === 0) {
      throw new ApiError('VALIDATION_FAILED', 'Posting tidak boleh kosong');
    }
    const audience = input.audiencePolicy ?? 'ADULT_PUBLIC';
    this.requireFixtureAudience(principal, audience);
    const id = randomUUID();
    return inTransaction(this.pool, async (client) => {
      const assessment = await this.moderation.assessAndRecord(
        {
          principal,
          targetType: 'SOCIAL_POST',
          targetId: id,
          contentText: body,
          url: linkUrl ?? undefined,
        },
        client,
      );
      if (input.groupId) await this.assertCanPostToGroup(client, principal, input.groupId);
      const mediaSafe = await this.assertOwnedSafeMedia(client, principal, attachments);
      const state = publicationState(assessment.status, mediaSafe);
      const inserted = await client.query(
        `INSERT INTO ${this.schema}.social_posts
           (id, principal_id, group_id, body, link_url, status, moderation_status,
            moderation_reason, audience_policy, is_indexed, is_test, post_type, is_anonymous)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
        [
          id,
          principal.id,
          input.groupId ?? null,
          body,
          linkUrl,
          state,
          assessment.status,
          assessment.reason,
          audience,
          state === 'PUBLISHED' && audience === 'ADULT_PUBLIC',
          principal.fixture,
          postType,
          anonymous,
        ],
      );
      for (const [position, objectId] of attachments.entries()) {
        await client.query(
          `INSERT INTO ${this.schema}.social_post_attachments
             (post_id, storage_object_id, position) VALUES ($1,$2,$3)`,
          [id, objectId, position],
        );
      }
      // L05 G-01: hanya post PUBLISHED + ADULT_PUBLIC yang boleh terindeks.
      // Pending/quarantined/rejected tidak boleh terekspos lewat SearchService.
      const indexable = state === 'PUBLISHED' && audience === 'ADULT_PUBLIC';
      await client.query(
        `INSERT INTO ${this.schema}.search_index_entries
           (id,entry_type,object_id,title,slug,summary,searchable_body,access_level,source_key,language,is_indexed,is_test)
         VALUES ($1,'POST',$2,$3,$4,$5,$6,'PUBLIC',$7,'id',$8,$9)
         ON CONFLICT (source_key) DO UPDATE SET
           title=EXCLUDED.title,summary=EXCLUDED.summary,searchable_body=EXCLUDED.searchable_body,
           is_indexed=EXCLUDED.is_indexed,updated_at=CURRENT_TIMESTAMP`,
        [
          randomUUID(),
          id,
          body.slice(0, 220) || 'Posting Madevi Line',
          `line/${id}`,
          body.slice(0, 500),
          body,
          `SOCIAL_POST:${id}`,
          indexable,
          principal.fixture,
        ],
      );
      await appendAuditEvent(
        client,
        this.audit(principal, 'SOCIAL_POST_CREATED', 'social_post', id, {
          state,
          attachmentCount: attachments.length,
        }),
      );
      return inserted.rows[0];
    });
  }

  async updatePost(
    principal: Principal,
    postId: string,
    input: { body?: string; linkUrl?: string },
  ) {
    this.requireSocial(principal);
    const body = cleanText(input.body ?? '', 10_000, true);
    const linkUrl = optionalWebUrl(input.linkUrl);
    if (!body && !linkUrl) throw new ApiError('VALIDATION_FAILED', 'Posting tidak boleh kosong');
    return inTransaction(this.pool, async (client) => {
      const assessment = await this.moderation.assessAndRecord(
        {
          principal,
          targetType: 'SOCIAL_POST',
          targetId: postId,
          contentText: body,
          url: linkUrl ?? undefined,
        },
        client,
      );
      const state = publicationState(assessment.status, true);
      const result = await client.query(
        `UPDATE ${this.schema}.social_posts
          SET body=$3, link_url=$4, status=$5, moderation_status=$6,
              moderation_reason=$7, is_indexed=($5='PUBLISHED' AND audience_policy='ADULT_PUBLIC'),
              updated_at=$8, version=version+1
        WHERE id=$1 AND principal_id=$2 AND status <> 'DELETED' RETURNING *`,
        [
          postId,
          principal.id,
          body,
          linkUrl,
          state,
          assessment.status,
          assessment.reason,
          this.now(),
        ],
      );
      if (!result.rows[0]) throw new ApiError('NOT_FOUND', 'Posting milik Anda tidak ditemukan');
      // L05 G-01: sinkron index mengikuti status terbit + audience, bukan selalu true.
      const published = state === 'PUBLISHED';
      const audienceOk = (result.rows[0] as { audience_policy?: string }).audience_policy !== 'CHILD_FIXTURE_ONLY';
      await client.query(
        `UPDATE ${this.schema}.search_index_entries
            SET title=$2,summary=$3,searchable_body=$4,is_indexed=($5 AND $6),updated_at=CURRENT_TIMESTAMP
          WHERE source_key=$1`,
        [`SOCIAL_POST:${postId}`, body.slice(0, 220) || 'Posting Madevi Line', body.slice(0, 500), body, published, audienceOk],
      );
      return result.rows[0];
    });
  }

  async deletePost(principal: Principal, postId: string) {
    this.requireSocial(principal);
    return inTransaction(this.pool, async (client) => {
      const result = await client.query<{ storage_object_id: string | null }>(
        `UPDATE ${this.schema}.social_posts SET body='', link_url=NULL, status='DELETED',
              is_indexed=false, deleted_at=$3, updated_at=$3, version=version+1
          WHERE id=$1 AND principal_id=$2 AND status <> 'DELETED'
          RETURNING (SELECT min(storage_object_id::text)::uuid
            FROM ${this.schema}.social_post_attachments WHERE post_id=$1) storage_object_id`,
        [postId, principal.id, this.now()],
      );
      if (!result.rows[0]) throw new ApiError('NOT_FOUND', 'Posting milik Anda tidak ditemukan');
      await client.query(
        `UPDATE ${this.schema}.search_index_entries SET is_indexed=false,updated_at=CURRENT_TIMESTAMP
          WHERE source_key=$1`,
        [`SOCIAL_POST:${postId}`],
      );
      const refs = await client.query<{ storage_object_id: string }>(
        `DELETE FROM ${this.schema}.social_post_attachments WHERE post_id=$1 RETURNING storage_object_id`,
        [postId],
      );
      for (const ref of refs.rows) await this.releaseIfUnreferenced(client, ref.storage_object_id);
      await appendAuditEvent(
        client,
        this.audit(principal, 'SOCIAL_POST_DELETED', 'social_post', postId),
      );
      return { id: postId, deleted: true };
    });
  }

  /**
   * L05: komentar viewer-aware dengan cursor. Visibility post diperiksa dulu
   * (tamu boleh baca post publik non-grup; pasangan block ditolak generik).
   */
  async listComments(
    postId: string,
    principalId?: string,
    input: { cursor?: string; limit?: number } = {},
  ) {
    const limit = Math.min(Math.max(input.limit ?? 50, 1), 100);
    const cursor = decodeCursor(input.cursor);
    if (principalId) {
      await this.assertPostActionAllowed(this.pool, principalId, postId);
    } else {
      await this.pool
        .query(
          `SELECT 1 FROM ${this.schema}.social_posts
            WHERE id = $1 AND status = 'PUBLISHED' AND moderation_status = 'SAFE'
              AND group_id IS NULL`,
          [postId],
        )
        .then((r) => {
          if (!r.rows[0]) throw new ApiError('NOT_FOUND', 'Posting tidak ditemukan');
        });
    }
    const values: unknown[] = [postId, limit + 1];
    const filters = [`c.post_id = $1`, `c.status = 'PUBLISHED'`, `c.moderation_status = 'SAFE'`];
    if (principalId) {
      values.push(principalId);
      const pIdx = values.length;
      filters.push(
        `NOT EXISTS (
          SELECT 1 FROM ${this.schema}.social_blocks sb
          WHERE (sb.blocker_principal_id = $${pIdx} AND sb.blocked_principal_id = c.principal_id)
             OR (sb.blocker_principal_id = c.principal_id AND sb.blocked_principal_id = $${pIdx})
        )`,
        `NOT EXISTS (
          SELECT 1 FROM ${this.schema}.social_mutes sm
          WHERE sm.muter_principal_id = $${pIdx} AND sm.muted_principal_id = c.principal_id
        )`,
      );
    }
    if (cursor) {
      values.push(cursor.createdAt, cursor.id);
      filters.push(`(c.created_at, c.id) < ($${values.length - 1}, $${values.length})`);
    }
    const rows = await this.pool
      .query(
        `SELECT c.id,c.post_id,c.parent_comment_id,c.body,c.created_at,c.principal_id,
              p.display_name,p.username
         FROM ${this.schema}.social_comments c
         JOIN ${this.schema}.principals p ON p.id=c.principal_id
        WHERE ${filters.join(' AND ')}
        ORDER BY c.created_at,c.id LIMIT $2`,
        values,
      )
      .then((r) => r.rows.slice(0, limit));
    const last = rows.at(-1) as { created_at?: Date; id?: string } | undefined;
    return {
      items: rows.map((row) => ({
        id: row.id,
        postId: row.post_id,
        parentCommentId: row.parent_comment_id,
        body: row.body,
        authorId: row.principal_id,
        authorName: row.display_name,
        authorUsername: row.username,
        createdAt: new Date(row.created_at).toISOString(),
        mine: principalId === row.principal_id,
      })),
      nextCursor:
        rows.length === limit && last?.created_at && last.id
          ? encodeCursor(last.created_at, last.id)
          : null,
    };
  }

  async resolvePublicAttachment(postId: string, objectId: string, viewerId?: string) {
    const row = await this.pool
      .query<{ relative_path: string; media_type: string; size_bytes: string; sha256: string; principal_id: string }>(
        `SELECT so.relative_path,so.media_type,so.size_bytes,so.sha256,p.principal_id
         FROM ${this.schema}.social_post_attachments a
         JOIN ${this.schema}.social_posts p ON p.id=a.post_id
         JOIN ${this.schema}.storage_objects so ON so.id=a.storage_object_id
        WHERE a.post_id=$1 AND a.storage_object_id=$2
          AND p.status='PUBLISHED' AND p.moderation_status='SAFE'
          AND (p.group_id IS NULL OR EXISTS (
            SELECT 1 FROM ${this.schema}.public_groups g WHERE g.id=p.group_id AND g.status='APPROVED'))
          AND so.storage_state='ACTIVE' AND so.assessment_status='SAFE' AND so.deleted_at IS NULL`,
        [postId, objectId],
      )
      .then((result) => result.rows[0]);
    if (!row) throw new ApiError('NOT_FOUND', 'Lampiran aman tidak ditemukan');
    // L05 AC-01: tolak pasangan block dua-arah dengan pesan generik.
    if (viewerId && viewerId !== row.principal_id) {
      const blocked = await this.pool.query(
        `SELECT 1 FROM ${this.schema}.social_blocks
          WHERE (blocker_principal_id = $1 AND blocked_principal_id = $2)
             OR (blocker_principal_id = $2 AND blocked_principal_id = $1)`,
        [viewerId, row.principal_id],
      );
      if (blocked.rows[0]) throw new ApiError('NOT_FOUND', 'Lampiran aman tidak ditemukan');
    }
    return {
      relativePath: row.relative_path,
      mediaType: row.media_type,
      sizeBytes: Number(row.size_bytes),
      sha256: row.sha256,
    };
  }

  async addComment(principal: Principal, postId: string, bodyInput: string, parentId?: string) {
    this.requireSocial(principal);
    await this.assertCommentRateLimit(principal);
    const body = cleanText(bodyInput, 5_000);
    const id = randomUUID();
    return inTransaction(this.pool, async (client) => {
      // L05 G-02: tolak aksi lintas block / non-anggota grup.
      await this.assertPostActionAllowed(client, principal.id, postId);
      const assessment = await this.moderation.assessAndRecord(
        {
          principal,
          targetType: 'SOCIAL_COMMENT',
          targetId: id,
          contentText: body,
        },
        client,
      );
      const status =
        assessment.status === 'SAFE'
          ? 'PUBLISHED'
          : assessment.status === 'UNSAFE'
            ? 'REJECTED'
            : 'PENDING_MODERATION';
      const result = await client.query(
        `INSERT INTO ${this.schema}.social_comments
        (id,post_id,principal_id,parent_comment_id,body,status,moderation_status,is_test)
       SELECT $1,$2,$3,$4,$5,$6,$7,$8
        WHERE $4::uuid IS NULL OR EXISTS (
          SELECT 1 FROM ${this.schema}.social_comments WHERE id=$4 AND post_id=$2)
       RETURNING *`,
        [
          id,
          postId,
          principal.id,
          parentId ?? null,
          body,
          status,
          assessment.status,
          principal.fixture,
        ],
      );
      if (!result.rows[0]) throw new ApiError('VALIDATION_FAILED', 'Komentar induk tidak valid');
      // L05 G-10: beri tahu author post (tepat-satu-per-event; self/mute/block disaring).
      const postAuthor = await client
        .query<{ principal_id: string }>(
          `SELECT principal_id FROM ${this.schema}.social_posts WHERE id = $1`,
          [postId],
        )
        .then((r) => r.rows[0]);
      if (postAuthor && status === 'PUBLISHED') {
        await this.notifyRecipient(client, {
          actor: principal,
          recipientId: postAuthor.principal_id,
          type: 'POST_COMMENTED',
          objectType: 'COMMENT',
          objectId: id,
          summary: 'Komentar baru pada postingan Anda',
        });
      }
      return result.rows[0];
    });
  }

  async updateComment(principal: Principal, commentId: string, bodyInput: string) {
    this.requireSocial(principal);
    const body = cleanText(bodyInput, 5_000);
    return inTransaction(this.pool, async (client) => {
      const assessment = await this.moderation.assessAndRecord(
        { principal, targetType: 'SOCIAL_COMMENT', targetId: commentId, contentText: body },
        client,
      );
      const status =
        assessment.status === 'SAFE'
          ? 'PUBLISHED'
          : assessment.status === 'UNSAFE'
            ? 'REJECTED'
            : 'PENDING_MODERATION';
      const row = await client
        .query(
          `UPDATE ${this.schema}.social_comments SET body=$3,status=$4,moderation_status=$5,updated_at=$6 WHERE id=$1 AND principal_id=$2 AND status<>'DELETED' RETURNING *`,
          [commentId, principal.id, body, status, assessment.status, this.now()],
        )
        .then((r) => r.rows[0]);
      if (!row) throw new ApiError('NOT_FOUND', 'Komentar milik Anda tidak ditemukan');
      return row;
    });
  }

  async deleteComment(principal: Principal, commentId: string) {
    this.requireSocial(principal);
    const row = await this.pool
      .query(
        `UPDATE ${this.schema}.social_comments SET body='',status='DELETED',deleted_at=$3,updated_at=$3 WHERE id=$1 AND principal_id=$2 AND status<>'DELETED' RETURNING id`,
        [commentId, principal.id, this.now()],
      )
      .then((r) => r.rows[0]);
    if (!row) throw new ApiError('NOT_FOUND', 'Komentar milik Anda tidak ditemukan');
    return { id: commentId, deleted: true };
  }

  async setReaction(principal: Principal, postId: string, reaction: string | null) {
    this.requireSocial(principal);
    // L05 G-02: tolak aksi lintas block / non-anggota grup.
    await this.assertPostActionAllowed(this.pool, principal.id, postId);
    if (reaction === null) {
      await this.pool.query(
        `DELETE FROM ${this.schema}.social_reactions WHERE post_id=$1 AND principal_id=$2`,
        [postId, principal.id],
      );
      return { reaction: null };
    }
    if (!['LIKE', 'SUPPORT', 'INSIGHTFUL', 'THANKS'].includes(reaction)) {
      throw new ApiError('VALIDATION_FAILED', 'Reaksi tidak valid');
    }
    await this.pool.query(
      `INSERT INTO ${this.schema}.social_reactions (post_id,principal_id,reaction)
       VALUES ($1,$2,$3) ON CONFLICT (post_id,principal_id)
       DO UPDATE SET reaction=EXCLUDED.reaction,created_at=CURRENT_TIMESTAMP`,
      [postId, principal.id, reaction],
    );
    return { reaction };
  }

  async setSaved(principal: Principal, postId: string, saved: boolean) {
    this.requireSocial(principal);
    // L05 G-02: tolak aksi lintas block / non-anggota grup.
    await this.assertPostActionAllowed(this.pool, principal.id, postId);
    if (saved) {
      await this.pool.query(
        `INSERT INTO ${this.schema}.saved_social_posts (post_id,principal_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [postId, principal.id],
      );
    } else {
      await this.pool.query(
        `DELETE FROM ${this.schema}.saved_social_posts WHERE post_id=$1 AND principal_id=$2`,
        [postId, principal.id],
      );
    }
    return { saved };
  }

  async report(
    principal: Principal,
    input: {
      objectType: string;
      objectId: string;
      reason: string;
      idempotencyKey: string;
      category?: string;
    },
  ) {
    this.requireSocial(principal);
    const type = input.objectType.toUpperCase();
    if (!['POST', 'COMMENT', 'GROUP_POST'].includes(type))
      throw new ApiError(
        'VALIDATION_FAILED',
        'Gunakan endpoint laporan pesan khusus untuk MESSAGE',
      );
    const reason = cleanText(input.reason, 2_000, false, 10);
    validateKey(input.idempotencyKey);
    return inTransaction(this.pool, async (client) => {
      const previous = await client.query<{
        id: string;
        object_type: string;
        object_id: string;
        reason: string;
      }>(
        `SELECT id,object_type,object_id,reason FROM ${this.schema}.social_reports
          WHERE reporter_principal_id=$1 AND idempotency_key=$2`,
        [principal.id, input.idempotencyKey],
      );
      if (previous.rows[0]) {
        const p = previous.rows[0];
        if (p.object_type !== type || p.object_id !== input.objectId || p.reason !== reason)
          throw new ApiError('IDEMPOTENCY_CONFLICT', 'Key laporan dipakai untuk payload berbeda');
        return p;
      }
      const target =
        type === 'COMMENT'
          ? await client
              .query<{ principal_id: string; body: string; link_url: null }>(
                `SELECT principal_id,body,NULL::text link_url FROM ${this.schema}.social_comments
            WHERE id=$1 AND status='PUBLISHED'`,
                [input.objectId],
              )
              .then((query) => query.rows[0])
          : await client
              .query<{ principal_id: string; body: string; link_url: string | null }>(
                `SELECT principal_id,body,link_url FROM ${this.schema}.social_posts
            WHERE id=$1 AND status='PUBLISHED' AND ($2<>'GROUP_POST' OR group_id IS NOT NULL)`,
                [input.objectId, type],
              )
              .then((query) => query.rows[0]);
      if (!target) throw new ApiError('NOT_FOUND', 'Objek laporan tidak ditemukan');
      const id = randomUUID();
      const category = normalizeReportCategory(input.category);
      const created = await client.query(
        `INSERT INTO ${this.schema}.social_reports
          (id,reporter_principal_id,object_type,object_id,reason,reason_category,
           idempotency_key,is_test)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [
          id,
          principal.id,
          type,
          input.objectId,
          reason,
          category,
          input.idempotencyKey,
          principal.fixture,
        ],
      );
      const subject = await this.loadPrincipal(client, target.principal_id);
      await this.moderation.openReportedCase(
        {
          subject,
          targetType: type === 'COMMENT' ? 'SOCIAL_COMMENT' : 'SOCIAL_POST',
          targetId: input.objectId,
          contentText: target.body,
          url: target.link_url ?? undefined,
        },
        client,
      );
      await appendAuditEvent(
        client,
        this.audit(principal, 'SOCIAL_OBJECT_REPORTED', 'social_report', id, {
          objectType: type,
          objectId: input.objectId,
        }),
      );
      return created.rows[0];
    });
  }

  async quota(principal: Principal) {
    requireApproved(principal);
    const row = await this.pool
      .query<{ limit_bytes: string; used_bytes: string; reserved_bytes: string }>(
        `INSERT INTO ${this.schema}.quota_accounts (principal_id) VALUES ($1)
       ON CONFLICT (principal_id) DO UPDATE SET principal_id=EXCLUDED.principal_id
       RETURNING limit_bytes,used_bytes,reserved_bytes`,
        [principal.id],
      )
      .then((r) => r.rows[0]);
    const limitBytes = Number(row.limit_bytes);
    const usedBytes = Number(row.used_bytes);
    const reservedBytes = Number(row.reserved_bytes);
    return {
      limitBytes,
      usedBytes,
      reservedBytes,
      availableBytes: limitBytes - usedBytes - reservedBytes,
      warning: usedBytes + reservedBytes >= limitBytes * 0.8,
      full: usedBytes + reservedBytes >= limitBytes,
    };
  }

  /**
   * L05 G-10: notifikasi sosial tepat-satu-per-event.
   * - event_key deterministik `social:<event-id>:<recipient>:<type>`.
   * - Baris outbox (pipeline pengiriman actor) + receipt inbox (per penerima),
   *   keduanya `ON CONFLICT DO NOTHING` → retry tidak menggandakan.
   * - Payload hanya ID/ringkasan yang di-redact; tanpa body pesan/evidence/URL privat.
   * - Dilewati untuk diri sendiri dan pasangan mute/block.
   */
  private async notifyRecipient(
    client: PoolClient,
    input: {
      actor: Principal;
      recipientId: string;
      type: 'MESSAGE_RECEIVED' | 'POST_COMMENTED' | 'REQUEST_RECEIVED' | 'REQUEST_ACCEPTED' | 'GROUP_DECISION';
      objectType: string;
      objectId: string;
      summary: string;
    },
  ) {
    if (input.recipientId === input.actor.id) return;
    const relation = await client.query(
      `SELECT 1 FROM ${this.schema}.social_mutes
        WHERE muter_principal_id = $1 AND muted_principal_id = $2
       UNION
       SELECT 1 FROM ${this.schema}.social_blocks
        WHERE (blocker_principal_id = $1 AND blocked_principal_id = $2)
           OR (blocker_principal_id = $2 AND blocked_principal_id = $1)`,
      [input.recipientId, input.actor.id],
    );
    if (relation.rows[0]) return;
    const eventKey = `social:${input.objectId}:${input.recipientId}:${input.type}`;
    await client.query(
      `INSERT INTO ${this.schema}.notification_outbox
         (id, principal_id, notification_type, payload, idempotency_key)
       VALUES ($1, $2, $3, $4::jsonb, $5)
       ON CONFLICT (principal_id, notification_type, idempotency_key) DO NOTHING`,
      [
        randomUUID(),
        input.actor.id,
        input.type,
        JSON.stringify({
          recipientId: input.recipientId,
          objectType: input.objectType,
          objectId: input.objectId,
        }),
        eventKey,
      ],
    );
    await client.query(
      `INSERT INTO ${this.schema}.social_notification_receipts
         (id, recipient_principal_id, event_key, notification_type,
          actor_principal_id, object_type, object_id, summary)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (event_key) DO NOTHING`,
      [
        randomUUID(),
        input.recipientId,
        eventKey,
        input.type,
        input.actor.id,
        input.objectType,
        input.objectId,
        input.summary.slice(0, 200),
      ],
    );
  }

  /** Inbox notifikasi milik sendiri dengan cursor + jumlah belum dibaca. */
  async listNotifications(principal: Principal, input: { cursor?: string; limit?: number } = {}) {
    this.requireSocial(principal);
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 50);
    const cursor = decodeCursor(input.cursor);
    const values: unknown[] = [principal.id, limit + 1];
    if (cursor) values.push(cursor.createdAt, cursor.id);
    const rows = await this.pool
      .query(
        `SELECT n.id, n.notification_type, n.actor_principal_id, n.object_type, n.object_id,
                n.summary, n.read_at, n.created_at
           FROM ${this.schema}.social_notification_receipts n
          WHERE n.recipient_principal_id = $1
          ${cursor ? `AND (n.created_at, n.id) < ($3, $4)` : ''}
          ORDER BY n.created_at DESC, n.id DESC LIMIT $2`,
        values,
      )
      .then((r) => r.rows.slice(0, limit));
    const unread = await this.pool
      .query(
        `SELECT count(*)::int AS count FROM ${this.schema}.social_notification_receipts
          WHERE recipient_principal_id = $1 AND read_at IS NULL`,
        [principal.id],
      )
      .then((r) => Number(r.rows[0]?.count ?? 0));
    const last = rows.at(-1) as { created_at?: Date; id?: string } | undefined;
    return {
      items: rows.map((row) => ({
        id: row.id,
        type: row.notification_type,
        actorId: row.actor_principal_id,
        objectType: row.object_type,
        objectId: row.object_id,
        summary: row.summary,
        read: row.read_at !== null,
        createdAt: new Date(row.created_at).toISOString(),
      })),
      nextCursor:
        rows.length === limit && last?.created_at && last.id
          ? encodeCursor(last.created_at, last.id)
          : null,
      unread,
    };
  }

  async markNotificationsRead(principal: Principal, ids?: string[]) {
    this.requireSocial(principal);
    const clean = (ids ?? []).filter((id) => /^[0-9a-f-]{36}$/i.test(id)).slice(0, 100);
    if (clean.length) {
      await this.pool.query(
        `UPDATE ${this.schema}.social_notification_receipts SET read_at = CURRENT_TIMESTAMP
          WHERE recipient_principal_id = $1 AND id = ANY($2::uuid[]) AND read_at IS NULL`,
        [principal.id, clean],
      );
    } else {
      await this.pool.query(
        `UPDATE ${this.schema}.social_notification_receipts SET read_at = CURRENT_TIMESTAMP
          WHERE recipient_principal_id = $1 AND read_at IS NULL`,
        [principal.id],
      );
    }
    return { ok: true };
  }

  /**
   * L05 G-03: kartu profil minimal viewer-aware.
   * Tamu atau pasangan block mendapat NOT_FOUND generik (tanpa membocorkan akun).
   */
  async viewProfileCard(viewerId: string | null, username: string) {
    const name = username.trim().toLowerCase();
    if (name.length < 3 || name.length > 32) throw new ApiError('NOT_FOUND', 'Profil tidak ditemukan');
    const row = await this.pool
      .query<{
        id: string;
        display_name: string;
        username: string;
        profile_description: string | null;
      }>(
        `SELECT id, display_name, username, profile_description
           FROM ${this.schema}.principals
          WHERE lower(username) = $1 AND lifecycle_status = 'ACTIVE'
            AND approval_status = 'APPROVED' AND social_status = 'ENABLED'
            AND deleted_at IS NULL`,
        [name],
      )
      .then((r) => r.rows[0]);
    if (!row) throw new ApiError('NOT_FOUND', 'Profil tidak ditemukan');
    if (viewerId && viewerId !== row.id) {
      const blocked = await this.pool.query(
        `SELECT 1 FROM ${this.schema}.social_blocks
          WHERE (blocker_principal_id = $1 AND blocked_principal_id = $2)
             OR (blocker_principal_id = $2 AND blocked_principal_id = $1)`,
        [viewerId, row.id],
      );
      if (blocked.rows[0]) throw new ApiError('NOT_FOUND', 'Profil tidak ditemukan');
    }
    if (!viewerId) throw new ApiError('NOT_FOUND', 'Profil tidak ditemukan');
    const friends = viewerId === row.id ? true : await this.pool
      .query(
        `SELECT 1 FROM ${this.schema}.friend_connections
          WHERE ((member_a_id = $1 AND member_b_id = $2) OR (member_a_id = $2 AND member_b_id = $1))
            AND status = 'ACCEPTED'`,
        [viewerId, row.id],
      )
      .then((r) => Boolean(r.rows[0]));
    return {
      username: row.username,
      displayName: row.display_name,
      bio: row.profile_description ?? '',
      friends,
      unavailable: false,
    };
  }

  /**
   * L05 G-04: block dua-arah menutup visibility dan kontak di query + assertion
   * (feed, komentar, aksi post, profil, people lookup, pesan, grup).
   * Membership grup TIDAK dihapus (retensi); isinya disaring fail-closed oleh
   * policy. Mute adalah preferensi satu-arah terpisah (social_mutes).
   */
  async setBlock(principal: Principal, blockedId: string, blocked: boolean) {
    this.requireSocial(principal);
    if (blockedId === principal.id)
      throw new ApiError('VALIDATION_FAILED', 'Tidak dapat memblokir diri sendiri');
    return inTransaction(this.pool, async (client) => {
      if (blocked) {
        await client.query(
          `INSERT INTO ${this.schema}.social_blocks (blocker_principal_id,blocked_principal_id,source_case_id) VALUES ($1,$2,NULL) ON CONFLICT (blocker_principal_id,blocked_principal_id) DO UPDATE SET source_case_id=NULL`,
          [principal.id, blockedId],
        );
        await client.query(
          `UPDATE ${this.schema}.message_requests SET status='BLOCKED',responded_at=$3 WHERE status='PENDING' AND ((sender_principal_id=$1 AND recipient_principal_id=$2) OR (sender_principal_id=$2 AND recipient_principal_id=$1))`,
          [principal.id, blockedId, this.now()],
        );
        const [a, b] = canonicalPair(principal.id, blockedId);
        await client.query(
          `UPDATE ${this.schema}.friend_connections SET status='REMOVED',updated_at=$3 WHERE member_a_id=$1 AND member_b_id=$2`,
          [a, b, this.now()],
        );
      } else {
        await client.query(
          `DELETE FROM ${this.schema}.social_blocks WHERE blocker_principal_id=$1 AND blocked_principal_id=$2`,
          [principal.id, blockedId],
        );
      }
      return { blocked };
    });
  }

  async createMessageRequest(
    principal: Principal,
    input: { recipientId: string; body: string; idempotencyKey: string; childFixture?: boolean },
  ) {
    this.requireSocial(principal);
    const body = requestText(input.body);
    validateKey(input.idempotencyKey);
    if (input.childFixture && !principal.fixture)
      throw new ApiError('ACCESS_DENIED', 'Pesan anak hanya untuk fixture uji sampai O-01');
    return inTransaction(this.pool, async (client) => {
      await this.assertNotBlocked(client, principal.id, input.recipientId);
      const recipient = await this.loadSocialPrincipal(client, input.recipientId);
      const sender = await this.loadSocialPrincipal(client, principal.id);
      const involvesMinor =
        isMinor(sender.birth_date, this.now()) || isMinor(recipient.birth_date, this.now());
      if (involvesMinor && (!input.childFixture || !principal.fixture || !recipient.is_test)) {
        throw new ApiError(
          'ACCESS_DENIED',
          'DM yang melibatkan anak hanya fixture uji sampai O-01',
        );
      }
      if (input.childFixture && (!principal.fixture || !recipient.is_test))
        throw new ApiError('ACCESS_DENIED', 'Penerima anak harus fixture uji');
      const previous = await client.query<{
        id: string;
        recipient_principal_id: string;
        body: string;
      }>(
        `SELECT id,recipient_principal_id,body FROM ${this.schema}.message_requests WHERE sender_principal_id=$1 AND idempotency_key=$2`,
        [principal.id, input.idempotencyKey],
      );
      if (previous.rows[0]) {
        if (
          previous.rows[0].recipient_principal_id !== input.recipientId ||
          previous.rows[0].body !== body
        )
          throw new ApiError(
            'IDEMPOTENCY_CONFLICT',
            'Key permintaan dipakai untuk payload berbeda',
          );
        return previous.rows[0];
      }
      const recent = await client
        .query<{ count: string }>(
          `SELECT count(*) FROM ${this.schema}.message_requests
          WHERE sender_principal_id=$1 AND created_at >= $2::timestamptz - interval '1 hour'`,
          [principal.id, this.now()],
        )
        .then((result) => Number(result.rows[0]?.count ?? 0));
      if (recent >= 10)
        throw new ApiError('RATE_LIMITED', 'Batas 10 permintaan pesan per jam tercapai');
      const pending = await client.query(
        `SELECT 1 FROM ${this.schema}.message_requests
          WHERE sender_principal_id=$1 AND recipient_principal_id=$2 AND status='PENDING' LIMIT 1`,
        [principal.id, input.recipientId],
      );
      if (pending.rowCount)
        throw new ApiError(
          'IDEMPOTENCY_CONFLICT',
          'Permintaan pesan ke penerima ini masih menunggu',
        );
      const id = randomUUID();
      const created = await client
        .query(
          `INSERT INTO ${this.schema}.message_requests
          (id,sender_principal_id,recipient_principal_id,body,idempotency_key,is_child_fixture,is_test)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
          [
            id,
            principal.id,
            input.recipientId,
            body,
            input.idempotencyKey,
            input.childFixture ?? false,
            principal.fixture && recipient.is_test,
          ],
        )
        .then((r) => r.rows[0]);
      // L05 G-10: beri tahu penerima request (tepat-satu-per-event).
      await this.notifyRecipient(client, {
        actor: principal,
        recipientId: input.recipientId,
        type: 'REQUEST_RECEIVED',
        objectType: 'MESSAGE_REQUEST',
        objectId: id,
        summary: 'Permintaan pesan baru di Madevi Line',
      });
      return created;
    });
  }

  async listMessageRequests(principal: Principal) {
    this.requireSocial(principal);
    return this.pool
      .query(
        `SELECT r.id,r.sender_principal_id,r.body,r.status,r.created_at,p.display_name,p.username
          FROM ${this.schema}.message_requests r JOIN ${this.schema}.principals p ON p.id=r.sender_principal_id
         WHERE r.recipient_principal_id=$1
           AND NOT EXISTS (
             SELECT 1 FROM ${this.schema}.social_blocks sb
              WHERE (sb.blocker_principal_id=$1 AND sb.blocked_principal_id=r.sender_principal_id)
                 OR (sb.blocker_principal_id=r.sender_principal_id AND sb.blocked_principal_id=$1)
           )
         ORDER BY r.created_at DESC`,
        [principal.id],
      )
      .then((r) =>
        r.rows.map((row) => ({
          id: row.id,
          senderId: row.sender_principal_id,
          body: row.body,
          status: row.status,
          senderName: row.display_name,
          senderUsername: row.username,
          createdAt: new Date(row.created_at).toISOString(),
        })),
      );
  }

  /**
   * L05 G-07: percakapan milik sendiri kecuali yang ditinggalkan viewer;
   * arsip ditandai (bukan disembunyikan) agar tidak hilang tanpa jejak.
   */
  async listConversations(principal: Principal) {
    this.requireSocial(principal);
    return this.pool
      .query(
        `SELECT c.id, c.member_a_id, c.member_b_id,
              p.display_name AS other_name, p.username AS other_username,
              (SELECT m.body FROM ${this.schema}.direct_messages m
                WHERE m.conversation_id = c.id ORDER BY m.sent_at DESC LIMIT 1) AS last_message,
              c.last_message_at AS updated_at,
              (pref.archived_at IS NOT NULL) AS archived
          FROM ${this.schema}.direct_conversations c
          JOIN ${this.schema}.principals p
            ON p.id = CASE WHEN c.member_a_id = $1 THEN c.member_b_id ELSE c.member_a_id END
          LEFT JOIN ${this.schema}.conversation_prefs pref
            ON pref.conversation_id = c.id AND pref.principal_id = $1
         WHERE (c.member_a_id = $1 OR c.member_b_id = $1) AND c.purged_at IS NULL
           AND (pref.left_at IS NULL)
           AND NOT EXISTS (
             SELECT 1 FROM ${this.schema}.social_blocks sb
              WHERE (sb.blocker_principal_id=$1 AND sb.blocked_principal_id=p.id)
                 OR (sb.blocker_principal_id=p.id AND sb.blocked_principal_id=$1)
           )
         ORDER BY c.updated_at DESC LIMIT 50`,
        [principal.id],
      )
      .then((r) =>
        r.rows.map((row) => ({
          id: row.id,
          otherId: row.member_a_id === principal.id ? row.member_b_id : row.member_a_id,
          otherName: row.other_name,
          otherUsername: row.other_username,
          lastMessage: row.last_message,
          updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
          archived: Boolean(row.archived),
        })),
      );
  }

  async respondMessageRequest(
    principal: Principal,
    requestId: string,
    input: { decision: 'ACCEPT' | 'REJECT'; becomeFriends?: boolean },
  ) {
    this.requireSocial(principal);
    if (!['ACCEPT', 'REJECT'].includes(input.decision))
      throw new ApiError('VALIDATION_FAILED', 'Keputusan tidak valid');
    return inTransaction(this.pool, async (client) => {
      const request = await client
        .query<{
          sender_principal_id: string;
          recipient_principal_id: string;
          status: string;
          is_child_fixture: boolean;
          is_test: boolean;
        }>(
          `SELECT sender_principal_id,recipient_principal_id,status,is_child_fixture,is_test FROM ${this.schema}.message_requests WHERE id=$1 FOR UPDATE`,
          [requestId],
        )
        .then((r) => r.rows[0]);
      if (!request || request.recipient_principal_id !== principal.id)
        throw new ApiError('NOT_FOUND', 'Permintaan pesan tidak ditemukan');
      if (request.status !== 'PENDING')
        throw new ApiError('IDEMPOTENCY_CONFLICT', 'Permintaan sudah diputuskan');
      await this.assertNotBlocked(client, request.sender_principal_id, principal.id);
      const accepted = input.decision === 'ACCEPT';
      await client.query(
        `UPDATE ${this.schema}.message_requests SET status=$2,befriend_on_accept=$3,responded_at=$4 WHERE id=$1`,
        [
          requestId,
          accepted ? 'ACCEPTED' : 'REJECTED',
          accepted ? Boolean(input.becomeFriends) : null,
          this.now(),
        ],
      );
      if (!accepted) return { accepted: false, conversationId: null };
      const [a, b] = canonicalPair(request.sender_principal_id, principal.id);
      const conversationId = randomUUID();
      const conversation = await client.query<{ id: string }>(
        `INSERT INTO ${this.schema}.direct_conversations
          (id,member_a_id,member_b_id,request_id,is_child_fixture,is_test)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (member_a_id,member_b_id) DO UPDATE SET request_id=EXCLUDED.request_id,purged_at=NULL,updated_at=$7
         RETURNING id`,
        [conversationId, a, b, requestId, request.is_child_fixture, request.is_test, this.now()],
      );
      if (input.becomeFriends)
        await client.query(
          `INSERT INTO ${this.schema}.friend_connections (member_a_id,member_b_id,requested_by,status)
         VALUES ($1,$2,$3,'ACCEPTED') ON CONFLICT (member_a_id,member_b_id)
         DO UPDATE SET status='ACCEPTED',updated_at=$4`,
          [a, b, request.sender_principal_id, this.now()],
        );
      // L05 G-10: beri tahu pengirim bahwa request diterima.
      if (accepted) {
        await this.notifyRecipient(client, {
          actor: principal,
          recipientId: request.sender_principal_id,
          type: 'REQUEST_ACCEPTED',
          objectType: 'MESSAGE_REQUEST',
          objectId: requestId,
          summary: 'Permintaan pesan Anda diterima',
        });
      }
      return {
        accepted: true,
        conversationId: conversation.rows[0].id,
        friends: Boolean(input.becomeFriends),
      };
    });
  }

  /**
   * L05 G-07: riwayat pesan dengan cursor. Percakapan yang ditinggalkan
   * viewer tidak lagi terbaca (bukti pihak lain dipertahankan).
   */
  async listMessages(
    principal: Principal,
    conversationId: string,
    input: { cursor?: string; limit?: number } = {},
  ) {
    this.requireSocial(principal);
    const limit = Math.min(Math.max(input.limit ?? 50, 1), 100);
    const cursor = decodeCursor(input.cursor);
    const conversation = await this.assertConversationMember(this.pool, principal.id, conversationId);
    const other =
      conversation.member_a_id === principal.id
        ? conversation.member_b_id
        : conversation.member_a_id;
    await this.assertNotBlocked(this.pool, principal.id, other);
    await this.assertConversationOpen(this.pool, principal.id, conversationId);
    const values: unknown[] = [conversationId, principal.id, limit + 1];
    if (cursor) values.push(cursor.createdAt, cursor.id);
    const rows = await this.pool
      .query(
        `SELECT id,conversation_id,sender_principal_id,
              CASE WHEN status='VISIBLE' OR sender_principal_id=$2 THEN body ELSE '' END body,
              CASE WHEN status='VISIBLE' OR sender_principal_id=$2 THEN storage_object_id ELSE NULL END storage_object_id,
              status,moderation_status,sent_at
         FROM ${this.schema}.direct_messages
        WHERE conversation_id=$1 AND status<>'DELETED_BOTH'
          AND (status='VISIBLE' OR sender_principal_id=$2)
        ${cursor ? `AND (sent_at, id) < ($4, $5)` : ''}
        ORDER BY sent_at DESC, id DESC LIMIT $3`,
        values,
      )
      .then((r) => r.rows.slice(0, limit).reverse());
    const first = rows[0] as { sent_at?: Date; id?: string } | undefined;
    return {
      items: rows.map((row) => ({
        id: row.id,
        conversationId: row.conversation_id,
        senderId: row.sender_principal_id,
        mine: row.sender_principal_id === principal.id,
        body: row.body,
        status: row.status,
        sentAt: new Date(row.sent_at).toISOString(),
      })),
      nextCursor:
        rows.length === limit && first?.sent_at && first.id
          ? encodeCursor(first.sent_at, first.id)
          : null,
    };
  }

  /** Preference arsip/keluar per anggota (tanpa menghapus bukti) — L05 G-07. */
  async setConversationPref(
    principal: Principal,
    conversationId: string,
    input: { archived?: boolean; leave?: boolean },
  ) {
    this.requireSocial(principal);
    await this.assertConversationMember(this.pool, principal.id, conversationId);
    await this.pool.query(
      `INSERT INTO ${this.schema}.conversation_prefs (conversation_id, principal_id, archived_at, left_at, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (conversation_id, principal_id) DO UPDATE SET
         archived_at = CASE WHEN $5 THEN $3 ELSE ${this.schema}.conversation_prefs.archived_at END,
         left_at = COALESCE($4, ${this.schema}.conversation_prefs.left_at),
         updated_at = CURRENT_TIMESTAMP`,
      [
        conversationId,
        principal.id,
        input.archived ? this.now() : null,
        input.leave ? this.now() : null,
        input.archived !== undefined,
      ],
    );
    // Catatan: keluar bersifat satu arah; membuka kembali hanya lewat request
    // pesan baru yang disetujui. Arsip dapat dibatalkan (archived=false).
    return { ok: true };
  }

  private async assertConversationOpen(client: Pick<Pool, 'query'> | PoolClient, principalId: string, conversationId: string) {
    const left = await client
      .query(
        `SELECT 1 FROM ${this.schema}.conversation_prefs
          WHERE conversation_id = $1 AND principal_id = $2 AND left_at IS NOT NULL`,
        [conversationId, principalId],
      )
      .then((r) => r.rows[0]);
    if (left) throw new ApiError('NOT_FOUND', 'Percakapan tidak ditemukan');
  }

  /**
   * L05 G-07: kirim pesan dengan idempotency key + rate limit per pengirim.
   * Retry dengan key sama mengembalikan pesan yang sama (replay), bukan duplikat.
   */
  async sendMessage(
    principal: Principal,
    conversationId: string,
    input: { body?: string; attachmentId?: string; idempotencyKey?: string },
  ) {
    this.requireSocial(principal);
    const body = cleanText(input.body ?? '', 10_000, true);
    if (!body && !input.attachmentId)
      throw new ApiError('VALIDATION_FAILED', 'Pesan tidak boleh kosong');
    if (input.idempotencyKey !== undefined) validateKey(input.idempotencyKey);
    return inTransaction(this.pool, async (client) => {
      const conversation = await this.assertConversationMember(
        client,
        principal.id,
        conversationId,
        true,
      );
      const other =
        conversation.member_a_id === principal.id
          ? conversation.member_b_id
          : conversation.member_a_id;
      await this.assertNotBlocked(client, principal.id, other);
      await this.assertConversationOpen(client, principal.id, conversationId);
      if (input.idempotencyKey) {
        const replay = await client
          .query(
            `SELECT * FROM ${this.schema}.direct_messages
              WHERE conversation_id = $1 AND sender_principal_id = $2 AND idempotency_key = $3`,
            [conversationId, principal.id, input.idempotencyKey],
          )
          .then((r) => r.rows[0]);
        if (replay) return replay;
      }
      const recent = await client
        .query<{ count: string }>(
          `SELECT count(*) FROM ${this.schema}.direct_messages
           WHERE sender_principal_id = $1 AND sent_at >= $2::timestamptz - interval '1 hour'`,
          [principal.id, this.now()],
        )
        .then((result) => Number(result.rows[0]?.count ?? 0));
      if (recent >= 30)
        throw new ApiError('RATE_LIMITED', 'Batas 30 pesan per jam tercapai');
      const mediaSafe = input.attachmentId
        ? await this.assertOwnedSafeMedia(client, principal, [input.attachmentId])
        : true;
      const id = randomUUID();
      const assessment = await this.moderation.assessAndRecord(
        {
          principal,
          targetType: 'DIRECT_MESSAGE',
          targetId: id,
          contentText: body,
        },
        client,
      );
      const status =
        assessment.status === 'SAFE' && mediaSafe
          ? 'VISIBLE'
          : assessment.status === 'UNSAFE'
            ? 'REJECTED'
            : 'QUARANTINED';
      if (assessment.riskLevel === 'HIGH') {
        await client.query(
          `INSERT INTO ${this.schema}.social_blocks
            (blocker_principal_id,blocked_principal_id,source_case_id) VALUES ($1,$2,$3)
           ON CONFLICT DO NOTHING`,
          [other, principal.id, assessment.caseId],
        );
      }
      const sentAt = this.now();
      const message = await client.query(
        `INSERT INTO ${this.schema}.direct_messages
          (id,conversation_id,sender_principal_id,body,storage_object_id,status,moderation_status,moderation_reason,is_test,idempotency_key)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [
          id,
          conversationId,
          principal.id,
          body,
          input.attachmentId ?? null,
          status,
          assessment.status,
          assessment.reason,
          principal.fixture,
          input.idempotencyKey ?? null,
        ],
      );
      await client.query(
        `UPDATE ${this.schema}.direct_conversations SET last_message_at=$2,updated_at=$2,purged_at=NULL WHERE id=$1`,
        [conversationId, sentAt],
      );
      // L05 G-10: notifikasi penerima (dedupe per event; mute/block/self disaring).
      if (status === 'VISIBLE') {
        await this.notifyRecipient(client, {
          actor: principal,
          recipientId: other,
          type: 'MESSAGE_RECEIVED',
          objectType: 'MESSAGE',
          objectId: id,
          summary: 'Pesan baru di Madevi Line',
        });
      }
      return message.rows[0];
    });
  }

  async deleteMessage(principal: Principal, messageId: string) {
    this.requireSocial(principal);
    return inTransaction(this.pool, async (client) => {
      const row = await client
        .query<{
          conversation_id: string;
          sender_principal_id: string;
          storage_object_id: string | null;
          status: string;
        }>(
          `SELECT m.conversation_id,m.sender_principal_id,m.storage_object_id,m.status
         FROM ${this.schema}.direct_messages m JOIN ${this.schema}.direct_conversations c ON c.id=m.conversation_id
         WHERE m.id=$1 AND $2 IN (c.member_a_id,c.member_b_id) FOR UPDATE`,
          [messageId, principal.id],
        )
        .then((r) => r.rows[0]);
      if (!row) throw new ApiError('NOT_FOUND', 'Pesan tidak ditemukan');
      if (row.status !== 'DELETED_BOTH') {
        await client.query(
          `UPDATE ${this.schema}.direct_messages SET body='',storage_object_id=NULL,status='DELETED_BOTH',deleted_at=$2 WHERE id=$1`,
          [messageId, this.now()],
        );
        await client.query(
          `INSERT INTO ${this.schema}.message_tombstones
          (message_id,conversation_id,original_sender_id,deleted_by,deleted_at,attachment_was_present)
          VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`,
          [
            messageId,
            row.conversation_id,
            row.sender_principal_id,
            principal.id,
            this.now(),
            Boolean(row.storage_object_id),
          ],
        );
        if (row.storage_object_id) await this.releaseIfUnreferenced(client, row.storage_object_id);
      }
      return { id: messageId, deletedForBoth: true };
    });
  }

  async reportMessage(
    principal: Principal,
    messageId: string,
    reason: string,
    idempotencyKey: string,
  ) {
    this.requireSocial(principal);
    const evidenceReason = cleanText(reason, 2_000, false, 10);
    validateKey(idempotencyKey);
    return inTransaction(this.pool, async (client) => {
      const message = await client
        .query<{
          conversation_id: string;
          sender_principal_id: string;
          body: string;
          storage_object_id: string | null;
          is_test: boolean;
        }>(
          `SELECT m.conversation_id,m.sender_principal_id,m.body,m.storage_object_id,m.is_test
         FROM ${this.schema}.direct_messages m JOIN ${this.schema}.direct_conversations c ON c.id=m.conversation_id
         WHERE m.id=$1 AND $2 IN (c.member_a_id,c.member_b_id)`,
          [messageId, principal.id],
        )
        .then((r) => r.rows[0]);
      if (!message) throw new ApiError('NOT_FOUND', 'Pesan tidak ditemukan');
      const existing = await client
        .query<{ id: string; object_id: string; reason: string }>(
          `SELECT id,object_id,reason FROM ${this.schema}.social_reports WHERE reporter_principal_id=$1 AND idempotency_key=$2`,
          [principal.id, idempotencyKey],
        )
        .then((r) => r.rows[0]);
      if (existing) {
        if (existing.object_id !== messageId || existing.reason !== evidenceReason)
          throw new ApiError('IDEMPOTENCY_CONFLICT', 'Key laporan dipakai untuk payload berbeda');
        const evidence = await client
          .query<{ id: string }>(
            `SELECT id FROM ${this.schema}.message_evidence WHERE report_id=$1`,
            [existing.id],
          )
          .then((r) => r.rows[0]);
        return { reportId: existing.id, evidenceId: evidence?.id ?? null, existing: true };
      }
      const reportId = randomUUID();
      const evidenceId = randomUUID();
      const expiresAt = new Date(this.now());
      expiresAt.setUTCDate(expiresAt.getUTCDate() + 90);
      await client.query(
        `INSERT INTO ${this.schema}.social_reports
        (id,reporter_principal_id,object_type,object_id,reason,idempotency_key,is_test)
        VALUES ($1,$2,'MESSAGE',$3,$4,$5,$6)`,
        [reportId, principal.id, messageId, evidenceReason, idempotencyKey, message.is_test],
      );
      await client.query(
        `INSERT INTO ${this.schema}.message_evidence
        (id,message_id,report_id,conversation_id,evidence_body,storage_object_id,captured_by,expires_at,is_test)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          evidenceId,
          messageId,
          reportId,
          message.conversation_id,
          message.body,
          message.storage_object_id,
          principal.id,
          expiresAt,
          message.is_test,
        ],
      );
      const subject = await this.loadPrincipal(client, message.sender_principal_id);
      await this.moderation.openReportedCase(
        {
          subject,
          targetType: 'DIRECT_MESSAGE',
          targetId: messageId,
          contentText: message.body,
        },
        client,
      );
      await appendAuditEvent(
        client,
        this.audit(
          principal,
          'MESSAGE_REPORTED_EVIDENCE_CAPTURED',
          'message_evidence',
          evidenceId,
          { reportId },
        ),
      );
      return { reportId, evidenceId, existing: false };
    });
  }

  async getMessageEvidence(owner: Principal, evidenceId: string, accessReason: string) {
    this.requireOwner(owner);
    const reason = cleanText(accessReason, 500, false, 10);
    return inTransaction(this.pool, async (client) => {
      const evidence = await client
        .query(
          `UPDATE ${this.schema}.message_evidence SET access_reason=$3
          WHERE id=$1 AND purged_at IS NULL AND expires_at>$2 RETURNING *`,
          [evidenceId, this.now(), reason],
        )
        .then((r) => r.rows[0]);
      if (!evidence)
        throw new ApiError('NOT_FOUND', 'Bukti laporan tidak tersedia atau kedaluwarsa');
      await appendAuditEvent(
        client,
        this.audit(owner, 'MESSAGE_EVIDENCE_ACCESSED', 'message_evidence', evidenceId, {
          accessReason: reason,
        }),
      );
      return evidence;
    });
  }

  async createGroup(
    principal: Principal,
    input: {
      name: string;
      description?: string;
      audiencePolicy?: 'ADULT_PUBLIC' | 'CHILD_FIXTURE_ONLY';
    },
  ) {
    this.requireSocial(principal);
    const name = cleanText(input.name, 160, false, 3);
    const description = cleanText(input.description ?? '', 2_000, true);
    const audience = input.audiencePolicy ?? 'ADULT_PUBLIC';
    this.requireFixtureAudience(principal, audience);
    const id = randomUUID();
    return inTransaction(this.pool, async (client) => {
      const group = await client.query(
        `INSERT INTO ${this.schema}.public_groups
        (id,business_code,name,description,creator_principal_id,manager_principal_id,audience_policy,is_test)
        VALUES ($1,$2,$3,$4,$5,$5,$6,$7) RETURNING *`,
        [
          id,
          `GRP-${id.slice(0, 8).toUpperCase()}`,
          name,
          description,
          principal.id,
          audience,
          principal.fixture,
        ],
      );
      await client.query(
        `INSERT INTO ${this.schema}.group_memberships (group_id,principal_id,status,decided_by,decided_at) VALUES ($1,$2,'ACTIVE',$2,$3)`,
        [id, principal.id, this.now()],
      );
      return group.rows[0];
    });
  }

  /**
   * L05 G-08: direktori hanya metadata minimal grup APPROVED + jumlah anggota
   * aktif + status membership viewer. Tanpa isi/member grup.
   */
  async listGroups(principal: Principal | null) {
    return this.pool
      .query(
        `SELECT g.id,g.business_code,g.name,g.description,g.manager_principal_id,g.status,g.is_indexed,
              (SELECT count(*)::int FROM ${this.schema}.group_memberships m
                WHERE m.group_id = g.id AND m.status = 'ACTIVE') AS member_count,
              CASE WHEN $1::uuid IS NOT NULL THEN (SELECT status FROM ${this.schema}.group_memberships m WHERE m.group_id=g.id AND m.principal_id=$1) ELSE NULL END membership_status
         FROM ${this.schema}.public_groups g WHERE g.status='APPROVED' ORDER BY g.created_at DESC`,
        [principal?.id ?? null],
      )
      .then((r) =>
        r.rows.map((row) => ({
          id: row.id,
          businessCode: row.business_code,
          name: row.name,
          description: row.description,
          status: row.status,
          memberCount: Number(row.member_count),
          membershipStatus: row.membership_status,
          mine: principal?.id !== undefined && row.manager_principal_id === principal?.id,
          managedByMe: principal?.id !== undefined && row.manager_principal_id === principal?.id,
        })),
      );
  }

  /**
   * L05 G-08: detail grup + status membership viewer. Anggota non-aktif hanya
   * melihat metadata; isi grup tidak bocor lewat detail.
   */
  async getGroupDetail(viewer: Principal | null, groupId: string) {
    if (!/^[0-9a-f-]{36}$/i.test(groupId)) {
      throw new ApiError('NOT_FOUND', 'Grup tidak ditemukan');
    }
    const row = await this.pool
      .query(
        `SELECT g.id,g.business_code,g.name,g.description,g.manager_principal_id,g.status,
              (SELECT count(*)::int FROM ${this.schema}.group_memberships m
                WHERE m.group_id = g.id AND m.status = 'ACTIVE') AS member_count,
              CASE WHEN $2::uuid IS NOT NULL THEN (SELECT status FROM ${this.schema}.group_memberships m WHERE m.group_id=g.id AND m.principal_id=$2) ELSE NULL END membership_status
         FROM ${this.schema}.public_groups g WHERE g.id = $1 AND g.status = 'APPROVED'`,
        [groupId, viewer?.id ?? null],
      )
      .then((r) => r.rows[0]);
    if (!row) throw new ApiError('NOT_FOUND', 'Grup tidak ditemukan');
    return {
      id: row.id,
      businessCode: row.business_code,
      name: row.name,
      description: row.description,
      status: row.status,
      memberCount: Number(row.member_count),
      membershipStatus: row.membership_status,
      mine: viewer?.id !== undefined && row.manager_principal_id === viewer?.id,
      managedByMe: viewer?.id !== undefined && row.manager_principal_id === viewer?.id,
    };
  }

  /** Keluar grup (per-member; bukti/history tidak dihapus) — L05 G-08. */
  async leaveGroup(principal: Principal, groupId: string) {
    this.requireSocial(principal);
    const result = await this.pool.query(
      `UPDATE ${this.schema}.group_memberships SET status = 'REMOVED', decided_at = $3
        WHERE group_id = $1 AND principal_id = $2 AND status = 'ACTIVE'`,
      [groupId, principal.id, this.now()],
    );
    if (!result.rowCount) throw new ApiError('NOT_FOUND', 'Keanggotaan aktif tidak ditemukan');
    return { left: true };
  }

  async listOwnerGroupQueue(owner: Principal) {
    this.requireOwner(owner);
    const [groups, appeals] = await Promise.all([
      this.pool.query(
        `SELECT id,business_code,name,description,creator_principal_id,status,created_at FROM ${this.schema}.public_groups WHERE status='PENDING_OWNER' ORDER BY created_at,id`,
      ),
      this.pool.query(
        `SELECT a.id,a.group_id,a.principal_id,a.reason,a.status,a.created_at,g.name FROM ${this.schema}.group_appeals a JOIN ${this.schema}.public_groups g ON g.id=a.group_id WHERE a.status IN ('PENDING','UNDER_REVIEW') ORDER BY a.created_at,a.id`,
      ),
    ]);
    return { groups: groups.rows, appeals: appeals.rows };
  }

  async decideGroup(owner: Principal, groupId: string, decision: 'APPROVE' | 'REJECT') {
    this.requireOwner(owner);
    if (!['APPROVE', 'REJECT'].includes(decision))
      throw new ApiError('VALIDATION_FAILED', 'Keputusan tidak valid');
    const result = await this.pool.query(
      `UPDATE ${this.schema}.public_groups SET status=$3,is_indexed=($3='APPROVED' AND audience_policy='ADULT_PUBLIC'),owner_decided_by=$2,owner_decided_at=$4,updated_at=$4 WHERE id=$1 AND status='PENDING_OWNER' RETURNING *`,
      [groupId, owner.id, decision === 'APPROVE' ? 'APPROVED' : 'REJECTED', this.now()],
    );
    if (!result.rows[0]) throw new ApiError('NOT_FOUND', 'Pengajuan grup aktif tidak ditemukan');
    return result.rows[0];
  }

  async requestGroupJoin(principal: Principal, groupId: string) {
    this.requireSocial(principal);
    const group = await this.pool
      .query<{ status: string; audience_policy: string; is_test: boolean; manager_principal_id: string }>(
        `SELECT status,audience_policy,is_test,manager_principal_id FROM ${this.schema}.public_groups WHERE id=$1`,
        [groupId],
      )
      .then((r) => r.rows[0]);
    if (!group || group.status !== 'APPROVED')
      throw new ApiError('NOT_FOUND', 'Grup publik tidak ditemukan');
    if (group.audience_policy === 'CHILD_FIXTURE_ONLY' && (!group.is_test || !principal.fixture))
      throw new ApiError('ACCESS_DENIED', 'Grup anak hanya fixture uji');
    // L05: tolak permintaan lintas block dengan pengelola (pesan generik).
    const blocked = await this.pool.query(
      `SELECT 1 FROM ${this.schema}.social_blocks
        WHERE (blocker_principal_id = $1 AND blocked_principal_id = $2)
           OR (blocker_principal_id = $2 AND blocked_principal_id = $1)`,
      [principal.id, group.manager_principal_id],
    );
    if (blocked.rows[0] && group.manager_principal_id !== principal.id) {
      throw new ApiError('ACCESS_DENIED', 'Permintaan bergabung tidak dapat diproses');
    }
    await this.pool.query(
      `INSERT INTO ${this.schema}.group_memberships (group_id,principal_id) VALUES ($1,$2) ON CONFLICT (group_id,principal_id) DO UPDATE SET status=CASE WHEN group_memberships.status='REMOVED' THEN 'PENDING' ELSE group_memberships.status END,requested_at=CURRENT_TIMESTAMP`,
      [groupId, principal.id],
    );
    return { status: 'PENDING' };
  }

  async decideMembership(
    principal: Principal,
    groupId: string,
    memberId: string,
    decision: 'APPROVE' | 'REJECT' | 'REMOVE',
  ) {
    this.requireSocial(principal);
    const group = await this.pool
      .query<{ manager_principal_id: string }>(
        `SELECT manager_principal_id FROM ${this.schema}.public_groups WHERE id=$1 AND status='APPROVED'`,
        [groupId],
      )
      .then((r) => r.rows[0]);
    if (!group || group.manager_principal_id !== principal.id)
      throw new ApiError('ACCESS_DENIED', 'Hanya pengelola grup dapat memutuskan anggota');
    if (memberId === principal.id && decision === 'REMOVE')
      throw new ApiError('VALIDATION_FAILED', 'Pengelola tidak dapat menghapus dirinya');
    const status =
      decision === 'APPROVE' ? 'ACTIVE' : decision === 'REJECT' ? 'REJECTED' : 'REMOVED';
    const row = await this.pool
      .query(
        `UPDATE ${this.schema}.group_memberships SET status=$3,decided_by=$4,decided_at=$5 WHERE group_id=$1 AND principal_id=$2 RETURNING *`,
        [groupId, memberId, status, principal.id, this.now()],
      )
      .then((r) => r.rows[0]);
    if (!row) throw new ApiError('NOT_FOUND', 'Permintaan anggota tidak ditemukan');
    return row;
  }

  async listGroupMembers(principal: Principal, groupId: string) {
    requireApproved(principal);
    const allowed =
      principal.role === 'OWNER' ||
      (await this.pool
        .query(
          `SELECT 1 FROM ${this.schema}.group_memberships WHERE group_id=$1 AND principal_id=$2 AND status='ACTIVE'`,
          [groupId, principal.id],
        )
        .then((r) => Boolean(r.rows[0])));
    if (!allowed)
      throw new ApiError('ACCESS_DENIED', 'Daftar anggota hanya untuk anggota grup dan Admin');
    // L05: sembunyikan pasangan block dua-arah dari viewer (kecuali Admin).
    // DTO camelCase kanonis (G-05).
    return this.pool
      .query(
        `SELECT m.principal_id,m.status,p.display_name,p.username FROM ${this.schema}.group_memberships m JOIN ${this.schema}.principals p ON p.id=m.principal_id WHERE m.group_id=$1 AND m.status='ACTIVE'
          ${principal.role === 'OWNER' ? '' : `AND NOT EXISTS (
            SELECT 1 FROM ${this.schema}.social_blocks sb
            WHERE (sb.blocker_principal_id = $2 AND sb.blocked_principal_id = m.principal_id)
               OR (sb.blocker_principal_id = m.principal_id AND sb.blocked_principal_id = $2)
          )`}
          ORDER BY p.display_name,p.id`,
        principal.role === 'OWNER' ? [groupId] : [groupId, principal.id],
      )
      .then((r) =>
        r.rows.map((row) => ({
          id: row.principal_id,
          status: row.status,
          displayName: row.display_name,
          username: row.username,
        })),
      );
  }

  async transferGroupManager(owner: Principal, groupId: string, memberId: string) {
    this.requireOwner(owner);
    const result = await this.pool.query(
      `UPDATE ${this.schema}.public_groups g SET manager_principal_id=$2,updated_at=$3 WHERE g.id=$1 AND EXISTS (SELECT 1 FROM ${this.schema}.group_memberships m WHERE m.group_id=g.id AND m.principal_id=$2 AND m.status='ACTIVE') RETURNING *`,
      [groupId, memberId, this.now()],
    );
    if (!result.rows[0])
      throw new ApiError('VALIDATION_FAILED', 'Pengelola baru harus anggota aktif');
    return result.rows[0];
  }

  async appealGroup(
    principal: Principal,
    groupId: string,
    reasonInput: string,
    idempotencyKey: string,
  ) {
    this.requireSocial(principal);
    validateKey(idempotencyKey);
    const reason = cleanText(reasonInput, 2_000, false, 10);
    const id = randomUUID();
    return this.pool
      .query(
        `INSERT INTO ${this.schema}.group_appeals (id,group_id,principal_id,reason,idempotency_key) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (principal_id,idempotency_key) DO UPDATE SET id=group_appeals.id RETURNING *`,
        [id, groupId, principal.id, reason, idempotencyKey],
      )
      .then((r) => r.rows[0]);
  }

  async decideGroupAppeal(owner: Principal, appealId: string, decision: 'RESOLVE' | 'REJECT') {
    this.requireOwner(owner);
    if (!['RESOLVE', 'REJECT'].includes(decision))
      throw new ApiError('VALIDATION_FAILED', 'Keputusan banding tidak valid');
    const row = await this.pool
      .query(
        `UPDATE ${this.schema}.group_appeals SET status=$2,updated_at=$3 WHERE id=$1 AND status IN ('PENDING','UNDER_REVIEW') RETURNING *`,
        [appealId, decision === 'RESOLVE' ? 'RESOLVED' : 'REJECTED', this.now()],
      )
      .then((r) => r.rows[0]);
    if (!row) throw new ApiError('NOT_FOUND', 'Banding grup aktif tidak ditemukan');
    return row;
  }

  async runRetentionPurge(owner: Principal, confirmPurge: boolean) {
    this.requireOwner(owner);
    if (!confirmPurge)
      throw new ApiError('VALIDATION_FAILED', 'Konfirmasi operasi retensi diperlukan');
    const cutoff = new Date(this.now());
    cutoff.setUTCMonth(cutoff.getUTCMonth() - 12);
    return inTransaction(this.pool, async (client) => {
      // S04: Hapus is_test=true, ini adalah retensi data riil untuk percakapan inaktif > 12 bulan
      const conversations = await client.query<{ id: string }>(
        `SELECT id FROM ${this.schema}.direct_conversations WHERE last_message_at<$1 AND purged_at IS NULL FOR UPDATE`,
        [cutoff],
      );
      let messageCount = 0;
      for (const conversation of conversations.rows) {
        const messages = await client.query<{
          id: string;
          sender_principal_id: string;
          storage_object_id: string | null;
        }>(
          `SELECT id,sender_principal_id,storage_object_id FROM ${this.schema}.direct_messages WHERE conversation_id=$1 AND status<>'DELETED_BOTH'`,
          [conversation.id],
        );
        const attachmentIds = new Set(
          messages.rows.flatMap((message) =>
            message.storage_object_id ? [message.storage_object_id] : [],
          ),
        );
        for (const message of messages.rows) {
          await client.query(
            `INSERT INTO ${this.schema}.message_tombstones (message_id,conversation_id,original_sender_id,deleted_by,attachment_was_present,reason_code) VALUES ($1,$2,$3,$4,$5,'RETENTION_POLICY') ON CONFLICT DO NOTHING`,
            [
              message.id,
              conversation.id,
              message.sender_principal_id,
              owner.id,
              Boolean(message.storage_object_id),
            ],
          );
        }
        messageCount += messages.rowCount ?? 0;
        await client.query(`DELETE FROM ${this.schema}.direct_messages WHERE conversation_id=$1`, [
          conversation.id,
        ]);
        for (const attachmentId of attachmentIds)
          await this.releaseIfUnreferenced(client, attachmentId);
        await client.query(
          `UPDATE ${this.schema}.direct_conversations SET purged_at=$2,updated_at=$2 WHERE id=$1`,
          [conversation.id, this.now()],
        );
      }
      const runId = randomUUID();
      await client.query(
        `INSERT INTO ${this.schema}.social_retention_runs (id,mode,cutoff_at,conversations_purged,messages_purged,executed_by) VALUES ($1,'MANUAL_PURGE',$2,$3,$4,$5)`,
        [runId, 'MANUAL_PURGE', cutoff, conversations.rowCount ?? 0, messageCount, owner.id],
      );
      await appendAuditEvent(
        client,
        this.audit(owner, 'SOCIAL_RETENTION_PURGED', 'social_retention_run', runId, {
          cutoff: cutoff.toISOString(),
          conversations: conversations.rowCount ?? 0,
          messages: messageCount,
        }),
      );
      return {
        runId,
        cutoff: cutoff.toISOString(),
        conversationsPurged: conversations.rowCount ?? 0,
        messagesPurged: messageCount,
      };
    });
  }

  /** Fixture-only retention operation retained for integration and QA tooling. */
  async purgeInactiveFixtureConversations(owner: Principal, confirmPurge: boolean) {
    this.requireOwner(owner);
    if (!confirmPurge)
      throw new ApiError('VALIDATION_FAILED', 'Konfirmasi operasi retensi diperlukan');
    const cutoff = new Date(this.now());
    cutoff.setUTCMonth(cutoff.getUTCMonth() - 12);
    return inTransaction(this.pool, async (client) => {
      const conversations = await client.query<{ id: string }>(
        `SELECT c.id FROM ${this.schema}.direct_conversations c
           WHERE c.last_message_at < $1 AND c.purged_at IS NULL
             AND EXISTS (
               SELECT 1 FROM ${this.schema}.principals p
                WHERE p.id = c.member_a_id AND p.is_test = true
             )
             AND EXISTS (
               SELECT 1 FROM ${this.schema}.principals p
                WHERE p.id = c.member_b_id AND p.is_test = true
             ) FOR UPDATE`,
        [cutoff],
      );
      let messageCount = 0;
      for (const conversation of conversations.rows) {
        const messages = await client.query<{
          id: string; sender_principal_id: string; storage_object_id: string | null;
        }>(
          `SELECT id,sender_principal_id,storage_object_id FROM ${this.schema}.direct_messages
            WHERE conversation_id=$1 AND status<>'DELETED_BOTH'`,
          [conversation.id],
        );
        for (const message of messages.rows) {
          await client.query(
            `INSERT INTO ${this.schema}.message_tombstones
              (message_id,conversation_id,original_sender_id,deleted_by,attachment_was_present,reason_code)
             VALUES ($1,$2,$3,$4,$5,'RETENTION_SIMULATION') ON CONFLICT DO NOTHING`,
            [message.id, conversation.id, message.sender_principal_id, owner.id, Boolean(message.storage_object_id)],
          );
        }
        messageCount += messages.rowCount ?? 0;
        await client.query(`DELETE FROM ${this.schema}.direct_messages WHERE conversation_id=$1`, [conversation.id]);
        await client.query(`UPDATE ${this.schema}.direct_conversations SET purged_at=$2,updated_at=$2 WHERE id=$1`, [conversation.id, this.now()]);
      }
      return {
        conversationsPurged: conversations.rowCount ?? 0,
        messagesPurged: messageCount,
      };
    });
  }

  private requireSocial(principal: Principal) {
    requireApproved(principal);
    if (principal.socialStatus !== 'ENABLED')
      throw new ApiError('ACCESS_DENIED', 'Akses sosial tidak aktif');
  }

  private requireOwner(principal: Principal) {
    requireApproved(principal);
    if (principal.role !== 'OWNER') throw new ApiError('ACCESS_DENIED', 'Hanya Admin');
  }

  private requireFixtureAudience(principal: Principal, audience: string) {
    if (audience === 'CHILD_FIXTURE_ONLY' && !principal.fixture)
      throw new ApiError('ACCESS_DENIED', 'Data anak hanya fixture uji sampai keputusan O-01');
  }

  /**
   * Batas rate postingan per jam (INSTRUKSI-03 item #6, anti spam).
   * Angka ada di `LINE_RATE_LIMITS` — simulasi, mudah diubah.
   */
  private async assertPostRateLimit(principal: Principal) {
    const { rows } = await this.pool.query(
      `SELECT count(*)::int AS n FROM ${this.schema}.social_posts
        WHERE principal_id=$1 AND created_at >= now() - interval '1 hour'`,
      [principal.id],
    );
    const count = rows[0]?.n ?? 0;
    if (count >= LINE_RATE_LIMITS.postsPerHour) {
      throw new ApiError(
        'RATE_LIMITED',
        `Batas ${LINE_RATE_LIMITS.postsPerHour} postingan per jam tercapai`,
      );
    }
  }

  /**
   * Batas rate komentar per jam (INSTRUKSI-03 item #6, anti spam).
   */
  private async assertCommentRateLimit(principal: Principal) {
    const { rows } = await this.pool.query(
      `SELECT count(*)::int AS n FROM ${this.schema}.social_comments
        WHERE principal_id=$1 AND created_at >= now() - interval '1 hour'`,
      [principal.id],
    );
    const count = rows[0]?.n ?? 0;
    if (count >= LINE_RATE_LIMITS.commentsPerHour) {
      throw new ApiError(
        'RATE_LIMITED',
        `Batas ${LINE_RATE_LIMITS.commentsPerHour} komentar per jam tercapai`,
      );
    }
  }

  private async assertPublishedPost(postId: string) {
    const found = await this.pool.query(
      `SELECT 1 FROM ${this.schema}.social_posts WHERE id=$1 AND status='PUBLISHED' AND moderation_status='SAFE'`,
      [postId],
    );
    if (!found.rows[0]) throw new ApiError('NOT_FOUND', 'Posting tidak ditemukan');
  }

  /**
   * L05 G-02: policy aksi per objek. Selain terbit+aman, pastikan viewer tidak
   * saling blokir dengan author dan (untuk post grup) viewer anggota aktif.
   * Pesan error generik agar tidak membocorkan relasi blokir.
   */
  private async assertPostActionAllowed(
    client: Pick<Pool, 'query'> | PoolClient,
    viewerId: string,
    postId: string,
  ) {
    const post = await client
      .query<{ principal_id: string; group_id: string | null }>(
        `SELECT p.principal_id, p.group_id FROM ${this.schema}.social_posts p
          WHERE p.id = $1 AND p.status = 'PUBLISHED' AND p.moderation_status = 'SAFE'`,
        [postId],
      )
      .then((r) => r.rows[0]);
    if (!post) throw new ApiError('NOT_FOUND', 'Posting tidak ditemukan');
    if (post.principal_id !== viewerId) {
      const blocked = await client.query(
        `SELECT 1 FROM ${this.schema}.social_blocks
          WHERE (blocker_principal_id = $1 AND blocked_principal_id = $2)
             OR (blocker_principal_id = $2 AND blocked_principal_id = $1)`,
        [viewerId, post.principal_id],
      );
      if (blocked.rows[0]) throw new ApiError('NOT_FOUND', 'Posting tidak ditemukan');
    }
    if (post.group_id) {
      const member = await client.query(
        `SELECT 1 FROM ${this.schema}.group_memberships
          WHERE group_id = $1 AND principal_id = $2 AND status = 'ACTIVE'`,
        [post.group_id, viewerId],
      );
      if (!member.rows[0]) throw new ApiError('NOT_FOUND', 'Posting tidak ditemukan');
    }
    return post;
  }

  /** Daftar postingan milik sendiri dengan cursor (L05 G-06). */
  async listMyPosts(principal: Principal, input: { cursor?: string; limit?: number } = {}) {
    this.requireSocial(principal);
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const cursor = decodeCursor(input.cursor);
    const values: unknown[] = [principal.id, limit + 1];
    if (cursor) {
      values.push(cursor.createdAt, cursor.id);
    }
    const result = await this.pool.query(
      `SELECT p.id, p.principal_id, p.group_id, p.body, p.link_url, p.audience_policy,
              p.status, p.created_at, pr.display_name, pr.username,
              '[]'::jsonb AS attachments,
              (SELECT count(*)::int FROM ${this.schema}.social_comments c
                WHERE c.post_id = p.id AND c.status = 'PUBLISHED') AS comment_count,
              (SELECT count(*)::int FROM ${this.schema}.social_reactions r
                WHERE r.post_id = p.id) AS reaction_count,
              (SELECT r.reaction FROM ${this.schema}.social_reactions r
                WHERE r.post_id = p.id AND r.principal_id = $1) AS my_reaction,
              EXISTS (SELECT 1 FROM ${this.schema}.saved_social_posts s
                WHERE s.post_id = p.id AND s.principal_id = $1) AS is_saved
         FROM ${this.schema}.social_posts p
         JOIN ${this.schema}.principals pr ON pr.id = p.principal_id
        WHERE p.principal_id = $1 AND p.status <> 'DELETED'
        ${cursor ? `AND (p.created_at, p.id) < ($3, $4)` : ''}
        ORDER BY p.created_at DESC, p.id DESC LIMIT $2`,
      values,
    );
    const rows = result.rows.slice(0, limit);
    const last = rows.at(-1) as { created_at?: Date; id?: string } | undefined;
    return {
      items: rows.map((row) => this.toPostView(row, principal.id)),
      nextCursor:
        result.rows.length > limit && last?.created_at && last.id
          ? encodeCursor(last.created_at, last.id)
          : null,
    };
  }

  /** Daftar teman (friendship ACCEPTED), pasangan block disembunyikan (L05 G-06). */
  async listFriends(principal: Principal, input: { limit?: number } = {}) {
    this.requireSocial(principal);
    const limit = Math.min(Math.max(input.limit ?? 100, 1), 100);
    const result = await this.pool.query(
      `SELECT CASE WHEN f.member_a_id = $1 THEN f.member_b_id ELSE f.member_a_id END AS id,
              p.display_name, p.username, f.updated_at AS friends_since
         FROM ${this.schema}.friend_connections f
         JOIN ${this.schema}.principals p
           ON p.id = CASE WHEN f.member_a_id = $1 THEN f.member_b_id ELSE f.member_a_id END
        WHERE (f.member_a_id = $1 OR f.member_b_id = $1) AND f.status = 'ACCEPTED'
          AND p.lifecycle_status = 'ACTIVE'
          AND NOT EXISTS (
            SELECT 1 FROM ${this.schema}.social_blocks sb
            WHERE (sb.blocker_principal_id = $1 AND sb.blocked_principal_id = p.id)
               OR (sb.blocker_principal_id = p.id AND sb.blocked_principal_id = $1)
          )
        ORDER BY f.updated_at DESC LIMIT $2`,
      [principal.id, limit],
    );
    return {
      items: result.rows.map((row) => ({
        id: row.id,
        displayName: row.display_name,
        username: row.username,
        friendsSince: new Date(row.friends_since).toISOString(),
      })),
      nextCursor: null,
    };
  }

  /** Hapus pertemanan (tidak bisa menembus block) — L05 G-06. */
  async removeFriend(principal: Principal, friendId: string) {
    this.requireSocial(principal);
    if (!/^[0-9a-f-]{36}$/i.test(friendId)) {
      throw new ApiError('VALIDATION_FAILED', 'Teman tidak valid');
    }
    const [a, b] = canonicalPair(principal.id, friendId);
    const result = await this.pool.query(
      `UPDATE ${this.schema}.friend_connections SET status = 'REMOVED', updated_at = $3
        WHERE member_a_id = $1 AND member_b_id = $2 AND status = 'ACCEPTED'`,
      [a, b, this.now()],
    );
    if (!result.rowCount) throw new ApiError('NOT_FOUND', 'Pertemanan tidak ditemukan');
    return { removed: true };
  }

  /**
   * People lookup minimal untuk memilih target hubungan/pesan (L05).
   * Bukan global Search: hanya prefix username/display_name, pasangan block
   * dan akun non-sosial disembunyikan.
   */
  async searchPeople(principal: Principal, query: string, limit = 10) {
    this.requireSocial(principal);
    const q = query.trim();
    if (q.length < 2 || q.length > 64) {
      throw new ApiError('VALIDATION_FAILED', 'Kueri minimal 2 karakter');
    }
    const capped = Math.min(Math.max(limit, 1), 20);
    const result = await this.pool.query(
      `SELECT p.id, p.display_name, p.username
         FROM ${this.schema}.principals p
        WHERE p.id <> $1 AND p.lifecycle_status = 'ACTIVE'
          AND p.approval_status = 'APPROVED' AND p.social_status = 'ENABLED'
          AND (p.username ILIKE $2 || '%' OR p.display_name ILIKE $2 || '%')
          AND NOT EXISTS (
            SELECT 1 FROM ${this.schema}.social_blocks sb
            WHERE (sb.blocker_principal_id = $1 AND sb.blocked_principal_id = p.id)
               OR (sb.blocker_principal_id = p.id AND sb.blocked_principal_id = $1)
          )
        ORDER BY p.display_name LIMIT $3`,
      [principal.id, q.replace(/[%_\\]/g, ''), capped],
    );
    return result.rows.map((row) => ({
      id: row.id,
      displayName: row.display_name,
      username: row.username,
    }));
  }

  /** Mute satu-arah + daftar mute (L05 G-04). */
  async setMute(principal: Principal, mutedId: string, muted: boolean) {
    this.requireSocial(principal);
    if (!/^[0-9a-f-]{36}$/i.test(mutedId) || mutedId === principal.id) {
      throw new ApiError('VALIDATION_FAILED', 'Target mute tidak valid');
    }
    if (muted) {
      await this.pool.query(
        `INSERT INTO ${this.schema}.social_mutes (muter_principal_id, muted_principal_id)
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [principal.id, mutedId],
      );
    } else {
      await this.pool.query(
        `DELETE FROM ${this.schema}.social_mutes WHERE muter_principal_id = $1 AND muted_principal_id = $2`,
        [principal.id, mutedId],
      );
    }
    return { muted };
  }

  async listMutes(principal: Principal) {
    this.requireSocial(principal);
    return this.pool
      .query(
        `SELECT p.id, p.display_name, p.username FROM ${this.schema}.social_mutes m
          JOIN ${this.schema}.principals p ON p.id = m.muted_principal_id
         WHERE m.muter_principal_id = $1 ORDER BY p.display_name`,
        [principal.id],
      )
      .then((r) =>
        r.rows.map((row) => ({ id: row.id, displayName: row.display_name, username: row.username })),
      );
  }

  private async assertOwnedSafeMedia(client: PoolClient, principal: Principal, ids: string[]) {
    if (!ids.length) return true;
    const result = await client.query<{
      id: string;
      storage_state: string;
      assessment_status: string;
      media_type: string;
    }>(
      `SELECT id,storage_state,assessment_status,media_type FROM ${this.schema}.storage_objects WHERE id=ANY($1::uuid[]) AND owner_principal_id=$2 AND deleted_at IS NULL`,
      [ids, principal.id],
    );
    if (result.rowCount !== ids.length) throw new ApiError('NOT_FOUND', 'Lampiran tidak ditemukan');
    if (result.rows.some((row) => !allowedSocialMedia(row.media_type)))
      throw new ApiError('VALIDATION_FAILED', 'Format lampiran sosial tidak didukung');
    return result.rows.every(
      (row) => row.storage_state === 'ACTIVE' && row.assessment_status === 'SAFE',
    );
  }

  private async assertCanPostToGroup(client: PoolClient, principal: Principal, groupId: string) {
    const result = await client.query<{ audience_policy: string; is_test: boolean }>(
      `SELECT g.audience_policy,g.is_test FROM ${this.schema}.public_groups g JOIN ${this.schema}.group_memberships m ON m.group_id=g.id WHERE g.id=$1 AND g.status='APPROVED' AND m.principal_id=$2 AND m.status='ACTIVE'`,
      [groupId, principal.id],
    );
    if (!result.rows[0])
      throw new ApiError('ACCESS_DENIED', 'Posting grup hanya untuk anggota aktif grup disetujui');
    if (
      result.rows[0].audience_policy === 'CHILD_FIXTURE_ONLY' &&
      (!result.rows[0].is_test || !principal.fixture)
    )
      throw new ApiError('ACCESS_DENIED', 'Grup anak hanya fixture uji');
  }

  private async assertNotBlocked(client: PoolClient | Pool, a: string, b: string) {
    if (a === b) throw new ApiError('VALIDATION_FAILED', 'Penerima tidak valid');
    const blocked = await client.query(
      `SELECT 1 FROM ${this.schema}.social_blocks WHERE (blocker_principal_id=$1 AND blocked_principal_id=$2) OR (blocker_principal_id=$2 AND blocked_principal_id=$1)`,
      [a, b],
    );
    if (blocked.rows[0]) throw new ApiError('ACCESS_DENIED', 'Hubungan pesan diblokir');
  }

  private async loadSocialPrincipal(client: PoolClient, id: string) {
    const row = await client
      .query<{ is_test: boolean; birth_date: string | Date | null }>(
        `SELECT is_test,birth_date FROM ${this.schema}.principals WHERE id=$1 AND approval_status='APPROVED' AND social_status='ENABLED' AND lifecycle_status='ACTIVE'`,
        [id],
      )
      .then((r) => r.rows[0]);
    if (!row) throw new ApiError('NOT_FOUND', 'Penerima tidak tersedia');
    return row;
  }

  private async loadPrincipal(client: PoolClient, id: string): Promise<Principal> {
    const row = await client
      .query<{
        id: string;
        role: Principal['role'];
        approval_status: Principal['approvalStatus'];
        entitlement_status: Principal['entitlementStatus'];
        social_status: Principal['socialStatus'];
        is_test: boolean;
      }>(
        `SELECT id,role,approval_status,entitlement_status,social_status,is_test
         FROM ${this.schema}.principals WHERE id=$1`,
        [id],
      )
      .then((query) => query.rows[0]);
    if (!row) throw new ApiError('NOT_FOUND', 'Pemilik objek tidak ditemukan');
    return {
      id: row.id,
      role: row.role,
      approvalStatus: row.approval_status,
      entitlementStatus: row.entitlement_status,
      socialStatus: row.social_status,
      fixture: row.is_test,
    };
  }

  private async assertConversationMember(
    client: Pick<Pool, 'query'> | PoolClient,
    principalId: string,
    conversationId: string,
    lock = false,
  ) {
    const row = await client
      .query<{ member_a_id: string; member_b_id: string }>(
        `SELECT member_a_id,member_b_id FROM ${this.schema}.direct_conversations WHERE id=$1 AND purged_at IS NULL AND $2 IN (member_a_id,member_b_id)${lock ? ' FOR UPDATE' : ''}`,
        [conversationId, principalId],
      )
      .then((r) => r.rows[0]);
    if (!row) throw new ApiError('NOT_FOUND', 'Percakapan tidak ditemukan');
    return row;
  }

  private async releaseIfUnreferenced(
    client: PoolClient,
    objectId: string,
    excludingMessageId?: string,
  ) {
    const referenced = await client.query(
      `SELECT 1 WHERE EXISTS (SELECT 1 FROM ${this.schema}.social_post_attachments WHERE storage_object_id=$1)
       OR EXISTS (SELECT 1 FROM ${this.schema}.article_blocks WHERE storage_object_id=$1)
       OR EXISTS (SELECT 1 FROM ${this.schema}.principals WHERE avatar_object_id=$1 AND deleted_at IS NULL)
       OR EXISTS (SELECT 1 FROM ${this.schema}.direct_messages WHERE storage_object_id=$1 AND ($2::uuid IS NULL OR id<>$2))
       OR EXISTS (SELECT 1 FROM ${this.schema}.message_evidence WHERE storage_object_id=$1 AND purged_at IS NULL AND expires_at>CURRENT_TIMESTAMP)`,
      [objectId, excludingMessageId ?? null],
    );
    if (referenced.rows[0]) return;
    const object = await client
      .query<{ owner_principal_id: string; size_bytes: string }>(
        `UPDATE ${this.schema}.storage_objects SET storage_state='DELETED',deleted_at=CURRENT_TIMESTAMP WHERE id=$1 AND deleted_at IS NULL RETURNING owner_principal_id,size_bytes`,
        [objectId],
      )
      .then((r) => r.rows[0]);
    if (object)
      await client.query(
        `UPDATE ${this.schema}.quota_accounts SET used_bytes=GREATEST(0,used_bytes-$2),updated_at=CURRENT_TIMESTAMP,version=version+1 WHERE principal_id=$1`,
        [object.owner_principal_id, object.size_bytes],
      );
  }

  private audit(
    principal: Principal,
    eventType: string,
    objectType: string,
    objectId?: string,
    details?: Record<string, unknown>,
  ) {
    return {
      actorPrincipalId: principal.id,
      eventType,
      objectType,
      objectId,
      details,
      fixture: principal.fixture,
      schema: this.schema.slice(1, -1),
    };
  }
}

function publicationState(status: Assessment, mediaSafe: boolean): ModeratedState {
  if (status === 'UNSAFE') return 'REJECTED';
  if (status === 'SAFE' && mediaSafe) return 'PUBLISHED';
  return status === 'SAFE' ? 'QUARANTINED' : 'PENDING_MODERATION';
}

function cleanText(value: string, maximum: number, allowEmpty = false, minimum = 1) {
  if (typeof value !== 'string') throw new ApiError('VALIDATION_FAILED', 'Teks tidak valid');
  const text = value.trim();
  if (
    (!allowEmpty && text.length < minimum) ||
    text.length > maximum ||
    /<\/?[a-z][^>]*>/i.test(text) ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)
  ) {
    throw new ApiError(
      'VALIDATION_FAILED',
      `Teks harus ${allowEmpty ? '0' : minimum}–${maximum} karakter tanpa HTML/kontrol`,
    );
  }
  return text;
}

function requestText(value: string) {
  const text = cleanText(value, 1_000);
  if (/\b(?:https?:\/\/|www\.|mailto:)/i.test(text))
    throw new ApiError('VALIDATION_FAILED', 'Permintaan pesan hanya boleh berisi teks dan emoji');
  return text;
}

function optionalWebUrl(value?: string) {
  if (!value?.trim()) return null;
  if (value.length > 2_048) throw new ApiError('VALIDATION_FAILED', 'Tautan terlalu panjang');
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password)
      throw new Error('unsafe');
    return url.toString();
  } catch {
    throw new ApiError('VALIDATION_FAILED', 'Tautan web tidak valid');
  }
}

function uniqueIds(ids: string[], maximum: number) {
  if (
    !Array.isArray(ids) ||
    ids.length > maximum ||
    ids.some((id) => typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id))
  )
    throw new ApiError('VALIDATION_FAILED', 'Daftar lampiran tidak valid');
  if (new Set(ids).size !== ids.length)
    throw new ApiError('VALIDATION_FAILED', 'Lampiran duplikat');
  return ids;
}

function validateKey(value: string) {
  if (!/^[A-Za-z0-9._:-]{8,128}$/.test(value))
    throw new ApiError('VALIDATION_FAILED', 'Idempotency key tidak valid');
}

/**
 * Validasi kategori laporan (INSTRUKSI-03 item #2).
 * Mengembalikan null untuk input kosong/tidak dikenal — kolom DB nullable,
 * jadi laporan lama & laporan tanpa kategori tetap disimpan.
 */
function normalizeReportCategory(value?: string): string | null {
  if (typeof value !== 'string') return null;
  const upper = value.trim().toUpperCase();
  const allowed = [
    'PORNOGRAFI',
    'ANCAMAN',
    'KEKERASAN',
    'PELECEHAN',
    'SARA',
    'SPAM',
    'LAINNYA',
  ];
  return allowed.includes(upper) ? upper : null;
}

function allowedSocialMedia(mediaType: string) {
  return (
    mediaType.startsWith('image/') ||
    mediaType.startsWith('video/') ||
    [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text',
    ].includes(mediaType)
  );
}

function canonicalPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

function isMinor(value: string | Date | null, now: Date) {
  if (!value) return false;
  const birth = new Date(value);
  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const beforeBirthday =
    now.getUTCMonth() < birth.getUTCMonth() ||
    (now.getUTCMonth() === birth.getUTCMonth() && now.getUTCDate() < birth.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age < 18;
}

function encodeCursor(createdAt: Date, id: string) {
  return Buffer.from(`${createdAt.toISOString()}|${id}`).toString('base64url');
}

function decodeCursor(value?: string) {
  if (!value) return null;
  try {
    const [date, id] = Buffer.from(value, 'base64url').toString('utf8').split('|');
    const createdAt = new Date(date);
    if (!id || Number.isNaN(createdAt.getTime())) throw new Error('bad');
    return { createdAt, id };
  } catch {
    throw new ApiError('VALIDATION_FAILED', 'Cursor tidak valid');
  }
}
