import { errorResponse, successResponse } from '@/api/response';
import { socialService } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
type Context = { params: Promise<{ principalId: string }> };
async function mutate(request: Request, context: Context, blocked: boolean) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const { principalId } = await context.params;
    return successResponse(
      await socialService().setBlock(auth.principal, principalId, blocked),
      requestId,
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
export function PUT(r: Request, c: Context) {
  return mutate(r, c, true);
}
export function DELETE(r: Request, c: Context) {
  return mutate(r, c, false);
}
