import { errorResponse, successResponse } from '@/api/response';
import { sidangService } from '@/app/api/v1/line/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/line/sidang/[id]/advance — maju fase sidang
 * (hanya pembuat usulan atau admin grup): TANYA → SANGGAH → VOTING.
 * Voting tidak bisa dibuka sebelum ≥2 argumen SANGGAH tercatat.
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
    const data = await sidangService().advancePhase(auth.principal, id);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
