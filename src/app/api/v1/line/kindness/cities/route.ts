import { errorResponse, successResponse } from '@/api/response';
import { kindnessService } from '@/app/api/v1/line/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/** GET /api/v1/line/kindness/cities — jumlah kebaikan TAYANG per kota (publik). */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const data = await kindnessService().cityCounts();
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
