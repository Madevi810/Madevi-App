import { errorResponse, successResponse } from '@/api/response';
import { socialService } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
type Context = { params: Promise<{ id: string }> };
async function mutate(request: Request, context: Context, saved: boolean) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const { id } = await context.params;
    return successResponse(await socialService().setSaved(auth.principal, id, saved), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
export function PUT(request: Request, context: Context) {
  return mutate(request, context, true);
}
export function DELETE(request: Request, context: Context) {
  return mutate(request, context, false);
}
