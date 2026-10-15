import { spawnSync } from 'node:child_process';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { OperasiService } from '@/services/operasi';

const schema = 'test_prompt14';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'prompt14-test',
});
const testPrincipalId = 'e0000000-0000-4000-8000-000000000001';
let ops: OperasiService;

beforeAll(async () => {
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await pool.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  for (const num of ['0001', '0002', '0003', '0004', '0014']) {
    const r = spawnSync(
      process.execPath,
      ['scripts/migrate.mjs', 'up', '--schema', schema, '--target', num],
      { cwd: process.cwd(), env: process.env, encoding: 'utf8' },
    );
    if (r.status !== 0) throw new Error(`Migrate ${num} gagal: ${(r.stderr || r.stdout).trim()}`);
  }
  await pool.query(
    `INSERT INTO "${schema}".principals (id,business_code,kind,role,approval_status,entitlement_status,social_status,display_name,username,is_test) VALUES ($1,'T14_USER','MEMBER','MEMBER','APPROVED','PAID','ENABLED','User14','user14',true)`,
    [testPrincipalId],
  );
  ops = new OperasiService(pool, schema);
}, 120_000);

afterAll(async () => {
  await pool.end();
  const c = new Pool({ connectionString: process.env.DATABASE_URL });
  await c.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await c.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  await c.end();
});

describe.sequential('Prompt 14 — Operasi', () => {
  it('F14-01: queue email idempoten', async () => {
    const key = 'email-key-14';
    const e1 = await ops.queueEmail({
      recipientEmail: 'test@madevi.dev',
      templateId: 'VERIFY',
      templateData: { code: '123' },
      idempotencyKey: key,
    });
    const e2 = await ops.queueEmail({
      recipientEmail: 'test@madevi.dev',
      templateId: 'VERIFY',
      templateData: { code: '456' },
      idempotencyKey: key,
    });
    expect(e1.id).toBe(e2.id);
    expect(e1.status).toBe('PENDING');
  });

  it('F14-02: health check matrix', async () => {
    const h = await ops.getSystemHealth();
    expect(h.status).toBe('OK');
    expect(h.components.database).toBe('UP');
  });

  it('F14-03: log aktivitas tercatat', async () => {
    await expect(
      ops.logUserActivity(testPrincipalId, 'LOGIN_TEST', '127.0.0.1', 'vitest'),
    ).resolves.not.toThrow();
  });

  it('F14-04: backup trigger simulasi tidak error', async () => {
    const b = await ops.triggerBackup('FULL');
    expect(b.status).toBe('IN_PROGRESS');
    expect(b.type).toBe('FULL');
  });
});
