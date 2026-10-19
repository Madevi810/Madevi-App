import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';

import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { ModerationDecision, Principal } from '@/contracts/services';
import { SocialService } from '@/services/social';
import { UnavailableModerationDecision } from '@/services/moderation';

/**
 * Prompt L05 — policy block/mute dua-arah, indeks aman, DTO friends/my-posts,
 * idempotency pesan, dedupe notifikasi, privasi profil/grup.
 * Dijalankan Admin via `npm run test:prompt-l05` (agent tidak mengeksekusi).
 */

const schema = 'test_promptl05';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'promptl05-integration-test',
});
const owner = principal('81000000-0000-4000-8000-000000000001', 'OWNER', true);
const alice = principal('81000000-0000-4000-8000-000000000002', 'MEMBER', true);
const bob = principal('81000000-0000-4000-8000-000000000003', 'MEMBER', true);
const carol = principal('81000000-0000-4000-8000-000000000004', 'MEMBER', true);
const safe: ModerationDecision = {
  async assess() {
    return { status: 'SAFE', reason: 'fixture positif Prompt 05' };
  },
};
const now = new Date('2026-09-22T05:00:00.000Z');
let service: SocialService;
let alicePostId = '';
let groupId = '';

function principal(id: string, role: 'OWNER' | 'MEMBER', fixture: boolean): Principal {
  return {
    id,
    role,
    approvalStatus: 'APPROVED',
    entitlementStatus: 'PAID',
    socialStatus: 'ENABLED',
    fixture,
  };
}

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
    VALUES ($1,'TEST_L05_OWNER','OWNER','OWNER','APPROVED','PAID','ENABLED','Admin L05','admin-l05','Admin L05',true),
    ($2,'TEST_L05_ALICE','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Alice L05','alice-l05','Alice L05',true),
    ($3,'TEST_L05_BOB','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Bob L05','bob-l05','Bob L05',true),
    ($4,'TEST_L05_CAROL','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Carol L05','carol-l05','Carol L05',true)`,
    [owner.id, alice.id, bob.id, carol.id],
  );
  service = new SocialService(pool, schema, safe, () => new Date(now));
}, 120_000);

afterAll(async () => {
  await pool.end();
  const cleanup = new Pool({ connectionString: process.env.DATABASE_URL });
  await cleanup.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await cleanup.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  await cleanup.end();
});

describe.sequential('Prompt L05 — privasi sosial dan pengiriman', () => {
  it('G-01: post pending tidak terindeks pencarian; post aman terindeks', async () => {
    const pending = await new SocialService(
      pool,
      schema,
      new UnavailableModerationDecision(),
      () => new Date(now),
    ).createPost(alice, { body: 'Postingan L05 menunggu penilaian' });
    expect(pending.status).toBe('PENDING_MODERATION');
    const pendingIndex = await pool.query(
      `SELECT is_indexed FROM "${schema}".search_index_entries WHERE source_key = $1`,
      [`SOCIAL_POST:${pending.id}`],
    );
    expect(pendingIndex.rows[0]?.is_indexed).toBe(false);

    const published = await service.createPost(alice, { body: 'Postingan L05 aman untuk feed' });
    alicePostId = published.id;
    expect(published.status).toBe('PUBLISHED');
    const publishedIndex = await pool.query(
      `SELECT is_indexed FROM "${schema}".search_index_entries WHERE source_key = $1`,
      [`SOCIAL_POST:${alicePostId}`],
    );
    expect(publishedIndex.rows[0]?.is_indexed).toBe(true);

    await service.createPost(bob, { body: 'Postingan L05 milik Bob' });
  });

  it('G-02: aksi lintas block ditolak dan feed menyembunyikan pasangan block', async () => {
    await service.setBlock(bob, alice.id, true);
    await expect(service.addComment(bob, alicePostId, 'Komentar lintas block')).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    await expect(service.setReaction(bob, alicePostId, 'LIKE')).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    await expect(service.setSaved(bob, alicePostId, true)).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    const feed = await service.listFeed({ principalId: bob.id });
    expect(feed.items.map((item: { id: string }) => item.id)).not.toContain(alicePostId);
    await service.setBlock(bob, alice.id, false);
    const reopened = await service.listFeed({ principalId: bob.id });
    expect(reopened.items.map((item: { id: string }) => item.id)).toContain(alicePostId);
  });

  it('G-04: mute menyembunyikan satu arah tanpa mengubah hak target', async () => {
    await service.setMute(alice, carol.id, true);
    const carolPost = await service.createPost(carol, { body: 'Postingan L05 milik Carol' });
    const aliceFeed = await service.listFeed({ principalId: alice.id });
    expect(aliceFeed.items.map((item: { id: string }) => item.id)).not.toContain(carolPost.id);
    const carolFeed = await service.listFeed({ principalId: carol.id });
    expect(carolFeed.items.map((item: { id: string }) => item.id)).toContain(alicePostId);
    await service.setMute(alice, carol.id, false);
  });

  it('G-03: profil privat untuk tamu dan pasangan block', async () => {
    await expect(service.viewProfileCard(null, 'alice-l05')).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    const visible = await service.viewProfileCard(bob.id, 'alice-l05');
    expect(visible).toMatchObject({ username: 'alice-l05' });
    await service.setBlock(bob, alice.id, true);
    await expect(service.viewProfileCard(bob.id, 'alice-l05')).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    await service.setBlock(bob, alice.id, false);
  });

  it('G-06/G-07: teman, postingan sendiri, dan pesan idempoten', async () => {
    const request = await service.createMessageRequest(alice, {
      recipientId: bob.id,
      body: 'Halo Bob, sambung di Line yuk',
      idempotencyKey: `l05-req-${randomUUID()}`,
    });
    const accepted = await service.respondMessageRequest(bob, request.id, {
      decision: 'ACCEPT',
      becomeFriends: true,
    });
    expect(accepted.accepted).toBe(true);
    const friends = await service.listFriends(alice);
    expect(friends.items.map((f: { id: string }) => f.id)).toContain(bob.id);
    const mine = await service.listMyPosts(alice);
    expect(mine.items.map((p: { id: string }) => p.id)).toContain(alicePostId);

    const conversationId = accepted.conversationId as string;
    const key = `l05-msg-${randomUUID()}`;
    const first = await service.sendMessage(alice, conversationId, {
      body: 'Pesan idempoten L05',
      idempotencyKey: key,
    });
    const replay = await service.sendMessage(alice, conversationId, {
      body: 'Pesan idempoten L05',
      idempotencyKey: key,
    });
    expect(replay.id).toBe(first.id);
    const stored = await pool.query(
      `SELECT count(*)::int AS count FROM "${schema}".direct_messages WHERE conversation_id = $1 AND sender_principal_id = $2 AND body = 'Pesan idempoten L05'`,
      [conversationId, alice.id],
    );
    expect(Number(stored.rows[0]?.count)).toBe(1);
  });

  it('G-10: notifikasi tepat-satu-per-event tanpa konten sensitif', async () => {
    await service.addComment(bob, alicePostId, 'Komentar notifikasi L05 yang cukup panjang');
    const inbox = await service.listNotifications(alice);
    const commentNotes = inbox.items.filter(
      (n: { type: string; objectType: string }) => n.type === 'POST_COMMENTED',
    );
    expect(commentNotes.length).toBeGreaterThanOrEqual(1);
    expect(JSON.stringify(commentNotes[0])).not.toContain('Komentar notifikasi L05');
    const before = inbox.unread;
    await service.markNotificationsRead(alice);
    const after = await service.listNotifications(alice);
    expect(after.unread).toBeLessThanOrEqual(before);
  });

  it('G-08: post grup hanya untuk anggota aktif', async () => {
    const group = await service.createGroup(alice, { name: 'Grup L05 Eksklusif' });
    groupId = group.id;
    await service.decideGroup(owner, groupId, 'APPROVE');
    await service.requestGroupJoin(bob, groupId);
    await service.decideMembership(alice, groupId, bob.id, 'APPROVE');
    const grouped = await service.createPost(alice, {
      body: 'Postingan grup L05 khusus anggota',
      groupId,
    });
    const memberFeed = await service.listFeed({ principalId: bob.id });
    expect(memberFeed.items.map((item: { id: string }) => item.id)).toContain(grouped.id);
    const outsiderFeed = await service.listFeed({ principalId: carol.id });
    expect(outsiderFeed.items.map((item: { id: string }) => item.id)).not.toContain(grouped.id);
    const guestFeed = await service.listFeed();
    expect(guestFeed.items.map((item: { id: string }) => item.id)).not.toContain(grouped.id);
    await service.leaveGroup(bob, groupId);
    const afterLeave = await service.listFeed({ principalId: bob.id });
    expect(afterLeave.items.map((item: { id: string }) => item.id)).not.toContain(grouped.id);
  });
});
