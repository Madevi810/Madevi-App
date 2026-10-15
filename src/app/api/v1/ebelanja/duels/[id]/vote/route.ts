import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { duelService } from '@/app/api/v1/ebelanja/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/ebelanja/duels/[id]/vote — vote produk pilihan + alasan.
 *
 * Body: { chosenProductId: string, reason: string } — alasan minimal
 * 30 karakter (mendorong vote yang beralasan, bukan asal pilih).
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
    const data = await duelService().castVote(
      auth.principal,
      id,
      requiredText(body.chosenProductId, 'chosenProductId'),
      requiredText(body.reason, 'reason'),
    );
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
