import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { examService } from '@/app/api/v1/exams/route-utils';
import type { ChoiceKey } from '@/services/exam';
import { requestIdFromHeaders } from '@/server/request-id';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request, 256 * 1024);
    if (body.mcAnswers !== undefined && !Array.isArray(body.mcAnswers)) {
      throw new ApiError('VALIDATION_FAILED', 'Jawaban PG tidak valid');
    }
    if (body.essayAnswers !== undefined && !Array.isArray(body.essayAnswers)) {
      throw new ApiError('VALIDATION_FAILED', 'Jawaban esai tidak valid');
    }
    const mcAnswers = (body.mcAnswers ?? []).map((item: unknown) => {
      if (!item || typeof item !== 'object')
        throw new ApiError('VALIDATION_FAILED', 'Jawaban PG tidak valid');
      const row = item as Record<string, unknown>;
      if (typeof row.questionId !== 'string' || typeof row.selectedKey !== 'string') {
        throw new ApiError('VALIDATION_FAILED', 'Jawaban PG tidak valid');
      }
      return { questionId: row.questionId, selectedKey: row.selectedKey as ChoiceKey };
    });
    const essayAnswers = (body.essayAnswers ?? []).map((item: unknown) => {
      if (!item || typeof item !== 'object')
        throw new ApiError('VALIDATION_FAILED', 'Jawaban esai tidak valid');
      const row = item as Record<string, unknown>;
      if (typeof row.questionId !== 'string' || typeof row.answerText !== 'string') {
        throw new ApiError('VALIDATION_FAILED', 'Jawaban esai tidak valid');
      }
      return { questionId: row.questionId, answerText: row.answerText };
    });
    const { id } = await params;
    const data = await examService().saveAnswers(auth.principal, id, { mcAnswers, essayAnswers });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
