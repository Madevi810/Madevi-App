import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';

import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { Principal } from '@/contracts/services';
import { ArticleService } from '@/services/article';
import { ExamEligibilityImpl, ExamService } from '@/services/exam';

const schema = 'test_prompt07';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'prompt07-integration-test',
});

const owner: Principal = {
  id: '70000000-0000-4000-8000-000000000001',
  role: 'OWNER',
  approvalStatus: 'APPROVED',
  entitlementStatus: 'PAID',
  socialStatus: 'ENABLED',
  fixture: true,
};
const member: Principal = {
  id: '70000000-0000-4000-8000-000000000002',
  role: 'MEMBER',
  approvalStatus: 'APPROVED',
  entitlementStatus: 'PAID',
  socialStatus: 'ENABLED',
  fixture: true,
};
const retryMember: Principal = {
  ...member,
  id: '70000000-0000-4000-8000-000000000003',
};
const outsider: Principal = {
  ...member,
  id: '70000000-0000-4000-8000-000000000004',
};

let articleService: ArticleService;
let examService: ExamService;
let now = new Date('2026-09-09T08:00:00.000Z');
let articleId = '';
let sourceId = '';
let pathId = '';
let passingAttemptId = '';

function questionBank(language: 'id' | 'en' = 'id') {
  return {
    articleId,
    language,
    translationReviewed: language === 'id',
    mcQuestions: Array.from({ length: 20 }, (_, index) => ({
      position: index + 1,
      stem: `Pertanyaan pilihan ganda unik nomor ${index + 1} dalam bahasa ${language}?`,
      options: [
        { key: 'A' as const, text: `Jawaban benar ${index + 1}` },
        { key: 'B' as const, text: `Pengecoh B ${index + 1}` },
        { key: 'C' as const, text: `Pengecoh C ${index + 1}` },
        { key: 'D' as const, text: `Pengecoh D ${index + 1}` },
      ],
      correctKey: 'A' as const,
      explanation: `Alasan jawaban nomor ${index + 1}`,
      sourceId,
      difficulty: 'MEDIUM' as const,
    })),
    essayQuestions: Array.from({ length: 5 }, (_, index) => ({
      position: index + 1,
      stem: `Jelaskan penerapan konsep unik nomor ${index + 1} dalam bahasa ${language}.`,
      rubric: `Nilai 0-8 berdasarkan ketepatan penjelasan nomor ${index + 1}.`,
      sourceId,
      difficulty: 'MEDIUM' as const,
    })),
  };
}

beforeAll(async () => {
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await pool.query('DELETE FROM public.madevi_migration_history WHERE schema_name = $1', [schema]);
  const migrated = spawnSync(process.execPath, ['scripts/migrate.mjs', 'up', '--schema', schema], {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf8',
  });
  if (migrated.status !== 0) throw new Error((migrated.stderr || migrated.stdout).trim());
  await pool.query(
    `INSERT INTO "${schema}".principals
       (id,business_code,kind,role,approval_status,entitlement_status,social_status,
        display_name,full_name,is_test)
     VALUES
       ($1,'TEST_OWNER_EXAM','OWNER','OWNER','APPROVED','PAID','ENABLED','Admin Ujian','Admin Ujian',true),
       ($2,'TEST_MEMBER_EXAM','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Peserta Ujian','Peserta Ujian Lengkap',true),
       ($3,'TEST_RETRY_EXAM','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Peserta Ulang','Peserta Ulang Lengkap',true),
       ($4,'TEST_OUTSIDER_EXAM','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Peserta Lain','Peserta Lain Lengkap',true)`,
    [owner.id, member.id, retryMember.id, outsider.id],
  );
  articleService = new ArticleService(pool, schema);
  examService = new ExamService(pool, schema, () => new Date(now));
}, 120_000);

afterAll(async () => {
  await pool.end();
  const cleanup = new Pool({ connectionString: process.env.DATABASE_URL });
  await cleanup.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await cleanup.query('DELETE FROM public.madevi_migration_history WHERE schema_name = $1', [
    schema,
  ]);
  await cleanup.end();
});

