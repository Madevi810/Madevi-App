import { errorResponse, successResponse } from '@/api/response';
import { sidangService } from '@/app/api/v1/line/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/line/sidang/[id] — detail sidang: argumen per fase + hasil
 * voting (hanya jika sudah ditutup — anti-bandwagon).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const data = await sidangService().readSidang(id);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
