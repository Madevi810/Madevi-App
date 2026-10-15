import { errorResponse, successResponse } from '@/api/response';
import { requestIdFromHeaders } from '@/server/request-id';
import { authenticateRequest } from '@/auth/http';
import { JasaService } from '@/services/jasa';
import { getDatabaseClients } from '@/db/client';

export const dynamic = 'force-dynamic';

const service = () => new JasaService(getDatabaseClients().pool);

/** GET /api/v1/owner/jasa/orders?kind=UNDANGAN|LOGO|SERVICE — daftar semua order (Admin) */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await authenticateRequest(request, 'OWNER', { humanActivity: true });
    const url = new URL(request.url);
    const kind = url.searchParams.get('kind');
    if (kind === 'LOGO') {
      return successResponse(await service().listAllLogoOrders(), requestId);
    }
    if (kind === 'SERVICE') {
      return successResponse(await service().listAllServiceOrders(), requestId);
    }
    return successResponse(await service().listAllInvitationOrders(), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
