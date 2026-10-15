import { errorResponse, successResponse } from '@/api/response';
import { duelService } from '@/app/api/v1/ebelanja/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/** GET /api/v1/ebelanja/duels/[id] — detail duel + kartu pro/kontra (publik). */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const data = await duelService().readDuel(id, null);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
