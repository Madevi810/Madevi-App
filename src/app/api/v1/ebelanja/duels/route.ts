import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { duelService } from '@/app/api/v1/ebelanja/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/** GET /api/v1/ebelanja/duels — daftar duel produk (publik). */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') ?? undefined;
    const limit = Number.parseInt(url.searchParams.get('limit') ?? '20', 10);
    const data = await duelService().listDuels({
      status,
      limit: Number.isFinite(limit) ? limit : 20,
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** POST /api/v1/ebelanja/duels — buat duel baru (kurator/admin). */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await duelService().createDuel(auth.principal, {
      title: requiredText(body.title, 'title', { minimum: 5, maximum: 120 }),
      productAId: requiredText(body.productAId, 'productAId'),
      productBId: requiredText(body.productBId, 'productBId'),
    });
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
