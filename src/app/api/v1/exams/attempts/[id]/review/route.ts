import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { examService } from '@/app/api/v1/exams/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const { id } = await params;
    const data = await examService().requestGradeReview(auth.principal, id, {
      reason: requiredText(body.reason, 'reason', { minimum: 10, maximum: 2_000 }),
      idempotencyKey: requiredText(body.idempotencyKey, 'idempotencyKey', {
        minimum: 8,
        maximum: 160,
      }),
    });
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
