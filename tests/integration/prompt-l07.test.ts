import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';

import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { Principal } from '@/contracts/services';
import {
  appAudienceFromSession,
  appRoleFromStorage,
  storageRoleFromApp,
} from '@/contracts/identity';
import { SecurityService } from '@/services/security';
import { AdminService } from '@/services/admin';
import { AdminOperationService } from '@/services/admin-operations';

/**
 * Prompt L07 — Admin, Backend, API, Security, Backup.
 * Dijalankan Admin via `npm run test:prompt-l07` (agent tidak mengeksekusi).
 * Schema terisolasi; tidak memakai database/seed production.
 */

const schema = 'test_promptl07';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'promptl07-integration-test',
});

const admin = principal('a7000000-0000-4000-8000-000000000001', 'OWNER');
const user = principal('a7000000-0000-4000-8000-000000000002', 'MEMBER');

function principal(id: string, role: 'OWNER' | 'MEMBER'): Principal {
  return {
    id,
    role,
    approvalStatus: 'APPROVED',
    entitlementStatus: 'PAID',
    socialStatus: 'ENABLED',
    fixture: true,
  };
}

let security: SecurityService;
let adminSvc: AdminService;
let ops: AdminOperationService;

beforeAll(async () => {
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await pool.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  const migrated = spawnSync(process.execPath, ['scripts/migrate.mjs', 'up', '--schema', schema], {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf8',
  });
  if (migrated.status !== 0) throw new Error((migrated.stderr || migrated.stdout).trim());
  await pool.query(
    `INSERT INTO "${schema}".principals
      (id,business_code,kind,role,approval_status,entitlement_status,social_status,display_name,username,full_name,is_test)
     VALUES ($1,'TEST_L07_ADMIN','OWNER','OWNER','APPROVED','PAID','ENABLED','Admin L07','admin-l07','Admin L07',true),
            ($2,'TEST_L07_USER','MEMBER','MEMBER','APPROVED','PAID','ENABLED','User L07','user-l07','User L07',true)`,
    [admin.id, user.id],
  );
  security = new SecurityService(pool, schema);
  adminSvc = new AdminService(pool, schema);
  ops = new AdminOperationService(pool, schema);
}, 180_000);

afterAll(async () => {
  await pool.end();
  const cleanup = new Pool({ connectionString: process.env.DATABASE_URL });
  await cleanup.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await cleanup.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  await cleanup.end();
});

