/**
 * LineageService — "Silsilah Karya" (INOVASI-20261014-1245 IDE 1).
 *
 * Pohon remix karya: post KARYA bisa ditandai sebagai remix dari karya
 * lain (parent_karya_id), lineage graph CTE rekursif, badges otomatis
 * via refresh_karya_badges() di DB.
 *
 * Aturan:
 *   - setParent(): anti-siklus CTE rekursif; tidak boleh menetapkan
 *     diri sendiri sebagai parent; maks 3 tingkat remix; parent harus
 *     post KARYA PUBLISHED.
 *   - readLineage(): pohon ke bawah dan ke atas via recursive CTE.
 *   - listKarya(): post KARYA dengan badge aktif.
 *   - clearParent(): karya kembali mandiri (parent dihapus).
 *
 * Badge (dihitung di DB oleh refresh_karya_badges()):
 *   PERTAMA (karya pertama kreator), REMIXED (≥1 remix), POPULER (≥3),
 *   LEGENDA (≥10), MENTOR (parent dari ≥5 remix).
 */

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import type { Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';

/** Maksimum tingkat lineage (parent → child → grandchild…). */
export const LINEAGE_MAX_DEPTH = 3;

/** Ambang badge berdasarkan jumlah remix. */
export const LINEAGE_BADGE_THRESHOLDS: Readonly<Record<string, number>> = {
  REMIXED: 1,
  POPULER: 3,
  LEGENDA: 10,
};

/** Keterangan badge untuk UI. */
export const LINEAGE_BADGE_META: Readonly<Record<string, string>> = {
  PERTAMA: 'Karya pertama dari kreator',
  REMIXED: 'Di-remix minimal 1 karya lain',
  POPULER: 'Di-remix minimal 3 karya lain',
  LEGENDA: 'Di-remix minimal 10 karya lain',
  MENTOR: 'Parent dari ≥5 karya remix',
};

export interface LineageTreeNode {
  postId: string;
  parentKaryaId: string | null;
  authorId: string;
  authorName: string | null;
  depth: number;
  children: LineageTreeNode[];
}

interface LineageRow {
  post_id: string;
  parent_karya_id: string | null;
  author_id?: string;
  author_name?: string | null;
}

/**
 * Bangun pohon lineage dari daftar baris datar (post_id, parent_karya_id).
 * PURE — dasar unit test "pohon 3 tingkat terbentuk benar".
 */
export function buildLineageTree(rows: LineageRow[]): LineageTreeNode[] {
  const byId = new Map<string, LineageTreeNode>();
  for (const r of rows) {
    byId.set(r.post_id, {
      postId: r.post_id,
      parentKaryaId: r.parent_karya_id,
      authorId: r.author_id ?? '',
      authorName: r.author_name ?? null,
      depth: 0,
      children: [],
    });
  }
  const roots: LineageTreeNode[] = [];
  for (const node of byId.values()) {
    if (node.parentKaryaId && byId.has(node.parentKaryaId)) {
      byId.get(node.parentKaryaId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const assignDepth = (node: LineageTreeNode, depth: number) => {
    node.depth = depth;
    for (const child of node.children) assignDepth(child, depth + 1);
  };
  for (const root of roots) assignDepth(root, 0);
  return roots;
}

/** Cek apakah menetapkan parent akan membentuk siklus. PURE. */
export function wouldCreateCycle(
  postId: string,
  newParentId: string,
  existing: { post_id: string; parent_karya_id: string | null }[],
): boolean {
  if (postId === newParentId) return true;
  const byId = new Map<string, string | null>();
  for (const r of existing) byId.set(r.post_id, r.parent_karya_id);
  let cur: string | null = newParentId;
  const seen = new Set<string>();
  while (cur && !seen.has(cur)) {
    if (cur === postId) return true;
    seen.add(cur);
    cur = byId.get(cur) ?? null;
  }
  return false;
}

/** Tentukan badge yang seharusnya aktif dari jumlah remix. PURE. */
export function badgesForRemixCount(
  remixCount: number,
  isFirstWork: boolean,
): string[] {
  const badges: string[] = [];
  if (isFirstWork) badges.push('PERTAMA');
  for (const [badge, threshold] of Object.entries(LINEAGE_BADGE_THRESHOLDS)) {
    if (remixCount >= threshold) badges.push(badge);
  }
  return badges;
}

export class LineageService {
  private readonly schema: string;

  constructor(private readonly pool: Pool, schemaName: string) {
    this.schema = quotedSchema(schemaName);
  }

  /** Tetapkan parent karya (remix-of). */
  async setParent(principal: Principal, postId: string, parentKaryaId: string) {
    return inTransaction(this.pool, async (client) => {
      if (postId === parentKaryaId) {
        throw new ApiError(
          'VALIDATION_FAILED',
          'Karya tidak boleh jadi remix dari dirinya sendiri',
        );
      }
      const post = await client.query<{
        post_type: string;
        principal_id: string;
        status: string;
      }>(
        `SELECT post_type, principal_id, status FROM ${this.schema}.social_posts
          WHERE id = $1 AND deleted_at IS NULL`,
        [postId],
      );
      const row = post.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Karya tidak ditemukan');
      if (row.post_type !== 'KARYA') {
        throw new ApiError('VALIDATION_FAILED', 'Hanya karya yang bisa dijadikan remix');
      }
      if (row.principal_id !== principal.id) {
        throw new ApiError('ACCESS_DENIED', 'Hanya pemilik karya yang bisa menetapkan remix');
      }
      if (row.status !== 'PUBLISHED') {
        throw new ApiError('VALIDATION_FAILED', 'Karya belum diterbitkan');
      }

      const parent = await client.query<{ post_type: string; status: string }>(
        `SELECT post_type, status FROM ${this.schema}.social_posts
          WHERE id = $1 AND deleted_at IS NULL`,
        [parentKaryaId],
      );
      const parentRow = parent.rows[0];
      if (!parentRow || parentRow.post_type !== 'KARYA' || parentRow.status !== 'PUBLISHED') {
        throw new ApiError('VALIDATION_FAILED', 'Parent harus karya yang sudah diterbitkan');
      }

      // Anti-siklus + maks 3 tingkat.
      const allRows = await client.query(
        `SELECT post_id, parent_karya_id FROM ${this.schema}.karya_lineage`,
      );
      if (wouldCreateCycle(postId, parentKaryaId, allRows.rows)) {
        throw new ApiError('VALIDATION_FAILED', 'Tidak boleh membentuk siklus silsilah');
      }
      const depth = await this.lineageDepth(client, parentKaryaId);
      if (depth >= LINEAGE_MAX_DEPTH) {
        throw new ApiError(
          'VALIDATION_FAILED',
          `Silsilah sudah sedalam ${LINEAGE_MAX_DEPTH} tingkat`,
        );
      }

      await client.query(
        `INSERT INTO ${this.schema}.karya_lineage (post_id, parent_karya_id, set_by)
         VALUES ($1, $2, $3)
         ON CONFLICT (post_id) DO UPDATE
           SET parent_karya_id = EXCLUDED.parent_karya_id, set_by = EXCLUDED.set_by`,
        [postId, parentKaryaId, principal.id],
      );
      await client.query(
        `UPDATE ${this.schema}.social_posts SET parent_karya_id = $2 WHERE id = $1`,
        [postId, parentKaryaId],
      );
      await client.query(`SELECT ${this.schema}.refresh_karya_badges()`);
      return { postId, parentKaryaId };
    });
  }

  /** Hapus parent karya (karya jadi mandiri). */
  async clearParent(principal: Principal, postId: string) {
    return inTransaction(this.pool, async (client) => {
      const post = await client.query<{ principal_id: string }>(
        `SELECT principal_id FROM ${this.schema}.social_posts
          WHERE id = $1 AND deleted_at IS NULL`,
        [postId],
      );
      const row = post.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Karya tidak ditemukan');
      if (row.principal_id !== principal.id) {
        throw new ApiError('ACCESS_DENIED', 'Hanya pemilik karya yang bisa menghapus remix');
      }
      await client.query(
        `DELETE FROM ${this.schema}.karya_lineage WHERE post_id = $1`,
        [postId],
      );
      await client.query(
        `UPDATE ${this.schema}.social_posts SET parent_karya_id = NULL WHERE id = $1`,
        [postId],
      );
      await client.query(`SELECT ${this.schema}.refresh_karya_badges()`);
      return { postId, parentKaryaId: null };
    });
  }

  /** Baca lineage sebuah karya (atas + bawah, recursive CTE). */
  async readLineage(postId: string) {
    const treeRes = await this.pool.query(
      `WITH RECURSIVE lineage AS (
          SELECT p.id AS post_id, p.parent_karya_id, p.author_id,
                 pp.display_name AS author_name, 0 AS depth
            FROM ${this.schema}.social_posts p
            LEFT JOIN ${this.schema}.principals pp ON pp.id = p.author_id
           WHERE p.id = $1 AND p.deleted_at IS NULL
          UNION ALL
          SELECT c.id, c.parent_karya_id, c.author_id,
                 cp.display_name, l.depth + 1
            FROM ${this.schema}.social_posts c
            JOIN lineage l ON c.parent_karya_id = l.post_id
            LEFT JOIN ${this.schema}.principals cp ON cp.id = c.author_id
           WHERE c.deleted_at IS NULL AND l.depth < 10
       )
       SELECT post_id, parent_karya_id, author_id, author_name, depth
         FROM lineage ORDER BY depth ASC, post_id ASC`,
      [postId],
    );
    const ancestorsRes = await this.pool.query(
      `WITH RECURSIVE ancestors AS (
          SELECT p.id AS post_id, p.parent_karya_id, 0 AS depth
            FROM ${this.schema}.social_posts p WHERE p.id = $1
          UNION ALL
          SELECT pa.id, pa.parent_karya_id, a.depth + 1
            FROM ${this.schema}.social_posts pa
            JOIN ancestors a ON a.parent_karya_id = pa.id
           WHERE pa.deleted_at IS NULL AND a.depth < 10
       )
       SELECT post_id, depth FROM ancestors ORDER BY depth ASC`,
      [postId],
    );
    return {
      tree: buildLineageTree(treeRes.rows),
      ancestors: ancestorsRes.rows.map((r: { post_id: string; depth: number }) => ({
        postId: r.post_id,
        depth: r.depth,
      })),
      descendantCount: Math.max(treeRes.rows.length - 1, 0),
    };
  }

  /** Daftar karya (opsional difilter badge). */
  async listKarya(input: { limit?: number; badge?: string } = {}) {
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const badge = input.badge?.trim().toUpperCase();
    const badgeList = badge ? [badge] : null;
    const result = await this.pool.query(
      `SELECT p.id, p.body, p.author_id, p.created_at,
              pp.display_name AS author_name,
              (SELECT string_agg(b.badge, ', ')
                 FROM ${this.schema}.karya_badges b
                WHERE b.post_id = p.id AND b.is_active) AS badges,
              (SELECT COUNT(*)::int FROM ${this.schema}.social_posts c
                WHERE c.parent_karya_id = p.id AND c.deleted_at IS NULL) AS remix_count
         FROM ${this.schema}.social_posts p
         LEFT JOIN ${this.schema}.principals pp ON pp.id = p.author_id
        WHERE p.post_type = 'KARYA' AND p.deleted_at IS NULL
          AND ($1::text[] IS NULL OR EXISTS (
                SELECT 1 FROM ${this.schema}.karya_badges b
                 WHERE b.post_id = p.id AND b.badge = ANY($1::text[]) AND b.is_active))
        ORDER BY p.created_at DESC, p.id DESC LIMIT $2`,
      [badgeList, limit],
    );
    return result.rows.map(
      (r: {
        id: string;
        body: string;
        author_id: string;
        created_at: Date;
        author_name: string | null;
        badges: string | null;
        remix_count: number;
      }) => ({
        id: r.id,
        body: r.body,
        authorId: r.author_id,
        authorName: r.author_name ?? null,
        createdAt: r.created_at,
        badges: r.badges ? String(r.badges).split(', ') : [],
        remixCount: r.remix_count ?? 0,
      }),
    );
  }

  /** Hitung jumlah karya yang meremix karya ini. */
  async remixCount(postId: string) {
    const result = await this.pool.query<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM ${this.schema}.social_posts
        WHERE parent_karya_id = $1 AND deleted_at IS NULL`,
      [postId],
    );
    return result.rows[0]?.n ?? 0;
  }

  /** Badge karya (dari karya_badges). */
  async badges(postId: string) {
    const result = await this.pool.query(
      `SELECT badge, awarded_at FROM ${this.schema}.karya_badges
        WHERE post_id = $1 AND is_active ORDER BY awarded_at ASC`,
      [postId],
    );
    return result.rows.map((r: { badge: string; awarded_at: Date }) => ({
      badge: r.badge,
      awardedAt: r.awarded_at,
    }));
  }

  /** Job simulasi: refresh badge semua karya aktif. */
  async refreshAllBadges(): Promise<number> {
    return inTransaction(this.pool, async (client) => {
      await client.query(`SELECT ${this.schema}.refresh_karya_badges()`);
      const result = await client.query<{ n: number }>(
        `SELECT COUNT(*)::int AS n FROM ${this.schema}.karya_badges WHERE is_active`,
      );
      return result.rows[0]?.n ?? 0;
    });
  }

  private async lineageDepth(client: import('pg').PoolClient, postId: string) {
    const result = await client.query<{ d: number }>(
      `WITH RECURSIVE ancestors AS (
          SELECT id, parent_karya_id, 0 AS d
            FROM ${this.schema}.social_posts WHERE id = $1
          UNION ALL
          SELECT pa.id, pa.parent_karya_id, a.d + 1
            FROM ${this.schema}.social_posts pa
            JOIN ancestors a ON a.parent_karya_id = pa.id
       )
       SELECT COALESCE(MAX(d), 0) AS d FROM ancestors`,
      [postId],
    );
    return result.rows[0]?.d ?? 0;
  }
}
