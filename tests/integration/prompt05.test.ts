import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { Principal } from '@/contracts/services';
import { TaxonomyService } from '@/services/taxonomy';

// Jalur legacy R1–R5 txt sudah tidak ada di paket kontrol (diganti paket
// domain JSON L08). Suite legacy dilewati bila arsip absen; penggantinya:
// tests/integration/prompt05-package.test.ts.
const legacyPresent = fs.existsSync(
  path.resolve(process.cwd(), '..', 'Aturan/Rancangan-Offline/02-Menu-R1-R5/Menu-Aktif'),
);
const suite = legacyPresent ? describe.sequential : describe.skip;

const schema = 'test_prompt05';
const ownerId = '50000000-0000-4000-8000-000000000001';
const owner: Principal = {
  id: ownerId,
  role: 'OWNER',
  approvalStatus: 'APPROVED',
  entitlementStatus: 'NONE',
  socialStatus: 'ENABLED',
  fixture: true,
};
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'prompt05-integration-test',
});
const service = new TaxonomyService(pool, schema);
let stagedRevisionId = '';

beforeAll(async () => {
  if (!legacyPresent) return;
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await pool.query('DELETE FROM public.madevi_migration_history WHERE schema_name = $1', [schema]);
  runMigration();
  await pool.query(
    `INSERT INTO "${schema}".principals
       (id,business_code,kind,role,approval_status,entitlement_status,social_status,display_name,is_test)
     VALUES ($1,'TEST_OWNER_MENU','OWNER','OWNER','APPROVED','NONE','ENABLED','Admin Menu TEST',true)`,
    [ownerId],
  );
}, 120_000);

afterAll(async () => {
  if (!legacyPresent) return;
  await pool.end();
  const cleanup = new Pool({ connectionString: process.env.DATABASE_URL });
  await cleanup.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await cleanup.query('DELETE FROM public.madevi_migration_history WHERE schema_name = $1', [
    schema,
  ]);
  await cleanup.end();
});

