import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { ApiError } from '@/api/errors';
import { consumeRateLimit } from '@/api/rate-limit';
import type { Principal } from '@/contracts/services';
import { RecordsService } from '@/services/records';
import { LocalStorageService } from '@/services/storage';
import { LocalOwnerInbox, PostgresNotificationOutbox } from '@/services/outbox';
import { PostgresJobQueue } from '@/services/queue';
import { GET as listRecordsRoute } from '@/app/api/v1/foundation/records/route';

const schema = 'test_prompt02';
const runtimeRoot = path.join(process.cwd(), 'cloud-local', 'test-prompt02');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 12,
  application_name: 'prompt02-integration-test',
});

const memberA: Principal = {
  id: '50000000-0000-4000-8000-000000000001',
  role: 'MEMBER',
  approvalStatus: 'APPROVED',
  entitlementStatus: 'NONE',
  socialStatus: 'ENABLED',
  fixture: true,
};
const memberB: Principal = {
  ...memberA,
  id: '50000000-0000-4000-8000-000000000002',
};
const pendingMember: Principal = {
  ...memberA,
  id: '50000000-0000-4000-8000-000000000003',
  approvalStatus: 'PENDING',
};

beforeAll(async () => {
  runMigration('down', '--steps', '3', '--test-only', 'true', true);
  runMigration('up', '--target', '0003');
  await fs.rm(runtimeRoot, { recursive: true, force: true });
  await fs.mkdir(runtimeRoot, { recursive: true });
  await seedPrincipals();
});

async function seedPrincipals() {
  for (const [principal, code] of [
    [memberA, 'TEST_MEMBER_A'],
    [memberB, 'TEST_MEMBER_B'],
    [pendingMember, 'TEST_MEMBER_PENDING'],
  ] as const) {
    await pool.query(
      `INSERT INTO "${schema}".principals
         (id, business_code, kind, role, approval_status, entitlement_status,
          social_status, display_name, is_test)
       VALUES ($1, $2, 'MEMBER', 'MEMBER', $3, 'NONE', 'ENABLED', $2, true)
       ON CONFLICT (id) DO NOTHING`,
      [principal.id, code, principal.approvalStatus],
    );
    await pool.query(
      `INSERT INTO "${schema}".quota_accounts (principal_id) VALUES ($1)
       ON CONFLICT (principal_id) DO NOTHING`,
      [principal.id],
    );
  }
}

afterAll(async () => {
  await pool.end();
  runMigration('down', '--steps', '3', '--test-only', 'true');
  await fs.rm(runtimeRoot, { recursive: true, force: true });
});

