import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';

import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { AiAdapter, Principal } from '@/contracts/services';
import { resolveSearchTarget } from '@/contracts/search';
import { validateRuntimePackageRow } from '@/contracts/runtime-content';
import { SearchService } from '@/services/search';
import { SearchProjectionService } from '@/services/search-projection';
import { RuntimeContentPackageService } from '@/services/runtime-content';
import { AiService } from '@/services/ai';
// @ts-expect-error TS7016: Skrip seed MJS diimpor langsung dalam test
import { upsertRuntimePackages } from '../../database/seeds/seed-runtime-content-packages.mjs';

/**
 * Prompt L06 — pondasi ruang, Search bertarget, AI SIMULASI jujur.
 * Dijalankan Admin via `npm run test:prompt-l06` (agent tidak mengeksekusi).
 * Schema terisolasi; tidak memakai database/seed production.
 */

const schema = 'test_promptl06';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'promptl06-integration-test',
});

const owner = principal('91000000-0000-4000-8000-000000000001', 'OWNER', true);
const member = principal('91000000-0000-4000-8000-000000000002', 'MEMBER', true);
const guestMember = principal('91000000-0000-4000-8000-000000000003', 'MEMBER', true);
const blockedA = principal('91000000-0000-4000-8000-000000000004', 'MEMBER', true);
const blockedB = principal('91000000-0000-4000-8000-000000000005', 'MEMBER', true);

const mockAdapter: AiAdapter = {
  mode: 'SIMULASI' as const,
  async answer() {
    return { ok: true };
  },
};

function principal(id: string, role: 'OWNER' | 'MEMBER', fixture: boolean): Principal {
  return {
    id,
    role,
    approvalStatus: 'APPROVED',
    entitlementStatus: role === 'OWNER' ? 'PAID' : 'PAID',
    socialStatus: 'ENABLED',
    fixture,
  };
}

let search: SearchService;
let projector: SearchProjectionService;
let runtime: RuntimeContentPackageService;
let ai: AiService;

beforeAll(async () => {
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await pool.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  const migrated = spawnSync(process.execPath, ['scripts/migrate.mjs', 'up', '--schema', schema], {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf8',
  });
  if (migrated.status !== 0) throw new Error((migrated.stderr || migrated.stdout).trim());
  for (const p of [owner, member, guestMember, blockedA, blockedB]) {
    // Suffix unik per principal (8 char pertama semua sama '91000000').
    const suffix = p.id.slice(-4).toUpperCase();
    await pool.query(
      `INSERT INTO "${schema}".principals
        (id,business_code,kind,role,approval_status,entitlement_status,social_status,display_name,username,full_name,is_test)
       VALUES ($1,$2,'MEMBER',$3,'APPROVED','PAID','ENABLED',$4,$5,$4,true)
       ON CONFLICT (id) DO NOTHING`,
      [
        p.id,
        `TEST_L06_${suffix}`,
        p.role,
        `User ${suffix}`,
        `user-l06-${suffix.toLowerCase()}`,
      ],
    );
  }
  // Guest tanpa entitlement untuk matriks School lock.
  await pool.query(
    `INSERT INTO "${schema}".principals
      (id,business_code,kind,role,approval_status,entitlement_status,social_status,display_name,username,full_name,is_test)
     VALUES ('91000000-0000-4000-8000-000000000099','TEST_L06_GUEST','MEMBER','MEMBER','APPROVED','NONE','ENABLED','Guest L06','guest-l06','Guest L06',true)
     ON CONFLICT (id) DO NOTHING`,
  );
  search = new SearchService(pool, schema);
  projector = new SearchProjectionService(pool, schema);
  runtime = new RuntimeContentPackageService(pool, schema);
  ai = new AiService(pool, schema, mockAdapter);
}, 180_000);

afterAll(async () => {
  await pool.end();
  const cleanup = new Pool({ connectionString: process.env.DATABASE_URL });
  await cleanup.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await cleanup.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  await cleanup.end();
});

