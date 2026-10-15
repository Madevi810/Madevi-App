import { errorResponse, successResponse } from '@/api/response';
import { clinicService } from '@/app/api/v1/line/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/line/clinic/[id] — detail klinik: feedback dikelompokkan
 * per fase + jumlah vote Pilihan Klinik.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const data = await clinicService().readClinic(id);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
