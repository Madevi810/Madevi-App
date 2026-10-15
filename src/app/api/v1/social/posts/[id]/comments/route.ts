import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, parseLimit, requiredText } from '@/api/validation';
import { socialService, stringValue } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await context.params;
    let principalId: string | undefined;
    try {
      const auth = await authenticateRequest(request, 'MEMBER');
      principalId = auth.principal.id;
    } catch {
      // Guest or unauthenticated viewer
    }
    const url = new URL(request.url);
    const data = await socialService().listComments(id, principalId, {
      cursor: url.searchParams.get('cursor') ?? undefined,
      limit: parseLimit(url.searchParams.get('limit')),
    });
    return successResponse(data.items, requestId, {
      page: { nextCursor: data.nextCursor, limit: parseLimit(url.searchParams.get('limit')) },
    });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
export async function POST(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const { id } = await context.params;
    return successResponse(
      await socialService().addComment(
        auth.principal,
        id,
        requiredText(body.body, 'body', { maximum: 5000 }),
        stringValue(body.parentId),
      ),
      requestId,
      { status: 202 },
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
