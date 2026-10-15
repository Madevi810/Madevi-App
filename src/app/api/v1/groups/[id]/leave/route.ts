import { errorResponse, successResponse } from '@/api/response';
import { socialService } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ id: string }> };

/**
 * POST /api/v1/groups/[id]/leave — keluar grup per anggota (L05 G-08).
 * History/bukti tidak dihapus.
 */
export async function POST(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const { id } = await context.params;
    const data = await socialService().leaveGroup(auth.principal, id);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
