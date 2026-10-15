import { errorResponse, successResponse } from '@/api/response';
import { authenticateRequest } from '@/auth/http';
import { getPool } from '@/db/pool';
import { AdminService } from '@/services/admin';
import { requestIdFromHeaders } from '@/server/request-id';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await authenticateRequest(request, 'OWNER', { humanActivity: true });
    const pool = await getPool();
    const service = new AdminService(pool);
    // P15: antrean prioritas di samping ringkasan — satu Admin, urut risiko+umur.
    const [summary, queue] = await Promise.all([
      service.getDashboardSummary(),
      service.getPriorityQueue(),
    ]);
    return successResponse({ ...summary, queue }, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
