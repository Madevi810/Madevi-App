import { errorResponse, successResponse } from '@/api/response';
import { authenticateRequest } from '@/auth/http';
import { socialService } from '@/app/api/v1/social/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ id: string }> };

/**
 * GET /api/v1/groups/[id] — detail grup + status membership viewer (L05 G-08).
 * Metadata minimal untuk non-anggota; isi grup tidak bocor lewat detail.
 */
export async function GET(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    let viewer = null;
    try {
      const auth = await authenticateRequest(request, 'MEMBER');
      viewer = auth.principal;
    } catch {
      viewer = null;
    }
    const { id } = await context.params;
    const data = await socialService().getGroupDetail(viewer, id);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
