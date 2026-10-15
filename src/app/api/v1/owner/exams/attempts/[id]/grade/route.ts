import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { examService, optionalString } from '@/app/api/v1/exams/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const body = await parseJsonObject(request);
    if (!Array.isArray(body.scores))
      throw new ApiError('VALIDATION_FAILED', 'Nilai esai tidak valid');
    const scores = body.scores.map((item: unknown) => {
      if (!item || typeof item !== 'object')
        throw new ApiError('VALIDATION_FAILED', 'Nilai esai tidak valid');
      const row = item as Record<string, unknown>;
      if (typeof row.questionId !== 'string' || typeof row.score !== 'number') {
        throw new ApiError('VALIDATION_FAILED', 'Nilai esai tidak valid');
      }
      return { questionId: row.questionId, score: row.score, note: optionalString(row.note) };
    });
    const { id } = await params;
    const data = await examService().gradeAttempt(auth.principal, id, {
      scores,
      reason: optionalString(body.reason),
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
