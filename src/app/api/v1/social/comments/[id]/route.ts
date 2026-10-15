import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { socialService } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
type Context = { params: Promise<{ id: string }> };
async function auth(request: Request) {
  const a = await authenticateRequest(request, 'MEMBER');
  await assertRequestCsrf(request, a.sessionId, 'MEMBER');
  return a;
}
export async function PATCH(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const a = await auth(request);
    const body = await parseJsonObject(request);
    const { id } = await context.params;
    return successResponse(
      await socialService().updateComment(
        a.principal,
        id,
        requiredText(body.body, 'body', { maximum: 5000 }),
      ),
      requestId,
      { status: 202 },
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
export async function DELETE(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const a = await auth(request);
    const { id } = await context.params;
    return successResponse(await socialService().deleteComment(a.principal, id), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
