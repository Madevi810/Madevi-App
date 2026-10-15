import { errorResponse, successResponse } from '@/api/response';
import { lineageService } from '@/app/api/v1/line/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/line/karya/[id]/lineage — pohon silsilah karya ke bawah
 * (remixes) dan ke atas (ancestors), depth-aware.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const data = await lineageService().readLineage(id);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
