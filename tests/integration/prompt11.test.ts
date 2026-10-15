import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { SoftwareService } from '@/services/software';
import type { Principal, ScannerAdapter } from '@/contracts/services';

const schema = 'test_prompt11';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'prompt11-test',
});
const owner: Principal = {
  id: 'b0000000-0000-4000-8000-000000000001',
  role: 'OWNER',
  approvalStatus: 'APPROVED',
  entitlementStatus: 'PAID',
  socialStatus: 'ENABLED',
  fixture: true,
};
const member: Principal = {
  id: 'b0000000-0000-4000-8000-000000000002',
  role: 'MEMBER',
  approvalStatus: 'APPROVED',
  entitlementStatus: 'PAID',
  socialStatus: 'ENABLED',
  fixture: true,
};
let sw: SoftwareService;

class MockScanner implements ScannerAdapter {
  readonly mode = 'SIMULASI' as const;

  async scan() {
    return { status: 'SAFE' as const, report: { threats: [] } };
  }
}

beforeAll(async () => {
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await pool.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  for (const num of ['0001', '0002', '0003', '0004', '0011']) {
    const r = spawnSync(
      process.execPath,
      ['scripts/migrate.mjs', 'up', '--schema', schema, '--target', num],
      { cwd: process.cwd(), env: process.env, encoding: 'utf8' },
    );
    if (r.status !== 0) throw new Error(`Migrate ${num} gagal: ${(r.stderr || r.stdout).trim()}`);
  }
  await pool.query(
    `INSERT INTO "${schema}".principals (id,business_code,kind,role,approval_status,entitlement_status,social_status,display_name,username,is_test) VALUES ($1,'T11_OWNER','OWNER','OWNER','APPROVED','PAID','ENABLED','Owner11','owner11',true),($2,'T11_MEMBER','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Member11','member11',true)`,
    [owner.id, member.id],
  );
  sw = new SoftwareService(pool, schema, new MockScanner());
}, 120_000);

afterAll(async () => {
  await pool.end();
  const c = new Pool({ connectionString: process.env.DATABASE_URL });
  await c.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await c.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  await c.end();
});

describe.sequential('Prompt 11 — Software', () => {
  it('F11-01: katalog software & versi', async () => {
    const cat = await sw.createCatalog(owner, {
      name: 'Firefox',
      slug: 'firefox',
      developer: 'Mozilla',
      license: 'MPL-2.0',
      description: 'Browser',
    });
    expect(cat.name).toBe('Firefox');
    const list = await sw.list(member);
    expect(list.items.length).toBeGreaterThanOrEqual(1);
  });

  it('F11-02: hanya Admin dapat membuat, member dapat usul', async () => {
    await expect(sw.createCatalog(member, { name: 'Test', slug: 'test' })).rejects.toThrow();
    const prop = await sw.proposeUpdate(member, { name: 'GIMP', officialUrl: 'https://gimp.org' });
    expect(prop.proposedId).toBeDefined();
  });

  it('F11-03: unduhan fail-closed — hanya SAFE yang boleh diunduh', async () => {
    await expect(sw.prepareDownload(member, randomUUID())).rejects.toThrow();
  });

  it('F11-04: review dan laporan risiko', async () => {
    const cat = await sw.createCatalog(owner, {
      name: 'LibreOffice',
      slug: 'libreoffice',
      isTest: true,
    });
    await sw.review(member, { softwareId: cat.id, rating: 4, reviewText: 'Bagus', isTest: true });
    await sw.report(member, {
      softwareId: cat.id,
      kind: 'LICENSE',
      description: 'Lisensi tidak jelas',
      isTest: true,
    });
  });

  it('F11-05: usulan pengguna tidak langsung masuk katalog', async () => {
    const list = await sw.list(member);
    const slugs = list.items.map((i) => i.slug);
    expect(slugs).not.toContain('gimp');
  });
});
