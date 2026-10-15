import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { sidangService } from '@/app/api/v1/line/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
import { ApiError } from '@/api/errors';

export const dynamic = 'force-dynamic';

/** GET /api/v1/line/sidang?groupId=… — daftar sidang per grup. */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const url = new URL(request.url);
    const groupId = url.searchParams.get('groupId');
    if (!groupId) {
      throw new ApiError('VALIDATION_FAILED', 'Parameter groupId wajib diisi');
    }
    const includeClosed = url.searchParams.get('includeClosed') === 'true';
    const limit = Number.parseInt(url.searchParams.get('limit') ?? '20', 10);
    const data = await sidangService().listSidang(groupId, {
      limit: Number.isFinite(limit) ? limit : 20,
      includeClosed,
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** POST /api/v1/line/sidang — ajukan sidang baru (anggota aktif grup). */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await sidangService().createSidang(auth.principal, {
      groupId: requiredText(body.groupId, 'groupId'),
      title: requiredText(body.title, 'title', { minimum: 5, maximum: 120 }),
      description: requiredText(body.description, 'description', {
        minimum: 10,
        maximum: 1000,
      }),
      quorumPct: typeof body.quorumPct === 'number' ? body.quorumPct : undefined,
    });
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
