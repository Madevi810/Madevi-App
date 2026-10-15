import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { duelService } from '@/app/api/v1/ebelanja/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
import { ApiError } from '@/api/errors';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/ebelanja/duels/[id]/points — tambah kartu pro/kontra.
 *
 * Body: { productId: string, side: 'PRO' | 'KONTRA', body: string }.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const side = requiredText(body.side, 'side');
    if (side !== 'PRO' && side !== 'KONTRA') {
      throw new ApiError('VALIDATION_FAILED', 'side harus PRO atau KONTRA');
    }
    const data = await duelService().addDuelPoint(
      auth.principal,
      id,
      requiredText(body.productId, 'productId'),
      side,
      requiredText(body.body, 'body'),
    );
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
