import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { parseJsonObject, requiredText } from '@/api/validation';
import { socialService } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
import { getDatabaseClients } from '@/db/client';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    return successResponse(await socialService().listMessageRequests(auth.principal), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const guard = await new SecurityService(getDatabaseClients().pool).checkActionRateLimit(
      clientIp(request),
      'message_request',
    );
    if (!guard.allowed) {
      return errorResponse(
        new ApiError('RATE_LIMITED', 'Batas permintaan pesan tercapai. Coba lagi nanti.'),
        requestId,
      );
    }
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    return successResponse(
      await socialService().createMessageRequest(auth.principal, {
        recipientId: requiredText(body.recipientId, 'recipientId'),
        body: requiredText(body.body, 'body', { maximum: 1000 }),
        idempotencyKey: requiredText(body.idempotencyKey, 'idempotencyKey', {
          minimum: 8,
          maximum: 128,
        }),
        childFixture: body.childFixture === true,
      }),
      requestId,
      { status: 202 },
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
