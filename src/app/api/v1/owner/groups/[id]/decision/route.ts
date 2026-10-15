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
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const body = await parseJsonObject(request);
    if (body.decision !== 'APPROVE' && body.decision !== 'REJECT')
      throw new ApiError('VALIDATION_FAILED', 'Keputusan tidak valid');
    const { id } = await context.params;
    return successResponse(
      await socialService().decideGroup(auth.principal, id, body.decision),
      requestId,
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
