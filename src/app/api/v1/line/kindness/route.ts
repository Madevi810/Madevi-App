import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { kindnessService } from '@/app/api/v1/line/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/** GET /api/v1/line/kindness — daftar kebaikan TAYANG (publik, tamu boleh). */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const url = new URL(request.url);
    const city = url.searchParams.get('city') ?? undefined;
    const limit = Number.parseInt(url.searchParams.get('limit') ?? '20', 10);
    const cursor = url.searchParams.get('cursor') ?? undefined;
    const data = await kindnessService().listApproved({
      city,
      limit: Number.isFinite(limit) ? limit : 20,
      cursor,
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** POST /api/v1/line/kindness — buat laporan kebaikan (member). */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await kindnessService().createReport(auth.principal, {
      title: requiredText(body.title, 'title', { minimum: 3, maximum: 120 }),
      story: requiredText(body.story, 'story', { minimum: 10, maximum: 500 }),
      city: requiredText(body.city, 'city'),
      category: requiredText(body.category, 'category'),
      isAnonymous: body.isAnonymous === true,
    });
    return successResponse(data, requestId, { status: 202 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
