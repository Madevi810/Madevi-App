import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { moderationService } from '@/app/api/v1/moderation/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    return successResponse(await moderationService().listOwnAppeals(auth.principal), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await moderationService().submitAppeal(
      auth.principal,
      requiredText(body.caseId, 'caseId'),
      requiredText(body.reason, 'reason', { minimum: 10, maximum: 2000 }),
      requiredText(body.idempotencyKey, 'idempotencyKey', { minimum: 8, maximum: 128 }),
    );
    return successResponse(data, requestId, { status: 202 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
