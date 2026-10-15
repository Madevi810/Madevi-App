import { errorResponse, successResponse } from '@/api/response';
import { socialService } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
type Context = { params: Promise<{ id: string }> };
export async function POST(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const { id } = await context.params;
    return successResponse(await socialService().requestGroupJoin(auth.principal, id), requestId, {
      status: 202,
    });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
