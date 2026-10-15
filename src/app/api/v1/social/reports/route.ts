import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { socialService } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await socialService().report(auth.principal, {
      objectType: requiredText(body.objectType, 'objectType'),
      objectId: requiredText(body.objectId, 'objectId'),
      reason: requiredText(body.reason, 'reason', { minimum: 10, maximum: 2000 }),
      category: typeof body.category === 'string' ? body.category.trim() : undefined,
      idempotencyKey: requiredText(body.idempotencyKey, 'idempotencyKey', {
        minimum: 8,
        maximum: 128,
      }),
    });
    return successResponse(data, requestId, { status: 202 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