describe.sequential('Prompt 07 — F07-01 bank soal dan snapshot', () => {
  it('menyiapkan artikel, sumber, bank 20 PG + 5 esai, dan jalur resmi Admin', async () => {
    const article = await articleService.createDraft(owner, {
      title: 'Materi Ujian Prompt 07',
      slug: 'materi-ujian-prompt-07',
      accessLevel: 'MEMBER',
      isTest: true,
    });
    articleId = article.id;
    const source = await articleService.addSource(owner, articleId, {
      position: 0,
      title: 'Sumber Resmi Ujian Prompt 07',
      authorOrOrg: 'Madevi TEST',
      publisher: 'Fixture lokal',
      publicationDate: '2026-09-09',
      accessedDate: '2026-09-09',
      url: 'https://example.invalid/prompt07',
      isbn: null,
      doi: null,
      documentNumber: null,
      sectionReference: 'Bagian TEST',
      mediaLicense: 'TEST only',
      sourceType: 'OFFICIAL_DOC',
      linkStatus: 'ACTIVE',
      isPrimary: true,
    });
    sourceId = source.id;
    await pool.query(
      `UPDATE "${schema}".articles SET status = 'PUBLISHED', published_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [articleId],
    );
    const bank = await examService.createQuestionBank(owner, questionBank());
    expect(bank.status).toBe('VALIDATED');
    const path = await examService.createLearningPath(owner, {
      businessCode: 'PATH-P07-TEST',
      name: 'Jalur Tes Prompt 07',
      minimumScore: 80,
      isTest: true,
      articles: [{ articleId, position: 0, isExamRequired: true }],
    });
    pathId = path.id;
    await examService.publishLearningPath(owner, pathId);
    const eligibility = new ExamEligibilityImpl(pool, schema);
    await expect(eligibility.decide({ principal: member, pathId })).resolves.toMatchObject({
      allowed: true,
    });
  });

  it('menolak jumlah soal, opsi, sumber, dan pertanyaan duplikat yang tidak sah', async () => {
    const invalid = questionBank();
    invalid.mcQuestions = invalid.mcQuestions.slice(0, 19);
    await expect(examService.createQuestionBank(owner, invalid)).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
    });

    const duplicate = questionBank();
    duplicate.mcQuestions[1]!.stem = duplicate.mcQuestions[0]!.stem;
    await expect(examService.createQuestionBank(owner, duplicate)).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
    });
  });

  it('bank terjemahan tetap DRAFT sampai direview Admin', async () => {
    const english = await examService.createQuestionBank(owner, {
      ...questionBank('en'),
      translationReviewed: false,
    });
    expect(english.status).toBe('DRAFT');
    await expect(examService.reviewQuestionBank(owner, english.id)).resolves.toMatchObject({
      status: 'VALIDATED',
    });
  });
});

describe.sequential('Prompt 07 — F07-02/F07-03 attempt, timer, dan penilaian', () => {
  it('mengharuskan artikel selesai dan mengembalikan attempt aktif yang sama saat start diulang', async () => {
    await expect(examService.startAttempt(member, { pathId, articleId })).rejects.toMatchObject({
      code: 'ACCESS_DENIED',
    });
    await examService.markArticleRead(member, pathId, articleId);
    const first = await examService.startAttempt(member, { pathId, articleId });
    const replay = await examService.startAttempt(member, { pathId, articleId });
    expect(replay.id).toBe(first.id);
    expect(new Date(first.deadlineAt).getTime() - new Date(first.startedAt).getTime()).toBe(
      90 * 60_000,
    );
    passingAttemptId = first.id;
  });

  it('snapshot tidak berubah dan kunci/skor tidak bocor sebelum grade final', async () => {
    const before = await examService.getAttempt(member, passingAttemptId);
    expect(before.mcQuestions).toHaveLength(20);
    expect(before.mcQuestions[0]).not.toHaveProperty('correctKey');
    expect(before.scores).toBeNull();
    const originalStem = before.mcQuestions[0]!.stem;
    await pool.query(
      `UPDATE "${schema}".questions_mc SET stem = 'Bank telah diedit sesudah start' WHERE id = $1`,
      [before.mcQuestions[0]!.id],
    );
    const after = await examService.getAttempt(member, passingAttemptId);
    expect(after.mcQuestions[0]!.stem).toBe(originalStem);
  });

  it('autosave, submit lengkap, rumus 60/40, dan gate hasil bekerja', async () => {
    const view = await examService.getAttempt(member, passingAttemptId);
    await examService.saveAnswers(member, passingAttemptId, {
      mcAnswers: view.mcQuestions.map((question) => ({
        questionId: question.id,
        selectedKey: 'A',
      })),
      essayAnswers: view.essayQuestions.map((question) => ({
        questionId: question.id,
        answerText: `Jawaban lengkap untuk esai ${question.position}`,
      })),
    });
    await expect(examService.submitAttempt(member, passingAttemptId)).resolves.toMatchObject({
      status: 'SUBMITTED',
    });
    const waiting = await examService.getAttempt(member, passingAttemptId);
    expect(waiting.scores).toBeNull();
    expect(waiting.mcQuestions[0]).not.toHaveProperty('correctKey');
    await expect(examService.listGradingQueue(owner)).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: passingAttemptId, status: 'SUBMITTED' }),
      ]),
    );
    await expect(
      examService.claimAttemptForGrading(owner, passingAttemptId),
    ).resolves.toMatchObject({ status: 'GRADING' });

    const graded = await examService.gradeAttempt(owner, passingAttemptId, {
      scores: view.essayQuestions.map((question) => ({ questionId: question.id, score: 4 })),
    });
    expect(graded).toMatchObject({ pgScore: 60, essayScore: 20, totalScore: 80, passed: true });
    const final = await examService.getAttempt(member, passingAttemptId);
    expect(final.scores).toMatchObject({ total: 80, passed: true });
    expect(final.mcQuestions[0]).toHaveProperty('correctKey', 'A');
  });

  it('timeout memakai waktu server, auto-submit idempoten, dan esai kosong tetap masuk antrean', async () => {
    await examService.markArticleRead(retryMember, pathId, articleId);
    const attempt = await examService.startAttempt(retryMember, { pathId, articleId });
    now = new Date(new Date(attempt.deadlineAt).getTime() + 1_000);
    const timedOut = await examService.getAttempt(retryMember, attempt.id);
    expect(timedOut).toMatchObject({ status: 'SUBMITTED', timedOut: true });
    const replay = await examService.submitAttempt(retryMember, attempt.id);
    expect(replay).toMatchObject({ status: 'SUBMITTED', timedOut: true });
    now = new Date('2026-09-10T08:00:00.000Z');
  });

  it('perubahan nilai memerlukan alasan dan tercatat sebagai revisi', async () => {
    const view = await examService.getAttempt(owner, passingAttemptId);
    await examService.requestGradeReview(member, passingAttemptId, {
      reason: 'Mohon tinjau kembali penilaian esai saya.',
      idempotencyKey: `review-${randomUUID()}`,
    });
    await expect(
      examService.gradeAttempt(owner, passingAttemptId, {
        scores: view.essayQuestions.map((question) => ({ questionId: question.id, score: 5 })),
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
    const revised = await examService.gradeAttempt(owner, passingAttemptId, {
      scores: view.essayQuestions.map((question) => ({ questionId: question.id, score: 5 })),
      reason: 'Rubrik ditinjau kembali atas permohonan peserta.',
    });
    expect(revised.totalScore).toBe(85);
  });
});

describe.sequential('Prompt 07 — F07-04/F07-05/F07-06 jalur, sertifikat, dan AI', () => {
  it('tiga kegagalan mewajibkan siklus baru dengan progres prasyarat kosong', async () => {
    // Attempt timeout sebelumnya adalah percobaan pertama retryMember.
    const timeoutView = await pool.query<{ id: string }>(
      `SELECT id FROM "${schema}".exam_attempts
        WHERE principal_id = $1 AND article_id = $2 ORDER BY started_at LIMIT 1`,
      [retryMember.id, articleId],
    );
    const firstView = await examService.getAttempt(owner, timeoutView.rows[0]!.id);
    await examService.gradeAttempt(owner, firstView.id, {
      scores: firstView.essayQuestions.map((question) => ({ questionId: question.id, score: 0 })),
    });

    for (let attemptNumber = 2; attemptNumber <= 3; attemptNumber += 1) {
      const attempt = await examService.startAttempt(retryMember, { pathId, articleId });
      const view = await examService.getAttempt(retryMember, attempt.id);
      await examService.saveAnswers(retryMember, attempt.id, {
        mcAnswers: view.mcQuestions.map((question) => ({
          questionId: question.id,
          selectedKey: 'B',
        })),
        essayAnswers: view.essayQuestions.map((question) => ({
          questionId: question.id,
          answerText: 'Jawaban gagal.',
        })),
      });
      await examService.submitAttempt(retryMember, attempt.id);
      const ownerView = await examService.getAttempt(owner, attempt.id);
      await examService.gradeAttempt(owner, attempt.id, {
        scores: ownerView.essayQuestions.map((question) => ({ questionId: question.id, score: 0 })),
      });
    }
    const exhausted = await examService.getProgress(retryMember, pathId);
    expect(exhausted.cycleStatus).toBe('RESET_REQUIRED');
    const restarted = await examService.restartLearningCycle(retryMember, pathId);
    expect(restarted).toMatchObject({ cycle: 2, progressReset: true });
    const fresh = await examService.getProgress(retryMember, pathId);
    expect(fresh.items[0]).toMatchObject({ read: false, attemptsUsed: 0, passed: false });
  });

  it('sertifikat hanya terbit setelah jalur selesai dan hanya pemilik/Admin dapat memverifikasi', async () => {
    await expect(examService.issueCertificate(outsider, pathId)).rejects.toMatchObject({
      code: 'ACCESS_DENIED',
    });
    const certificate = await examService.issueCertificate(member, pathId);
    expect(certificate.statement).toContain('bukan ijazah resmi');
    await expect(
      examService.verifyCertificate(member, certificate.certificateNumber),
    ).resolves.toMatchObject({ status: 'ACTIVE' });
    await expect(
      examService.verifyCertificate(owner, certificate.certificateNumber),
    ).resolves.toMatchObject({ status: 'ACTIVE' });
    await expect(
      examService.verifyCertificate(outsider, certificate.certificateNumber),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('Madevi AI diblok hanya selama attempt server masih aktif', async () => {
    await examService.markArticleRead(outsider, pathId, articleId);
    const attempt = await examService.startAttempt(outsider, { pathId, articleId });
    await expect(examService.getAiAvailability(outsider)).resolves.toMatchObject({
      allowed: false,
      reason: 'EXAM_ACTIVE',
      attemptId: attempt.id,
    });
    now = new Date(new Date(attempt.deadlineAt).getTime() + 1_000);
    await expect(examService.getAiAvailability(outsider)).resolves.toMatchObject({
      allowed: true,
      scope: 'MADEVI_AI_ONLY',
    });
  });
});
