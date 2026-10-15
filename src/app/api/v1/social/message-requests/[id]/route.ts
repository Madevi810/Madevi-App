import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { socialService } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
type Context = { params: Promise<{ id: string }> };
export async function POST(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    if (body.decision !== 'ACCEPT' && body.decision !== 'REJECT')
      throw new ApiError('VALIDATION_FAILED', 'Keputusan tidak valid');
    const { id } = await context.params;
    return successResponse(
      await socialService().respondMessageRequest(auth.principal, id, {
        decision: body.decision,
        becomeFriends: body.becomeFriends === true,
      }),
      requestId,
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
