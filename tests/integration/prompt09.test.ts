import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';

import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { ModerationDecision, Principal } from '@/contracts/services';
import { ArticleService } from '@/services/article';
import {
  LocalModerationEngine,
  ModerationService,
  UnavailableModerationDecision,
} from '@/services/moderation';
import { SocialService } from '@/services/social';

const schema = 'test_prompt09';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'prompt09-integration-test',
});
const owner = principal('90000000-0000-4000-8000-000000000001', 'OWNER');
const offender = principal('90000000-0000-4000-8000-000000000002', 'MEMBER');
const recipient = principal('90000000-0000-4000-8000-000000000003', 'MEMBER');
const cleanWindow = principal('90000000-0000-4000-8000-000000000004', 'MEMBER');
let now = new Date('2026-09-09T08:00:00.000Z');
let moderation: ModerationService;
let social: SocialService;

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
      (id,business_code,kind,role,approval_status,entitlement_status,social_status,
       display_name,username,full_name,is_test)
     VALUES
      ($1,'TEST_P09_OWNER','OWNER','OWNER','APPROVED','PAID','ENABLED','Admin Moderasi','owner-mod','Admin Moderasi',true),
      ($2,'TEST_P09_OFFENDER','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Pelaku Fixture','pelaku-fixture','Pelaku Fixture',true),
      ($3,'TEST_P09_RECIPIENT','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Penerima Fixture','penerima-fixture','Penerima Fixture',true),
      ($4,'TEST_P09_CLEAN','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Window Fixture','window-fixture','Window Fixture',true)`,
    [owner.id, offender.id, recipient.id, cleanWindow.id],
  );
  moderation = new ModerationService(
    pool,
    schema,
    new LocalModerationEngine(),
    () => new Date(now),
  );
  social = new SocialService(pool, schema, new LocalModerationEngine(), () => new Date(now));
}, 120_000);

afterAll(async () => {
  await pool.end();
  const cleanup = new Pool({ connectionString: process.env.DATABASE_URL });
  await cleanup.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await cleanup.query('DELETE FROM public.madevi_migration_history WHERE schema_name=$1', [schema]);
  await cleanup.end();
});

describe.sequential('Prompt 09 — engine lokal fail-closed', () => {
  const engine = new LocalModerationEngine();

  it('mencatat engine, versi, signature, keyakinan, dan dukungan ID/EN', async () => {
    const safe = await engine.assess({
      objectId: randomUUID(),
      relativePath: 'virtual/fixture.txt',
      contentText: 'Diskusi ilmu pengetahuan yang aman dan bermanfaat.',
    });
    expect(safe).toMatchObject({
      status: 'SAFE',
      riskLevel: 'LOW',
      category: 'NONE',
      engine: {
        name: 'MADEVI_LOCAL_RULE_ENGINE',
        version: '1.0.0',
        signatureVersion: '2026-09-09',
      },
    });
    expect(safe.confidence).toBeGreaterThan(0);
    await expect(moderation.engineInventory(owner)).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ active: true })]),
    );
  });

  it('memahami konteks pendidikan/sejarah tanpa membebaskan ancaman aktif', async () => {
    const history = await engine.assess({
      objectId: randomUUID(),
      relativePath: 'virtual/history.txt',
      contentText: 'Untuk pendidikan, sejarah perang dibahas tanpa instruksi tindakan.',
    });
    expect(history).toMatchObject({ status: 'SAFE', category: 'VIOLENCE' });
    const threat = await engine.assess({
      objectId: randomUUID(),
      relativePath: 'virtual/threat.txt',
      contentText: 'Saya akan membunuh kamu.',
    });
    expect(threat).toMatchObject({ status: 'UNSAFE', riskLevel: 'HIGH', category: 'THREAT' });
  });

  it('menahan data pribadi, phishing, URL lokal, error, dan format tak didukung', async () => {
    await expect(
      engine.assess({
        objectId: randomUUID(),
        relativePath: 'virtual/pii.txt',
        contentText: 'Hubungi 081234567890',
      }),
    ).resolves.toMatchObject({ status: 'UNASSESSED', category: 'PERSONAL_DATA' });
    await expect(
      engine.assess({
        objectId: randomUUID(),
        relativePath: 'virtual/url.txt',
        url: 'http://127.0.0.1/admin',
      }),
    ).resolves.toMatchObject({ status: 'UNSAFE', category: 'DANGEROUS_URL' });
    const failing: ModerationDecision = {
      async assess() {
        throw new Error('fixture timeout');
      },
    };
    const held = await new ModerationService(pool, schema, failing).assessAndRecord({
      principal: recipient,
      targetType: 'SOCIAL_POST',
      targetId: randomUUID(),
      contentText: 'fixture',
    });
    expect(held).toMatchObject({
      status: 'UNASSESSED',
      riskLevel: 'UNKNOWN',
      category: 'ENGINE_ERROR',
    });
    await expect(new UnavailableModerationDecision().assess()).resolves.toMatchObject({
      status: 'UNASSESSED',
    });
  });

  it('tidak mengeksekusi fixture file dan memisahkan executable, arsip, serta MIME palsu', async () => {
    const executable = new Uint8Array([0x7f, 0x45, 0x4c, 0x46]);
    const archive = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    await expect(
      engine.assess({
        objectId: randomUUID(),
        relativePath: 'quarantine/a.bin',
        bytes: executable,
        mediaType: 'application/octet-stream',
      }),
    ).resolves.toMatchObject({ status: 'UNSAFE', category: 'EXECUTABLE' });
    await expect(
      engine.assess({
        objectId: randomUUID(),
        relativePath: 'quarantine/b.bin',
        bytes: archive,
        mediaType: 'application/zip',
      }),
    ).resolves.toMatchObject({ status: 'UNASSESSED', category: 'ARCHIVE_UNSUPPORTED' });
    await expect(
      engine.assess({
        objectId: randomUUID(),
        relativePath: 'quarantine/c.bin',
        bytes: png,
        mediaType: 'image/jpeg',
      }),
    ).resolves.toMatchObject({ status: 'UNSAFE', category: 'MIME_MISMATCH' });
  });
});

describe.sequential('Prompt 09 — kasus, kontak berisiko, dan false positive', () => {
  it('menahan ancaman, membuat kasus kritis, dan mewajibkan alasan akses', async () => {
    const post = await social.createPost(offender, { body: 'Saya akan membunuh kamu.' });
    expect(post).toMatchObject({ status: 'REJECTED', moderation_status: 'UNSAFE' });
    const cases = await moderation.listCases(owner, { risk: 'HIGH' });
    const moderationCase = cases.find((item: { target_id: string }) => item.target_id === post.id);
    expect(moderationCase).toMatchObject({ category: 'THREAT', critical_policy_pending: true });
    if (!moderationCase) throw new Error('Kasus ancaman fixture tidak ditemukan');
    await expect(
      moderation.accessEvidence(owner, moderationCase.id, 'pendek'),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
    await expect(
      moderation.accessEvidence(
        owner,
        moderationCase.id,
        'Meninjau ancaman fixture prioritas tinggi.',
      ),
    ).resolves.toMatchObject({ evidence: { body: 'Saya akan membunuh kamu.' } });
    await expect(
      moderation.decideCase(owner, moderationCase.id, {
        decision: 'CONFIRM_CRITICAL',
        reason: 'Konfirmasi fixture tanpa sanksi.',
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
    await moderation.decideCase(owner, moderationCase.id, {
      decision: 'CLEAR',
      reason: 'False positive fixture untuk menguji pemulihan.',
    });
    const restored = await pool.query(
      `SELECT status,moderation_status FROM "${schema}".social_posts WHERE id=$1`,
      [post.id],
    );
    expect(restored.rows[0]).toEqual({ status: 'PUBLISHED', moderation_status: 'SAFE' });
  });

  it('ancaman DM menghentikan kontak dan clear Admin memulihkan blok otomatis', async () => {
    const request = await social.createMessageRequest(offender, {
      recipientId: recipient.id,
      body: 'Halo fixture 👋',
      idempotencyKey: 'p09-request-safe',
    });
    const accepted = await social.respondMessageRequest(recipient, request.id, {
      decision: 'ACCEPT',
    });
    const message = await social.sendMessage(offender, accepted.conversationId!, {
      body: 'Saya akan membunuh kamu.',
    });
    expect(message.status).toBe('REJECTED');
    const blocked = await pool.query(
      `SELECT source_case_id FROM "${schema}".social_blocks WHERE blocker_principal_id=$1 AND blocked_principal_id=$2`,
      [recipient.id, offender.id],
    );
    expect(blocked.rows[0].source_case_id).toBeTruthy();
    const cases = await moderation.listCases(owner, { risk: 'HIGH' });
    const moderationCase = cases.find(
      (item: { target_id: string }) => item.target_id === message.id,
    );
    if (!moderationCase) throw new Error('Kasus DM fixture tidak ditemukan');
    await moderation.decideCase(owner, moderationCase.id, {
      decision: 'CLEAR',
      reason: 'Fixture false positive dipulihkan oleh Admin.',
    });
    const after = await pool.query(
      `SELECT 1 FROM "${schema}".social_blocks WHERE source_case_id=$1`,
      [moderationCase.id],
    );
    expect(after.rowCount).toBe(0);
  });

  it('laporan pengguna membuka kasus tanpa membuat Admin membaca semua DM', async () => {
    const post = await social.createPost(recipient, {
      body: 'Posting aman tetapi dapat dilaporkan.',
    });
    await social.report(offender, {
      objectType: 'POST',
      objectId: post.id,
      reason: 'Laporan fixture untuk pemeriksaan manual.',
      idempotencyKey: 'p09-report-post',
    });
    const queue = await moderation.listCases(owner, { status: 'OPEN' });
    expect(queue).toEqual(
      expect.arrayContaining([expect.objectContaining({ target_id: post.id, report_count: 1 })]),
    );
  });
});

describe.sequential('Prompt 09 — eskalasi, banding, reset, dan integrasi artikel', () => {
  const caseIds: string[] = [];
  it('eskalasi umum tepat 7 hari, 30 hari, lalu permanen setelah review Admin', async () => {
    for (let index = 0; index < 3; index += 1) {
      const assessed = await moderation.assessAndRecord({
        principal: offender,
        targetType: 'ARTICLE_SUGGESTION',
        targetId: randomUUID(),
        contentText: `Jaminan untung transfer sekarang fixture ${index}`,
      });
      if (!assessed.caseId) throw new Error('Kasus fixture tidak terbentuk');
      caseIds.push(assessed.caseId);
      const decided = await moderation.decideCase(owner, assessed.caseId, {
        decision: 'CONFIRM_GENERAL',
        reason: `Pelanggaran umum fixture urutan ${index + 1}.`,
      });
      expect(decided.sanction).toBe(['MUTE_7D', 'MUTE_30D', 'PERMANENT_BLOCK'][index]);
    }
  });

  it('pengguna dapat banding dan Admin menerima dengan alasan tanpa menghapus audit', async () => {
    const appeal = await moderation.submitAppeal(
      offender,
      caseIds[2]!,
      'Mohon tinjau ulang klasifikasi fixture ini.',
      'p09-appeal-third',
    );
    expect(await moderation.listOwnAppeals(offender)).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: appeal.id })]),
    );
    await expect(
      moderation.decideAppeal(owner, appeal.id, {
        decision: 'ACCEPT',
        reason: 'Banding fixture diterima setelah review konteks.',
      }),
    ).resolves.toMatchObject({ status: 'ACCEPTED' });
    const audit = await pool.query(
      `SELECT 1 FROM "${schema}".audit_events WHERE object_id=$1 AND event_type='MODERATION_APPEAL_DECIDED'`,
      [appeal.id],
    );
    expect(audit.rowCount).toBe(1);
  });

  it('hitungan mute kembali bersih setelah satu tahun tanpa menghapus audit lama', async () => {
    now = new Date('2024-01-01T00:00:00.000Z');
    const assessed = await moderation.assessAndRecord({
      principal: cleanWindow,
      targetType: 'ARTICLE_SUGGESTION',
      targetId: randomUUID(),
      contentText: 'Jaminan untung transfer sekarang fixture reset',
    });
    await moderation.decideCase(owner, assessed.caseId!, {
      decision: 'CONFIRM_GENERAL',
      reason: 'Strike fixture untuk pengujian reset tahunan.',
    });
    now = new Date('2026-09-09T08:00:00.000Z');
    await expect(moderation.expireCleanWindows(owner)).resolves.toMatchObject({
      strikesExpired: 1,
    });
    const row = await pool.query(`SELECT social_status FROM "${schema}".principals WHERE id=$1`, [
      cleanWindow.id,
    ]);
    expect(row.rows[0].social_status).toBe('ENABLED');
  });

  it('usulan artikel aman terlihat dan data pribadi tetap tertahan', async () => {
    const article = new ArticleService(pool, schema, new LocalModerationEngine());
    const safe = await article.submitSuggestion(recipient, {
      topic: 'Astronomi Dasar',
      reason: 'Membantu pembelajaran sains dasar.',
      idempotencyKey: 'p09-article-safe',
    });
    const held = await article.submitSuggestion(recipient, {
      topic: 'Kontak Pribadi',
      reason: 'Hubungi 081234567890 untuk rincian.',
      idempotencyKey: 'p09-article-held',
    });
    const rows = await pool.query(
      `SELECT id,moderation_status FROM "${schema}".article_suggestions WHERE id=ANY($1::uuid[]) ORDER BY id`,
      [[safe.id, held.id]],
    );
    expect(rows.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: safe.id, moderation_status: 'SAFE' }),
        expect.objectContaining({ id: held.id, moderation_status: 'UNASSESSED' }),
      ]),
    );
  });
});

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
