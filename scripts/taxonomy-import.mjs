import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import {
  createScriptPool,
  databaseScriptContext,
  parseOptions,
  printSafe,
  quoteIdentifier,
  safeSchema,
} from './lib/database.mjs';
import { hashCanonical, readTaxonomyPackage, readTaxonomySources } from './lib/taxonomy-source.mjs';

const command = process.argv[2];
const options = parseOptions(process.argv.slice(3));
const { root, config } = databaseScriptContext(import.meta.url);
const schemaName = safeSchema(options.schema);
const schema = quoteIdentifier(schemaName);
const pool = createScriptPool(config);
const menuRoot = path.resolve(root, '..', 'Aturan/Rancangan-Offline/02-Menu-R1-R5/Menu-Aktif');

try {
  await requireTaxonomySchema();
  if (command === 'preview') await preview();
  else if (command === 'stage') await stage();
  else if (command === 'status') await status();
  else if (command === 'promote') await promote();
  else if (command === 'abort') await abort();
  else if (command === 'export') await exportRevision();
  else throw new Error('Perintah taxonomy: preview | stage | status | promote | abort | export');
} finally {
  await pool.end();
}

async function requireTaxonomySchema() {
  const result = await pool.query('SELECT to_regclass($1) AS table_name', [
    `${schemaName}.taxonomy_revisions`,
  ]);
  if (!result.rows[0]?.table_name) throw new Error('Migrasi taxonomy 0005 belum diterapkan');
}

async function currentState(client = pool) {
  const result = await client.query(
    `SELECT active_revision_id, active_revision_number, export_required
       FROM ${schema}.taxonomy_state WHERE singleton = true`,
  );
  return result.rows[0] ?? { active_revision_id: null, active_revision_number: null };
}

function requiredExpectedBase() {
  const value = Number(options['expected-base']);
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error('--expected-base wajib integer >= 0');
  }
  return value;
}

async function preview() {
  const source = loadSource();
  const state = await currentState();
  const expectedBase = requiredExpectedBase();
  const active = Number(state.active_revision_number ?? 0);
  if (active !== expectedBase) throw new Error(`VERSION_CONFLICT: revisi aktif ${active}`);
  const diff = await diffAgainstActive(source.nodes, state.active_revision_id);
  printSafe({
    ok: true,
    command,
    schema: schemaName,
    expectedBase,
    sourceHash: source.sourceHash,
    sourceFiles: source.sourceManifest,
    nodeCount: source.nodes.length,
    diff,
    requiresOwnerConfirmation: true,
  });
}

