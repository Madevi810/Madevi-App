import { createHash, randomUUID } from 'node:crypto';

import type { Pool, PoolClient } from 'pg';

import { ApiError } from '@/api/errors';
import type { Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PATH = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
const LEVEL_CHILDREN: Record<string, string[]> = {
  R: ['D'],
  D: ['K'],
  K: ['M'],
  M: ['SM', 'T'],
  SM: ['T'],
  T: ['ST', 'J'],
  ST: ['J'],
  J: [],
};

interface TaxonomyRow {
  node_id: string;
  parent_id: string | null;
  level: string;
  local_code: string;
  path_code: string;
  name: string;
  slug: string;
  path_slug: string;
  sort_order: number;
  lifecycle_status: 'ACTIVE' | 'ARCHIVED';
  empty_marker: 'KOSONG' | 'RENCANA_ARTIKEL' | null;
  version: string;
  metadata: Record<string, unknown>;
  child_count: string;
}

interface RuntimePackageSnapshot {
  package_id: string;
  package_kind: string;
  version: string;
  schema_version: string;
  status: string;
  access_level: string;
  source_ref: string;
  license_ref: string;
  checksum: string | null;
  rollback_reference: string;
  payload: unknown;
  published_at: string | null;
}

export class TaxonomyService {
  constructor(
    private readonly pool: Pool,
    private readonly schemaName = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {}

  async browse(input: { path?: string; query?: string; limit: number; cursor?: string | null }) {
    const schema = quotedSchema(this.schemaName);
    const revision = await this.activeRevision();
    if (!revision) throw new ApiError('DEPENDENCY_UNAVAILABLE', 'Struktur menu belum dipromosikan');
    const path = normalizePath(input.path);
    let parent: TaxonomyRow | undefined;
    if (path) {
      const found = await this.pool.query<TaxonomyRow>(
        `SELECT n.*,
                (SELECT count(*) FROM ${schema}.taxonomy_nodes c
                  WHERE c.revision_id=n.revision_id AND c.parent_id=n.node_id
                    AND c.lifecycle_status='ACTIVE' AND c.visibility='PUBLIC') AS child_count
           FROM ${schema}.taxonomy_nodes n
          WHERE n.revision_id = $1 AND n.path_slug = $2 AND n.lifecycle_status = 'ACTIVE'`,
        [revision.id, path],
      );
      parent = found.rows[0];
      if (!parent) {
        const alias = await this.pool.query<{ path_slug: string }>(
          `SELECT n.path_slug
             FROM ${schema}.taxonomy_aliases a
             JOIN ${schema}.taxonomy_nodes n
               ON n.revision_id = $1 AND n.node_id = a.target_node_id
            WHERE a.alias_path = $2 AND a.retired_at IS NULL`,
          [revision.id, path],
        );
        if (alias.rows[0]) {
          return { redirectPath: alias.rows[0].path_slug, revision: revision.number };
        }
        throw new ApiError('NOT_FOUND', 'Kategori tidak ditemukan');
      }
    }
    const cursor = decodeTreeCursor(input.cursor);
    const values: unknown[] = [revision.id];
    const conditions = ["n.lifecycle_status = 'ACTIVE'", "n.visibility = 'PUBLIC'"];
    if (input.query) {
      values.push(`%${escapeLike(input.query.trim().toLowerCase())}%`);
      conditions.push(`lower(n.name) LIKE $${values.length} ESCAPE '\\'`);
      if (parent) {
        values.push(`${parent.path_slug}/%`);
        conditions.push(`n.path_slug LIKE $${values.length}`);
      }
    } else if (parent) {
      values.push(parent.node_id);
      conditions.push(`n.parent_id = $${values.length}`);
    } else {
      conditions.push('n.parent_id IS NULL');
    }
    if (cursor) {
      values.push(cursor.order, cursor.id);
      conditions.push(
        `(n.sort_order, n.node_id) > ($${values.length - 1}, $${values.length}::uuid)`,
      );
    }
    values.push(input.limit + 1);
    const result = await this.pool.query<TaxonomyRow>(
      `SELECT n.*,
              (SELECT count(*) FROM ${schema}.taxonomy_nodes c
                WHERE c.revision_id = n.revision_id AND c.parent_id = n.node_id
                  AND c.lifecycle_status = 'ACTIVE' AND c.visibility = 'PUBLIC') AS child_count
         FROM ${schema}.taxonomy_nodes n
        WHERE n.revision_id = $1 AND ${conditions.join(' AND ')}
        ORDER BY n.sort_order, n.node_id
        LIMIT $${values.length}`,
      values,
    );
    const hasMore = result.rows.length > input.limit;
    const rows = result.rows.slice(0, input.limit);
    const last = rows.at(-1);
    let articleCount = 0;
    if (parent) {
      try {
        const artCount = await this.pool.query<{ count: string }>(
          `SELECT count(*)::text as count FROM ${schema}.articles WHERE taxonomy_node_id = $1 AND status = 'PUBLISHED'`,
          [parent.node_id],
        );
        articleCount = Number(artCount.rows[0]?.count ?? 0);
      } catch {
        articleCount = 0;
      }
    }
    return {
      revision: revision.number,
      node: parent ? publicNode(parent) : null,
      breadcrumb: parent ? await this.breadcrumb(revision.id, parent.node_id) : [],
      children: rows.map(publicNode),
      counts: {
        children: parent ? Number(parent.child_count || rows.length) : rows.length,
        articles: articleCount,
      },
      query: input.query ?? null,
      page: {
        limit: input.limit,
        nextCursor:
          hasMore && last ? encodeTreeCursor(Number(last.sort_order), last.node_id) : null,
      },
    };
  }

  async summary() {
    const schema = quotedSchema(this.schemaName);
    const revision = await this.activeRevision();
    if (!revision) return { activeRevision: null, nodeCount: 0, exportRequired: false };
    const result = await this.pool.query<{ node_count: string; export_required: boolean }>(
      `SELECT count(n.*)::bigint AS node_count, s.export_required
         FROM ${schema}.taxonomy_state s
         LEFT JOIN ${schema}.taxonomy_nodes n ON n.revision_id = s.active_revision_id
        WHERE s.singleton = true GROUP BY s.export_required`,
    );
    return {
      activeRevision: revision.number,
      nodeCount: Number(result.rows[0]?.node_count ?? 0),
      exportRequired: result.rows[0]?.export_required ?? false,
    };
  }

  async history(principal: Principal, limit = 50) {
    requireOwner(principal);
    const schema = quotedSchema(this.schemaName);
    const result = await this.pool.query(
      `SELECT id, revision_number AS "revision", action, node_id AS "nodeId",
              impact, created_at AS "createdAt"
         FROM ${schema}.taxonomy_change_log
        ORDER BY created_at DESC, id DESC LIMIT $1`,
      [Math.min(Math.max(limit, 1), 100)],
    );
    return { items: result.rows };
  }

  async impact(principal: Principal, input: { nodeId: string; targetParentId?: string }) {
    requireOwner(principal);
    requireUuid(input.nodeId);
    if (input.targetParentId) requireUuid(input.targetParentId);
    const schema = quotedSchema(this.schemaName);
    const revision = await this.requireActiveRevision();
    const result = await this.pool.query<{
      node_id: string;
      name: string;
      path_code: string;
      path_slug: string;
      subtree_count: string;
    }>(
      `WITH RECURSIVE subtree AS (
         SELECT node_id FROM ${schema}.taxonomy_nodes WHERE revision_id = $1 AND node_id = $2
         UNION ALL
         SELECT child.node_id FROM ${schema}.taxonomy_nodes child
         JOIN subtree parent ON child.parent_id = parent.node_id
         WHERE child.revision_id = $1
       )
       SELECT n.node_id, n.name, n.path_code, n.path_slug,
              (SELECT count(*) FROM subtree)::bigint AS subtree_count
         FROM ${schema}.taxonomy_nodes n WHERE n.revision_id = $1 AND n.node_id = $2`,
      [revision.id, input.nodeId],
    );
    const node = result.rows[0];
    if (!node) throw new ApiError('NOT_FOUND', 'Node tidak ditemukan');
    let target: { path_code: string; path_slug: string; level: string } | null = null;
    if (input.targetParentId) {
      const targetResult = await this.pool.query(
        `SELECT path_code, path_slug, level FROM ${schema}.taxonomy_nodes
          WHERE revision_id = $1 AND node_id = $2 AND lifecycle_status = 'ACTIVE'`,
        [revision.id, input.targetParentId],
      );
      target = targetResult.rows[0] ?? null;
      if (!target) throw new ApiError('NOT_FOUND', 'Induk tujuan tidak ditemukan');
    }
    return {
      revision: revision.number,
      nodeId: node.node_id,
      name: node.name,
      currentPath: node.path_slug,
      targetParentPath: target?.path_slug ?? null,
      subtreeCount: Number(node.subtree_count),
      urlAndCodeWillChange: Boolean(target),
      nodeIdWillChange: false,
      requiresConfirmation: true,
    };
  }

  async mutate(
    principal: Principal,
    input: {
      action: 'ADD' | 'EDIT' | 'REORDER' | 'MOVE' | 'ARCHIVE' | 'RESTORE';
      expectedRevision: number;
      confirmedImpact: boolean;
      nodeId?: string;
      parentId?: string;
      name?: string;
      slug?: string;
      localCode?: string;
      sortOrder?: number;
    },
  ) {
    requireOwner(principal);
    if (!input.confirmedImpact) throw new ApiError('VALIDATION_FAILED', 'Konfirmasi dampak wajib');
    if (!Number.isSafeInteger(input.expectedRevision) || input.expectedRevision < 1) {
      throw new ApiError('VALIDATION_FAILED', 'Revisi dasar tidak valid');
    }
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        `taxonomy:${this.schemaName}`,
      ]);
      const active = await this.activeRevision(client);
      if (!active || active.number !== input.expectedRevision) {
        throw new ApiError('VERSION_CONFLICT', 'Struktur berubah; muat ulang diff terbaru');
      }
      const nextRevisionId = randomUUID();
      const created = await client.query<{ revision_number: string }>(
        `INSERT INTO ${quotedSchema(this.schemaName)}.taxonomy_revisions
           (id, base_revision_number, status, source_hash, source_manifest,
            expected_node_count, loaded_node_count, batch_cursor, validation_report, created_by)
         SELECT $1, revision_number, 'STAGING', source_hash, source_manifest,
                expected_node_count, loaded_node_count, batch_cursor,
                '{"ok":true,"origin":"OWNER_EDIT"}'::jsonb, $2
           FROM ${quotedSchema(this.schemaName)}.taxonomy_revisions WHERE id = $3
         RETURNING revision_number`,
        [nextRevisionId, principal.id, active.id],
      );
      const nextRevision = Number(created.rows[0]?.revision_number);
      await client.query(
        `INSERT INTO ${quotedSchema(this.schemaName)}.taxonomy_nodes
         SELECT $1, node_id, parent_id, level, local_code, path_code, name, slug, path_slug,
                sort_order, visibility, lifecycle_status, empty_marker, source_file, source_line,
                source_virtual_path, metadata, version, created_at, updated_at
           FROM ${quotedSchema(this.schemaName)}.taxonomy_nodes WHERE revision_id = $2`,
        [nextRevisionId, active.id],
      );
      const impact = await this.applyMutation(client, nextRevisionId, input);
      await client.query(
        `INSERT INTO ${quotedSchema(this.schemaName)}.taxonomy_aliases
           (alias_path, target_node_id, created_in_revision)
         SELECT old.path_slug, old.node_id, $3
           FROM ${quotedSchema(this.schemaName)}.taxonomy_nodes old
           JOIN ${quotedSchema(this.schemaName)}.taxonomy_nodes fresh
             ON fresh.revision_id = $1 AND fresh.node_id = old.node_id
          WHERE old.revision_id = $2 AND old.path_slug <> fresh.path_slug
         ON CONFLICT (alias_path) DO UPDATE SET
           target_node_id = EXCLUDED.target_node_id,
           created_in_revision = EXCLUDED.created_in_revision,
           retired_at = NULL`,
        [nextRevisionId, active.id, nextRevision],
      );
      await client.query(
        `UPDATE ${quotedSchema(this.schemaName)}.taxonomy_revisions
            SET status = 'RETIRED' WHERE id = $1`,
        [active.id],
      );
      await client.query(
        `UPDATE ${quotedSchema(this.schemaName)}.taxonomy_revisions
            SET status = 'ACTIVE', promoted_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [nextRevisionId],
      );
      await client.query(
        `UPDATE ${quotedSchema(this.schemaName)}.taxonomy_state SET
           active_revision_id = $1, active_revision_number = $2, export_required = true,
           updated_at = CURRENT_TIMESTAMP WHERE singleton = true`,
        [nextRevisionId, nextRevision],
      );
      await client.query(
        `INSERT INTO ${quotedSchema(this.schemaName)}.taxonomy_change_log
           (id, revision_number, actor_principal_id, action, node_id, impact)
         VALUES ($1,$2,$3,$4,$5,$6::jsonb)`,
        [
          randomUUID(),
          nextRevision,
          principal.id,
          input.action,
          input.nodeId ?? null,
          JSON.stringify(impact),
        ],
      );
      await client.query('COMMIT');
      return { revision: nextRevision, exportRequired: true, impact };
    } catch (error) {
      await client.query('ROLLBACK');
      throw mapConstraintError(error);
    } finally {
      client.release();
    }
  }

  async exportSnapshot(principal: Principal, expectedRevision: number) {
    requireOwner(principal);
    const schema = quotedSchema(this.schemaName);
    const active = await this.requireActiveRevision();
    if (active.number !== expectedRevision) {
      throw new ApiError('VERSION_CONFLICT', 'Revisi export sudah berubah');
    }
    const result = await this.pool.query(
      `SELECT node_id AS "nodeId", parent_id AS "parentId", level,
              local_code AS "localCode", path_code AS "pathCode", name, slug,
              path_slug AS "pathSlug", sort_order AS "sortOrder", visibility,
              lifecycle_status AS "lifecycleStatus", empty_marker AS "emptyMarker",
              source_file AS "sourceFile", source_line AS "sourceLine", version
         FROM ${schema}.taxonomy_nodes WHERE revision_id = $1 ORDER BY path_code`,
      [active.id],
    );
    return {
      schemaVersion: 1,
      revision: active.number,
      nodeCount: result.rows.length,
      exportRequired: true,
      nodes: result.rows,
    };
  }

  private async applyMutation(
    client: PoolClient,
    revisionId: string,
    input: Parameters<TaxonomyService['mutate']>[1],
  ) {
    const schema = quotedSchema(this.schemaName);
    if (input.action === 'ADD') {
      if (!input.parentId || !input.name || !input.slug || !input.localCode) {
        throw new ApiError('VALIDATION_FAILED', 'Data node baru belum lengkap');
      }
      requireUuid(input.parentId);
      validateSlug(input.slug);
      const parent = await nodeForUpdate(client, schema, revisionId, input.parentId);
      const level = input.localCode.match(/^(SM|ST|R|D|K|M|T|J)/)?.[1];
      if (!level || !LEVEL_CHILDREN[parent.level]?.includes(level)) {
        throw new ApiError('VALIDATION_FAILED', 'Level anak tidak sah');
      }
      const nodeId = randomUUID();
      await client.query(
        `INSERT INTO ${schema}.taxonomy_nodes
           (revision_id,node_id,parent_id,level,local_code,path_code,name,slug,path_slug,
            sort_order,source_file,source_line,metadata)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'OWNER_EDIT',1,'{"ownerEdit":true}'::jsonb)`,
        [
          revisionId,
          nodeId,
          parent.node_id,
          level,
          input.localCode,
          `${parent.path_code}.${input.localCode}`,
          input.name.trim(),
          input.slug,
          `${parent.path_slug}/${input.slug}`,
          input.sortOrder ?? 0,
        ],
      );
      return { nodeId, subtreeCount: 1, nodeIdPreserved: true };
    }
    if (!input.nodeId) throw new ApiError('VALIDATION_FAILED', 'nodeId wajib');
    requireUuid(input.nodeId);
    const node = await nodeForUpdate(client, schema, revisionId, input.nodeId);
    if (input.action === 'EDIT') {
      const name = input.name?.trim() || node.name;
      const slug = input.slug ?? node.slug;
      validateSlug(slug);
      await rewriteSubtreePaths(
        client,
        schema,
        revisionId,
        node,
        node.parent_id,
        node.local_code,
        slug,
      );
      await client.query(
        `UPDATE ${schema}.taxonomy_nodes SET name=$3, version=version+1, updated_at=CURRENT_TIMESTAMP
          WHERE revision_id=$1 AND node_id=$2`,
        [revisionId, node.node_id, name],
      );
      return {
        nodeId: node.node_id,
        oldPath: node.path_slug,
        subtreeCount: await subtreeCount(client, schema, revisionId, node.node_id),
      };
    }
    if (input.action === 'REORDER') {
      if (!Number.isSafeInteger(input.sortOrder) || Number(input.sortOrder) < 0) {
        throw new ApiError('VALIDATION_FAILED', 'Urutan tidak valid');
      }
      await client.query(
        `UPDATE ${schema}.taxonomy_nodes SET sort_order=$3, version=version+1, updated_at=CURRENT_TIMESTAMP
          WHERE revision_id=$1 AND node_id=$2`,
        [revisionId, node.node_id, input.sortOrder],
      );
      return { nodeId: node.node_id, oldOrder: node.sort_order, newOrder: input.sortOrder };
    }
    if (input.action === 'MOVE') {
      if (!input.parentId) throw new ApiError('VALIDATION_FAILED', 'Induk tujuan wajib');
      requireUuid(input.parentId);
      const parent = await nodeForUpdate(client, schema, revisionId, input.parentId);
      if (!LEVEL_CHILDREN[parent.level]?.includes(node.level)) {
        throw new ApiError('VALIDATION_FAILED', 'Level induk tujuan tidak sah');
      }
      const inside = await client.query(
        `SELECT 1 FROM ${schema}.taxonomy_nodes
          WHERE revision_id=$1 AND node_id=$2 AND (path_slug=$3 OR path_slug LIKE $3 || '/%')`,
        [revisionId, parent.node_id, node.path_slug],
      );
      if (inside.rows[0]) throw new ApiError('VALIDATION_FAILED', 'Pemindahan akan membuat siklus');
      const siblings = await client.query<{ local_code: string }>(
        `SELECT local_code FROM ${schema}.taxonomy_nodes
          WHERE revision_id=$1 AND parent_id=$2 AND level=$3 AND node_id<>$4`,
        [revisionId, parent.node_id, node.level, node.node_id],
      );
      const usedCodes = new Set(siblings.rows.map((row) => row.local_code));
      let nextLocalCode = node.local_code;
      if (usedCodes.has(nextLocalCode)) {
        const maximum = Math.max(
          0,
          ...siblings.rows.map((row) => Number(row.local_code.slice(node.level.length))),
        );
        nextLocalCode = `${node.level}${maximum + 1}`;
      }
      await rewriteSubtreePaths(
        client,
        schema,
        revisionId,
        node,
        parent.node_id,
        nextLocalCode,
        node.slug,
        parent,
      );
      return {
        nodeId: node.node_id,
        oldPath: node.path_slug,
        targetParent: parent.path_slug,
        localCode: nextLocalCode,
        subtreeCount: await subtreeCount(client, schema, revisionId, node.node_id),
        nodeIdPreserved: true,
      };
    }
    const status = input.action === 'ARCHIVE' ? 'ARCHIVED' : 'ACTIVE';
    await client.query(
      `UPDATE ${schema}.taxonomy_nodes SET lifecycle_status=$3, version=version+1,
              updated_at=CURRENT_TIMESTAMP
        WHERE revision_id=$1 AND (node_id=$2 OR path_slug LIKE $4 || '/%')`,
      [revisionId, node.node_id, status, node.path_slug],
    );
    return {
      nodeId: node.node_id,
      lifecycleStatus: status,
      subtreeCount: await subtreeCount(client, schema, revisionId, node.node_id),
    };
  }

  private async activeRevision(client: Pool | PoolClient = this.pool) {
    const schema = quotedSchema(this.schemaName);
    const result = await client.query<{ id: string; number: string }>(
      `SELECT active_revision_id AS id, active_revision_number AS number
         FROM ${schema}.taxonomy_state WHERE singleton=true AND active_revision_id IS NOT NULL`,
    );
    return result.rows[0] ? { id: result.rows[0].id, number: Number(result.rows[0].number) } : null;
  }

  /* ---------------------------------------------------------- */
  /* L08 — stage/diff/promote/rollback paket Menu pilot Explore  */
  /* ---------------------------------------------------------- */

  /**
   * L08 stage: salin revision aktif → revision STAGING, sisipkan node pilot
   * sebagai extension dengan UUID staging yang dibuat SERVER (randomUUID).
   * ID fixture (`sourceNodeKey`) tidak pernah ditulis sebagai UUID DB.
   * Mapping dicatat di `source_manifest` staging + dikembalikan.
   * Root pilot dinormalisasi ke `space-explore` (tidak dibuat ulang bila
   * path `/ruang/jelajahi-pengetahuan` sudah merujuk root existing —
   * node R sumber menjadi alias mapping; root global lain tak tersentuh).
   */
  async stagePackage(
    principal: Principal,
    input: {
      packageId: string;
      version: string;
      expectedBaseRevision: number;
      manifest: {
        schemaVersion: string;
        sourceRef: string;
        licenseRef: string;
        rollbackReference: string;
        checksum: string;
        status: string;
        approvedBy: string;
        approvedAt: string;
      };
      nodes: Array<{
        sourceNodeKey: string;
        parentKey: string | null;
        level: string;
        name: string;
        slug: string;
        sortOrder: number;
        visibility: 'PUBLIC' | 'OWNER_ONLY';
        status: 'ACTIVE' | 'ARCHIVED';
        sourceRef: string;
        targetPath: string;
      }>;
    },
  ): Promise<{ snapshot: import('@/contracts/import-package').StageSnapshot; diff: import('@/contracts/import-package').PackageDiff }> {
    requireOwner(principal);
    if (input.packageId !== 'madevi-explore-pilot-v1' || input.version !== '1.0.0') {
      throw new ApiError('VALIDATION_FAILED', 'Hanya paket madevi-explore-pilot-v1 v1.0.0');
    }
    if (!Number.isSafeInteger(input.expectedBaseRevision) || input.expectedBaseRevision < 1) {
      throw new ApiError('VALIDATION_FAILED', 'Revisi dasar tidak valid');
    }
    if (input.nodes.length < 1 || input.nodes.length > 64) {
      throw new ApiError('VALIDATION_FAILED', 'Jumlah node paket 1–64');
    }
    if (!/^[0-9a-f]{64}$/i.test(input.manifest.checksum)) {
      throw new ApiError('VALIDATION_FAILED', 'Checksum rilis tidak valid');
    }
    const pilotRoots = input.nodes.filter((n) => n.parentKey === null);
    const pilotRoot = pilotRoots[0];
    if (
      pilotRoots.length !== 1 ||
      !pilotRoot ||
      pilotRoot.level !== 'R' ||
      pilotRoot.slug !== 'jelajahi-pengetahuan'
    ) {
      throw new ApiError('VALIDATION_FAILED', 'Paket wajib memiliki satu root Explore');
    }
    const extensionCount = input.nodes.length - 1;
    // Validasi murni tahap stage: hierarki level, slug aman, dan parent
    // internal paket (ID fixture diperlakukan sebagai source key sementara —
    // validasi UUID P18 tidak berlaku di sini; UUID dibuat server di bawah).
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        `taxonomy:${this.schemaName}`,
      ]);
      const schema = quotedSchema(this.schemaName);
      const active = await this.activeRevision(client);
      if (!active || active.number !== input.expectedBaseRevision) {
        throw new ApiError('VERSION_CONFLICT', 'Revisi dasar berubah; muat ulang diff terbaru');
      }
      const activeL08 = await client
        .query<{
          source_manifest: {
            l08Stage?: {
              packageId: string;
              version: string;
              verifiedChecksum: string;
              mapping: Record<string, string>;
              createdAt: string;
            };
          } | null;
        }>(
          `SELECT source_manifest FROM ${schema}.taxonomy_revisions WHERE id = $1`,
          [active.id],
        )
        .then((r) => r.rows[0]?.source_manifest?.l08Stage ?? null);
      if (activeL08?.packageId === input.packageId) {
        if (
          activeL08.version !== input.version ||
          activeL08.verifiedChecksum !== input.manifest.checksum
        ) {
          throw new ApiError('VERSION_CONFLICT', 'Versi/checksum pilot aktif berbeda; rollback atau review upgrade dulu');
        }
        const existingNodes = await client.query<{
          node_id: string;
          path_slug: string;
          metadata: { l08Package?: { sourceNodeKey?: string } };
        }>(
          `SELECT node_id, path_slug, metadata FROM ${schema}.taxonomy_nodes
            WHERE revision_id = $1 AND source_file = 'L08_PACKAGE' ORDER BY path_slug`,
          [active.id],
        );
        const root = input.nodes.find((node) => node.parentKey === null);
        await client.query('COMMIT');
        return {
          snapshot: {
            packageId: input.packageId,
            version: input.version,
            stagingRevisionId: active.id,
            stagingRevisionNumber: active.number,
            baseRevisionId: active.id,
            baseRevision: active.number,
            mapping: activeL08.mapping,
            createdAt: activeL08.createdAt,
            alreadyPromoted: true,
          },
          diff: {
            packageId: input.packageId,
            version: input.version,
            baseRevision: active.number,
            items: [
              ...(root
                ? [
                    {
                      sourceNodeKey: root.sourceNodeKey,
                      action: 'UPDATE' as const,
                      detail: 'already normalized onto existing space-explore root; no mutation',
                    },
                  ]
                : []),
              ...existingNodes.rows.map((node) => ({
                sourceNodeKey: node.metadata?.l08Package?.sourceNodeKey ?? node.node_id,
                action: 'UPDATE' as const,
                detail: `already active extension ${node.path_slug}; no mutation`,
              })),
            ],
            otherRootsChanged: 0,
          },
        };
      }
      const stagingId = randomUUID();
      await client.query(
        `INSERT INTO ${schema}.taxonomy_revisions
           (id, base_revision_number, status, source_hash, source_manifest,
            expected_node_count, loaded_node_count, batch_cursor, validation_report, created_by)
         SELECT $1, revision_number, 'STAGING', $4, $5::jsonb,
                expected_node_count + $6, loaded_node_count + $6, batch_cursor,
                '{"ok":true,"origin":"L08_STAGE"}'::jsonb, $2
           FROM ${schema}.taxonomy_revisions WHERE id = $3`,
        [
          stagingId,
          principal.id,
          active.id,
          createPackageSourceHash(input.packageId, input.version, input.nodes),
          JSON.stringify({ l08Stage: { packageId: input.packageId, version: input.version } }),
          extensionCount,
        ],
      );
      await client.query(
        `INSERT INTO ${schema}.taxonomy_nodes
           (revision_id,node_id,parent_id,level,local_code,path_code,name,slug,path_slug,
            sort_order,visibility,lifecycle_status,empty_marker,source_file,source_line,
            source_virtual_path,metadata,version,created_at,updated_at)
          SELECT $1, node_id, parent_id, level, local_code, path_code, name, slug, path_slug,
                 sort_order, visibility, lifecycle_status, empty_marker, source_file, source_line,
                 source_virtual_path, metadata, version, created_at, updated_at
            FROM ${schema}.taxonomy_nodes WHERE revision_id = $2`,
        [stagingId, active.id],
      );
      // Sisipkan child pilot sebagai extension: UUID dibuat server. Root sumber
      // hanya alias ke root Explore aktif, jadi tak ada root taxonomy baru.
      const mapping: Record<string, string> = {};
      const keyToUuid = new Map<string, string>();
      const keyToCode = new Map<string, string>();
      const siblingCount = new Map<string, number>();
      const exploreRoot = await client
        .query<{ node_id: string; path_code: string; level: string }>(
          `SELECT node_id, path_code, level FROM ${schema}.taxonomy_nodes
            WHERE revision_id = $1 AND path_slug = 'jelajahi-pengetahuan' AND lifecycle_status = 'ACTIVE'`,
          [stagingId],
        )
        .then((r) => r.rows[0] ?? null);
      if (!exploreRoot || exploreRoot.level !== 'R') {
        throw new ApiError('DEPENDENCY_UNAVAILABLE', 'Root Explore aktif belum tersedia');
      }
      keyToUuid.set(pilotRoot.sourceNodeKey, exploreRoot.node_id);
      keyToCode.set(pilotRoot.sourceNodeKey, exploreRoot.path_code);
      mapping[pilotRoot.sourceNodeKey] = exploreRoot.node_id;
      const pending = input.nodes.filter((n) => n.sourceNodeKey !== pilotRoot.sourceNodeKey);
      let guard = 0;
      while (pending.length > 0) {
        if (guard++ > 256) throw new ApiError('VALIDATION_FAILED', 'Hierarki paket terlalu dalam/siklikal');
        const idx = pending.findIndex(
          (n) => n.parentKey === null || keyToUuid.has(n.parentKey),
        );
        if (idx < 0) throw new ApiError('VALIDATION_FAILED', 'Parent paket tidak ditemukan (orphan/cycle)');
        const n = pending.splice(idx, 1)[0]!;
        const allowed = LEVEL_CHILDREN[n.level];
        if (!allowed) throw new ApiError('VALIDATION_FAILED', `Level tidak dikenal: ${n.level}`);
        const parentUuid = n.parentKey === null ? null : keyToUuid.get(n.parentKey)!;
        const parentCode = n.parentKey === null ? null : keyToCode.get(n.parentKey)!;
        if (n.parentKey !== null) {
          const parentLevel = input.nodes.find((x) => x.sourceNodeKey === n.parentKey)?.level;
          if (!parentLevel || !LEVEL_CHILDREN[parentLevel]?.includes(n.level)) {
            throw new ApiError('VALIDATION_FAILED', `Level ${n.level} tidak sah di bawah ${parentLevel}`);
          }
          if (parentCode === null) throw new ApiError('VALIDATION_FAILED', 'Parent code hilang');
        } else if (n.level !== 'R') {
          throw new ApiError('VALIDATION_FAILED', 'Root paket harus level R');
        }
        validateSlug(n.slug);
        const sibKey = n.parentKey ?? '__root__';
        if (!siblingCount.has(sibKey)) {
          const existing = await client.query<{ local_code: string }>(
            `SELECT local_code FROM ${schema}.taxonomy_nodes
              WHERE revision_id = $1 AND parent_id = $2 AND level = $3`,
            [stagingId, parentUuid, n.level],
          );
          const lastIndex = existing.rows.reduce((max, row) => {
            const value = Number(row.local_code.slice(n.level.length));
            return Number.isSafeInteger(value) ? Math.max(max, value) : max;
          }, 0);
          siblingCount.set(sibKey, lastIndex);
        }
        const sibIndex = (siblingCount.get(sibKey) ?? 0) + 1;
        siblingCount.set(sibKey, sibIndex);
        const localCode = `${n.level}${sibIndex}`;
        const pathCode = `${parentCode}.${localCode}`;
        const nodeId = randomUUID();
        const parentPath = n.parentKey === null ? '' : await this.stagedPath(client, schema, stagingId, parentUuid!);
        const pathSlug = parentPath ? `${parentPath}/${n.slug}` : n.slug;
        await client.query(
          `INSERT INTO ${schema}.taxonomy_nodes
             (revision_id,node_id,parent_id,level,local_code,path_code,name,slug,path_slug,
              sort_order,visibility,lifecycle_status,source_file,source_line,metadata)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'ACTIVE','L08_PACKAGE',1,
                   $12::jsonb)`,
          [
            stagingId,
            nodeId,
            parentUuid,
            n.level,
            localCode,
            pathCode,
            n.name.trim(),
            n.slug,
            pathSlug,
            n.sortOrder,
            n.visibility,
            JSON.stringify({
              l08Package: {
                packageId: input.packageId,
                sourceNodeKey: n.sourceNodeKey,
                targetPath: n.targetPath,
              },
            }),
          ],
        );
        keyToUuid.set(n.sourceNodeKey, nodeId);
        keyToCode.set(n.sourceNodeKey, pathCode);
        mapping[n.sourceNodeKey] = nodeId;
      }
      const runtimeBefore = await client
        .query<RuntimePackageSnapshot>(
          `SELECT package_id, package_kind, version, schema_version, status,
                  access_level, source_ref, license_ref, checksum,
                  rollback_reference, payload, published_at
             FROM ${schema}.runtime_content_packages WHERE package_id = $1 FOR UPDATE`,
          [input.packageId],
        )
        .then((r) => r.rows[0] ?? null);
      const runtimeNodes = input.nodes
        .filter((n) => n.sourceNodeKey !== pilotRoot.sourceNodeKey)
        .map((n) => {
          const id = mapping[n.sourceNodeKey];
          const parentId =
            n.parentKey === pilotRoot.sourceNodeKey
              ? 'space-explore'
              : (n.parentKey ? mapping[n.parentKey] : undefined);
          if (!id || !parentId) {
            throw new ApiError('VALIDATION_FAILED', 'Mapping runtime package tidak lengkap');
          }
          return {
            id,
            parentId,
            parentSpaceId: 'space-explore',
            kind: n.level === 'D' ? 'DOMAIN' : 'MENU',
            label: n.name.trim(),
            slug: n.slug,
            href: n.targetPath,
            sortOrder: n.sortOrder,
            sourceNodeKey: n.sourceNodeKey,
          };
        });
      const readyForPromote =
        input.manifest.status === 'SIAP-INTEGRASI' &&
        Boolean(input.manifest.approvedBy) &&
        !Number.isNaN(Date.parse(input.manifest.approvedAt));
      const createdAt = new Date().toISOString();
      await client.query(
        `UPDATE ${schema}.taxonomy_revisions SET source_manifest = $2 WHERE id = $1`,
        [
          stagingId,
          JSON.stringify({
            l08Stage: {
              packageId: input.packageId,
              version: input.version,
              baseRevision: active.number,
              mapping,
              manifest: input.manifest,
              verifiedChecksum: input.manifest.checksum,
              readyForPromote,
              runtimePayload: { nodes: runtimeNodes },
              runtimeBefore,
              actor: principal.id,
              createdAt,
            },
          }),
        ],
      );
      const diff = await this.buildStageDiff(client, schema, active.id, stagingId, input);
      const stagingRevisionNumber = await client
        .query<{ revision_number: string }>(
          `SELECT revision_number FROM ${schema}.taxonomy_revisions WHERE id = $1`,
          [stagingId],
        )
        .then((r) => Number(r.rows[0]?.revision_number ?? 0));
      await client.query('COMMIT');
      return {
        snapshot: {
          packageId: input.packageId,
          version: input.version,
          stagingRevisionId: stagingId,
          stagingRevisionNumber,
          baseRevisionId: active.id,
          baseRevision: active.number,
          mapping,
          createdAt,
        },
        diff,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw mapConstraintError(error);
    } finally {
      client.release();
    }
  }

  /** Path slug node di revision staging (untuk membangun path anak). */
  private async stagedPath(
    client: PoolClient,
    schema: string,
    stagingId: string,
    nodeId: string,
  ): Promise<string> {
    const row = await client
      .query<{ path_slug: string }>(
        `SELECT path_slug FROM ${schema}.taxonomy_nodes WHERE revision_id = $1 AND node_id = $2`,
        [stagingId, nodeId],
      )
      .then((r) => r.rows[0] ?? null);
    if (!row) throw new ApiError('NOT_FOUND', 'Node staging tidak ditemukan');
    return row.path_slug;
  }

  /**
   * Diff staging vs aktif: item-per-item ADD untuk node paket, plus
   * penegasan nol perubahan pada root global lain (hanya ekstensi Explore).
   */
  private async buildStageDiff(
    client: PoolClient,
    schema: string,
    activeId: string,
    stagingId: string,
    input: {
      packageId: string;
      version: string;
      nodes: Array<{ sourceNodeKey: string; parentKey: string | null; slug: string }>;
    },
  ): Promise<import('@/contracts/import-package').PackageDiff> {
    const staged = await client.query<{
      node_id: string;
      path_slug: string;
      metadata: { l08Package?: { sourceNodeKey?: string } };
    }>(
      `SELECT node_id, path_slug, metadata FROM ${schema}.taxonomy_nodes
        WHERE revision_id = $1 AND source_file = 'L08_PACKAGE'
        ORDER BY path_slug`,
      [stagingId],
    );
    const activeCount = await client
      .query<{ count: string }>(
        `SELECT count(*) AS count FROM ${schema}.taxonomy_nodes WHERE revision_id = $1`,
        [activeId],
      )
      .then((r) => Number(r.rows[0]?.count ?? 0));
    const stagingCount = await client
      .query<{ count: string }>(
        `SELECT count(*) AS count FROM ${schema}.taxonomy_nodes WHERE revision_id = $1`,
        [stagingId],
      )
      .then((r) => Number(r.rows[0]?.count ?? 0));
    const added = stagingCount - activeCount;
    const base = await this.activeRevision(client);
    const root = input.nodes.find((node) => node.parentKey === null);
    return {
      packageId: input.packageId,
      version: input.version,
      baseRevision: base?.number ?? 0,
      items: [
        ...(root
          ? [
              {
                sourceNodeKey: root.sourceNodeKey,
                action: 'UPDATE' as const,
                detail: 'normalized onto existing space-explore root; no root mutation',
              },
            ]
          : []),
        ...staged.rows.map((r) => ({
          sourceNodeKey: r.metadata?.l08Package?.sourceNodeKey ?? r.node_id,
          action: 'ADD' as const,
          detail: `extension ${r.path_slug}`,
        })),
      ],
      otherRootsChanged: added === staged.rows.length ? 0 : -1,
    };
  }

  /**
   * L08 promote: staging → ACTIVE atomik. Menolak bila revision aktif saat
   * ini bukan baseRevision snapshot (konflik → tanpa perubahan parsial).
   * Mapping final = mapping stage (UUID dibuat saat stage, bukan promote).
   * DRAFT tidak pernah terlihat runtime: hanya revision ACTIVE yang dibaca.
   */
  async promotePackage(
    principal: Principal,
    input: { stagingRevisionId: string; expectedBaseRevision: number },
  ): Promise<import('@/contracts/import-package').PromoteResult> {
    requireOwner(principal);
    requireUuid(input.stagingRevisionId);
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        `taxonomy:${this.schemaName}`,
      ]);
      const schema = quotedSchema(this.schemaName);
      const active = await this.activeRevision(client);
      if (!active || active.number !== input.expectedBaseRevision) {
        throw new ApiError('VERSION_CONFLICT', 'Revisi dasar berubah; stage ulang dari diff terbaru');
      }
      const staging = await client
        .query<{
          id: string;
          status: string;
          source_manifest: {
            l08Stage?: {
              packageId: string;
              version: string;
              baseRevision: number;
              mapping: Record<string, string>;
              manifest: {
                schemaVersion: string;
                sourceRef: string;
                licenseRef: string;
                rollbackReference: string;
                checksum: string;
                status: string;
              };
              verifiedChecksum: string;
              readyForPromote: boolean;
              runtimePayload: { nodes: unknown[] };
              runtimeBefore: RuntimePackageSnapshot | null;
            };
          } | null;
        }>(
          `SELECT id, status, source_manifest FROM ${schema}.taxonomy_revisions WHERE id = $1`,
          [input.stagingRevisionId],
        )
        .then((r) => r.rows[0] ?? null);
      if (!staging || staging.status !== 'STAGING' || !staging.source_manifest?.l08Stage) {
        throw new ApiError('VALIDATION_FAILED', 'Revision staging L08 tidak valid');
      }
      const stage = staging.source_manifest.l08Stage;
      if (stage.baseRevision !== input.expectedBaseRevision) {
        throw new ApiError('VERSION_CONFLICT', 'Snapshot stage tidak cocok dengan revision aktif');
      }
      if (
        !stage.readyForPromote ||
        stage.manifest.status !== 'SIAP-INTEGRASI' ||
        !/^[0-9a-f]{64}$/i.test(stage.verifiedChecksum) ||
        stage.manifest.checksum !== stage.verifiedChecksum ||
        !Array.isArray(stage.runtimePayload?.nodes) ||
        stage.runtimePayload.nodes.length === 0
      ) {
        throw new ApiError(
          'DEPENDENCY_UNAVAILABLE',
          'Rilis belum disetujui/terverifikasi untuk promote; stage preview tetap tidak terlihat runtime',
        );
      }
      const existingRuntime = await client
        .query<RuntimePackageSnapshot>(
          `SELECT package_id, package_kind, version, schema_version, status,
                  access_level, source_ref, license_ref, checksum,
                  rollback_reference, payload, published_at
             FROM ${schema}.runtime_content_packages WHERE package_id = $1 FOR UPDATE`,
          [stage.packageId],
        )
        .then((r) => r.rows[0] ?? null);
      if (
        existingRuntime?.status === 'PUBLISHED' &&
        (existingRuntime.version !== stage.version || existingRuntime.checksum !== stage.verifiedChecksum)
      ) {
        throw new ApiError('VERSION_CONFLICT', 'Package runtime terbit berbeda; review/rollback dulu');
      }
      if (
        existingRuntime &&
        existingRuntime.status !== 'PUBLISHED' &&
        existingRuntime.checksum !== null &&
        existingRuntime.checksum !== stage.verifiedChecksum
      ) {
        throw new ApiError('VERSION_CONFLICT', 'Draft runtime berbeda; perubahan manual harus diaudit dulu');
      }
      await client.query(`UPDATE ${schema}.taxonomy_revisions SET status = 'RETIRED' WHERE id = $1`, [
        active.id,
      ]);
      await client.query(
        `UPDATE ${schema}.taxonomy_revisions
            SET status = 'ACTIVE', promoted_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [staging.id],
      );
      const promoted = await client
        .query<{ revision_number: string }>(
          `SELECT revision_number FROM ${schema}.taxonomy_revisions WHERE id = $1`,
          [staging.id],
        )
        .then((r) => Number(r.rows[0]?.revision_number ?? 0));
      await client.query(
        `UPDATE ${schema}.taxonomy_state SET
            active_revision_id = $1, active_revision_number = $2, export_required = true,
            updated_at = CURRENT_TIMESTAMP WHERE singleton = true`,
        [staging.id, promoted],
      );
      if (existingRuntime?.status !== 'PUBLISHED') {
        await client.query(
          `INSERT INTO ${schema}.runtime_content_packages
             (package_id, package_kind, version, schema_version, status,
              access_level, source_ref, license_ref, checksum,
              rollback_reference, payload, published_at)
           VALUES ($1, 'MENU', $2, $3, 'PUBLISHED', 'PUBLIC', $4, $5, $6, $7, $8::jsonb,
                   CURRENT_TIMESTAMP)
           ON CONFLICT (package_id) DO UPDATE SET
             package_kind = EXCLUDED.package_kind,
             version = EXCLUDED.version,
             schema_version = EXCLUDED.schema_version,
             status = EXCLUDED.status,
             access_level = EXCLUDED.access_level,
             source_ref = EXCLUDED.source_ref,
             license_ref = EXCLUDED.license_ref,
             checksum = EXCLUDED.checksum,
             rollback_reference = EXCLUDED.rollback_reference,
             payload = EXCLUDED.payload,
             published_at = EXCLUDED.published_at,
             updated_at = CURRENT_TIMESTAMP
           WHERE ${schema}.runtime_content_packages.status <> 'PUBLISHED'`,
          [
            stage.packageId,
            stage.version,
            stage.manifest.schemaVersion,
            stage.manifest.sourceRef,
            stage.manifest.licenseRef,
            stage.verifiedChecksum,
            stage.manifest.rollbackReference,
            JSON.stringify(stage.runtimePayload),
          ],
        );
      }
      await client.query(
        `INSERT INTO ${schema}.taxonomy_change_log
           (id, revision_number, actor_principal_id, action, node_id, impact)
         VALUES ($1,$2,$3,'PROMOTE',NULL,$4::jsonb)`,
        [
          randomUUID(),
          promoted,
          principal.id,
          JSON.stringify({ l08: true, packageId: stage.packageId, version: stage.version }),
        ],
      );
      await client.query('COMMIT');
      return {
        packageId: stage.packageId,
        version: stage.version,
        activeRevision: promoted,
        mapping: stage.mapping,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw mapConstraintError(error);
    } finally {
      client.release();
    }
  }

  /**
   * L08 rollback: hanya menerima snapshot pra-promote (revision id + expected
   * current). Mengembalikan revision snapshot menjadi ACTIVE secara atomik
   * dan menghasilkan diff terbalik. Tidak menghapus konten manual.
   */
  async rollbackPackage(
    principal: Principal,
    input: { snapshotRevisionId: string; expectedCurrentRevision: number; reason: string },
  ): Promise<{ activeRevision: number; restoredRevision: number }> {
    requireOwner(principal);
    requireUuid(input.snapshotRevisionId);
    if (!input.reason || input.reason.trim().length < 10) {
      throw new ApiError('VALIDATION_FAILED', 'Alasan rollback minimal 10 karakter');
    }
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        `taxonomy:${this.schemaName}`,
      ]);
      const schema = quotedSchema(this.schemaName);
      const active = await this.activeRevision(client);
      if (!active || active.number !== input.expectedCurrentRevision) {
        throw new ApiError('VERSION_CONFLICT', 'Revision aktif berubah; audit ulang sebelum rollback');
      }
      const activeStage = await client
        .query<{
          source_manifest: {
            l08Stage?: {
              packageId: string;
              version: string;
              baseRevision: number;
              verifiedChecksum: string;
              runtimeBefore: RuntimePackageSnapshot | null;
            };
          } | null;
        }>(
          `SELECT source_manifest FROM ${schema}.taxonomy_revisions WHERE id = $1 FOR UPDATE`,
          [active.id],
        )
        .then((r) => r.rows[0]?.source_manifest?.l08Stage ?? null);
      if (!activeStage) {
        throw new ApiError('VALIDATION_FAILED', 'Revision aktif bukan promote L08 yang dapat di-rollback');
      }
      const snapshot = await client
        .query<{ id: string; revision_number: string; status: string }>(
          `SELECT id, revision_number, status FROM ${schema}.taxonomy_revisions WHERE id = $1`,
          [input.snapshotRevisionId],
        )
        .then((r) => r.rows[0] ?? null);
      if (!snapshot) {
        throw new ApiError('NOT_FOUND', 'Snapshot rollback tidak ditemukan');
      }
      if (snapshot.status !== 'RETIRED' || Number(snapshot.revision_number) !== activeStage.baseRevision) {
        throw new ApiError('VERSION_CONFLICT', 'Snapshot pra-promote L08 tidak cocok');
      }
      const runtimeCurrent = await client
        .query<RuntimePackageSnapshot>(
          `SELECT package_id, package_kind, version, schema_version, status,
                  access_level, source_ref, license_ref, checksum,
                  rollback_reference, payload, published_at
             FROM ${schema}.runtime_content_packages WHERE package_id = $1 FOR UPDATE`,
          [activeStage.packageId],
        )
        .then((r) => r.rows[0] ?? null);
      if (
        !runtimeCurrent ||
        runtimeCurrent.status !== 'PUBLISHED' ||
        runtimeCurrent.version !== activeStage.version ||
        runtimeCurrent.checksum !== activeStage.verifiedChecksum
      ) {
        throw new ApiError('VERSION_CONFLICT', 'Runtime package berubah; tidak boleh menimpa perubahan manual');
      }
      // Snapshot pra-promote berstatus RETIRED — itu yang dikembalikan.
      await client.query(`UPDATE ${schema}.taxonomy_revisions SET status = 'RETIRED' WHERE id = $1`, [
        active.id,
      ]);
      await client.query(
        `UPDATE ${schema}.taxonomy_revisions SET status = 'ACTIVE' WHERE id = $1`,
        [snapshot.id],
      );
      const restored = Number(snapshot.revision_number);
      await client.query(
        `UPDATE ${schema}.taxonomy_state SET
            active_revision_id = $1, active_revision_number = $2, export_required = true,
            updated_at = CURRENT_TIMESTAMP WHERE singleton = true`,
        [snapshot.id, restored],
      );
      if (activeStage.runtimeBefore) {
        const before = activeStage.runtimeBefore;
        await client.query(
          `INSERT INTO ${schema}.runtime_content_packages
             (package_id, package_kind, version, schema_version, status,
              access_level, source_ref, license_ref, checksum,
              rollback_reference, payload, published_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12)
           ON CONFLICT (package_id) DO UPDATE SET
             package_kind = EXCLUDED.package_kind,
             version = EXCLUDED.version,
             schema_version = EXCLUDED.schema_version,
             status = EXCLUDED.status,
             access_level = EXCLUDED.access_level,
             source_ref = EXCLUDED.source_ref,
             license_ref = EXCLUDED.license_ref,
             checksum = EXCLUDED.checksum,
             rollback_reference = EXCLUDED.rollback_reference,
             payload = EXCLUDED.payload,
             published_at = EXCLUDED.published_at,
             updated_at = CURRENT_TIMESTAMP`,
          [
            before.package_id,
            before.package_kind,
            before.version,
            before.schema_version,
            before.status,
            before.access_level,
            before.source_ref,
            before.license_ref,
            before.checksum,
            before.rollback_reference,
            JSON.stringify(before.payload),
            before.published_at,
          ],
        );
      } else {
        await client.query(
          `DELETE FROM ${schema}.runtime_content_packages
            WHERE package_id = $1 AND checksum = $2 AND status = 'PUBLISHED'`,
          [activeStage.packageId, activeStage.verifiedChecksum],
        );
      }
      await client.query(
        `INSERT INTO ${schema}.taxonomy_change_log
           (id, revision_number, actor_principal_id, action, node_id, impact)
         VALUES ($1,$2,$3,'RESTORE',NULL,$4::jsonb)`,
        [
          randomUUID(),
          restored,
          principal.id,
          JSON.stringify({ l08: true, from: active.number, reason: input.reason.slice(0, 500) }),
        ],
      );
      await client.query('COMMIT');
      return { activeRevision: restored, restoredRevision: restored };
    } catch (error) {
      await client.query('ROLLBACK');
      throw mapConstraintError(error);
    } finally {
      client.release();
    }
  }

  private async requireActiveRevision() {
    const revision = await this.activeRevision();
    if (!revision) throw new ApiError('DEPENDENCY_UNAVAILABLE', 'Struktur menu belum aktif');
    return revision;
  }

  private async breadcrumb(revisionId: string, nodeId: string) {
    const schema = quotedSchema(this.schemaName);
    const result = await this.pool.query<TaxonomyRow>(
      `WITH RECURSIVE parents AS (
         SELECT n.*, 0 AS distance FROM ${schema}.taxonomy_nodes n
          WHERE n.revision_id=$1 AND n.node_id=$2
         UNION ALL
         SELECT p.*, parents.distance+1 FROM ${schema}.taxonomy_nodes p
         JOIN parents ON parents.parent_id=p.node_id
         WHERE p.revision_id=$1 AND parents.distance < 7
       ) SELECT *, 0::bigint AS child_count FROM parents ORDER BY distance DESC`,
      [revisionId, nodeId],
    );
    return result.rows.map(publicNode);
  }
}