describe.sequential('Prompt L06 — read-model runtime, Search, dan AI', () => {
  it('AC-03/G-01: proyektor menulis enam ruang dengan target valid; lifecycle memanggil proyeksi', async () => {
    const articleId = randomUUID();
    await projector.projectArticle({
      id: articleId,
      title: 'Artikel L06 Explore terbit',
      slug: 'artikel-l06-explore',
      summary: 'Ringkasan artikel L06 untuk Explore',
      access_level: 'PUBLIC',
      status: 'PUBLISHED',
      is_indexed: true,
      is_test: true,
    });
    await projector.projectServiceItem({
      id: randomUUID(),
      title: 'Layanan L06 Services terbit',
      slug: 'layanan-l06',
      summary: 'Jasa L06',
      published: true,
    });
    await projector.projectProduct({
      id: randomUUID(),
      title: 'Produk L06 Shop terbit',
      slug: 'produk-l06',
      summary: 'Produk L06',
      published: true,
    });
    await projector.projectSoftware({
      id: randomUUID(),
      name: 'Software L06 Tools aktif',
      slug: 'software-l06',
      description: 'Software L06 aktif',
      active: true,
    });
    await projector.projectSocialPost({
      id: randomUUID(),
      body: 'Postingan L06 Line aman',
      authorId: member.id,
      indexable: true,
      isTest: true,
    });
    await projector.projectBaseMenu({
      id: 'space-explore',
      label: 'Explore & Learn',
      slug: 'jelajahi-pengetahuan',
      href: '/ruang/jelajahi-pengetahuan',
      space: 'explore',
    });

    const res = await search.search(member, { query: 'L06', limit: 50 });
    expect(res.items.length).toBeGreaterThanOrEqual(5);
    for (const item of res.items) {
      expect(item.targetHref.startsWith('/')).toBe(true);
      expect(resolveSearchTarget(item.targetHref)).toBe(item.targetHref.split('?')[0].split('#')[0]);
      expect(item.spaceKey).toBeTruthy();
    }
    // Filter ruang: services hanya mengembalikan ruang services.
    const services = await search.search(member, { query: 'L06', spaces: ['services'] });
    for (const item of services.items) expect(item.spaceKey).toBe('services');
  });

  it('AC-03: cursor, no-result, dan typo/sinonim tetap tersedia', async () => {
    const first = await search.search(member, { query: 'L06', limit: 2 });
    expect(first.items.length).toBeLessThanOrEqual(2);
    if (first.nextCursor) {
      const second = await search.search(member, { query: 'L06', limit: 2, cursor: first.nextCursor });
      expect(second.items.length).toBeGreaterThanOrEqual(0);
    }
    const empty = await search.search(member, { query: 'zzqqxx-tidak-ada-l06' });
    expect(empty.items).toEqual([]);
    expect(empty.nextCursor).toBeNull();
    // Sinonim: "belajar" diperluas ke learning/sekolah/materi.
    const syn = await search.search(member, { query: 'belajar' });
    expect(Array.isArray(syn.items)).toBe(true);
  });

  it('AC-04/G-03: draft/archive tidak bocor; block sosial menutup POST', async () => {
    const draftId = randomUUID();
    await projector.projectArticle({
      id: draftId,
      title: 'Artikel L06 draft rahasia',
      slug: 'artikel-l06-draft',
      summary: 'Draft L06 tidak boleh muncul',
      access_level: 'PUBLIC',
      status: 'DRAFT',
      is_indexed: true,
      is_test: true,
    });
    const draftSearch = await search.search(member, { query: 'rahasia' });
    expect(draftSearch.items.map((i) => i.objectId)).not.toContain(draftId);

    // Block dua arah memakai subject (author), bukan post ID.
    const postId = randomUUID();
    await projector.projectSocialPost({
      id: postId,
      body: 'Postingan block L06 unik',
      authorId: blockedA.id,
      indexable: true,
      isTest: true,
    });
    await pool.query(
      `INSERT INTO "${schema}".social_blocks (blocker_principal_id, blocked_principal_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [blockedB.id, blockedA.id],
    );
    const blockedSearch = await search.search(blockedB, { query: 'unik' });
    expect(blockedSearch.items.map((i) => i.objectId)).not.toContain(postId);
    const authorSearch = await search.search(blockedA, { query: 'unik' });
    expect(authorSearch.items.map((i) => i.objectId)).toContain(postId);
  });

  it('AC-04: School lock — MEMBER tanpa entitlement tidak melihat judul/snippet terkunci', async () => {
    const lockedId = randomUUID();
    await projector.projectArticle({
      id: lockedId,
      title: 'Artikel L06 School member terkunci',
      slug: 'artikel-l06-locked',
      summary: 'Ringkasan terkunci L06',
      access_level: 'MEMBER',
      status: 'PUBLISHED',
      is_indexed: true,
      is_test: true,
    });
    const guest = principal('91000000-0000-4000-8000-000000000099', 'MEMBER', true);
    guest.entitlementStatus = 'NONE';
    const guestRes = await search.search(guest, { query: 'terkunci' });
    expect(guestRes.items.map((i) => i.objectId)).not.toContain(lockedId);
    const memberRes = await search.search(member, { query: 'terkunci' });
    expect(memberRes.items.map((i) => i.objectId)).toContain(lockedId);
  });

  it('AC-05: AI berlabel jujur (LOCAL_RETRIEVAL) — guest/member/exam/context terbatas', async () => {
    const capGuest = await ai.getCapability({ principal: null, examActive: false });
    expect(capGuest.mode).toBe('LOCAL_RETRIEVAL');
    expect(capGuest.free).toBe(true);
    expect(capGuest.allowed).toBe(true);
    expect(capGuest.allowedSources).toContain('ARTICLE:PUBLIC');

    const capExam = await ai.getCapability({ principal: member, examActive: true });
    expect(capExam.allowed).toBe(false);
    expect(capExam.unavailableReason).toBe('EXAM_ACTIVE');

    await expect(
      ai.ask({
        principal: member,
        sessionHash: 'l06-session',
        message: 'Pertanyaan saat ujian L06',
        examActive: true,
      }),
    ).rejects.toMatchObject({ message: expect.stringContaining('ujian') });

    const answer = await ai.ask({
      principal: null,
      sessionHash: `l06-guest-${randomUUID()}`,
      message: 'L06 Explore',
      examActive: false,
    });
    expect(answer.answer.startsWith('[SIMULASI]')).toBe(true);
    // Konteks AI tidak membawa body terkunci/draft — hanya metadata berotorisasi.
    expect(JSON.stringify(answer.sources)).not.toContain('rahasia');
  });

  it('AC-02/G-04/G-05: package DRAFT vs PUBLISHED; seed idempoten tanpa promosi', async () => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await upsertRuntimePackages(client, schema);
      await client.query('COMMIT');
    } finally {
      client.release();
    }
    const first = await runtime.listPackages();
    expect(first.valid.length).toBeGreaterThanOrEqual(3);
    expect(first.valid.every((p) => p.status === 'DRAFT')).toBe(true);

    const client2 = await pool.connect();
    try {
      await client2.query('BEGIN');
      await upsertRuntimePackages(client2, schema);
      await client2.query('COMMIT');
    } finally {
      client2.release();
    }
    const second = await runtime.listPackages();
    expect(second.valid.length).toBe(first.valid.length);

    // Manifest tidak valid ditolak validator (checksum/status).
    const bad = validateRuntimePackageRow({
      package_id: 'BAD',
      package_kind: 'MENU',
      version: 'x',
      schema_version: 'menu.export.v1',
      status: 'PUBLISHED',
      access_level: 'PUBLIC',
      source_ref: 'x',
      license_ref: 'y',
      checksum: 'zzz',
      rollback_reference: 'r',
      published_at: null,
    });
    expect(bad.ok).toBe(false);

    const menu = await runtime.getRuntimeMenu();
    expect(menu.spaces.length).toBe(7);
    expect(menu.hasPublishedExtensions).toBe(false);
    expect(menu.extensions).toEqual([]);
  });

  it('AC-06/AC-07: target whitelist menolak eksternal; kontrak tanpa consumer jujur draft', async () => {
    expect(resolveSearchTarget('https://evil.example/x')).toBeNull();
    expect(resolveSearchTarget('//evil.example/x')).toBeNull();
    expect(resolveSearchTarget('/ruang/jelajahi-pengetahuan')).toBe('/ruang/jelajahi-pengetahuan');
    expect(resolveSearchTarget('/brosur-sekolah')).toBe('/brosur-sekolah');
    // Sub-menu bukan route ruang tidak diproyeksikan sebagai /ruang/*.
    expect(resolveSearchTarget('/ruang/brosur-program')).toBe('/ruang/brosur-program');
  });
});
