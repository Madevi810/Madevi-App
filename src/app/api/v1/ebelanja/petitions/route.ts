import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { petitionService } from '@/app/api/v1/ebelanja/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/** GET /api/v1/ebelanja/petitions — daftar usulan produk (publik). */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') ?? undefined;
    const limit = Number.parseInt(url.searchParams.get('limit') ?? '20', 10);
    const data = await petitionService().listPetitions({
      limit: Number.isFinite(limit) ? limit : 20,
      status: status as 'MENUNGGU' | 'DIKIRIM' | 'DITOLAK' | undefined,
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/**
 * POST /api/v1/ebelanja/petitions — usulkan produk afiliasi baru.
 *
 * Body: { productName, link, category, reason }. Link harus dari
 * marketplace resmi (divalidasi server-side; tidak boleh mengarang).
 */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await petitionService().createPetition(auth.principal, {
      productName: requiredText(body.productName, 'productName', {
        minimum: 3,
        maximum: 120,
      }),
      link: requiredText(body.link, 'link'),
      category: requiredText(body.category, 'category'),
      reason: requiredText(body.reason, 'reason', { minimum: 10, maximum: 500 }),
    });
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