async function nodeForUpdate(
  client: PoolClient,
  schema: string,
  revisionId: string,
  nodeId: string,
) {
  const result = await client.query<TaxonomyRow>(
    `SELECT *, 0::bigint AS child_count FROM ${schema}.taxonomy_nodes
      WHERE revision_id=$1 AND node_id=$2 FOR UPDATE`,
    [revisionId, nodeId],
  );
  if (!result.rows[0]) throw new ApiError('NOT_FOUND', 'Node tidak ditemukan');
  return result.rows[0];
}

async function rewriteSubtreePaths(
  client: PoolClient,
  schema: string,
  revisionId: string,
  node: TaxonomyRow,
  parentId: string | null,
  localCode: string,
  slug: string,
  explicitParent?: TaxonomyRow,
) {
  let parent = explicitParent;
  if (!parent && parentId) parent = await nodeForUpdate(client, schema, revisionId, parentId);
  const nextCode = parent ? `${parent.path_code}.${localCode}` : localCode;
  const nextSlug = parent ? `${parent.path_slug}/${slug}` : slug;
  await client.query(
    `UPDATE ${schema}.taxonomy_nodes SET
       parent_id = CASE WHEN node_id=$2 THEN $3 ELSE parent_id END,
       local_code = CASE WHEN node_id=$2 THEN $4 ELSE local_code END,
       path_code = $5 || substring(path_code FROM length($6)+1),
       path_slug = $7 || substring(path_slug FROM length($8)+1),
       slug = CASE WHEN node_id=$2 THEN $9 ELSE slug END,
       version=version+1, updated_at=CURRENT_TIMESTAMP
     WHERE revision_id=$1 AND (node_id=$2 OR path_slug LIKE $8 || '/%')`,
    [
      revisionId,
      node.node_id,
      parentId,
      localCode,
      nextCode,
      node.path_code,
      nextSlug,
      node.path_slug,
      slug,
    ],
  );
}

