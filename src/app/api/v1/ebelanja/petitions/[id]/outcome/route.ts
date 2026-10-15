import { errorResponse, successResponse } from '@/api/response';
import { petitionService } from '@/app/api/v1/ebelanja/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/ebelanja/petitions/[id]/outcome — tutup usulan (owner/
 * operator): vote ≥ target → DIKIRIM ke antrean moderasi pemilik,
 * < target → DITOLAK.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const auth = await authenticateRequest(request, 'ADMIN');
    await assertRequestCsrf(request, auth.sessionId, 'ADMIN');
    const data = await petitionService().closePetition(id);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
