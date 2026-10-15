import { randomBytes, randomUUID } from 'node:crypto';

import type { Pool, PoolClient } from 'pg';

import { ApiError } from '@/api/errors';
import { ArticleReadPolicyImpl } from '@/services/article';
import type { ExamEligibility, PolicyDecision, Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import { appendAuditEvent } from '@/services/audit';

export type ExamAttemptStatus = 'ACTIVE' | 'SUBMITTED' | 'GRADING' | 'REVIEW' | 'GRADED';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ChoiceKey = 'A' | 'B' | 'C' | 'D';

export interface LearningPathInput {
  businessCode: string;
  name: string;
  description?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  minimumScore?: number;
  estimatedHours?: number;
  isTest?: boolean;
  articles: Array<{
    articleId: string;
    position: number;
    isExamRequired?: boolean;
    prerequisiteArticleId?: string | null;
  }>;
}

export interface QuestionBankInput {
  articleId: string;
  language: 'id' | 'en';
  translationReviewed?: boolean;
  mcQuestions: Array<{
    position: number;
    stem: string;
    options: Array<{ key: ChoiceKey; text: string }>;
    correctKey: ChoiceKey;
    explanation: string;
    sourceId: string;
    difficulty: Difficulty;
  }>;
  essayQuestions: Array<{
    position: number;
    stem: string;
    rubric: string;
    sourceId: string;
    difficulty: Difficulty;
  }>;
}

interface AttemptRow {
  id: string;
  principal_id: string;
  article_id: string;
  path_id: string | null;
  cycle: number;
  bank_snapshot_id: string;
  started_at: Date;
  deadline_at: Date;
  submitted_at: Date | null;
  timed_out: boolean;
  status: ExamAttemptStatus;
  pg_score: string | number | null;
  essay_score: string | number | null;
  total_score: string | number | null;
  passed: boolean | null;
  graded_by: string | null;
  graded_at: Date | null;
  score_revision_count: number;
  policy_version: number;
  is_test: boolean;
}

interface AssessmentPolicy {
  version: number;
  max_attempts: number;
  duration_minutes: number;
  mc_count: number;
  essay_count: number;
  essay_max_score: number;
}

export class ExamEligibilityImpl implements ExamEligibility {
  private readonly sqlSchema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
  ) {
    this.sqlSchema = quotedSchema(schemaName);
  }

  async decide(input: { principal: Principal; pathId: string }): Promise<PolicyDecision> {
    if (input.principal.role !== 'MEMBER' || input.principal.approvalStatus !== 'APPROVED') {
      return { allowed: false, reason: 'APPROVED_MEMBER_REQUIRED' };
    }
    const path = await this.pool.query<{ status: string }>(
      `SELECT status FROM ${this.sqlSchema}.learning_paths WHERE id = $1`,
      [input.pathId],
    );
    if (!path.rows[0]) return { allowed: false, reason: 'PATH_NOT_FOUND' };
    if (path.rows[0].status !== 'PUBLISHED')
      return { allowed: false, reason: 'PATH_NOT_PUBLISHED' };
    return { allowed: true, reason: 'ELIGIBLE' };
  }
}

export class ExamService {
  private readonly sqlSchema: string;

  constructor(
    private readonly pool: Pool,
    private readonly schemaName: string,
    private readonly now: () => Date = () => new Date(),
  ) {
    this.sqlSchema = quotedSchema(schemaName);
  }

  /**
   * D09: kebijakan assessment aktif (atau versi snapshot attempt).
   * Satu-satunya sumber angka batas attempt, durasi, dan bentuk bank.
   */
  async loadPolicy(
    client: { query: Pool['query'] },
    version?: number,
  ): Promise<AssessmentPolicy> {
    const result =
      version === undefined
        ? await client.query<AssessmentPolicy>(
            `SELECT version, max_attempts, duration_minutes, mc_count,
                    essay_count, essay_max_score
               FROM ${this.sqlSchema}.assessment_policies
              WHERE superseded_at IS NULL
              ORDER BY version DESC LIMIT 1`,
          )
        : await client.query<AssessmentPolicy>(
            `SELECT version, max_attempts, duration_minutes, mc_count,
                    essay_count, essay_max_score
               FROM ${this.sqlSchema}.assessment_policies
              WHERE version = $1`,
            [version],
          );
    const policy = result.rows[0];
    if (!policy) throw new ApiError('DEPENDENCY_UNAVAILABLE', 'Kebijakan assessment belum tersedia');
    return policy;
  }

  async createQuestionBank(owner: Principal, input: QuestionBankInput) {
    this.assertOwner(owner);
    this.validateQuestionBank(input);

    return inTransaction(this.pool, async (client) => {
      const article = await client.query<{ id: string }>(
        `SELECT id FROM ${this.sqlSchema}.articles WHERE id = $1`,
        [input.articleId],
      );
      if (!article.rows[0]) throw new ApiError('NOT_FOUND', 'Artikel tidak ditemukan');

      const sourceIds = [
        ...new Set([
          ...input.mcQuestions.map((question) => question.sourceId),
          ...input.essayQuestions.map((question) => question.sourceId),
        ]),
      ];
      const sources = await client.query<{ id: string }>(
        `SELECT id FROM ${this.sqlSchema}.article_sources
          WHERE article_id = $1 AND id = ANY($2::uuid[])`,
        [input.articleId, sourceIds],
      );
      if (sources.rowCount !== sourceIds.length) {
        throw new ApiError(
          'VALIDATION_FAILED',
          'Setiap soal wajib memakai sumber artikel yang sah',
        );
      }

      const version = await client
        .query<{ next_version: number }>(
          `SELECT COALESCE(MAX(version), 0) + 1 AS next_version
             FROM ${this.sqlSchema}.question_banks
            WHERE article_id = $1 AND language = $2`,
          [input.articleId, input.language],
        )
        .then((result) => Number(result.rows[0]?.next_version ?? 1));
      const bankId = randomUUID();
      const reviewed = input.language === 'id' || input.translationReviewed === true;

      await client.query(
        `INSERT INTO ${this.sqlSchema}.question_banks
           (id, article_id, language, version, status, validated_at, reviewed_by,
            reviewed_at, is_test, created_by)
         VALUES ($1,$2,$3,$4,$5,$7,$6,$7,$8,$9)`,
        [
          bankId,
          input.articleId,
          input.language,
          version,
          reviewed ? 'VALIDATED' : 'DRAFT',
          reviewed ? owner.id : null,
          reviewed ? this.now() : null,
          owner.fixture,
          owner.id,
        ],
      );

      for (const question of input.mcQuestions) {
        await client.query(
          `INSERT INTO ${this.sqlSchema}.questions_mc
             (id, bank_id, position, stem, options, correct_key, explanation,
              source_id, difficulty, is_test)
           VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9,$10)`,
          [
            randomUUID(),
            bankId,
            question.position,
            question.stem.trim(),
            JSON.stringify(question.options),
            question.correctKey,
            question.explanation.trim(),
            question.sourceId,
            question.difficulty,
            owner.fixture,
          ],
        );
      }
      for (const question of input.essayQuestions) {
        await client.query(
          `INSERT INTO ${this.sqlSchema}.questions_essay
             (id, bank_id, position, stem, rubric, max_score, source_id, difficulty, is_test)
           VALUES ($1,$2,$3,$4,$5,8,$6,$7,$8)`,
          [
            randomUUID(),
            bankId,
            question.position,
            question.stem.trim(),
            question.rubric.trim(),
            question.sourceId,
            question.difficulty,
            owner.fixture,
          ],
        );
      }

      if (reviewed) {
        await client.query(
          `UPDATE ${this.sqlSchema}.question_banks
              SET status = 'SUPERSEDED', updated_at = CURRENT_TIMESTAMP
            WHERE article_id = $1 AND language = $2 AND id <> $3 AND status = 'VALIDATED'`,
          [input.articleId, input.language, bankId],
        );
      }
      await this.audit(client, owner, 'QUESTION_BANK_CREATED', 'question_bank', bankId, {
        language: input.language,
        version,
        reviewed,
      });
      return {
        id: bankId,
        version,
        status: reviewed ? ('VALIDATED' as const) : ('DRAFT' as const),
      };
    });
  }

