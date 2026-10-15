import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema, quotedSchema } from '@/db/schema-name';
import { examService, optionalString } from '@/app/api/v1/exams/route-utils';
import type { LearningPathInput } from '@/services/exam';
import { requestIdFromHeaders } from '@/server/request-id';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await authenticateRequest(request, 'OWNER');
    const limit = Math.min(
      Math.max(Number(new URL(request.url).searchParams.get('limit') ?? '20'), 1),
      100,
    );
    const { pool } = getDatabaseClients();
    const schema = quotedSchema(getDatabaseSchema());
    const result = await pool.query(
      `SELECT lp.id, lp.name, lp.difficulty, lp.status,
              (SELECT COUNT(*) FROM ${schema}.learning_path_articles lpa WHERE lpa.path_id = lp.id) AS "articleCount"
         FROM ${schema}.learning_paths lp
        ORDER BY lp.created_at DESC, lp.id DESC
        LIMIT $1`,
      [limit],
    );
    return successResponse(result.rows, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const body = await parseJsonObject(request, 256 * 1024);
    if (!Array.isArray(body.articles))
      throw new ApiError('VALIDATION_FAILED', 'Daftar artikel tidak valid');
    const articles = body.articles.map((item: unknown) => {
      if (!item || typeof item !== 'object')
        throw new ApiError('VALIDATION_FAILED', 'Artikel jalur tidak valid');
      const row = item as Record<string, unknown>;
      if (typeof row.articleId !== 'string' || !Number.isSafeInteger(row.position)) {
        throw new ApiError('VALIDATION_FAILED', 'Artikel jalur tidak valid');
      }
      return {
        articleId: row.articleId,
        position: Number(row.position),
        isExamRequired: row.isExamRequired !== false,
        prerequisiteArticleId: optionalString(row.prerequisiteArticleId) ?? null,
      };
    });
    const difficulty = body.difficulty;
    if (
      difficulty !== undefined &&
      !['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(String(difficulty))
    ) {
      throw new ApiError('VALIDATION_FAILED', 'Kesulitan jalur tidak valid');
    }
    const input: LearningPathInput = {
      businessCode: requiredText(body.businessCode, 'businessCode', { minimum: 3, maximum: 80 }),
      name: requiredText(body.name, 'name', { minimum: 3, maximum: 200 }),
      description: optionalString(body.description),
      difficulty: difficulty as LearningPathInput['difficulty'],
      minimumScore: body.minimumScore === undefined ? undefined : Number(body.minimumScore),
      estimatedHours: body.estimatedHours === undefined ? undefined : Number(body.estimatedHours),
      articles,
    };
    return successResponse(
      await examService().createLearningPath(auth.principal, input),
      requestId,
      {
        status: 201,
      },
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
