import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AdminService } from '@/services/admin';
import type { Principal } from '@/contracts/services';

const schema = 'test_prompt13';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'prompt13-test',
});
const owner: Principal = {
  id: 'd0000000-0000-4000-8000-000000000001',
  role: 'OWNER',
  approvalStatus: 'APPROVED',
  entitlementStatus: 'PAID',
  socialStatus: 'ENABLED',
  fixture: true,
};
let admin: AdminService;

beforeAll(async () => {
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await pool.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  for (const num of ['0001', '0002', '0003', '0004', '0013']) {
    const r = spawnSync(
      process.execPath,
      ['scripts/migrate.mjs', 'up', '--schema', schema, '--target', num],
      { cwd: process.cwd(), env: process.env, encoding: 'utf8' },
    );
    if (r.status !== 0) throw new Error(`Migrate ${num} gagal: ${(r.stderr || r.stdout).trim()}`);
  }
  await pool.query(
    `INSERT INTO "${schema}".principals (id,business_code,kind,role,approval_status,entitlement_status,social_status,display_name,username,is_test) VALUES ($1,'T13_OWNER','OWNER','OWNER','APPROVED','PAID','ENABLED','Owner13','owner13',true)`,
    [owner.id],
  );
  admin = new AdminService(pool, schema);
}, 120_000);

afterAll(async () => {
  await pool.end();
  const c = new Pool({ connectionString: process.env.DATABASE_URL });
  await c.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await c.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  await c.end();
});

describe.sequential('Prompt 13 — Admin Admin', () => {
  it('F13-01: audit log meredaksi data sensitif', async () => {
    const log = await admin.logAudit({
      principalId: owner.id,
      action: 'UPDATE',
      targetResource: 'USER',
      targetId: randomUUID(), // kolom target_id bertipe uuid
      result: 'SUCCESS',
      requestId: 'req-13',
      beforeState: { password: 'secret', name: 'A' },
      afterState: { password: 'newpass', name: 'B' },
    });
    const before = log.beforeState as Record<string, unknown>;
    const after = log.afterState as Record<string, unknown>;
    expect(before.password).toBe('[REDACTED]');
    expect(after.password).toBe('[REDACTED]');
    expect(after.name).toBe('B');
  });

  it('F13-02: dashboard summary tidak error', async () => {
    const s = await admin.getDashboardSummary();
    expect(s.stats).toBeDefined();
    expect(s.alerts).toBeInstanceOf(Array);
  });

  it('F13-03: admin session validasi dengan idle timeout', async () => {
    const token = randomUUID().replace(/-/g, '');
    await pool.query(
      `INSERT INTO "${schema}".admin_sessions (id,token_hash,principal_id,device_id,expires_at) VALUES ($1,$2,$3,$4,NOW()+INTERVAL '1 hour')`,
      [randomUUID(), token, owner.id, randomUUID()],
    );
    const valid = await admin.validateSession(token);
    expect(valid.isValid).toBe(true);
    expect(valid.needsReAuth).toBe(false);
  });

  it('F13-04: session expired memerlukan re-auth', async () => {
    const token = randomUUID().replace(/-/g, '');
    await pool.query(
      `INSERT INTO "${schema}".admin_sessions (id,token_hash,principal_id,device_id,expires_at) VALUES ($1,$2,$3,$4,NOW()-INTERVAL '1 minute')`,
      [randomUUID(), token, owner.id, randomUUID()],
    );
    const expired = await admin.validateSession(token);
    expect(expired.needsReAuth).toBe(true);
  });
});