  async reviewQuestionBank(owner: Principal, bankId: string) {
    this.assertOwner(owner);
    return inTransaction(this.pool, async (client) => {
      const bank = await client.query<{ article_id: string; language: string }>(
        `SELECT article_id, language FROM ${this.sqlSchema}.question_banks WHERE id = $1 FOR UPDATE`,
        [bankId],
      );
      if (!bank.rows[0]) throw new ApiError('NOT_FOUND', 'Bank soal tidak ditemukan');
      await client.query(
        `UPDATE ${this.sqlSchema}.question_banks
            SET status = 'SUPERSEDED', updated_at = CURRENT_TIMESTAMP
          WHERE article_id = $1 AND language = $2 AND id <> $3 AND status = 'VALIDATED'`,
        [bank.rows[0].article_id, bank.rows[0].language, bankId],
      );
      await client.query(
        `UPDATE ${this.sqlSchema}.question_banks
            SET status = 'VALIDATED', validated_at = CURRENT_TIMESTAMP,
                reviewed_by = $2, reviewed_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
          WHERE id = $1`,
        [bankId, owner.id],
      );
      await this.audit(client, owner, 'QUESTION_BANK_REVIEWED', 'question_bank', bankId);
      return { id: bankId, status: 'VALIDATED' as const };
    });
  }

  async createLearningPath(owner: Principal, input: LearningPathInput) {
    this.assertOwner(owner);
    if (!/^[A-Z0-9_-]{3,80}$/.test(input.businessCode)) {
      throw new ApiError('VALIDATION_FAILED', 'Kode jalur tidak valid');
    }
    if (input.name.trim().length < 3 || input.articles.length === 0) {
      throw new ApiError('VALIDATION_FAILED', 'Nama dan minimal satu artikel diperlukan');
    }
    if (input.minimumScore !== undefined && input.minimumScore !== 80) {
      throw new ApiError('VALIDATION_FAILED', 'Nilai minimum ujian wajib 80');
    }
    const articleIds = input.articles.map((item) => item.articleId);
    const positions = input.articles.map((item) => item.position);
    if (
      new Set(articleIds).size !== articleIds.length ||
      new Set(positions).size !== positions.length
    ) {
      throw new ApiError('VALIDATION_FAILED', 'Artikel dan posisi dalam jalur harus unik');
    }
    const articleSet = new Set(articleIds);
    if (
      input.articles.some(
        (item) =>
          item.position < 0 ||
          (item.prerequisiteArticleId && !articleSet.has(item.prerequisiteArticleId)),
      )
    ) {
      throw new ApiError('VALIDATION_FAILED', 'Prasyarat harus berasal dari jalur yang sama');
    }

    return inTransaction(this.pool, async (client) => {
      const found = await client.query<{ id: string }>(
        `SELECT id FROM ${this.sqlSchema}.articles WHERE id = ANY($1::uuid[])`,
        [articleIds],
      );
      if (found.rowCount !== articleIds.length) {
        throw new ApiError('VALIDATION_FAILED', 'Satu atau lebih artikel tidak ditemukan');
      }
      const pathId = randomUUID();
      await client.query(
        `INSERT INTO ${this.sqlSchema}.learning_paths
           (id, business_code, name, description, difficulty, minimum_score,
            estimated_hours, is_test, created_by, updated_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9)`,
        [
          pathId,
          input.businessCode,
          input.name.trim(),
          input.description?.trim() ?? '',
          input.difficulty ?? 'BEGINNER',
          input.minimumScore ?? 80,
          input.estimatedHours ?? null,
          input.isTest ?? owner.fixture,
          owner.id,
        ],
      );
      for (const item of input.articles) {
        await client.query(
          `INSERT INTO ${this.sqlSchema}.learning_path_articles
             (path_id, article_id, position, is_exam_required, prerequisite_article_id)
           VALUES ($1,$2,$3,$4,$5)`,
          [
            pathId,
            item.articleId,
            item.position,
            item.isExamRequired ?? true,
            item.prerequisiteArticleId ?? null,
          ],
        );
      }
      await this.audit(client, owner, 'LEARNING_PATH_CREATED', 'learning_path', pathId);
      return { id: pathId, status: 'DRAFT' as const, version: 1 };
    });
  }

  async publishLearningPath(owner: Principal, pathId: string) {
    this.assertOwner(owner);
    return inTransaction(this.pool, async (client) => {
      const path = await client.query<{ status: string }>(
        `SELECT status FROM ${this.sqlSchema}.learning_paths WHERE id = $1 FOR UPDATE`,
        [pathId],
      );
      if (!path.rows[0]) throw new ApiError('NOT_FOUND', 'Jalur belajar tidak ditemukan');
      const policy = await this.loadPolicy(client);
      const invalid = await client.query<{ count: string }>(
        `SELECT COUNT(*) AS count
           FROM ${this.sqlSchema}.learning_path_articles lpa
          WHERE lpa.path_id = $1 AND lpa.is_exam_required
            AND NOT EXISTS (
              SELECT 1 FROM ${this.sqlSchema}.question_banks qb
               WHERE qb.article_id = lpa.article_id
                 AND qb.language = 'id' AND qb.status = 'VALIDATED'
                 AND (SELECT COUNT(*) FROM ${this.sqlSchema}.questions_mc mc
                       WHERE mc.bank_id = qb.id AND mc.source_id IS NOT NULL) = $2
                 AND (SELECT COUNT(*) FROM ${this.sqlSchema}.questions_essay essay
                       WHERE essay.bank_id = qb.id AND essay.source_id IS NOT NULL) = $3
            )`,
        [pathId, policy.mc_count, policy.essay_count],
      );
      if (Number(invalid.rows[0]?.count ?? 0) > 0) {
        throw new ApiError(
          'VALIDATION_FAILED',
          'Semua ujian wajib membutuhkan bank soal tervalidasi',
        );
      }
      await client.query(
        `UPDATE ${this.sqlSchema}.learning_paths
            SET status = 'PUBLISHED', version = version + 1,
                updated_by = $2, updated_at = CURRENT_TIMESTAMP
          WHERE id = $1`,
        [pathId, owner.id],
      );
      await this.audit(client, owner, 'LEARNING_PATH_PUBLISHED', 'learning_path', pathId);
      return { id: pathId, status: 'PUBLISHED' as const };
    });
  }

  async setAttemptCapacity(owner: Principal, accepting: boolean, reason = '') {
    this.assertOwner(owner);
    if (!accepting && reason.trim().length < 5) {
      throw new ApiError('VALIDATION_FAILED', 'Alasan jeda minimal 5 karakter');
    }
    await this.pool.query(
      `UPDATE ${this.sqlSchema}.exam_capacity_control
          SET accepting_new_attempts = $1, pause_reason = $2,
              updated_by = $3, updated_at = CURRENT_TIMESTAMP
        WHERE singleton = true`,
      [accepting, accepting ? '' : reason.trim(), owner.id],
    );
    return { acceptingNewAttempts: accepting, reason: accepting ? '' : reason.trim() };
  }

  async markArticleRead(principal: Principal, pathId: string, articleId: string) {
    this.assertApproved(principal);
    const policy = new ArticleReadPolicyImpl(this.pool, this.schemaName);
    const access = await policy.decide({ principal, articleId });
    if (!access.allowed) throw new ApiError('ACCESS_DENIED', 'Artikel tidak dapat diakses');

    return inTransaction(this.pool, async (client) => {
      const cycle = await this.ensureCycle(client, principal, pathId);
      await this.assertPathArticle(client, pathId, articleId);
      await client.query(
        `INSERT INTO ${this.sqlSchema}.learning_progress
           (id, principal_id, path_id, article_id, read_at, cycle)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (principal_id, path_id, article_id, cycle)
         DO UPDATE SET read_at = COALESCE(${this.sqlSchema}.learning_progress.read_at, EXCLUDED.read_at),
                       updated_at = CURRENT_TIMESTAMP`,
        [randomUUID(), principal.id, pathId, articleId, this.now(), cycle],
      );
      return { pathId, articleId, cycle, read: true };
    });
  }

