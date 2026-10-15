import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, parseLimit } from '@/api/validation';
import { socialService, stringValue } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    const { id } = await context.params;
    const url = new URL(request.url);
    const data = await socialService().listMessages(auth.principal, id, {
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
    // L05 G-07: idempotencyKey opsional dari client; retry memakai key yang sama.
    const rawKey = stringValue(body.idempotencyKey);
    return successResponse(
      await socialService().sendMessage(auth.principal, id, {
        body: stringValue(body.body),
        attachmentId: stringValue(body.attachmentId),
        idempotencyKey:
          rawKey !== undefined && /^[A-Za-z0-9._:-]{8,128}$/.test(rawKey) ? rawKey : undefined,
      }),
      requestId,
      { status: 202 },
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
