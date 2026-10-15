import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { Principal } from '@/contracts/services';
import { TaxonomyService } from '@/services/taxonomy';

const schema = 'test_prompt05_pkg';
const ownerId = '50000000-0000-4000-8000-000000000002';
const owner: Principal = {
  id: ownerId,
  role: 'OWNER',
  approvalStatus: 'APPROVED',
  entitlementStatus: 'NONE',
  socialStatus: 'ENABLED',
  fixture: true,
};
// D02: paket taxonomy kanonis kini di dalam proyek (database/seeds/taxonomy);
// folder Menu/ di luar proyek sudah dipensiunkan (lihat memory/STATE.md).
const packagePath = path.resolve(
  process.cwd(),
  'database/seeds/taxonomy/madevi-explore-pilot-v1.json',
);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'prompt05-package-integration-test',
});
const service = new TaxonomyService(pool, schema);
let stagedRevisionId = '';

beforeAll(async () => {
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await pool.query('DELETE FROM public.madevi_migration_history WHERE schema_name = $1', [schema]);
  runMigration();
  await pool.query(
    `INSERT INTO "${schema}".principals
       (id,business_code,kind,role,approval_status,entitlement_status,social_status,display_name,is_test)
      VALUES ($1,'TEST_OWNER_PKG','OWNER','OWNER','APPROVED','NONE','ENABLED','Admin Paket TEST',true)`,
    [ownerId],
  );
}, 120_000);

afterAll(async () => {
  await pool.end();
  const cleanup = new Pool({ connectionString: process.env.DATABASE_URL });
  await cleanup.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await cleanup.query('DELETE FROM public.madevi_migration_history WHERE schema_name = $1', [
    schema,
  ]);
  await cleanup.end();
});

describe.sequential('Prompt 05 paket L08: staging, navigasi, dan roundtrip', () => {
  it('mengimpor 16 node pilot dalam 1 batch dan resume idempoten', () => {
    const first = runTaxonomy('stage', '--expected-base', '0');
    expect(first).toMatchObject({ ok: true, loaded: 16, batches: 1, promoted: false });
    expect(first.validation).toMatchObject({
      ok: true,
      rootCount: 1,
      leafCount: 3,
      orphanCount: 0,
      childOfLeafCount: 0,
    });
    expect(first.diff).toEqual({ added: 16, removed: 0, changed: 0, unchanged: 0 });
    stagedRevisionId = String(first.revisionId);
    const resumed = runTaxonomy('stage', '--expected-base', '0');
    expect(resumed.revisionId).toBe(stagedRevisionId);
    expect(resumed.loaded).toBe(16);
  }, 120_000);

  it('menolak promosi tanpa konfirmasi lalu mempromosikan atomik', () => {
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

  it('promosi memproyeksikan node ke indeks search dengan deep-link kanonis', async () => {
    const entries = await pool.query(
      `SELECT entry_type, title, target_href, space_key, is_indexed
         FROM "${schema}".search_index_entries
        WHERE source_key LIKE 'TAXONOMY:%' AND is_indexed = true`,
    );
    expect(entries.rowCount).toBe(16);
    expect(entries.rows.every((row) => row.entry_type === 'MENU')).toBe(true);
    expect(
      entries.rows.every((row) => /^\/ruang\/[a-z0-9][a-z0-9/-]{0,120}$/.test(row.target_href)),
    ).toBe(true);
    const cuaca = entries.rows.filter((row) => row.title === 'Cuaca');
    expect(cuaca).toHaveLength(1);
    expect(cuaca[0].target_href).toBe('/ruang/jelajahi-pengetahuan/sains-alam/pengamatan/cuaca');
  });

  it('navigasi ruang Explore: 3 domain anak langsung, breadcrumb, dan leaf kosong', async () => {
    const room = await service.browse({ path: 'jelajahi-pengetahuan', limit: 2 });
    expect('children' in room && room.children).toHaveLength(2);
    expect('children' in room && room.children?.every((node) => node.level === 'D')).toBe(true);
    expect('page' in room && room.page?.nextCursor).toBeTruthy();
    const next = await service.browse({
      path: 'jelajahi-pengetahuan',
      limit: 2,
      cursor: 'page' in room ? room.page?.nextCursor : null,
    });
    expect('children' in next && next.children).toHaveLength(1);
    expect('breadcrumb' in room && room.breadcrumb?.at(-1)?.level).toBe('R');
    const leaf = await pool.query(
      `SELECT path_slug FROM "${schema}".taxonomy_nodes WHERE level='J' LIMIT 1`,
    );
    const empty = await service.browse({ path: leaf.rows[0].path_slug, limit: 10 });
    expect('children' in empty && empty.children).toEqual([]);
  });

  it('export dan preview ulang: diff nol dan konflik revision ditolak', async () => {
    const summary = await service.summary();
    const exported = await service.exportSnapshot(owner, summary.activeRevision!);
    expect(exported.nodeCount).toBe(16);
    const preview = runTaxonomy('preview', '--expected-base', String(summary.activeRevision));
    expect(preview.diff).toEqual({ added: 0, removed: 0, changed: 0, unchanged: 16 });
    expect(() =>
      runTaxonomy(
        'promote',
        '--revision',
        String(stagedRevisionId),
        '--expected-base',
        '0',
        '--actor',
        ownerId,
        '--confirm-owner',
        'true',
      ),
    ).toThrow(/VERSION_CONFLICT/);
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
    ['scripts/taxonomy-import.mjs', command, '--schema', schema, '--package', packagePath, ...args],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: process.env,
    },
  );
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}