  async getProgress(principal: Principal, pathId: string) {
    this.assertApproved(principal);
    const path = await this.pool.query<{
      id: string;
      name: string;
      description: string;
      status: string;
      minimum_score: number;
    }>(
      `SELECT id, name, description, status, minimum_score
         FROM ${this.sqlSchema}.learning_paths WHERE id = $1`,
      [pathId],
    );
    if (!path.rows[0] || (path.rows[0].status !== 'PUBLISHED' && principal.role !== 'OWNER')) {
      throw new ApiError('NOT_FOUND', 'Jalur belajar tidak ditemukan');
    }
    const cycle = await this.pool.query<{ cycle: number; status: string }>(
      `SELECT cycle, status FROM ${this.sqlSchema}.learning_cycles
        WHERE principal_id = $1 AND path_id = $2
        ORDER BY cycle DESC LIMIT 1`,
      [principal.id, pathId],
    );
    const cycleNumber = cycle.rows[0]?.cycle ?? 1;
    const items = await this.pool.query<{
      article_id: string;
      position: number;
      is_exam_required: boolean;
      prerequisite_article_id: string | null;
      title: string;
      read_at: Date | null;
      attempts_used: number | null;
      best_score: string | number | null;
      passed: boolean | null;
    }>(
      `SELECT lpa.article_id, lpa.position, lpa.is_exam_required,
              lpa.prerequisite_article_id, a.title, lp.read_at, lp.attempts_used,
              lp.best_score, lp.passed
         FROM ${this.sqlSchema}.learning_path_articles lpa
         JOIN ${this.sqlSchema}.articles a ON a.id = lpa.article_id
    LEFT JOIN ${this.sqlSchema}.learning_progress lp
           ON lp.path_id = lpa.path_id AND lp.article_id = lpa.article_id
          AND lp.principal_id = $2 AND lp.cycle = $3
        WHERE lpa.path_id = $1 ORDER BY lpa.position`,
      [pathId, principal.id, cycleNumber],
    );
    const completed = items.rows.filter(
      (item) => item.read_at && (!item.is_exam_required || item.passed === true),
    ).length;
    const itemCount = items.rows.length;
    return {
      path: path.rows[0],
      cycle: cycleNumber,
      cycleStatus: cycle.rows[0]?.status ?? 'NOT_STARTED',
      percent: itemCount ? Math.floor((completed / itemCount) * 100) : 0,
      completedArticles: completed,
      totalArticles: itemCount,
      items: items.rows.map((item) => ({
        articleId: item.article_id,
        title: item.title,
        position: item.position,
        examRequired: item.is_exam_required,
        prerequisiteArticleId: item.prerequisite_article_id,
        read: Boolean(item.read_at),
        attemptsUsed: item.attempts_used ?? 0,
        bestScore: item.best_score === null ? null : Number(item.best_score),
        passed: item.passed ?? false,
      })),
    };
  }

