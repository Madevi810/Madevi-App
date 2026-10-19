import { spawnSync } from 'node:child_process';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { SecurityService } from '@/services/security';

const schema = 'test_prompt15';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'prompt15-test',
});
const ownerId = 'f1500000-0000-4000-8000-000000000001';
const reservationId = 'f1500000-0000-4000-8000-000000000002';
const fileId = 'f1500000-0000-4000-8000-000000000003';
let security: SecurityService;

beforeAll(async () => {
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await pool.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  for (const num of ['0001', '0002', '0003', '0004', '0015']) {
    const r = spawnSync(
      process.execPath,
      ['scripts/migrate.mjs', 'up', '--schema', schema, '--target', num],
      { cwd: process.cwd(), env: process.env, encoding: 'utf8' },
    );
    if (r.status !== 0) throw new Error(`Migrate ${num} gagal: ${(r.stderr || r.stdout).trim()}`);
  }
  await pool.query(
    `INSERT INTO "${schema}".principals
       (id, business_code, kind, role, approval_status, entitlement_status, social_status, display_name, is_test)
     VALUES ($1, 'TEST_P15_OWNER', 'OWNER', 'OWNER', 'APPROVED', 'PAID', 'ENABLED', 'Admin Security', true)`,
    [ownerId],
  );
  await pool.query(
    `INSERT INTO "${schema}".quota_accounts (principal_id, used_bytes) VALUES ($1, 10)`,
    [ownerId],
  );
  await pool.query(
    `INSERT INTO "${schema}".quota_reservations
       (id, principal_id, bytes, status, idempotency_key, expires_at, completed_at)
     VALUES ($1, $2, 10, 'COMMITTED', 'prompt15-file-fixture', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [reservationId, ownerId],
  );
  await pool.query(
    `INSERT INTO "${schema}".storage_objects
       (id, owner_principal_id, reservation_id, storage_state, assessment_status, relative_path, media_type, size_bytes, sha256, original_name, is_test)
     VALUES ($1, $2, $3, 'ACTIVE', 'SAFE', $4, 'application/octet-stream', 10, $5, 'fixture.bin', true)`,
    [fileId, ownerId, reservationId, `objects/${fileId}.bin`, '0'.repeat(64)],
  );
  security = new SecurityService(pool, schema);
}, 120_000);

afterAll(async () => {
  await pool.end();
  const c = new Pool({ connectionString: process.env.DATABASE_URL });
  await c.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await c.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  await c.end();
});

describe.sequential('Prompt 15 — Security', () => {
  it('F15-01: XSS payload diblokir', async () => {
    await expect(
      security.inspectPayload({ input: '<script>alert(1)</script>' }, '/api/test', '1.2.3.4'),
    ).rejects.toThrow('Blocked');
  });

  it('F15-02: payload aman diizinkan', async () => {
    const r = await security.inspectPayload({ input: 'hello world' }, '/api/test', '1.2.3.4');
    expect(r.safe).toBe(true);
  });

  it('F15-03: rate limit block after threshold', async () => {
    for (let i = 0; i < 101; i++) {
      await security.checkRateLimit('15.0.0.1');
    }
    const exceeded = await security.checkRateLimit('15.0.0.1');
    expect(exceeded.allowed).toBe(false);
    expect(exceeded.remaining).toBe(0);
  });

  it('F15-04: ancaman dicatat ke threat log', async () => {
    await expect(
      security.logThreat('SQLI_ATTEMPT', '1.2.3.4', '/api/login', "' OR 1=1--", undefined),
    ).resolves.not.toThrow();
    const rows = await pool.query(
      `SELECT COUNT(*) FROM "${schema}".security_threat_logs WHERE ip_address='1.2.3.4'`,
    );
    expect(parseInt(rows.rows[0].count, 10)).toBeGreaterThanOrEqual(1);
  });

  it('F15-05: karantina file', async () => {
    const q = await security.quarantineFile(fileId, 'Suspected malware in fixture.', ownerId);
    expect(q.status).toBe('QUARANTINED');
    expect(q.original_file_id).toBe(fileId);
  });
});