suite('Prompt 05 staging, navigasi, editor, dan roundtrip', () => {
  it('mengimpor 13.029 node dalam batch dan resume idempoten', () => {
    const first = runTaxonomy('stage', '--expected-base', '0');
    expect(first).toMatchObject({ ok: true, loaded: 13_029, batches: 27, promoted: false });
    expect(first.validation).toMatchObject({
      ok: true,
      rootCount: 5,
      orphanCount: 0,
      childOfLeafCount: 0,
    });
    expect(first.diff).toEqual({ added: 13_029, removed: 0, changed: 0, unchanged: 0 });
    stagedRevisionId = String(first.revisionId);
    const resumed = runTaxonomy('stage', '--expected-base', '0');
    expect(resumed.revisionId).toBe(stagedRevisionId);
    expect(resumed.loaded).toBe(13_029);
  }, 120_000);

  it('menolak promosi tanpa konfirmasi lalu mempromosikan atomik dengan Admin', () => {
    expect(() =>
      runTaxonomy(
        'promote',
        '--revision',
        stagedRevisionId,
        '--expected-base',
        '0',
        '--actor',
        ownerId,
      ),
    ).toThrow(/confirm-owner/);
    const promoted = runTaxonomy(
      'promote',
      '--revision',
      stagedRevisionId,
      '--expected-base',
      '0',
      '--actor',
      ownerId,
      '--confirm-owner',
      'true',
    );
    expect(promoted).toMatchObject({ ok: true, previousRevision: 0 });
  });

  it('navigasi hanya memuat anak langsung, breadcrumb, search, cursor, dan empty J', async () => {
    const room = await service.browse({ path: 'pendidikan-dan-pembelajaran', limit: 3 });
    expect('children' in room && room.children).toHaveLength(3);
    expect('children' in room && room.children?.every((node) => node.level === 'D')).toBe(true);
    expect('page' in room && room.page?.nextCursor).toBeTruthy();
    const next = await service.browse({
      path: 'pendidikan-dan-pembelajaran',
      limit: 3,
      cursor: 'page' in room ? room.page?.nextCursor : null,
    });
    expect('children' in next && next.children?.[0]?.id).not.toBe(
      'children' in room ? room.children?.[0]?.id : '',
    );
    const search = await service.browse({
      path: 'pendidikan-dan-pembelajaran',
      query: 'motorik',
      limit: 10,
    });
    expect('children' in search && search.children?.length).toBeGreaterThan(0);
    expect('breadcrumb' in room && room.breadcrumb?.at(-1)?.level).toBe('R');
    const leaf = await pool.query(
      `SELECT path_slug FROM "${schema}".taxonomy_nodes WHERE level='J' LIMIT 1`,
    );
    const empty = await service.browse({ path: leaf.rows[0].path_slug, limit: 10 });
    expect('children' in empty && empty.children).toEqual([]);
  });

  it('preview dampak, move, alias redirect, arsip/pulih, dan stale revision aman', async () => {
    const selected = await pool.query(
      `SELECT child.node_id, target.node_id AS target_id
         FROM "${schema}".taxonomy_state state
         JOIN "${schema}".taxonomy_nodes child ON child.revision_id=state.active_revision_id AND child.path_code='R1.D1.K1'
         JOIN "${schema}".taxonomy_nodes target ON target.revision_id=state.active_revision_id AND target.path_code='R1.D2'`,
    );
    const nodeId = selected.rows[0].node_id;
    const targetId = selected.rows[0].target_id;
    const impact = await service.impact(owner, { nodeId, targetParentId: targetId });
    expect(impact.subtreeCount).toBeGreaterThan(1);
    expect(impact.nodeIdWillChange).toBe(false);
    const base = impact.revision;
    const moved = await service.mutate(owner, {
      action: 'MOVE',
      expectedRevision: base,
      confirmedImpact: true,
      nodeId,
      parentId: targetId,
    });
    expect(moved.impact).toMatchObject({ nodeIdPreserved: true });
    const alias = await service.browse({ path: impact.currentPath, limit: 10 });
    expect(alias).toHaveProperty('redirectPath');
    await expect(
      service.mutate(owner, {
        action: 'ARCHIVE',
        expectedRevision: base,
        confirmedImpact: true,
        nodeId,
      }),
    ).rejects.toMatchObject({ code: 'VERSION_CONFLICT' });
    const archived = await service.mutate(owner, {
      action: 'ARCHIVE',
      expectedRevision: moved.revision,
      confirmedImpact: true,
      nodeId,
    });
    const restored = await service.mutate(owner, {
      action: 'RESTORE',
      expectedRevision: archived.revision,
      confirmedImpact: true,
      nodeId,
    });
    expect(restored.revision).toBeGreaterThan(archived.revision);
  }, 120_000);

  it('export dan source roundtrip menghasilkan diff lalu konflik revision ditolak', async () => {
    const summary = await service.summary();
    const exported = await service.exportSnapshot(owner, summary.activeRevision!);
    expect(exported.nodeCount).toBe(13_029);
    expect(exported.exportRequired).toBe(true);
    const preview = runTaxonomy('preview', '--expected-base', String(summary.activeRevision));
    expect(preview.diff.changed).toBeGreaterThan(0);
    const staged = runTaxonomy('stage', '--expected-base', String(summary.activeRevision));
    expect(staged.validation.ok).toBe(true);
    expect(() =>
      runTaxonomy(
        'promote',
        '--revision',
        String(staged.revisionId),
        '--expected-base',
        String(summary.activeRevision! - 1),
        '--actor',
        ownerId,
        '--confirm-owner',
        'true',
      ),
    ).toThrow(/VERSION_CONFLICT/);
    const promoted = runTaxonomy(
      'promote',
      '--revision',
      String(staged.revisionId),
      '--expected-base',
      String(summary.activeRevision),
      '--actor',
      ownerId,
      '--confirm-owner',
      'true',
    );
    expect(promoted.revisionNumber).toBeGreaterThan(summary.activeRevision!);
    const finalSummary = await service.summary();
    expect(finalSummary.nodeCount).toBe(13_029);
    expect(finalSummary.exportRequired).toBe(false);
  }, 120_000);
});

function runMigration() {
  const result = spawnSync(process.execPath, ['scripts/migrate.mjs', 'up', '--schema', schema], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: process.env,
  });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
}

function runTaxonomy(command: string, ...args: string[]) {
  const result = spawnSync(
    process.execPath,
    ['scripts/taxonomy-import.mjs', command, '--schema', schema, ...args],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: process.env,
    },
  );
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}
