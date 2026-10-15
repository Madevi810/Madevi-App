import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { socialService, stringValue } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
type Context = { params: Promise<{ id: string }> };
async function auth(request: Request) {
  const value = await authenticateRequest(request, 'MEMBER');
  await assertRequestCsrf(request, value.sessionId, 'MEMBER');
  return value;
}
export async function PUT(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const a = await auth(request);
    const body = await parseJsonObject(request);
    const { id } = await context.params;
    return successResponse(
      await socialService().setReaction(a.principal, id, stringValue(body.reaction) ?? ''),
      requestId,
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
    return successResponse(await socialService().setReaction(a.principal, id, null), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
