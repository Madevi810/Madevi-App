import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { clinicService } from '@/app/api/v1/line/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/** GET /api/v1/line/clinic — daftar klinik ide aktif. */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') ?? undefined;
    const limit = Number.parseInt(url.searchParams.get('limit') ?? '20', 10);
    const data = await clinicService().listClinics({
      status,
      limit: Number.isFinite(limit) ? limit : 20,
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/**
 * POST /api/v1/line/clinic — buka klinik untuk sebuah karya.
 *
 * Body: { postId: string } — harus post KARYA PUBLISHED milik pembuat.
 */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await clinicService().openClinic(
      auth.principal,
      requiredText(body.postId, 'postId'),
    );
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