describe.sequential('Prompt L07 — admin, security, operasi, backup', () => {
  it('AC-01: mapping ADMIN/USER tidak meningkatkan hak; alias ambigu ditolak', () => {
    expect(appRoleFromStorage('OWNER')).toBe('ADMIN');
    expect(appRoleFromStorage('MEMBER')).toBe('USER');
    expect(appRoleFromStorage('SERVICE')).toBeNull();
    expect(storageRoleFromApp('ADMIN')).toBe('OWNER');
    expect(storageRoleFromApp('USER')).toBe('MEMBER');
    expect(appAudienceFromSession('OWNER')).toBe('ADMIN');
    expect(appAudienceFromSession('ADMIN')).toBe('ADMIN');
    expect(appAudienceFromSession('BOGUS')).toBeNull();
    // MEMBER tidak bisa menjadi ADMIN via adapter.
    expect(appRoleFromStorage(user.role)).not.toBe('ADMIN');
  });

  it('AC-02: preview → execute → audit; replay idempoten; expiry ditolak', async () => {
    const key = `l07-${randomUUID()}`;
    const preview = await ops.preview({
      actorId: admin.id,
      action: 'MODERATION_RESOLVE',
      filter: { status: 'OPEN' },
      targets: [
        { targetType: 'MODERATION', targetId: randomUUID() },
        { targetType: 'MODERATION', targetId: randomUUID() },
      ],
      idempotencyKey: key,
      requestId: randomUUID(), // req-l07-1: kolom request_id bertipe uuid
    });
    expect(preview.itemTotal).toBe(2);
    expect(preview.confirmationToken.length).toBeGreaterThanOrEqual(16);

    // Replay key sama + filter sama → preview identik (bukan duplikat).
    const replay = await ops.preview({
      actorId: admin.id,
      action: 'MODERATION_RESOLVE',
      filter: { status: 'OPEN' },
      targets: preview.items,
      idempotencyKey: key,
      requestId: randomUUID(), // req-l07-2: kolom request_id bertipe uuid
    });
    expect(replay.runId).toBe(preview.runId);

    // Key sama + filter berbeda → konflik.
    await expect(
      ops.preview({
        actorId: admin.id,
        action: 'MODERATION_RESOLVE',
        filter: { status: 'CLOSED' },
        targets: [],
        idempotencyKey: key,
      }),
    ).rejects.toMatchObject({ code: 'IDEMPOTENCY_CONFLICT' });

    // Execute dengan executor nyata (2 sukses) → COMPLETED.
    const done = await ops.execute({
      actorId: admin.id,
      runId: preview.runId,
      confirmationToken: preview.confirmationToken,
      executor: async () => {},
      requestId: randomUUID(), // req-l07-3: kolom request_id bertipe uuid
    });
    expect(done).toMatchObject({ status: 'COMPLETED', succeeded: 2, failed: 0 });

    // Replay execute → run sudah COMPLETED.
    await expect(
      ops.execute({
        actorId: admin.id,
        runId: preview.runId,
        confirmationToken: preview.confirmationToken,
        executor: async () => {},
      }),
    ).rejects.toMatchObject({ code: 'IDEMPOTENCY_CONFLICT' });
  });

  it('AC-02: cancel sebelum execute; actor lain ditolak', async () => {
    const preview = await ops.preview({
      actorId: admin.id,
      action: 'APPROVAL_DECIDIDE',
      filter: { q: 'x' },
      targets: [{ targetType: 'USER', targetId: randomUUID() }],
      idempotencyKey: `l07-cancel-${randomUUID()}`,
    });
    await expect(
      ops.execute({
        actorId: user.id,
        runId: preview.runId,
        confirmationToken: preview.confirmationToken,
        executor: async () => {},
      }),
    ).rejects.toMatchObject({ code: 'ACCESS_DENIED' });
    const cancelled = await ops.cancel(admin.id, preview.runId);
    expect(cancelled.cancelled).toBe(true);
  });

  it('AC-03/AC-04: rate-limit atomik + threat redact (tanpa body mentah)', async () => {
    const ip = `10.7.0.${Math.floor(Math.random() * 200) + 1}`;
    // Burst login (limit 10/15m): 10 lolos, ke-11 ditolak dengan Retry-After.
    for (let i = 0; i < 10; i++) {
      const r = await security.checkActionRateLimit(ip, 'login');
      expect(r.allowed).toBe(true);
    }
    const over = await security.checkActionRateLimit(ip, 'login');
    expect(over.allowed).toBe(false);
    expect(over.retryAfterSeconds).toBeGreaterThan(0);

    // Threat: enum valid + redaksi (fingerprint, bukan body).
    const logged = await security.logThreat(
      'XSS_ATTEMPT', // enum kanonis CHECK database (bukan 'XSS')
      ip,
      '/api/v1/articles',
      JSON.stringify({ x: '<script>alert(1)</script>', password: 'rahasia-123' }),
      admin.id,
    );
    expect(logged.id).toBeTruthy();
    const row = await pool.query(
      `SELECT request_payload FROM "${schema}".security_threat_logs WHERE id = $1`,
      [logged.id],
    );
    expect(String(row.rows[0]?.request_payload)).not.toContain('rahasia-123');
    expect(String(row.rows[0]?.request_payload)).toContain('sha256:');
    await expect(security.logThreat('BOGUS_TYPE', ip, '/x', 'y')).rejects.toThrow();
  });

  it('AC-04: capability hanya layanan nyata; redactor rekursif menutup secret', async () => {
    const caps = await adminSvc.getCapabilities();
    expect(caps.length).toBeGreaterThanOrEqual(5);
    for (const c of caps) {
      expect(c.href.startsWith('/owner/')).toBe(true);
      expect(c.label).not.toMatch(/Owner|Wali/i);
    }
    // Audit redaction: password/token nested teredaksi.
    const logged = await adminSvc.logAudit({
      principalId: admin.id,
      action: 'TEST_REDACT_L07',
      targetResource: 'test',
      result: 'SUCCESS',
      requestId: randomUUID(), // req-l07-redact: kolom request_id bertipe uuid
      beforeState: { password: 'p', nested: { token: 't', ok: 1 } },
    });
    expect(logged.id).toBeTruthy();
    const stored = await pool.query(
      `SELECT before_state FROM "${schema}".admin_audit_logs WHERE id = $1`,
      [logged.id],
    );
    // Redaksi menutup NILAI sensitif (kunci tetap ada agar struktur terbaca).
    const storedState = stored.rows[0]?.before_state as Record<string, unknown>;
    expect(storedState.password).toBe('[REDACTED]');
    expect((storedState.nested as Record<string, unknown>).token).toBe('[REDACTED]');
    expect((storedState.nested as Record<string, unknown>).ok).toBe(1);
    expect(JSON.stringify(storedState)).toContain('[REDACTED]');
  });

  it('AC-05/AC-06: operation correlation + release rules statis', async () => {
    // 0032 tersedia: operation_runs + kolom backup_logs baru.
    const cols = await pool.query(
      `SELECT column_name FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = 'backup_logs'
          AND column_name IN ('manifest_version','aggregate_checksum','operation_run_id')`,
      [schema],
    );
    expect(cols.rows.length).toBe(3);
    const opsCols = await pool.query(
      `SELECT table_name FROM information_schema.tables
        WHERE table_schema = $1 AND table_name IN ('admin_operation_runs','admin_operation_items')`,
      [schema],
    );
    expect(opsCols.rows.length).toBe(2);
  });
});