async function subtreeCount(
  client: PoolClient,
  schema: string,
  revisionId: string,
  nodeId: string,
) {
  const result = await client.query<{ count: string }>(
    `WITH RECURSIVE subtree AS (
       SELECT node_id FROM ${schema}.taxonomy_nodes WHERE revision_id=$1 AND node_id=$2
       UNION ALL SELECT n.node_id FROM ${schema}.taxonomy_nodes n
       JOIN subtree s ON n.parent_id=s.node_id WHERE n.revision_id=$1
     ) SELECT count(*)::bigint AS count FROM subtree`,
    [revisionId, nodeId],
  );
  return Number(result.rows[0]?.count ?? 0);
}

function publicNode(row: TaxonomyRow) {
  return {
    id: row.node_id,
    parentId: row.parent_id,
    level: row.level,
    code: row.path_code,
    name: row.name,
    slug: row.slug,
    path: row.path_slug,
    order: Number(row.sort_order),
    status: row.lifecycle_status,
    empty: row.empty_marker !== null,
    childCount: Number(row.child_count ?? 0),
    articleCount: 0,
    version: Number(row.version),
    contentKind:
      typeof row.metadata?.contentKind === 'string' ? row.metadata.contentKind : undefined,
    softwareId: typeof row.metadata?.softwareId === 'string' ? row.metadata.softwareId : undefined,
  };
}