async function stage() {
  const source = loadSource();
  const expectedBase = requiredExpectedBase();
  const state = await currentState();
  const active = Number(state.active_revision_number ?? 0);
  if (active !== expectedBase) throw new Error(`VERSION_CONFLICT: revisi aktif ${active}`);
  let revision = await pool.query(
    `SELECT id, revision_number, loaded_node_count, batch_cursor
       FROM ${schema}.taxonomy_revisions
      WHERE source_hash = $1 AND status = 'STAGING'`,
    [source.sourceHash],
  );
  if (!revision.rows[0]) {
    const created = await pool.query(
      `INSERT INTO ${schema}.taxonomy_revisions
         (id, base_revision_number, source_hash, source_manifest, expected_node_count)
       VALUES ($1, $2, $3, $4::jsonb, $5)
       RETURNING id, revision_number, loaded_node_count, batch_cursor`,
      [
        crypto.randomUUID(),
        expectedBase || null,
        source.sourceHash,
        JSON.stringify(source.sourceManifest),
        source.nodes.length,
      ],
    );
    revision = created;
  }
  const row = revision.rows[0];
  const batchSize = 500;
  for (let offset = 0; offset < source.nodes.length; offset += batchSize) {
    const batchNumber = Math.floor(offset / batchSize);
    const nodes = source.nodes.slice(offset, offset + batchSize);
    const batchHash = hashCanonical(nodes);
    const existing = await pool.query(
      `SELECT batch_hash, node_count FROM ${schema}.taxonomy_import_batches
        WHERE revision_id = $1 AND batch_number = $2`,
      [row.id, batchNumber],
    );
    if (existing.rows[0]) {
      if (
        existing.rows[0].batch_hash !== batchHash ||
        Number(existing.rows[0].node_count) !== nodes.length
      ) {
        throw new Error(`Batch ${batchNumber} berbeda dari checkpoint; staging dibatalkan aman`);
      }
      continue;
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const stableJson = JSON.stringify(
        nodes.map((node) => ({ source_key: node.sourceKey, node_id: node.nodeId })),
      );
      const mismatch = await client.query(
        `SELECT incoming.source_key
           FROM jsonb_to_recordset($1::jsonb) AS incoming(source_key text, node_id uuid)
           JOIN ${schema}.taxonomy_stable_ids stable USING (source_key)
          WHERE stable.node_id <> incoming.node_id LIMIT 1`,
        [stableJson],
      );
      if (mismatch.rows[0]) {
        throw new Error(`Stable ID source berbeda: ${mismatch.rows[0].source_key}`);
      }
      await client.query(
        `INSERT INTO ${schema}.taxonomy_stable_ids (source_key, node_id)
         SELECT source_key, node_id FROM jsonb_to_recordset($1::jsonb)
           AS incoming(source_key text, node_id uuid)
         ON CONFLICT (source_key) DO NOTHING`,
        [stableJson],
      );
      const nodeJson = JSON.stringify(
        nodes.map((node) => ({
          node_id: node.nodeId,
          parent_id: node.parentId,
          level: node.level,
          local_code: node.localCode,
          path_code: node.pathCode,
          name: node.name,
          slug: node.slug,
          path_slug: node.pathSlug,
          sort_order: node.sortOrder,
          visibility: node.visibility,
          lifecycle_status: node.lifecycleStatus,
          empty_marker: node.emptyMarker,
          source_file: node.sourceFile,
          source_line: node.sourceLine,
          source_virtual_path: node.sourceVirtualPath,
          metadata: node.metadata,
        })),
      );
      await client.query(
        `INSERT INTO ${schema}.taxonomy_nodes
           (revision_id, node_id, parent_id, level, local_code, path_code, name, slug,
            path_slug, sort_order, visibility, lifecycle_status, empty_marker,
            source_file, source_line, source_virtual_path, metadata)
         SELECT $1, incoming.* FROM jsonb_to_recordset($2::jsonb) AS incoming(
           node_id uuid, parent_id uuid, level text, local_code text, path_code text,
           name text, slug text, path_slug text, sort_order integer, visibility text,
           lifecycle_status text, empty_marker text, source_file text, source_line integer,
           source_virtual_path text, metadata jsonb
         )`,
        [row.id, nodeJson],
      );
      await client.query(
        `INSERT INTO ${schema}.taxonomy_import_batches
           (revision_id, batch_number, batch_hash, first_offset, node_count)
         VALUES ($1,$2,$3,$4,$5)`,
        [row.id, batchNumber, batchHash, offset, nodes.length],
      );
      await client.query(
        `UPDATE ${schema}.taxonomy_revisions
            SET loaded_node_count = loaded_node_count + $2, batch_cursor = $3
          WHERE id = $1`,
        [row.id, nodes.length, offset + nodes.length],
      );
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  const report = await validateRevision(row.id, source.nodes.length, expectedRoots(source));
  await pool.query(
    `UPDATE ${schema}.taxonomy_revisions SET validation_report = $2::jsonb WHERE id = $1`,
    [row.id, JSON.stringify(report)],
  );
  const diff = await diffAgainstActive(source.nodes, state.active_revision_id);
  printSafe({
    ok: report.ok,
    command,
    schema: schemaName,
    revisionId: row.id,
    revisionNumber: Number(row.revision_number),
    loaded: report.nodeCount,
    batches: Math.ceil(source.nodes.length / batchSize),
    sourceHash: source.sourceHash,
    diff,
    validation: report,
    promoted: false,
    requiresOwnerConfirmation: true,
  });
}

async function validateRevision(revisionId, expectedCount, expectedRoots = 5) {
  const result = await pool.query(
    `SELECT count(*)::int AS node_count,
            count(*) FILTER (WHERE level = 'R')::int AS root_count,
            count(*) FILTER (WHERE level = 'J')::int AS leaf_count,
            count(*) FILTER (WHERE parent_id IS NOT NULL AND parent_id NOT IN
              (SELECT node_id FROM ${schema}.taxonomy_nodes WHERE revision_id = $1))::int AS orphan_count,
            count(*) FILTER (WHERE parent_id IN
              (SELECT node_id FROM ${schema}.taxonomy_nodes WHERE revision_id = $1 AND level = 'J'))::int AS child_of_leaf_count
       FROM ${schema}.taxonomy_nodes WHERE revision_id = $1`,
    [revisionId],
  );
  const row = result.rows[0];
  const report = {
    nodeCount: Number(row.node_count),
    rootCount: Number(row.root_count),
    leafCount: Number(row.leaf_count),
    orphanCount: Number(row.orphan_count),
    childOfLeafCount: Number(row.child_of_leaf_count),
  };
  return {
    ok:
      report.nodeCount === expectedCount &&
      report.rootCount === expectedRoots &&
      report.orphanCount === 0 &&
      report.childOfLeafCount === 0,
    ...report,
  };
}

/**
 * Sumber taxonomy ganda (D02, Amandemen MASTER 2026-09-23):
 * - `--package <release.json>` → paket domain JSON L08 (kanonis baru);
 * - tanpa flag → arsip txt legacy R1–R5 (kadaluwarsa; pesan jelas bila hilang).
 */
function loadSource() {
  const packagePath = options.package;
  if (packagePath) return readTaxonomyPackage(packagePath);
  try {
    return readTaxonomySources(menuRoot);
  } catch (error) {
    if (error?.code === 'ENOENT')
      throw new Error(
        `Sumber taxonomy legacy hilang (${error.path}); gunakan --package <database/seeds/taxonomy/packages/taxonomy/*.json>`,
      );
    throw error;
  }
}

/** Jumlah root harapan dari sumber (legacy selalu 5; paket sesuai isi). */
function expectedRoots(source) {
  if (typeof source.rootCount === 'number') return source.rootCount;
  return 5;
}

async function diffAgainstActive(nodes, activeRevisionId) {
  if (!activeRevisionId) return { added: nodes.length, removed: 0, changed: 0, unchanged: 0 };
  const result = await pool.query(
    `SELECT node_id, parent_id, path_code, name, path_slug, sort_order, lifecycle_status
       FROM ${schema}.taxonomy_nodes WHERE revision_id = $1`,
    [activeRevisionId],
  );
  const previous = new Map(result.rows.map((row) => [row.node_id, row]));
  let added = 0;
  let changed = 0;
  let unchanged = 0;
  for (const node of nodes) {
    const old = previous.get(node.nodeId);
    if (!old) added += 1;
    else {
      previous.delete(node.nodeId);
      const different =
        old.parent_id !== node.parentId ||
        old.path_code !== node.pathCode ||
        old.name !== node.name ||
        old.path_slug !== node.pathSlug ||
        Number(old.sort_order) !== node.sortOrder ||
        old.lifecycle_status !== node.lifecycleStatus;
      if (different) changed += 1;
      else unchanged += 1;
    }
  }
  return { added, removed: previous.size, changed, unchanged };
}

async function status() {
  const state = await currentState();
  const revisions = await pool.query(
    `SELECT id, revision_number, base_revision_number, status, source_hash,
            expected_node_count, loaded_node_count, batch_cursor, validation_report,
            created_at, promoted_at
       FROM ${schema}.taxonomy_revisions ORDER BY revision_number DESC LIMIT 20`,
  );
  printSafe({ ok: true, command, schema: schemaName, state, revisions: revisions.rows });
}

async function promote() {
  if (options['confirm-owner'] !== 'true')
    throw new Error('Promosi memerlukan --confirm-owner true');
  const revisionId = requiredUuid(options.revision, '--revision');
  const actorId = requiredUuid(options.actor, '--actor');
  const expectedBase = requiredExpectedBase();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`taxonomy:${schemaName}`]);
    const state = await currentState(client);
    const active = Number(state.active_revision_number ?? 0);
    if (active !== expectedBase) throw new Error(`VERSION_CONFLICT: revisi aktif ${active}`);
    const selected = await client.query(
      `SELECT revision_number, expected_node_count, loaded_node_count, validation_report
         FROM ${schema}.taxonomy_revisions WHERE id = $1 AND status = 'STAGING' FOR UPDATE`,
      [revisionId],
    );
    const revision = selected.rows[0];
    if (!revision) throw new Error('Staging revision tidak ditemukan');
    if (
      Number(revision.expected_node_count) !== Number(revision.loaded_node_count) ||
      revision.validation_report?.ok !== true
    ) {
      throw new Error('Staging belum lengkap atau valid');
    }
    if (state.active_revision_id) {
      await client.query(
        `INSERT INTO ${schema}.taxonomy_aliases (alias_path, target_node_id, created_in_revision)
         SELECT old.path_slug, old.node_id, $3
           FROM ${schema}.taxonomy_nodes old
           JOIN ${schema}.taxonomy_nodes fresh
             ON fresh.revision_id = $1 AND fresh.node_id = old.node_id
          WHERE old.revision_id = $2 AND old.path_slug <> fresh.path_slug
         ON CONFLICT (alias_path) DO UPDATE
           SET target_node_id = EXCLUDED.target_node_id,
               created_in_revision = EXCLUDED.created_in_revision,
               retired_at = NULL`,
        [revisionId, state.active_revision_id, revision.revision_number],
      );
      await client.query(
        `UPDATE ${schema}.taxonomy_revisions SET status = 'RETIRED'
          WHERE id = $1 AND status = 'ACTIVE'`,
        [state.active_revision_id],
      );
    }
    await client.query(
      `UPDATE ${schema}.taxonomy_revisions
          SET status = 'ACTIVE', promoted_at = CURRENT_TIMESTAMP, created_by = COALESCE(created_by, $2)
        WHERE id = $1`,
      [revisionId, actorId],
    );
    await client.query(
      `UPDATE ${schema}.taxonomy_state
          SET active_revision_id = $1, active_revision_number = $2,
              export_required = false, updated_at = CURRENT_TIMESTAMP
        WHERE singleton = true`,
      [revisionId, revision.revision_number],
    );
    await projectTaxonomySearch(client, revisionId);
    await client.query(
      `INSERT INTO ${schema}.taxonomy_change_log
         (id, revision_number, actor_principal_id, action, impact)
       VALUES ($1,$2,$3,'PROMOTE',$4::jsonb)`,
      [crypto.randomUUID(), revision.revision_number, actorId, JSON.stringify({ expectedBase })],
    );
    await client.query('COMMIT');
    printSafe({
      ok: true,
      command,
      schema: schemaName,
      revisionId,
      revisionNumber: Number(revision.revision_number),
      previousRevision: active,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * D08: proyeksikan node revisi yang dipromosikan ke indeks search (MENU).
 * Cerminan SQL dari SearchProjectionService.projectBaseMenu (script tidak
 * memuat TS): idempoten via source_key `TAXONOMY:<node_id>`, target
 * `/ruang/<path_slug>` ikut whitelist L06, entry basi dinonaktifkan.
 * Ruang: R1 → school, R7 → tutorial, sisanya explore (pemetaan final di CONTENT-PLAN).
 */
async function projectTaxonomySearch(client, revisionId) {
  await client.query(
    `INSERT INTO ${schema}.search_index_entries
       (id, entry_type, object_id, title, slug, summary, searchable_body,
        access_level, source_key, language, is_indexed, is_test,
        space_key, target_href, subject_principal_id, visibility, publication_state)
     SELECT gen_random_uuid(), 'MENU', n.node_id,
            left(n.name, 220), n.slug, left(n.name, 500),
            left(n.name || E'\n' || n.path_slug, 100000),
            'PUBLIC', 'TAXONOMY:' || n.node_id::text, 'id',
            ('/ruang/' || n.path_slug) ~ '^/ruang/[a-z0-9][a-z0-9/-]{0,120}$',
            false,
            CASE split_part(n.path_code, '.', 1)
              WHEN 'R1' THEN 'school'
              WHEN 'R7' THEN 'tutorial'
              ELSE 'explore' END,
            '/ruang/' || n.path_slug, NULL, 'PUBLIC', 'PUBLISHED'
       FROM ${schema}.taxonomy_nodes n
      WHERE n.revision_id = $1 AND n.lifecycle_status = 'ACTIVE'
     ON CONFLICT (source_key) DO UPDATE SET
       entry_type = EXCLUDED.entry_type,
       object_id = EXCLUDED.object_id,
       title = EXCLUDED.title,
       slug = EXCLUDED.slug,
       summary = EXCLUDED.summary,
       searchable_body = EXCLUDED.searchable_body,
       access_level = EXCLUDED.access_level,
       language = EXCLUDED.language,
       is_indexed = EXCLUDED.is_indexed,
       space_key = EXCLUDED.space_key,
       target_href = EXCLUDED.target_href,
       subject_principal_id = EXCLUDED.subject_principal_id,
       visibility = EXCLUDED.visibility,
       publication_state = EXCLUDED.publication_state,
       updated_at = CURRENT_TIMESTAMP`,
    [revisionId],
  );
  await client.query(
    `UPDATE ${schema}.search_index_entries
        SET is_indexed = false, publication_state = 'ARCHIVED',
            updated_at = CURRENT_TIMESTAMP
      WHERE source_key LIKE 'TAXONOMY:%'
        AND object_id NOT IN (
          SELECT node_id FROM ${schema}.taxonomy_nodes WHERE revision_id = $1
        )`,
    [revisionId],
  );
}

async function abort() {
  const revisionId = requiredUuid(options.revision, '--revision');
  const result = await pool.query(
    `UPDATE ${schema}.taxonomy_revisions SET status = 'ABORTED'
      WHERE id = $1 AND status = 'STAGING' RETURNING revision_number`,
    [revisionId],
  );
  if (!result.rows[0]) throw new Error('Staging revision tidak ditemukan');
  printSafe({ ok: true, command, schema: schemaName, revisionId });
}

async function exportRevision() {
  const state = await currentState();
  if (!state.active_revision_id) throw new Error('Belum ada taxonomy aktif');
  const result = await pool.query(
    `SELECT node_id, parent_id, level, local_code, path_code, name, slug, path_slug,
            sort_order, visibility, lifecycle_status, empty_marker, source_file,
            source_line, source_virtual_path, metadata, version
       FROM ${schema}.taxonomy_nodes WHERE revision_id = $1 ORDER BY path_code`,
    [state.active_revision_id],
  );
  const bundle = {
    schemaVersion: 1,
    revision: Number(state.active_revision_number),
    nodeCount: result.rows.length,
    nodes: result.rows,
  };
  const manifest = { ...bundle, sha256: hashCanonical(bundle) };
  const output = options.output;
  if (!output) throw new Error('--output wajib diberikan');
  const resolved = path.resolve(output);
  const exportRoot = path.resolve(root, 'database/seeds/taxonomy');
  if (!(resolved === exportRoot || resolved.startsWith(`${exportRoot}${path.sep}`))) {
    throw new Error('Output export wajib berada di database/seeds/taxonomy');
  }
  fs.mkdirSync(path.dirname(resolved), { recursive: true, mode: 0o700 });
  fs.writeFileSync(resolved, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  await pool.query(
    `INSERT INTO ${schema}.taxonomy_change_log
       (id, revision_number, action, impact)
     VALUES ($1,$2,'EXPORT',$3::jsonb)`,
    [
      crypto.randomUUID(),
      state.active_revision_number,
      JSON.stringify({ sha256: manifest.sha256, nodeCount: result.rows.length }),
    ],
  );
  printSafe({
    ok: true,
    command,
    schema: schemaName,
    revision: manifest.revision,
    nodeCount: manifest.nodeCount,
    sha256: manifest.sha256,
    output: resolved,
  });
}

function requiredUuid(value, label) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value ?? '')
  ) {
    throw new Error(`${label} wajib UUID`);
  }
  return value.toLowerCase();
}
