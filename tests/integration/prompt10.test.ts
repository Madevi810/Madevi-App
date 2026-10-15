import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AiService } from '@/services/ai';
import { SearchService } from '@/services/search';
import type { Principal } from '@/contracts/services';
import type { AiAdapter } from '@/contracts/services';

const schema = 'test_prompt10';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'prompt10-test',
});
const member: Principal = {
  id: 'a0000000-0000-4000-8000-000000000001',
  role: 'MEMBER',
  approvalStatus: 'APPROVED',
  entitlementStatus: 'PAID',
  socialStatus: 'ENABLED',
  fixture: true,
};
const guestHash = 'guest-session-test-10';
let ai: AiService;
let search: SearchService;

class MockAiAdapter implements AiAdapter {
  readonly mode = 'SIMULASI' as const;

  async answer() {
    return { messageId: 'mock', content: '[SIMULASI] Jawaban dari adapter mock', sources: [] };
  }
}

beforeAll(async () => {
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await pool.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  for (const num of ['0001', '0002', '0003', '0004', '0010']) {
    const r = spawnSync(
      process.execPath,
      ['scripts/migrate.mjs', 'up', '--schema', schema, '--target', num],
      { cwd: process.cwd(), env: process.env, encoding: 'utf8' },
    );
    if (r.status !== 0) throw new Error(`Migrate ${num} gagal: ${(r.stderr || r.stdout).trim()}`);
  }
  await pool.query(
    `INSERT INTO "${schema}".principals (id,business_code,kind,role,approval_status,entitlement_status,social_status,display_name,username,is_test) VALUES ($1,'T10_MEMBER','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Test Member','test10',true)`,
    [member.id],
  );
  ai = new AiService(pool, schema, new MockAiAdapter());
  search = new SearchService(pool, schema);
}, 120_000);

afterAll(async () => {
  await pool.end();
  const c = new Pool({ connectionString: process.env.DATABASE_URL });
  await c.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await c.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  await c.end();
});

describe.sequential('Prompt 10 — Search', () => {
  it('F10-01: search dengan filter kategori dan validasi query', async () => {
    await pool.query(
      `INSERT INTO "${schema}".search_index_entries (id,entry_type,object_id,title,slug,summary,searchable_body,source_key,is_indexed,is_test) VALUES ($1,'ARTICLE',$2,'Belajar Next.js','belajar-nextjs','Panduan Next.js','panduan next js react','ARTICLE-TEST-10-1',true,false)`,
      [randomUUID(), randomUUID()],
    );
    await pool.query(
      `INSERT INTO "${schema}".search_index_entries (id,entry_type,object_id,title,slug,summary,searchable_body,source_key,is_indexed,is_test) VALUES ($1,'SOFTWARE',$2,'Visual Studio Code','vscode','Code editor','editor code','SOFTWARE-TEST-10-1',true,false)`,
      [randomUUID(), randomUUID()],
    );
    const res = await search.search(member, { query: 'next', categories: ['ARTICLE'], limit: 10 });
    expect(res.items.length).toBeGreaterThanOrEqual(1);
    expect(res.items[0].entryType).toBe('ARTICLE');
    await expect(search.search(member, { query: 'x', limit: 10 })).rejects.toThrow();
  });

  it('F10-02: antrean indeks idempoten', async () => {
    const key = 'idx-10-test';
    const j1 = await search.enqueueIndexJob({
      entryType: 'ARTICLE',
      objectId: randomUUID(),
      action: 'UPSERT',
      idempotencyKey: key,
    });
    const j2 = await search.enqueueIndexJob({
      entryType: 'ARTICLE',
      objectId: randomUUID(),
      action: 'UPSERT',
      idempotencyKey: key,
    });
    expect(j1.jobId).toEqual(j2.jobId);
  });
});

describe.sequential('Prompt 10 — AI', () => {
  it('F10-03: AI SIMULASI deterministik dan tidak mengakses jaringan', async () => {
    const ans = await ai.ask({
      principal: member,
      sessionHash: guestHash,
      message: 'Apa itu React?',
      examActive: false,
    });
    expect(ans.answer).toContain('[SIMULASI]');
    expect(ans).not.toHaveProperty('quotaRemaining');
  });

  it('F10-04: gate ujian menolak AI tanpa kuota pengguna', async () => {
    await expect(
      ai.ask({ principal: member, sessionHash: guestHash, message: 'test', examActive: true }),
    ).rejects.toThrow();
    const capability = await ai.getCapability({ principal: member, examActive: false });
    expect(capability.allowed).toBe(true);
  });

  it('F10-05: riwayat percakapan tersimpan dan bisa dihapus', async () => {
    const ans = await ai.ask({
      principal: member,
      sessionHash: guestHash,
      message: 'Halo AI',
      examActive: false,
    });
    const conv = await ai.getConversation(ans.conversationId, member, guestHash);
    expect(conv.messages.length).toBe(2);
    await ai.deleteConversation(ans.conversationId, member, guestHash);
    await expect(ai.getConversation(ans.conversationId, member, guestHash)).rejects.toThrow();
  });
});