function normalizePath(value?: string) {
  if (!value) return '';
  const path = value.replace(/^\/+|\/+$/g, '');
  if (!PATH.test(path)) throw new ApiError('VALIDATION_FAILED', 'Path kategori tidak valid');
  return path;
}

function validateSlug(value: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || value.length > 240) {
    throw new ApiError('VALIDATION_FAILED', 'Slug tidak aman');
  }
}

function requireUuid(value: string) {
  if (!UUID.test(value)) throw new ApiError('VALIDATION_FAILED', 'ID tidak valid');
}

function requireOwner(principal: Principal) {
  if (principal.role !== 'OWNER' || principal.approvalStatus !== 'APPROVED') {
    throw new ApiError('ACCESS_DENIED', 'Hanya Admin yang dapat mengubah struktur');
  }
}

function createPackageSourceHash(
  packageId: string,
  version: string,
  nodes: Array<{ sourceNodeKey: string; parentKey: string | null; level: string; slug: string }>,
) {
  return createHash('sha256')
    .update(JSON.stringify({ packageId, version, nodes }), 'utf8')
    .digest('hex');
}

function encodeTreeCursor(order: number, id: string) {
  return Buffer.from(JSON.stringify({ order, id }), 'utf8').toString('base64url');
}

function decodeTreeCursor(value?: string | null) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as Record<
      string,
      unknown
    >;
    if (
      !Number.isSafeInteger(parsed.order) ||
      Number(parsed.order) < 0 ||
      typeof parsed.id !== 'string' ||
      !UUID.test(parsed.id)
    )
      throw new Error('shape');
    return { order: Number(parsed.order), id: parsed.id };
  } catch {
    throw new ApiError('VALIDATION_FAILED', 'Cursor taxonomy tidak valid');
  }
}

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, '\\$&');
}

function mapConstraintError(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
  if (['23503', '23505', '23514'].includes(code)) {
    return new ApiError('VALIDATION_FAILED', 'Perubahan melanggar struktur, kode, atau slug unik');
  }
  return error;
}
