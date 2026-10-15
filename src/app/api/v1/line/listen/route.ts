import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { listenService } from '@/app/api/v1/line/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/** GET /api/v1/line/listen — daftar sesi Giliran Dengar (publik). */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const url = new URL(request.url);
    const limit = Number.parseInt(url.searchParams.get('limit') ?? '20', 10);
    const includeFinished = url.searchParams.get('includeFinished') === 'true';
    const data = await listenService().listSessions({
      limit: Number.isFinite(limit) ? limit : 20,
      includeFinished,
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** POST /api/v1/line/listen — buat sesi Giliran Dengar baru (member). */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await listenService().createSession(auth.principal, {
      topic: requiredText(body.topic, 'topic', { minimum: 5, maximum: 200 }),
      isAnonymous: body.isAnonymous === true,
    });
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
