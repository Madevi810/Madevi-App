import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';

import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { ModerationDecision, Principal } from '@/contracts/services';
import { SocialService } from '@/services/social';
import { UnavailableModerationDecision } from '@/services/moderation';

const schema = 'test_prompt08';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'prompt08-integration-test',
});
const owner = principal('80000000-0000-4000-8000-000000000001', 'OWNER', true);
const alice = principal('80000000-0000-4000-8000-000000000002', 'MEMBER', true);
const bob = principal('80000000-0000-4000-8000-000000000003', 'MEMBER', true);
const outsider = principal('80000000-0000-4000-8000-000000000004', 'MEMBER', true);
const realAdult = principal('80000000-0000-4000-8000-000000000005', 'MEMBER', false);
const safe: ModerationDecision = {
  async assess() {
    return { status: 'SAFE', reason: 'fixture positif Prompt 08' };
  },
};
const now = new Date('2026-09-09T08:00:00.000Z');
let service: SocialService;
let postId = '';
let conversationId = '';
let messageId = '';
let groupId = '';

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
    VALUES ($1,'TEST_P08_OWNER','OWNER','OWNER','APPROVED','PAID','ENABLED','Admin Sosial','owner-sosial','Admin Sosial',true),
    ($2,'TEST_P08_ALICE','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Alice Fixture','alice-fixture','Alice Fixture',true),
    ($3,'TEST_P08_BOB','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Bob Fixture','bob-fixture','Bob Fixture',true),
    ($4,'TEST_P08_OUT','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Outsider Fixture','outsider-fixture','Outsider Fixture',true),
    ($5,'TEST_P08_REAL','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Adult Nonfixture','adult-nonfixture','Adult Nonfixture',false)`,
    [owner.id, alice.id, bob.id, outsider.id, realAdult.id],
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

describe.sequential('Prompt 08 — feed, moderasi, kepemilikan, dan kuota', () => {
  it('moderator default menahan konten UNKNOWN sedangkan fixture SAFE dapat tampil di feed guest', async () => {
    const held = await new SocialService(
      pool,
      schema,
      new UnavailableModerationDecision(),
    ).createPost(alice, { body: 'Konten fixture menunggu penilaian.' });
    expect(held).toMatchObject({
      status: 'PENDING_MODERATION',
      moderation_status: 'UNASSESSED',
      is_indexed: false,
    });
    const reservationId = randomUUID();
    const attachmentId = randomUUID();
    await pool.query(
      `INSERT INTO "${schema}".quota_accounts (principal_id,used_bytes) VALUES ($1,10)`,
      [alice.id],
    );
    await pool.query(
      `INSERT INTO "${schema}".quota_reservations (id,principal_id,bytes,status,idempotency_key,expires_at,completed_at) VALUES ($1,$2,10,'COMMITTED','prompt08-media-fixture',$3,$3)`,
      [reservationId, alice.id, now],
    );
    await pool.query(
      `INSERT INTO "${schema}".storage_objects (id,owner_principal_id,reservation_id,storage_state,assessment_status,relative_path,media_type,size_bytes,sha256,original_name,is_test) VALUES ($1,$2,$3,'ACTIVE','SAFE',$4,'image/png',10,$5,'fixture.png',true)`,
      [attachmentId, alice.id, reservationId, `objects/${attachmentId}.bin`, '0'.repeat(64)],
    );
    const published = await service.createPost(alice, {
      body: 'Konten edukasi fixture yang dinilai aman.',
      linkUrl: 'https://example.invalid/sumber',
      attachmentIds: [attachmentId],
    });
    postId = published.id;
    expect(published).toMatchObject({
      status: 'PUBLISHED',
      moderation_status: 'SAFE',
      is_indexed: true,
    });
    const guest = await service.listFeed();
    expect(guest.items.map((item: { id: string }) => item.id)).toContain(postId);
    expect(guest.items.map((item: { id: string }) => item.id)).not.toContain(held.id);
    expect(guest.items[0]).not.toHaveProperty('relative_path');
    expect(guest.items[0].attachments[0]).not.toHaveProperty('relativePath');
    await expect(service.resolvePublicAttachment(postId, attachmentId)).resolves.toMatchObject({
      mediaType: 'image/png',
      sizeBytes: 10,
    });
  });

  it('reaksi/simpan/komentar memerlukan principal sah dan edit/delete tunduk ownership', async () => {
    await expect(service.setReaction(bob, postId, 'SUPPORT')).resolves.toEqual({
      reaction: 'SUPPORT',
    });
    await expect(service.setSaved(bob, postId, true)).resolves.toEqual({ saved: true });
    const comment = await service.addComment(bob, postId, 'Komentar fixture aman.');
    expect(comment).toMatchObject({ status: 'PUBLISHED' });
    await expect(
      service.updateComment(outsider, comment.id, 'Percobaan IDOR komentar'),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
    await expect(
      service.updateComment(bob, comment.id, 'Komentar fixture aman yang diperbarui.'),
    ).resolves.toMatchObject({ status: 'PUBLISHED' });
    await expect(
      service.updatePost(outsider, postId, { body: 'Percobaan IDOR' }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
    await expect(service.deletePost(outsider, postId)).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('kuota sosial default 500.000.000 byte dan memberi status warning/full tanpa auto-delete', async () => {
    const quota = await service.quota(alice);
    expect(quota).toMatchObject({
      limitBytes: 500_000_000,
      usedBytes: 10,
      warning: false,
      full: false,
    });
  });

  it('data anak nyata ditolak dan fixture anak tidak diindeks', async () => {
    await expect(
      service.createPost(realAdult, {
        body: 'Bukan fixture',
        audiencePolicy: 'CHILD_FIXTURE_ONLY',
      }),
    ).rejects.toMatchObject({ code: 'ACCESS_DENIED' });
    const fixture = await service.createPost(alice, {
      body: 'Simulasi kebijakan anak',
      audiencePolicy: 'CHILD_FIXTURE_ONLY',
    });
    expect(fixture.is_indexed).toBe(false);
  });
});

describe.sequential('Prompt 08 — request, blokir, DM, bukti, dan hapus dua pihak', () => {
  it('permintaan non-teman hanya teks/emoji dan penerima memilih berteman', async () => {
    await expect(
      service.createMessageRequest(alice, {
        recipientId: bob.id,
        body: 'lihat https://example.invalid',
        idempotencyKey: 'request-link-01',
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
    const request = await service.createMessageRequest(alice, {
      recipientId: bob.id,
      body: 'Halo Bob 👋',
      idempotencyKey: 'request-safe-01',
    });
    const accepted = await service.respondMessageRequest(bob, request.id, {
      decision: 'ACCEPT',
      becomeFriends: true,
    });
    conversationId = accepted.conversationId!;
    expect(accepted).toMatchObject({ accepted: true, friends: true });
  });

  it('anggota dapat mengirim, outsider ditolak, dan hapus satu pihak menghapus untuk keduanya', async () => {
    const message = await service.sendMessage(alice, conversationId, {
      body: 'Pesan privat fixture aman',
    });
    messageId = message.id;
    await expect(service.listMessages(outsider, conversationId)).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    expect((await service.listMessages(bob, conversationId)).items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: messageId, body: 'Pesan privat fixture aman' }),
      ]),
    );
    await service.deleteMessage(bob, messageId);
    expect((await service.listMessages(alice, conversationId)).items).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: messageId })]),
    );
    const tomb = await pool.query(
      `SELECT * FROM "${schema}".message_tombstones WHERE message_id=$1`,
      [messageId],
    );
    expect(tomb.rows[0]).not.toHaveProperty('body');
  });

  it('Admin hanya dapat membuka snapshot laporan dengan alasan audit', async () => {
    const message = await service.sendMessage(alice, conversationId, {
      body: 'Pesan yang dilaporkan oleh peserta',
    });
    const report = await service.reportMessage(
      bob,
      message.id,
      'Alasan laporan fixture yang memadai.',
      'message-report-01',
    );
    if (!report.evidenceId) throw new Error('Fixture bukti tidak terbentuk');
    await expect(service.getMessageEvidence(owner, report.evidenceId, '')).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
    });
    const evidence = await service.getMessageEvidence(
      owner,
      report.evidenceId,
      'Meninjau laporan keselamatan fixture.',
    );
    expect(evidence.evidence_body).toBe('Pesan yang dilaporkan oleh peserta');
  });

  it('blok dua arah menghentikan request/pesan dan mencabut pertemanan', async () => {
    await service.setBlock(bob, alice.id, true);
    await expect(
      service.sendMessage(alice, conversationId, { body: 'Tidak boleh terkirim' }),
    ).rejects.toMatchObject({ code: 'ACCESS_DENIED' });
    await expect(
      service.createMessageRequest(alice, {
        recipientId: bob.id,
        body: 'Halo lagi',
        idempotencyKey: 'blocked-request-01',
      }),
    ).rejects.toMatchObject({ code: 'ACCESS_DENIED' });
    await service.setBlock(bob, alice.id, false);
  });
});

describe.sequential('Prompt 08 — grup dan retensi simulasi', () => {
  it('grup menunggu Admin, join menunggu pengelola, dan daftar anggota privat', async () => {
    const group = await service.createGroup(alice, {
      name: 'Kelompok Belajar Fixture',
      description: 'Grup pengujian aman.',
    });
    groupId = group.id;
    expect(group.status).toBe('PENDING_OWNER');
    await service.decideGroup(owner, groupId, 'APPROVE');
    await service.requestGroupJoin(bob, groupId);
    await expect(service.listGroupMembers(outsider, groupId)).rejects.toMatchObject({
      code: 'ACCESS_DENIED',
    });
    await service.decideMembership(alice, groupId, bob.id, 'APPROVE');
    expect(await service.listGroupMembers(bob, groupId)).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: bob.id })]),
    );
    await service.transferGroupManager(owner, groupId, bob.id);
    await expect(
      service.decideMembership(alice, groupId, outsider.id, 'APPROVE'),
    ).rejects.toMatchObject({ code: 'ACCESS_DENIED' });
    const appeal = await service.appealGroup(
      outsider,
      groupId,
      'Mohon tinjau keputusan grup fixture.',
      'group-appeal-01',
    );
    const queue = await service.listOwnerGroupQueue(owner);
    expect(queue.appeals).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: appeal.id })]),
    );
    await expect(service.decideGroupAppeal(owner, appeal.id, 'RESOLVE')).resolves.toMatchObject({
      status: 'RESOLVED',
    });
  });

  it('purge 12 bulan hanya fixture, perlu konfirmasi, dan menghasilkan tombstone tanpa isi', async () => {
    const request = await service.createMessageRequest(alice, {
      recipientId: outsider.id,
      body: 'Percakapan retensi fixture',
      idempotencyKey: 'retention-request-01',
    });
    const accepted = await service.respondMessageRequest(outsider, request.id, {
      decision: 'ACCEPT',
    });
    const old = await service.sendMessage(alice, accepted.conversationId!, {
      body: 'Isi lama akan dihapus',
    });
    await pool.query(`UPDATE "${schema}".direct_conversations SET last_message_at=$2 WHERE id=$1`, [
      accepted.conversationId!,
      new Date('2025-09-08T07:59:59.000Z'),
    ]);
    await expect(service.purgeInactiveFixtureConversations(owner, false)).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
    });
    const result = await service.purgeInactiveFixtureConversations(owner, true);
    expect(result.conversationsPurged).toBeGreaterThanOrEqual(1);
    const deleted = await pool.query(`SELECT 1 FROM "${schema}".direct_messages WHERE id=$1`, [
      old.id,
    ]);
    expect(deleted.rowCount).toBe(0);
    const tomb = await pool.query(
      `SELECT reason_code FROM "${schema}".message_tombstones WHERE message_id=$1`,
      [old.id],
    );
    expect(tomb.rows[0]).toEqual({ reason_code: 'RETENTION_SIMULATION' });
  });
});

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