describe.sequential('Prompt 02 REAL_LOCAL', () => {
  it('migrasi maju, rollback test aman, dan upgrade skema sebelumnya', async () => {
    const status = runMigration('status');
    expect(status).toContain('"applied":true');
    expect(() => runMigration('down', '--steps', '1')).toThrowError();
    runMigration('down', '--steps', '3', '--test-only', 'true');
    const previous = runMigration('status');
    expect(previous).toContain('"id":"0003","name":"storage-path-hardening","applied":false');
    runMigration('up', '--target', '0003');
    // Rollback di atas menghapus tabel principals; seed ulang agar test
    // berikutnya memiliki principal fixture (bug isolasi suite, bukan produk).
    await seedPrincipals();
  });

  it('route publik mengabaikan header role dan mengembalikan 401', async () => {
    const response = await listRecordsRoute(
      new Request('http://localhost/api/v1/foundation/records', {
        headers: { 'x-role': 'OWNER', 'x-principal-id': memberA.id },
      }),
    );
    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({
      error: { code: 'AUTHENTICATION_REQUIRED' },
      requestId: expect.any(String),
    });
  });

  it('policy fixture menolak 403 dan menyembunyikan IDOR sebagai 404', async () => {
    const service = new RecordsService(pool, schema);
    await expect(
      service.list({ principal: pendingMember, limit: 20, cursor: null }),
    ).rejects.toMatchObject({ code: 'ACCESS_DENIED', status: 403 });
    const created = (await service.create({
      principal: memberA,
      label: 'Milik A TEST',
      idempotencyKey: 'record-create-a-001',
    })) as { id: string };
    await expect(service.get({ principal: memberB, id: created.id })).rejects.toMatchObject({
      code: 'NOT_FOUND',
      status: 404,
    });
  });

  it('idempotensi mengulang hasil dan menolak payload berbeda dengan 409', async () => {
    const service = new RecordsService(pool, schema);
    const first = await service.create({
      principal: memberA,
      label: 'Idempoten TEST',
      idempotencyKey: 'record-idempotent-001',
    });
    const replay = await service.create({
      principal: memberA,
      label: 'Idempoten TEST',
      idempotencyKey: 'record-idempotent-001',
    });
    expect(replay).toEqual(first);
    await expect(
      service.create({
        principal: memberA,
        label: 'Payload berubah TEST',
        idempotencyKey: 'record-idempotent-001',
      }),
    ).rejects.toMatchObject({ code: 'IDEMPOTENCY_CONFLICT', status: 409 });
  });

  it('optimistic locking menolak update dari versi lama', async () => {
    const service = new RecordsService(pool, schema);
    const created = (await service.create({
      principal: memberA,
      label: 'Versi awal TEST',
      idempotencyKey: 'record-version-0001',
    })) as { id: string; version: number };
    const updated = await service.update({
      principal: memberA,
      id: created.id,
      label: 'Versi baru TEST',
      expectedVersion: created.version,
    });
    expect(updated.version).toBe(created.version + 1);
    await expect(
      service.update({
        principal: memberA,
        id: created.id,
        label: 'Update basi TEST',
        expectedVersion: created.version,
      }),
    ).rejects.toMatchObject({ code: 'VERSION_CONFLICT', status: 409 });
    await expect(service.get({ principal: memberA, id: "' OR true --" })).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
      status: 400,
    });
  });

  it('pagination cursor menelusuri volume besar tanpa duplikasi dan limit maksimal 100', async () => {
    await pool.query(
      `INSERT INTO "${schema}".api_records
         (id, owner_principal_id, label, visibility, created_by, updated_by, created_at)
       SELECT md5('page-' || n::text)::uuid, $1, 'Volume TEST ' || n,
              'OWNER_ONLY', $1, $1, CURRENT_TIMESTAMP - (n || ' seconds')::interval
         FROM generate_series(1, 250) AS n
       ON CONFLICT (id) DO NOTHING`,
      [memberA.id],
    );
    const service = new RecordsService(pool, schema);
    const seen = new Set<string>();
    let cursor: string | null = null;
    do {
      const page = await service.list({ principal: memberA, limit: 100, cursor });
      for (const row of page.data) {
        expect(seen.has(row.id)).toBe(false);
        seen.add(row.id);
      }
      cursor = page.page.nextCursor;
    } while (cursor);
    expect(seen.size).toBeGreaterThanOrEqual(252);

    const filtered = await service.list({
      principal: memberA,
      limit: 20,
      cursor: null,
      filter: "%' OR true --",
      sort: 'createdAt:asc',
    });
    expect(filtered.data).toHaveLength(0);
  });

  it('rate-limit hook atomik menghasilkan 429', async () => {
    const input = {
      principalId: memberA.id,
      bucket: 'contract-test',
      maximum: 2,
      windowSeconds: 60,
      schema,
    };
    await consumeRateLimit(pool, input);
    await consumeRateLimit(pool, input);
    await expect(consumeRateLimit(pool, input)).rejects.toMatchObject({
      code: 'RATE_LIMITED',
      status: 429,
    });
  });

  it('reservasi kuota concurrent tidak dapat melampaui batas', async () => {
    await pool.query(
      `UPDATE "${schema}".quota_accounts
          SET limit_bytes = 100, used_bytes = 0, reserved_bytes = 0
        WHERE principal_id = $1`,
      [memberB.id],
    );
    const storage = new LocalStorageService(pool, runtimeRoot, schema);
    const attempts = await Promise.allSettled([
      storage.reserve({ principal: memberB, bytes: 60, idempotencyKey: 'quota-race-0001' }),
      storage.reserve({ principal: memberB, bytes: 60, idempotencyKey: 'quota-race-0002' }),
    ]);
    expect(attempts.filter((item) => item.status === 'fulfilled')).toHaveLength(1);
    const failure = attempts.find((item) => item.status === 'rejected') as PromiseRejectedResult;
    expect(failure.reason).toMatchObject({ code: 'QUOTA_EXCEEDED' });
    const quota = await pool.query(
      `SELECT used_bytes, reserved_bytes, limit_bytes
         FROM "${schema}".quota_accounts WHERE principal_id = $1`,
      [memberB.id],
    );
    expect(Number(quota.rows[0].used_bytes) + Number(quota.rows[0].reserved_bytes)).toBe(60);
  });

  it('bytes disimpan di karantina luar public dan moderator default gagal tertutup', async () => {
    const storage = new LocalStorageService(pool, runtimeRoot, schema);
    const bytes = new TextEncoder().encode('TEST-BYTES');
    const reservation = await storage.reserve({
      principal: memberA,
      bytes: bytes.byteLength,
      idempotencyKey: 'storage-object-0001',
    });
    const object = await storage.storeQuarantined({
      principal: memberA,
      reservationId: reservation.reservationId,
      bytes,
      mediaType: 'application/octet-stream',
      originalName: '../../rahasia.txt',
      fixture: true,
    });
    const replay = await storage.storeQuarantined({
      principal: memberA,
      reservationId: reservation.reservationId,
      bytes,
      mediaType: 'application/octet-stream',
      originalName: '../../rahasia.txt',
      fixture: true,
    });
    expect(replay).toEqual(object);
    expect((await storage.reconcile()).orphanBytes).toEqual([]);
    const metadata = await pool.query(
      `SELECT relative_path, original_name, assessment_status
         FROM "${schema}".storage_objects WHERE id = $1`,
      [object.id],
    );
    expect(metadata.rows[0]).toMatchObject({
      original_name: 'rahasia.txt',
      assessment_status: 'UNASSESSED',
    });
    expect(metadata.rows[0].relative_path.startsWith('quarantine/')).toBe(true);
    await expect(
      storage.promote({ principal: memberA, objectId: object.id }),
    ).rejects.toMatchObject({
      code: 'DEPENDENCY_UNAVAILABLE',
      status: 503,
    });

    const orphanId = randomUUID();
    await fs.writeFile(
      path.join(runtimeRoot, 'storage', 'quarantine', `${orphanId}.bin`),
      'ORPHAN',
    );
    await fs.unlink(path.join(runtimeRoot, 'storage', metadata.rows[0].relative_path));
    const reconciliation = await storage.reconcile();
    expect(reconciliation.orphanBytes).toContain(`quarantine/${orphanId}.bin`);
    expect(reconciliation.missingBytes).toContainEqual({
      id: object.id,
      relativePath: metadata.rows[0].relative_path,
    });
  });

  it('outbox retry/crash tidak menggandakan mailbox dan meredaksi secret', async () => {
    const outbox = new PostgresNotificationOutbox(pool, schema);
    const inbox = new LocalOwnerInbox(pool, schema);
    const first = await outbox.enqueue({
      principal: memberA,
      notificationType: 'TEST_NOTICE',
      payload: { title: 'TEST', nested: { password: 'tidak-boleh-tersimpan' } },
      idempotencyKey: 'outbox-message-0001',
    });
    const replay = await outbox.enqueue({
      principal: memberA,
      notificationType: 'TEST_NOTICE',
      payload: { title: 'TEST', nested: { password: 'tidak-boleh-tersimpan' } },
      idempotencyKey: 'outbox-message-0001',
    });
    expect(replay).toEqual(first);
    await expect(
      outbox.enqueue({
        principal: memberA,
        notificationType: 'TEST_NOTICE',
        payload: { title: 'BERBEDA' },
        idempotencyKey: 'outbox-message-0001',
      }),
    ).rejects.toMatchObject({ code: 'IDEMPOTENCY_CONFLICT' });
    await expect(
      outbox.deliverNext({ workerId: 'worker-test', simulateCrashBeforeCommit: true }),
    ).rejects.toThrow('SIMULATED_CRASH_BEFORE_COMMIT');
    await outbox.deliverNext({ workerId: 'worker-test' });
    expect(await outbox.deliverNext({ workerId: 'worker-test' })).toBeNull();
    const mailbox = (await inbox.list({ principal: memberA })) as {
      data: Array<{ bodyText: string; simulationLabel: string }>;
    };
    expect(mailbox.data).toHaveLength(1);
    expect(mailbox.data[0]!.bodyText).not.toContain('tidak-boleh-tersimpan');
    expect(mailbox.data[0]!.simulationLabel).toContain('SIMULASI');
    const otherMailbox = (await inbox.list({ principal: memberB })) as { data: unknown[] };
    expect(otherMailbox.data).toHaveLength(0);

    const retry = await outbox.enqueue({
      principal: memberA,
      notificationType: 'TEST_RETRY',
      payload: { title: 'RETRY TEST' },
      idempotencyKey: 'outbox-message-0002',
    });
    expect(await outbox.deliverNext({ workerId: 'worker-test', simulateFailure: true })).toEqual({
      outboxId: retry.outboxId,
      status: 'PENDING',
    });
    await pool.query(
      `UPDATE "${schema}".notification_outbox SET available_at = CURRENT_TIMESTAMP
        WHERE id = $1`,
      [retry.outboxId],
    );
    expect(await outbox.deliverNext({ workerId: 'worker-test' })).toMatchObject({
      outboxId: retry.outboxId,
      status: 'DELIVERED',
    });

    const dead = await outbox.enqueue({
      principal: memberA,
      notificationType: 'TEST_DEAD',
      payload: { title: 'DEAD TEST' },
      idempotencyKey: 'outbox-message-0003',
    });
    await pool.query(`UPDATE "${schema}".notification_outbox SET max_attempts = 1 WHERE id = $1`, [
      dead.outboxId,
    ]);
    expect(await outbox.deliverNext({ workerId: 'worker-test', simulateFailure: true })).toEqual({
      outboxId: dead.outboxId,
      status: 'DEAD',
    });
  });

  it('queue lease dan idempotensi tidak menggandakan job', async () => {
    const queue = new PostgresJobQueue(pool, schema);
    const first = await queue.enqueue({
      jobType: 'TEST_JOB',
      payload: { value: 1 },
      idempotencyKey: 'job-idempotent-0001',
    });
    expect(
      await queue.enqueue({
        jobType: 'TEST_JOB',
        payload: { value: 1 },
        idempotencyKey: 'job-idempotent-0001',
      }),
    ).toEqual(first);
    await expect(
      queue.enqueue({
        jobType: 'TEST_JOB',
        payload: { value: 2 },
        idempotencyKey: 'job-idempotent-0001',
      }),
    ).rejects.toBeInstanceOf(ApiError);
    const claimed = await queue.claim('worker-queue');
    expect(claimed.id).toBe(first.jobId);
    expect(await queue.complete(first.jobId, 'worker-queue')).toBe(true);

    const retry = await queue.enqueue({
      jobType: 'TEST_RETRY_JOB',
      payload: { value: 1 },
      idempotencyKey: 'job-idempotent-0002',
    });
    expect((await queue.claim('worker-queue')).id).toBe(retry.jobId);
    expect(await queue.fail(retry.jobId, 'worker-queue', 'TEST_FAILURE')).toBe('PENDING');
    await pool.query(`UPDATE "${schema}".jobs SET available_at = CURRENT_TIMESTAMP WHERE id = $1`, [
      retry.jobId,
    ]);
    expect((await queue.claim('worker-queue')).id).toBe(retry.jobId);
    expect(await queue.complete(retry.jobId, 'worker-queue')).toBe(true);

    const dead = await queue.enqueue({
      jobType: 'TEST_DEAD_JOB',
      payload: { value: 1 },
      idempotencyKey: 'job-idempotent-0003',
    });
    await pool.query(`UPDATE "${schema}".jobs SET max_attempts = 1 WHERE id = $1`, [dead.jobId]);
    expect((await queue.claim('worker-queue')).id).toBe(dead.jobId);
    expect(await queue.fail(dead.jobId, 'worker-queue', 'TEST_FAILURE')).toBe('DEAD');
    expect(await queue.claim('worker-queue')).toBeNull();
  });

  it('audit menyimpan detail teredaksi', async () => {
    const result = await pool.query(
      `SELECT details FROM "${schema}".audit_events
        WHERE event_type = 'OUTBOX_ENQUEUED' ORDER BY occurred_at DESC LIMIT 1`,
    );
    expect(JSON.stringify(result.rows[0].details)).not.toContain('tidak-boleh-tersimpan');
  });
});

function runMigration(command: string, ...args: Array<string | boolean>) {
  const allowFailure = args.at(-1) === true;
  if (allowFailure) args.pop();
  const result = spawnSync(
    process.execPath,
    ['scripts/migrate.mjs', command, '--schema', schema, ...(args as string[])],
    {
      cwd: process.cwd(),
      env: process.env,
      encoding: 'utf8',
    },
  );
  if (result.status !== 0 && !allowFailure) {
    throw new Error((result.stderr || result.stdout).trim());
  }
  return result.stdout;
}
