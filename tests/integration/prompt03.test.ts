import { spawnSync } from 'node:child_process';

import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { POST as publicFeedbackRoute } from '@/app/api/v1/public-feedback/route';
import { PublicFeedbackService } from '@/services/public-feedback';

const schema = 'test_prompt03';
const ownerId = '60000000-0000-4000-8000-000000000001';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 4,
  application_name: 'prompt03-integration-test',
});

beforeAll(async () => {
  // Drop schema dan history secara eksplisit agar tidak ada sisa dari run sebelumnya.
  // Pola down --steps 3 hanya rollback 3 dari 5 migrasi sehingga tabel dasar dan
  // principal fixture lama masih ada dan menyebabkan UUID duplikat pada run berikutnya.
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await pool.query('DELETE FROM public.madevi_migration_history WHERE schema_name = $1', [schema]);
  runMigration('up');
  await pool.query(
    `INSERT INTO "${schema}".principals
       (id, business_code, kind, role, approval_status, entitlement_status,
        social_status, display_name, is_test)
     VALUES ($1, 'TEST_OWNER_UI', 'OWNER', 'OWNER', 'APPROVED', 'PAID',
             'ENABLED', 'Admin Fixture UI', true)`,
    [ownerId],
  );
}, 60_000);

afterAll(async () => {
  await pool.end();
  // Cleanup schema di pool baru agar pool utama sudah tertutup lebih dahulu.
  const cleanup = new Pool({ connectionString: process.env.DATABASE_URL });
  await cleanup.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await cleanup.query('DELETE FROM public.madevi_migration_history WHERE schema_name = $1', [
    schema,
  ]);
  await cleanup.end();
});

describe.sequential('Prompt 03 — feedback OwnerInbox simulasi', () => {
  it('menerima masukan publik valid dan menulis ke owner_inbox_items (tanpa crash anonim)', async () => {
    // Desain kanonis (audit SEC-001): tanpa confirmFixture — UI feedback-form.tsx
    // tidak pernah mengirimnya. Masukan valid langsung ke inbox Owner.
    const key = `feedback-valid-${Date.now()}`;
    const response = await publicFeedbackRoute(
      new Request('http://localhost/api/v1/public-feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'idempotency-key': key },
        body: JSON.stringify({ kind: 'REPORT', topic: 'BUG', message: 'Data contoh saja' }),
      }),
    );
    expect(response.status).toBe(202);
    const data = (await response.json()) as { data: { inboxItemId: string } };
    expect(data.data).toMatchObject({ queued: true, destination: 'OwnerInbox' });
    // Route memakai koneksi DB real (bukan schema test) — bersihkan baris uji.
    const realPool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
    try {
      const stored = await realPool.query(
        `SELECT sender_principal_id FROM madevi.owner_inbox_items WHERE id = $1`,
        [data.data.inboxItemId],
      );
      expect(stored.rows[0]?.sender_principal_id).toBeNull();
      await realPool.query(`DELETE FROM madevi.owner_inbox_items WHERE id = $1`, [
        data.data.inboxItemId,
      ]);
    } finally {
      await realPool.end();
    }
  });

  it('menolak field tidak dikenal dan honeypot terisi', async () => {
    const unknown = await publicFeedbackRoute(
      new Request('http://localhost/api/v1/public-feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'idempotency-key': 'feedback-invalid-002' },
        body: JSON.stringify({
          kind: 'REPORT',
          topic: 'BUG',
          message: 'Data fiktif yang cukup panjang.',
          confirmFixture: true,
          website: '',
          ownerId,
        }),
      }),
    );
    expect(unknown.status).toBe(400);

    const bot = await publicFeedbackRoute(
      new Request('http://localhost/api/v1/public-feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'idempotency-key': 'feedback-invalid-003' },
        body: JSON.stringify({
          kind: 'REVIEW',
          topic: 'Navigasi',
          message: 'Data fiktif yang cukup panjang.',
          confirmFixture: true,
          website: 'https://example.invalid',
        }),
      }),
    );
    expect(bot.status).toBe(400);
  });

  it('mengantrekan masukan anonim ke owner_inbox_items dengan mode LOCAL_DELIVERY', async () => {
    // Desain kanonis (audit SEC-001): tulis langsung ke owner_inbox_items yang
    // hanya bisa dibaca Owner; tidak ada notification_outbox / label SIMULASI.
    const service = new PublicFeedbackService(pool, schema);
    const input = {
      kind: 'REVIEW' as const,
      topic: 'Navigasi contoh',
      message: 'Ulasan untuk pengujian Prompt 03.',
      idempotencyKey: 'feedback-prompt03-0001',
    };
    const first = await service.enqueue(input);
    expect(first).toMatchObject({ queued: true, mode: 'LOCAL_DELIVERY', destination: 'OwnerInbox' });

    const stored = await pool.query<{ subject: string; sender_principal_id: string | null }>(
      `SELECT subject, sender_principal_id FROM "${schema}".owner_inbox_items WHERE id = $1`,
      [first.inboxItemId],
    );
    expect(stored.rows[0]?.sender_principal_id).toBeNull();
    expect(stored.rows[0]?.subject).toContain('Navigasi contoh');
  });

  // CATATAN: penegakan idempotency-key sisi server (konflik 409 untuk key sama +
  // payload beda) belum diimplementasikan — service hanya menyimpan key di body.
  // UI (feedback-form.tsx) sudah menjaga double-submit di sisi klien.
  // Ditunda ke backlog untuk triase (butuh kolom+migrasi).
});

function runMigration(command: string, ...args: Array<string | boolean>) {
  const allowFailure = args.at(-1) === true;
  if (allowFailure) args.pop();
  const result = spawnSync(
    process.execPath,
    ['scripts/migrate.mjs', command, '--schema', schema, ...(args as string[])],
    { cwd: process.cwd(), env: process.env, encoding: 'utf8' },
  );
  if (result.status !== 0 && !allowFailure)
    throw new Error((result.stderr || result.stdout).trim());
  return result.stdout;
}