  async startAttempt(
    principal: Principal,
    input: { pathId: string; articleId: string; language?: 'id' | 'en' },
  ) {
    this.assertMember(principal);
    const articleAccess = await new ArticleReadPolicyImpl(this.pool, this.schemaName).decide({
      principal,
      articleId: input.articleId,
    });
    if (!articleAccess.allowed) throw new ApiError('ACCESS_DENIED', 'Artikel tidak dapat diakses');
    try {
      return await inTransaction(this.pool, async (client) => {
        const capacity = await client.query<{
          accepting_new_attempts: boolean;
          pause_reason: string;
        }>(
          `SELECT accepting_new_attempts, pause_reason
             FROM ${this.sqlSchema}.exam_capacity_control WHERE singleton = true`,
        );
        if (!capacity.rows[0]?.accepting_new_attempts) {
          throw new ApiError(
            'DEPENDENCY_UNAVAILABLE',
            capacity.rows[0]?.pause_reason || 'Penerimaan ujian baru sedang dijeda Admin',
          );
        }
        const cycle = await this.ensureCycle(client, principal, input.pathId);
        const membership = await this.assertPathArticle(client, input.pathId, input.articleId);
        const policy = await this.loadPolicy(client);
        const active = await client.query<AttemptRow>(
          `SELECT * FROM ${this.sqlSchema}.exam_attempts
            WHERE principal_id = $1 AND article_id = $2 AND cycle = $3 AND status = 'ACTIVE'
            FOR UPDATE`,
          [principal.id, input.articleId, cycle],
        );
        if (active.rows[0]) return this.attemptSummary(active.rows[0]);

        const progress = await client.query<{
          read_at: Date | null;
          attempts_used: number;
          passed: boolean;
        }>(
          `SELECT read_at, attempts_used, passed FROM ${this.sqlSchema}.learning_progress
            WHERE principal_id = $1 AND path_id = $2 AND article_id = $3 AND cycle = $4
            FOR UPDATE`,
          [principal.id, input.pathId, input.articleId, cycle],
        );
        if (!progress.rows[0]?.read_at) {
          throw new ApiError('ACCESS_DENIED', 'Artikel harus diselesaikan sebelum memulai ujian');
        }
        if (progress.rows[0].passed) {
          throw new ApiError('VERSION_CONFLICT', 'Ujian artikel ini sudah lulus pada siklus aktif');
        }
        const attempts = await client.query<{ count: string }>(
          `SELECT COUNT(*) AS count FROM ${this.sqlSchema}.exam_attempts
            WHERE principal_id = $1 AND article_id = $2 AND cycle = $3`,
          [principal.id, input.articleId, cycle],
        );
        if (Number(attempts.rows[0]?.count ?? 0) >= policy.max_attempts) {
          await client.query(
            `UPDATE ${this.sqlSchema}.learning_cycles
                SET status = 'RESET_REQUIRED', reset_reason = $4
              WHERE principal_id = $1 AND path_id = $2 AND cycle = $3`,
            [principal.id, input.pathId, cycle, `${policy.max_attempts} attempt belum lulus`],
          );
          throw new ApiError(
            'QUOTA_EXCEEDED',
            `${policy.max_attempts} attempt habis; ulangi jalur belajar`,
          );
        }
        if (membership.prerequisite_article_id) {
          const prerequisite = await client.query<{ read_at: Date | null; passed: boolean }>(
            `SELECT read_at, passed FROM ${this.sqlSchema}.learning_progress
              WHERE principal_id = $1 AND path_id = $2 AND article_id = $3 AND cycle = $4`,
            [principal.id, input.pathId, membership.prerequisite_article_id, cycle],
          );
          if (!prerequisite.rows[0]?.read_at || !prerequisite.rows[0]?.passed) {
            throw new ApiError(
              'ACCESS_DENIED',
              'Prasyarat jalur belum diselesaikan pada siklus ini',
            );
          }
        }

        const bank = await client.query<{ id: string; is_test: boolean }>(
          `SELECT id, is_test FROM ${this.sqlSchema}.question_banks
            WHERE article_id = $1 AND language = $2 AND status = 'VALIDATED'
              AND ($2 = 'id' OR reviewed_at IS NOT NULL)
            ORDER BY version DESC LIMIT 1`,
          [input.articleId, input.language ?? 'id'],
        );
        if (!bank.rows[0]) {
          throw new ApiError('DEPENDENCY_UNAVAILABLE', 'Bank soal tervalidasi belum tersedia');
        }
        const mc = await client.query<{
          id: string;
          position: number;
          stem: string;
          options: unknown;
          correct_key: ChoiceKey;
          explanation: string;
        }>(
          `SELECT id, position, stem, options, correct_key, explanation
             FROM ${this.sqlSchema}.questions_mc
            WHERE bank_id = $1 AND source_id IS NOT NULL ORDER BY position`,
          [bank.rows[0].id],
        );
        const essays = await client.query<{
          id: string;
          position: number;
          stem: string;
          rubric: string;
          max_score: number;
        }>(
          `SELECT id, position, stem, rubric, max_score
             FROM ${this.sqlSchema}.questions_essay
            WHERE bank_id = $1 AND source_id IS NOT NULL ORDER BY position`,
          [bank.rows[0].id],
        );
        if (mc.rowCount !== policy.mc_count || essays.rowCount !== policy.essay_count) {
          throw new ApiError('DEPENDENCY_UNAVAILABLE', 'Bank soal tidak lengkap');
        }

        const attemptId = randomUUID();
        const startedAt = this.now();
        const deadlineAt = new Date(startedAt.getTime() + policy.duration_minutes * 60_000);
        await client.query(
          `INSERT INTO ${this.sqlSchema}.exam_attempts
             (id, principal_id, article_id, path_id, cycle, bank_snapshot_id,
              started_at, deadline_at, policy_version, is_test)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [
            attemptId,
            principal.id,
            input.articleId,
            input.pathId,
            cycle,
            bank.rows[0].id,
            startedAt,
            deadlineAt,
            policy.version,
            principal.fixture || bank.rows[0].is_test,
          ],
        );
        for (const question of mc.rows) {
          await client.query(
            `INSERT INTO ${this.sqlSchema}.attempt_mc_answers
               (attempt_id, question_id, position_snapshot, stem_snapshot, options_snapshot,
                correct_key_snapshot, explanation_snapshot)
             VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7)`,
            [
              attemptId,
              question.id,
              question.position,
              question.stem,
              JSON.stringify(question.options),
              question.correct_key,
              question.explanation,
            ],
          );
        }
        for (const question of essays.rows) {
          await client.query(
            `INSERT INTO ${this.sqlSchema}.attempt_essay_answers
               (attempt_id, question_id, position_snapshot, stem_snapshot,
                rubric_snapshot, max_score_snapshot)
             VALUES ($1,$2,$3,$4,$5,$6)`,
            [
              attemptId,
              question.id,
              question.position,
              question.stem,
              question.rubric,
              question.max_score,
            ],
          );
        }
        await this.audit(client, principal, 'EXAM_ATTEMPT_STARTED', 'exam_attempt', attemptId, {
          pathId: input.pathId,
          articleId: input.articleId,
          cycle,
        });
        return {
          id: attemptId,
          status: 'ACTIVE' as const,
          startedAt: startedAt.toISOString(),
          deadlineAt: deadlineAt.toISOString(),
          cycle,
        };
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        const current = await this.pool.query<AttemptRow>(
          `SELECT * FROM ${this.sqlSchema}.exam_attempts
            WHERE principal_id = $1 AND article_id = $2 AND path_id = $3 AND status = 'ACTIVE'
            ORDER BY started_at DESC LIMIT 1`,
          [principal.id, input.articleId, input.pathId],
        );
        if (current.rows[0]) return this.attemptSummary(current.rows[0]);
      }
      throw error;
    }
  }

  async getAttempt(principal: Principal, attemptId: string) {
    this.assertApproved(principal);
    return inTransaction(this.pool, async (client) => {
      let attempt = await this.loadAttempt(client, attemptId, true);
      this.assertAttemptAccess(principal, attempt);
      if (attempt.status === 'ACTIVE' && attempt.deadline_at.getTime() <= this.now().getTime()) {
        attempt = await this.submitLocked(client, attempt, true);
      }
      return this.loadAttemptView(client, principal, attempt);
    });
  }

  async saveAnswers(
    principal: Principal,
    attemptId: string,
    input: {
      mcAnswers?: Array<{ questionId: string; selectedKey: ChoiceKey }>;
      essayAnswers?: Array<{ questionId: string; answerText: string }>;
    },
  ) {
    this.assertMember(principal);
    if ((input.mcAnswers?.length ?? 0) + (input.essayAnswers?.length ?? 0) === 0) {
      throw new ApiError('VALIDATION_FAILED', 'Minimal satu jawaban diperlukan');
    }
    return inTransaction(this.pool, async (client) => {
      let attempt = await this.loadAttempt(client, attemptId, true);
      this.assertAttemptOwner(principal, attempt);
      if (attempt.status !== 'ACTIVE') return this.attemptSummary(attempt);
      if (attempt.deadline_at.getTime() <= this.now().getTime()) {
        attempt = await this.submitLocked(client, attempt, true);
        return this.attemptSummary(attempt);
      }
      for (const answer of input.mcAnswers ?? []) {
        if (!['A', 'B', 'C', 'D'].includes(answer.selectedKey)) {
          throw new ApiError('VALIDATION_FAILED', 'Pilihan jawaban tidak valid');
        }
        const result = await client.query(
          `UPDATE ${this.sqlSchema}.attempt_mc_answers
              SET selected_key = $3, saved_at = CURRENT_TIMESTAMP
            WHERE attempt_id = $1 AND question_id = $2`,
          [attemptId, answer.questionId, answer.selectedKey],
        );
        if (result.rowCount !== 1) throw new ApiError('VALIDATION_FAILED', 'Soal PG tidak sah');
      }
      for (const answer of input.essayAnswers ?? []) {
        if (answer.answerText.length > 10_000) {
          throw new ApiError('PAYLOAD_TOO_LARGE', 'Jawaban esai terlalu panjang');
        }
        const result = await client.query(
          `UPDATE ${this.sqlSchema}.attempt_essay_answers
              SET answer_text = $3, saved_at = CURRENT_TIMESTAMP
            WHERE attempt_id = $1 AND question_id = $2`,
          [attemptId, answer.questionId, answer.answerText],
        );
        if (result.rowCount !== 1) throw new ApiError('VALIDATION_FAILED', 'Soal esai tidak sah');
      }
      return { ...this.attemptSummary(attempt), savedAt: this.now().toISOString() };
    });
  }

  async submitAttempt(principal: Principal, attemptId: string) {
    this.assertMember(principal);
    return inTransaction(this.pool, async (client) => {
      const attempt = await this.loadAttempt(client, attemptId, true);
      this.assertAttemptOwner(principal, attempt);
      if (attempt.status !== 'ACTIVE') return this.attemptSummary(attempt);
      const incomplete = await client.query<{ mc_missing: string; essay_missing: string }>(
        `SELECT
           (SELECT COUNT(*) FROM ${this.sqlSchema}.attempt_mc_answers
             WHERE attempt_id = $1 AND selected_key IS NULL) AS mc_missing,
           (SELECT COUNT(*) FROM ${this.sqlSchema}.attempt_essay_answers
             WHERE attempt_id = $1 AND btrim(answer_text) = '') AS essay_missing`,
        [attemptId],
      );
      if (
        attempt.deadline_at.getTime() > this.now().getTime() &&
        (Number(incomplete.rows[0]?.mc_missing ?? 0) > 0 ||
          Number(incomplete.rows[0]?.essay_missing ?? 0) > 0)
      ) {
        throw new ApiError('VALIDATION_FAILED', 'Seluruh 20 PG dan 5 esai wajib dijawab');
      }
      return this.attemptSummary(
        await this.submitLocked(
          client,
          attempt,
          attempt.deadline_at.getTime() <= this.now().getTime(),
        ),
      );
    });
  }

  async gradeAttempt(
    owner: Principal,
    attemptId: string,
    input: { scores: Array<{ questionId: string; score: number; note?: string }>; reason?: string },
  ) {
    this.assertOwner(owner);
    if (new Set(input.scores.map((item) => item.questionId)).size !== input.scores.length) {
      throw new ApiError('VALIDATION_FAILED', 'Soal esai ganda dalam penilaian');
    }
    return inTransaction(this.pool, async (client) => {
      const attempt = await this.loadAttempt(client, attemptId, true);
      // D09: validasi bentuk rubrik memakai snapshot kebijakan attempt,
      // bukan angka kini — perubahan aturan tidak menyentuh attempt lama.
      const policy = await this.loadPolicy(client, attempt.policy_version);
      if (input.scores.length !== policy.essay_count) {
        throw new ApiError(
          'VALIDATION_FAILED',
          `Nilai untuk tepat ${policy.essay_count} esai diperlukan`,
        );
      }
      if (
        input.scores.some(
          (item) =>
            !Number.isFinite(item.score) || item.score < 0 || item.score > policy.essay_max_score,
        )
      ) {
        throw new ApiError(
          'VALIDATION_FAILED',
          `Nilai esai harus 0 sampai ${policy.essay_max_score}`,
        );
      }
      if (!['SUBMITTED', 'GRADING', 'REVIEW', 'GRADED'].includes(attempt.status)) {
        throw new ApiError('VERSION_CONFLICT', 'Attempt belum dikirim');
      }
      const isRevision = attempt.total_score !== null;
      if (isRevision && (input.reason?.trim().length ?? 0) < 5) {
        throw new ApiError('VALIDATION_FAILED', 'Alasan perubahan nilai minimal 5 karakter');
      }
      for (const score of input.scores) {
        const updated = await client.query(
          `UPDATE ${this.sqlSchema}.attempt_essay_answers
              SET score_given = $3, owner_note = $4, saved_at = CURRENT_TIMESTAMP
            WHERE attempt_id = $1 AND question_id = $2`,
          [attemptId, score.questionId, score.score, score.note?.trim() ?? ''],
        );
        if (updated.rowCount !== 1) throw new ApiError('VALIDATION_FAILED', 'Soal esai tidak sah');
      }
      const essayScore = input.scores.reduce((sum, item) => sum + item.score, 0);
      const pgScore = Number(attempt.pg_score ?? 0);
      const totalScore = pgScore + essayScore;
      const passed = totalScore >= 80;
      await client.query(
        `UPDATE ${this.sqlSchema}.attempt_mc_answers
            SET correct_key_revealed = correct_key_snapshot,
                is_correct = selected_key = correct_key_snapshot,
                points_earned = CASE WHEN selected_key = correct_key_snapshot THEN 3 ELSE 0 END
          WHERE attempt_id = $1`,
        [attemptId],
      );
      await client.query(
        `UPDATE ${this.sqlSchema}.exam_attempts
            SET status = 'GRADED', essay_score = $2, total_score = $3, passed = $4,
                graded_by = $5, graded_at = CURRENT_TIMESTAMP,
                score_revision_count = score_revision_count + $6,
                updated_at = CURRENT_TIMESTAMP
          WHERE id = $1`,
        [attemptId, essayScore, totalScore, passed, owner.id, isRevision ? 1 : 0],
      );
      await client.query(
        `UPDATE ${this.sqlSchema}.grade_reviews
            SET status = 'RESOLVED', owner_response = $2, updated_at = CURRENT_TIMESTAMP
          WHERE attempt_id = $1 AND status IN ('PENDING','UNDER_REVIEW')`,
        [attemptId, input.reason?.trim() || 'Penilaian telah ditinjau dan difinalkan Admin.'],
      );
      if (isRevision) {
        await client.query(
          `INSERT INTO ${this.sqlSchema}.score_revisions
             (id, attempt_id, revised_by, old_total_score, new_total_score, reason)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [
            randomUUID(),
            attemptId,
            owner.id,
            Number(attempt.total_score),
            totalScore,
            input.reason!.trim(),
          ],
        );
      }
      if (attempt.path_id) {
        await client.query(
          `UPDATE ${this.sqlSchema}.learning_progress
              SET best_score = GREATEST(COALESCE(best_score, 0), $5),
                  passed = passed OR $6, updated_at = CURRENT_TIMESTAMP
            WHERE principal_id = $1 AND path_id = $2 AND article_id = $3 AND cycle = $4`,
          [
            attempt.principal_id,
            attempt.path_id,
            attempt.article_id,
            attempt.cycle,
            totalScore,
            passed,
          ],
        );
        if (passed) {
          await client.query(
            `UPDATE ${this.sqlSchema}.learning_cycles SET status = 'ACTIVE', reset_reason = NULL
              WHERE principal_id = $1 AND path_id = $2 AND cycle = $3
                AND status = 'RESET_REQUIRED'`,
            [attempt.principal_id, attempt.path_id, attempt.cycle],
          );
        } else {
          const attempts = await client.query<{ count: string }>(
            `SELECT COUNT(*) AS count FROM ${this.sqlSchema}.exam_attempts
              WHERE principal_id = $1 AND article_id = $2 AND cycle = $3`,
            [attempt.principal_id, attempt.article_id, attempt.cycle],
          );
          if (Number(attempts.rows[0]?.count ?? 0) >= 3) {
            await client.query(
              `UPDATE ${this.sqlSchema}.learning_cycles
                  SET status = 'RESET_REQUIRED', reset_reason = 'Tiga attempt belum lulus'
                WHERE principal_id = $1 AND path_id = $2 AND cycle = $3
                  AND status = 'ACTIVE'`,
              [attempt.principal_id, attempt.path_id, attempt.cycle],
            );
          }
        }
        await this.completeCycleIfEligible(
          client,
          attempt.principal_id,
          attempt.path_id,
          attempt.cycle,
        );
      }
      await this.audit(
        client,
        owner,
        isRevision ? 'EXAM_SCORE_REVISED' : 'EXAM_GRADED',
        'exam_attempt',
        attemptId,
        { passed, totalScore, reason: input.reason },
      );
      return { id: attemptId, status: 'GRADED' as const, pgScore, essayScore, totalScore, passed };
    });
  }

  async requestGradeReview(
    principal: Principal,
    attemptId: string,
    input: { reason: string; idempotencyKey: string },
  ) {
    this.assertMember(principal);
    if (input.reason.trim().length < 10 || input.idempotencyKey.trim().length < 8) {
      throw new ApiError('VALIDATION_FAILED', 'Alasan dan kunci idempotensi tidak valid');
    }
    return inTransaction(this.pool, async (client) => {
      const attempt = await this.loadAttempt(client, attemptId, true);
      this.assertAttemptOwner(principal, attempt);
      const existing = await client.query<{
        id: string;
        attempt_id: string;
        principal_id: string;
        reason: string;
        status: string;
      }>(
        `SELECT id, attempt_id, principal_id, reason, status
           FROM ${this.sqlSchema}.grade_reviews WHERE idempotency_key = $1`,
        [input.idempotencyKey],
      );
      if (existing.rows[0]) {
        if (
          existing.rows[0].attempt_id !== attemptId ||
          existing.rows[0].principal_id !== principal.id ||
          existing.rows[0].reason !== input.reason.trim()
        ) {
          throw new ApiError(
            'IDEMPOTENCY_CONFLICT',
            'Kunci idempotensi sudah dipakai payload lain',
          );
        }
        return { id: existing.rows[0].id, status: existing.rows[0].status };
      }
      if (attempt.status !== 'GRADED') {
        throw new ApiError('VERSION_CONFLICT', 'Nilai belum final');
      }
      const reviewId = randomUUID();
      await client.query(
        `INSERT INTO ${this.sqlSchema}.grade_reviews
           (id, attempt_id, principal_id, reason, idempotency_key)
         VALUES ($1,$2,$3,$4,$5)`,
        [reviewId, attemptId, principal.id, input.reason.trim(), input.idempotencyKey],
      );
      await client.query(
        `UPDATE ${this.sqlSchema}.exam_attempts SET status = 'REVIEW', updated_at = CURRENT_TIMESTAMP
          WHERE id = $1`,
        [attemptId],
      );
      await this.audit(client, principal, 'GRADE_REVIEW_REQUESTED', 'exam_attempt', attemptId);
      return { id: reviewId, status: 'PENDING' as const };
    });
  }

  async listGradingQueue(owner: Principal, limit = 20) {
    this.assertOwner(owner);
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const result = await this.pool.query<{
      id: string;
      status: ExamAttemptStatus;
      submitted_at: Date;
      article_id: string;
      article_title: string;
      age_seconds: string;
      identity_label: string;
    }>(
      `SELECT ea.id, ea.status, ea.submitted_at, ea.article_id, a.title AS article_title,
              EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - ea.submitted_at))::text AS age_seconds,
              'Peserta-' || upper(substr(md5(ea.principal_id::text), 1, 8)) AS identity_label
         FROM ${this.sqlSchema}.exam_attempts ea
         JOIN ${this.sqlSchema}.articles a ON a.id = ea.article_id
        WHERE ea.status IN ('SUBMITTED','GRADING','REVIEW')
        ORDER BY ea.submitted_at ASC LIMIT $1`,
      [safeLimit],
    );
    return result.rows.map((row) => ({
      id: row.id,
      status: row.status,
      submittedAt: row.submitted_at.toISOString(),
      articleId: row.article_id,
      articleTitle: row.article_title,
      ageSeconds: Math.max(0, Math.floor(Number(row.age_seconds))),
      identityLabel: row.identity_label,
    }));
  }

  async claimAttemptForGrading(owner: Principal, attemptId: string) {
    this.assertOwner(owner);
    return inTransaction(this.pool, async (client) => {
      const attempt = await this.loadAttempt(client, attemptId, true);
      if (!['SUBMITTED', 'GRADING', 'REVIEW'].includes(attempt.status)) {
        throw new ApiError('VERSION_CONFLICT', 'Attempt tidak berada dalam antrean penilaian');
      }
      if (attempt.status === 'SUBMITTED') {
        await client.query(
          `UPDATE ${this.sqlSchema}.exam_attempts
              SET status = 'GRADING', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
          [attemptId],
        );
      }
      if (attempt.status === 'REVIEW') {
        await client.query(
          `UPDATE ${this.sqlSchema}.grade_reviews
              SET status = 'UNDER_REVIEW', updated_at = CURRENT_TIMESTAMP
            WHERE attempt_id = $1 AND status = 'PENDING'`,
          [attemptId],
        );
      }
      await this.audit(client, owner, 'EXAM_GRADING_CLAIMED', 'exam_attempt', attemptId);
      return {
        id: attemptId,
        status: attempt.status === 'SUBMITTED' ? ('GRADING' as const) : attempt.status,
      };
    });
  }

  async restartLearningCycle(principal: Principal, pathId: string) {
    this.assertMember(principal);
    return inTransaction(this.pool, async (client) => {
      const latest = await client.query<{ cycle: number; status: string }>(
        `SELECT cycle, status FROM ${this.sqlSchema}.learning_cycles
          WHERE principal_id = $1 AND path_id = $2 ORDER BY cycle DESC LIMIT 1 FOR UPDATE`,
        [principal.id, pathId],
      );
      if (!latest.rows[0] || latest.rows[0].status !== 'RESET_REQUIRED') {
        throw new ApiError('VERSION_CONFLICT', 'Siklus ulang belum diwajibkan');
      }
      const nextCycle = latest.rows[0].cycle + 1;
      await client.query(
        `INSERT INTO ${this.sqlSchema}.learning_cycles
           (id, principal_id, path_id, cycle, status)
         VALUES ($1,$2,$3,$4,'ACTIVE')`,
        [randomUUID(), principal.id, pathId, nextCycle],
      );
      await this.audit(client, principal, 'LEARNING_CYCLE_RESTARTED', 'learning_path', pathId, {
        previousCycle: latest.rows[0].cycle,
        nextCycle,
      });
      return { pathId, cycle: nextCycle, status: 'ACTIVE' as const, progressReset: true };
    });
  }

  async issueCertificate(principal: Principal, pathId: string) {
    this.assertMember(principal);
    return inTransaction(this.pool, async (client) => {
      const existing = await client.query<{
        certificate_number: string;
        status: string;
        issued_at: Date;
      }>(
        `SELECT certificate_number, status, issued_at FROM ${this.sqlSchema}.certificates
          WHERE principal_id = $1 AND path_id = $2 AND status = 'ACTIVE' FOR UPDATE`,
        [principal.id, pathId],
      );
      if (existing.rows[0]) {
        return {
          certificateNumber: existing.rows[0].certificate_number,
          status: existing.rows[0].status,
          issuedAt: existing.rows[0].issued_at.toISOString(),
        };
      }
      const path = await client.query<{ name: string; version: number; minimum_score: number }>(
        `SELECT name, version, minimum_score FROM ${this.sqlSchema}.learning_paths
          WHERE id = $1 AND status = 'PUBLISHED'`,
        [pathId],
      );
      if (!path.rows[0]) throw new ApiError('NOT_FOUND', 'Jalur belajar tidak ditemukan');
      const cycle = await client.query<{ cycle: number; completed_at: Date | null }>(
        `SELECT cycle, completed_at FROM ${this.sqlSchema}.learning_cycles
          WHERE principal_id = $1 AND path_id = $2 AND status = 'COMPLETED'
          ORDER BY cycle DESC LIMIT 1`,
        [principal.id, pathId],
      );
      if (!cycle.rows[0]?.completed_at) {
        throw new ApiError('ACCESS_DENIED', 'Seluruh jalur dan ujian wajib harus selesai');
      }
      const incomplete = await client.query<{ count: string }>(
        `SELECT COUNT(*) AS count
           FROM ${this.sqlSchema}.learning_path_articles lpa
      LEFT JOIN ${this.sqlSchema}.learning_progress lp
             ON lp.path_id = lpa.path_id AND lp.article_id = lpa.article_id
            AND lp.principal_id = $2 AND lp.cycle = $3
          WHERE lpa.path_id = $1
            AND (lp.read_at IS NULL OR (lpa.is_exam_required AND
                 (NOT COALESCE(lp.passed, false) OR COALESCE(lp.best_score, 0) < $4)))`,
        [pathId, principal.id, cycle.rows[0].cycle, path.rows[0].minimum_score],
      );
      if (Number(incomplete.rows[0]?.count ?? 0) > 0) {
        throw new ApiError('ACCESS_DENIED', 'Syarat sertifikat belum lengkap');
      }
      const identity = await client.query<{ full_name: string | null }>(
        `SELECT full_name FROM ${this.sqlSchema}.principals WHERE id = $1`,
        [principal.id],
      );
      const fullName = identity.rows[0]?.full_name?.trim();
      if (!fullName) throw new ApiError('VALIDATION_FAILED', 'Nama lengkap pendaftaran diperlukan');

      const certificateId = randomUUID();
      const number = `MDV-${this.now().getUTCFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`;
      await client.query(
        `INSERT INTO ${this.sqlSchema}.certificates
           (id, certificate_number, principal_id, path_id, path_version_snapshot,
            path_name_snapshot, full_name_snapshot, completed_at, is_test)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          certificateId,
          number,
          principal.id,
          pathId,
          path.rows[0].version,
          path.rows[0].name,
          fullName,
          cycle.rows[0].completed_at,
          principal.fixture,
        ],
      );
      await client.query(
        `UPDATE ${this.sqlSchema}.certificates SET replaced_by = $3
          WHERE principal_id = $1 AND path_id = $2 AND status = 'REPLACED'
            AND replaced_by IS NULL`,
        [principal.id, pathId, certificateId],
      );
      await client.query(
        `INSERT INTO ${this.sqlSchema}.certificate_audits
           (id, certificate_id, action, performed_by, note)
         VALUES ($1,$2,'ISSUED',$3,'Syarat jalur dan ujian terverifikasi server')`,
        [randomUUID(), certificateId, principal.id],
      );
      return {
        certificateNumber: number,
        status: 'ACTIVE' as const,
        issuedAt: this.now().toISOString(),
        statement: 'Pencapaian internal, bukan ijazah resmi',
      };
    });
  }

  async verifyCertificate(principal: Principal, certificateNumber: string) {
    this.assertApproved(principal);
    return inTransaction(this.pool, async (client) => {
      const result = await client.query<{
        id: string;
        principal_id: string;
        certificate_number: string;
        path_name_snapshot: string;
        full_name_snapshot: string;
        completed_at: Date;
        issued_at: Date;
        status: string;
      }>(
        `SELECT id, principal_id, certificate_number, path_name_snapshot,
                full_name_snapshot, completed_at, issued_at, status
           FROM ${this.sqlSchema}.certificates WHERE certificate_number = $1`,
        [certificateNumber],
      );
      const certificate = result.rows[0];
      if (
        !certificate ||
        (principal.role !== 'OWNER' && certificate.principal_id !== principal.id)
      ) {
        throw new ApiError('NOT_FOUND', 'Sertifikat tidak ditemukan');
      }
      await client.query(
        `INSERT INTO ${this.sqlSchema}.certificate_audits
           (id, certificate_id, action, performed_by, note)
         VALUES ($1,$2,'VERIFIED',$3,'Verifikasi terautentikasi')`,
        [randomUUID(), certificate.id, principal.id],
      );
      return {
        certificateNumber: certificate.certificate_number,
        ownerName: certificate.full_name_snapshot,
        pathName: certificate.path_name_snapshot,
        completedAt: certificate.completed_at.toISOString(),
        issuedAt: certificate.issued_at.toISOString(),
        status: certificate.status,
        statement: 'Pencapaian internal, bukan ijazah resmi',
      };
    });
  }

  async changeCertificateStatus(
    owner: Principal,
    certificateNumber: string,
    input: { status: 'REPLACED' | 'REVOKED'; reason: string },
  ) {
    this.assertOwner(owner);
    if (input.reason.trim().length < 5) {
      throw new ApiError('VALIDATION_FAILED', 'Alasan perubahan minimal 5 karakter');
    }
    return inTransaction(this.pool, async (client) => {
      const certificate = await client.query<{ id: string; status: string }>(
        `SELECT id, status FROM ${this.sqlSchema}.certificates
          WHERE certificate_number = $1 FOR UPDATE`,
        [certificateNumber],
      );
      if (!certificate.rows[0]) throw new ApiError('NOT_FOUND', 'Sertifikat tidak ditemukan');
      if (certificate.rows[0].status !== 'ACTIVE') {
        throw new ApiError('VERSION_CONFLICT', 'Sertifikat sudah tidak aktif');
      }
      await client.query(
        `UPDATE ${this.sqlSchema}.certificates
            SET status = $2, revoked_at = CURRENT_TIMESTAMP, revoke_reason = $3
          WHERE id = $1`,
        [certificate.rows[0].id, input.status, input.reason.trim()],
      );
      await client.query(
        `INSERT INTO ${this.sqlSchema}.certificate_audits
           (id, certificate_id, action, performed_by, note)
         VALUES ($1,$2,$3,$4,$5)`,
        [randomUUID(), certificate.rows[0].id, input.status, owner.id, input.reason.trim()],
      );
      return { certificateNumber, status: input.status };
    });
  }

  async getAiAvailability(principal: Principal) {
    this.assertApproved(principal);
    const active = await this.pool.query<{ id: string; deadline_at: Date }>(
      `SELECT id, deadline_at FROM ${this.sqlSchema}.exam_attempts
        WHERE principal_id = $1 AND status = 'ACTIVE' AND deadline_at > $2
        ORDER BY deadline_at ASC LIMIT 1`,
      [principal.id, this.now()],
    );
    return active.rows[0]
      ? {
          allowed: false,
          reason: 'EXAM_ACTIVE',
          attemptId: active.rows[0].id,
          until: active.rows[0].deadline_at.toISOString(),
          scope: 'MADEVI_AI_ONLY',
        }
      : { allowed: true, reason: 'NO_ACTIVE_EXAM', scope: 'MADEVI_AI_ONLY' };
  }

  private async submitLocked(client: PoolClient, attempt: AttemptRow, timedOut: boolean) {
    if (attempt.status !== 'ACTIVE') return attempt;
    const score = await client.query<{ score: string }>(
      `SELECT COALESCE(SUM(CASE WHEN selected_key = correct_key_snapshot THEN 3 ELSE 0 END), 0)::text AS score
         FROM ${this.sqlSchema}.attempt_mc_answers WHERE attempt_id = $1`,
      [attempt.id],
    );
    const pgScore = Number(score.rows[0]?.score ?? 0);
    const submittedAt = this.now();
    const updated = await client.query<AttemptRow>(
      `UPDATE ${this.sqlSchema}.exam_attempts
          SET status = 'SUBMITTED', submitted_at = $2, timed_out = $3,
              pg_score = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND status = 'ACTIVE' RETURNING *`,
      [attempt.id, submittedAt, timedOut, pgScore],
    );
    const row = updated.rows[0] ?? attempt;
    if (row.path_id) {
      const attempts = await client.query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM ${this.sqlSchema}.exam_attempts
          WHERE principal_id = $1 AND article_id = $2 AND cycle = $3`,
        [row.principal_id, row.article_id, row.cycle],
      );
      await client.query(
        `UPDATE ${this.sqlSchema}.learning_progress
            SET attempts_used = LEAST(3, $5), updated_at = CURRENT_TIMESTAMP
          WHERE principal_id = $1 AND path_id = $2 AND article_id = $3 AND cycle = $4`,
        [
          row.principal_id,
          row.path_id,
          row.article_id,
          row.cycle,
          Number(attempts.rows[0]?.count ?? 1),
        ],
      );
    }
    return row;
  }

  private async loadAttempt(client: PoolClient, attemptId: string, forUpdate = false) {
    const result = await client.query<AttemptRow>(
      `SELECT * FROM ${this.sqlSchema}.exam_attempts WHERE id = $1${forUpdate ? ' FOR UPDATE' : ''}`,
      [attemptId],
    );
    if (!result.rows[0]) throw new ApiError('NOT_FOUND', 'Attempt tidak ditemukan');
    return result.rows[0];
  }

  private async loadAttemptView(client: PoolClient, principal: Principal, attempt: AttemptRow) {
    const mayReveal = principal.role === 'OWNER' || ['GRADED', 'REVIEW'].includes(attempt.status);
    const mc = await client.query<{
      question_id: string;
      position_snapshot: number;
      stem_snapshot: string;
      options_snapshot: unknown;
      selected_key: ChoiceKey | null;
      correct_key_snapshot: ChoiceKey;
      explanation_snapshot: string;
      is_correct: boolean | null;
      points_earned: string | number | null;
    }>(
      `SELECT question_id, position_snapshot, stem_snapshot, options_snapshot, selected_key,
              correct_key_snapshot, explanation_snapshot, is_correct, points_earned
         FROM ${this.sqlSchema}.attempt_mc_answers WHERE attempt_id = $1 ORDER BY position_snapshot`,
      [attempt.id],
    );
    const essays = await client.query<{
      question_id: string;
      position_snapshot: number;
      stem_snapshot: string;
      rubric_snapshot: string;
      answer_text: string;
      score_given: string | number | null;
      owner_note: string | null;
    }>(
      `SELECT question_id, position_snapshot, stem_snapshot, rubric_snapshot, answer_text,
              score_given, owner_note
         FROM ${this.sqlSchema}.attempt_essay_answers
        WHERE attempt_id = $1 ORDER BY position_snapshot`,
      [attempt.id],
    );
    return {
      ...this.attemptSummary(attempt),
      serverNow: this.now().toISOString(),
      remainingSeconds: Math.max(
        0,
        Math.ceil((attempt.deadline_at.getTime() - this.now().getTime()) / 1000),
      ),
      resultFinal: attempt.status === 'GRADED',
      scores: mayReveal
        ? {
            pg: attempt.pg_score === null ? null : Number(attempt.pg_score),
            essay: attempt.essay_score === null ? null : Number(attempt.essay_score),
            total: attempt.total_score === null ? null : Number(attempt.total_score),
            passed: attempt.passed,
          }
        : null,
      mcQuestions: mc.rows.map((question) => ({
        id: question.question_id,
        position: question.position_snapshot,
        stem: question.stem_snapshot,
        options: question.options_snapshot,
        selectedKey: question.selected_key,
        ...(mayReveal
          ? {
              correctKey: question.correct_key_snapshot,
              explanation: question.explanation_snapshot,
              correct: question.is_correct,
              points: question.points_earned === null ? null : Number(question.points_earned),
            }
          : {}),
      })),
      essayQuestions: essays.rows.map((question) => ({
        id: question.question_id,
        position: question.position_snapshot,
        stem: question.stem_snapshot,
        answerText: question.answer_text,
        ...(principal.role === 'OWNER' || attempt.status === 'GRADED'
          ? {
              rubric: question.rubric_snapshot,
              score: question.score_given === null ? null : Number(question.score_given),
              ownerNote: question.owner_note,
            }
          : {}),
      })),
    };
  }

  private async ensureCycle(client: PoolClient, principal: Principal, pathId: string) {
    const eligibility = await client.query<{ status: string }>(
      `SELECT status FROM ${this.sqlSchema}.learning_paths WHERE id = $1 FOR SHARE`,
      [pathId],
    );
    if (
      !eligibility.rows[0] ||
      (eligibility.rows[0].status !== 'PUBLISHED' && principal.role !== 'OWNER')
    ) {
      throw new ApiError('NOT_FOUND', 'Jalur belajar tidak ditemukan');
    }
    const current = await client.query<{ cycle: number; status: string }>(
      `SELECT cycle, status FROM ${this.sqlSchema}.learning_cycles
        WHERE principal_id = $1 AND path_id = $2 ORDER BY cycle DESC LIMIT 1 FOR UPDATE`,
      [principal.id, pathId],
    );
    if (current.rows[0]) {
      if (current.rows[0].status === 'RESET_REQUIRED') {
        throw new ApiError('QUOTA_EXCEEDED', 'Ulangi jalur untuk membuka siklus berikutnya');
      }
      if (current.rows[0].status === 'COMPLETED') {
        throw new ApiError('VERSION_CONFLICT', 'Jalur belajar sudah selesai');
      }
      return current.rows[0].cycle;
    }
    await client.query(
      `INSERT INTO ${this.sqlSchema}.learning_cycles
         (id, principal_id, path_id, cycle, status)
       VALUES ($1,$2,$3,1,'ACTIVE')`,
      [randomUUID(), principal.id, pathId],
    );
    return 1;
  }

  private async assertPathArticle(client: PoolClient, pathId: string, articleId: string) {
    const result = await client.query<{
      prerequisite_article_id: string | null;
      is_exam_required: boolean;
    }>(
      `SELECT prerequisite_article_id, is_exam_required
         FROM ${this.sqlSchema}.learning_path_articles
        WHERE path_id = $1 AND article_id = $2`,
      [pathId, articleId],
    );
    if (!result.rows[0]) throw new ApiError('NOT_FOUND', 'Artikel tidak ada dalam jalur');
    return result.rows[0];
  }

  private async completeCycleIfEligible(
    client: PoolClient,
    principalId: string,
    pathId: string,
    cycle: number,
  ) {
    const remaining = await client.query<{ count: string }>(
      `SELECT COUNT(*) AS count
         FROM ${this.sqlSchema}.learning_path_articles lpa
    LEFT JOIN ${this.sqlSchema}.learning_progress lp
           ON lp.path_id = lpa.path_id AND lp.article_id = lpa.article_id
          AND lp.principal_id = $2 AND lp.cycle = $3
        WHERE lpa.path_id = $1
          AND (lp.read_at IS NULL OR (lpa.is_exam_required AND NOT COALESCE(lp.passed, false)))`,
      [pathId, principalId, cycle],
    );
    if (Number(remaining.rows[0]?.count ?? 0) === 0) {
      await client.query(
        `UPDATE ${this.sqlSchema}.learning_cycles
            SET status = 'COMPLETED', completed_at = CURRENT_TIMESTAMP
          WHERE principal_id = $1 AND path_id = $2 AND cycle = $3 AND status = 'ACTIVE'`,
        [principalId, pathId, cycle],
      );
    }
  }

  private validateQuestionBank(input: QuestionBankInput) {
    if (
      !Array.isArray(input.mcQuestions) ||
      !Array.isArray(input.essayQuestions) ||
      input.mcQuestions.length !== 20 ||
      input.essayQuestions.length !== 5
    ) {
      throw new ApiError('VALIDATION_FAILED', 'Bank harus tepat 20 PG dan 5 esai');
    }
    const expectedMc = new Set(Array.from({ length: 20 }, (_, index) => index + 1));
    const expectedEssay = new Set(Array.from({ length: 5 }, (_, index) => index + 1));
    for (const question of input.mcQuestions) {
      if (
        !question ||
        typeof question !== 'object' ||
        typeof question.position !== 'number' ||
        typeof question.stem !== 'string' ||
        !Array.isArray(question.options) ||
        typeof question.correctKey !== 'string' ||
        typeof question.explanation !== 'string' ||
        typeof question.sourceId !== 'string' ||
        !['EASY', 'MEDIUM', 'HARD'].includes(question.difficulty)
      ) {
        throw new ApiError('VALIDATION_FAILED', 'Struktur soal PG tidak sah');
      }
      expectedMc.delete(question.position);
      if (
        question.options.some(
          (option) =>
            !option ||
            typeof option !== 'object' ||
            typeof option.key !== 'string' ||
            typeof option.text !== 'string',
        )
      ) {
        throw new ApiError('VALIDATION_FAILED', 'Struktur pilihan jawaban tidak sah');
      }
      const keys = question.options.map((option) => option.key);
      if (
        question.stem.trim().length < 10 ||
        question.explanation.trim().length < 3 ||
        !question.sourceId ||
        question.options.length !== 4 ||
        new Set(keys).size !== 4 ||
        !['A', 'B', 'C', 'D'].every((key) => keys.includes(key as ChoiceKey)) ||
        question.options.some((option) => option.text.trim().length === 0) ||
        !keys.includes(question.correctKey)
      ) {
        throw new ApiError(
          'VALIDATION_FAILED',
          'Soal PG, opsi, kunci, alasan, atau sumber tidak sah',
        );
      }
    }
    for (const question of input.essayQuestions) {
      if (
        !question ||
        typeof question !== 'object' ||
        typeof question.position !== 'number' ||
        typeof question.stem !== 'string' ||
        typeof question.rubric !== 'string' ||
        typeof question.sourceId !== 'string' ||
        !['EASY', 'MEDIUM', 'HARD'].includes(question.difficulty)
      ) {
        throw new ApiError('VALIDATION_FAILED', 'Struktur soal esai tidak sah');
      }
      expectedEssay.delete(question.position);
      if (
        question.stem.trim().length < 10 ||
        question.rubric.trim().length < 3 ||
        !question.sourceId
      ) {
        throw new ApiError('VALIDATION_FAILED', 'Soal esai, rubrik, atau sumber tidak sah');
      }
    }
    const normalized = [...input.mcQuestions, ...input.essayQuestions].map((question) =>
      question.stem.trim().toLocaleLowerCase('id-ID'),
    );
    if (expectedMc.size || expectedEssay.size || new Set(normalized).size !== normalized.length) {
      throw new ApiError('VALIDATION_FAILED', 'Posisi atau pertanyaan duplikat');
    }
  }

  private attemptSummary(attempt: AttemptRow) {
    return {
      id: attempt.id,
      articleId: attempt.article_id,
      pathId: attempt.path_id,
      cycle: attempt.cycle,
      status: attempt.status,
      startedAt: attempt.started_at.toISOString(),
      deadlineAt: attempt.deadline_at.toISOString(),
      submittedAt: attempt.submitted_at?.toISOString() ?? null,
      timedOut: attempt.timed_out,
    };
  }

  private assertAttemptAccess(principal: Principal, attempt: AttemptRow) {
    if (principal.role !== 'OWNER' && attempt.principal_id !== principal.id) {
      throw new ApiError('NOT_FOUND', 'Attempt tidak ditemukan');
    }
  }

  private assertAttemptOwner(principal: Principal, attempt: AttemptRow) {
    if (attempt.principal_id !== principal.id)
      throw new ApiError('NOT_FOUND', 'Attempt tidak ditemukan');
  }

  private assertOwner(principal: Principal) {
    if (principal.role !== 'OWNER')
      throw new ApiError('ACCESS_DENIED', 'Hanya Admin yang diizinkan');
  }

  private assertMember(principal: Principal) {
    if (principal.role !== 'MEMBER' || principal.approvalStatus !== 'APPROVED') {
      throw new ApiError('ACCESS_DENIED', 'Member yang disetujui diperlukan');
    }
  }

  private assertApproved(principal: Principal) {
    if (principal.approvalStatus !== 'APPROVED') {
      throw new ApiError('ACCESS_DENIED', 'Akun yang disetujui diperlukan');
    }
  }

  private audit(
    client: PoolClient,
    principal: Principal,
    eventType: string,
    objectType: string,
    objectId: string,
    details?: Record<string, unknown>,
  ) {
    return appendAuditEvent(client, {
      actorPrincipalId: principal.id,
      eventType,
      objectType,
      objectId,
      details,
      fixture: principal.fixture,
      schema: this.schemaName,
    });
  }
}

function isUniqueViolation(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
}
