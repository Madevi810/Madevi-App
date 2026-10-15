import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema, quotedSchema } from '@/db/schema-name';
import { examService } from '@/app/api/v1/exams/route-utils';
import type { QuestionBankInput } from '@/services/exam';
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
      `SELECT qb.id, qb.article_id AS "articleId", qb.language, qb.version, qb.status,
              (SELECT COUNT(*) FROM ${schema}.questions_mc mc WHERE mc.bank_id = qb.id) +
              (SELECT COUNT(*) FROM ${schema}.questions_essay essay WHERE essay.bank_id = qb.id) AS "questionCount"
         FROM ${schema}.question_banks qb
        ORDER BY qb.created_at DESC, qb.id DESC
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
    const body = await parseJsonObject(request, 512 * 1024);
    if (
      (body.language !== 'id' && body.language !== 'en') ||
      typeof body.articleId !== 'string' ||
      !Array.isArray(body.mcQuestions) ||
      !Array.isArray(body.essayQuestions)
    ) {
      throw new ApiError('VALIDATION_FAILED', 'Payload bank soal tidak valid');
    }
    const input = {
      articleId: body.articleId,
      language: body.language,
      translationReviewed: body.translationReviewed === true,
      mcQuestions: body.mcQuestions,
      essayQuestions: body.essayQuestions,
    } as QuestionBankInput;
    return successResponse(
      await examService().createQuestionBank(auth.principal, input),
      requestId,
      {
        status: 201,
      },
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
