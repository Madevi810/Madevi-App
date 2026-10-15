import { errorResponse, successResponse } from '@/api/response';
import { authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { JasaService } from '@/services/jasa';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const session = await authenticateRequest(request, 'USER');
    const url = new URL(request.url);
    const kindParam = url.searchParams.get('kinds');
    const kinds = kindParam ? kindParam.split(',') : undefined;

    const service = new JasaService(getDatabaseClients().pool, getDatabaseSchema());
    
    // Default to general service orders
    let orders;
    if (kinds && kinds.includes('UNDANGAN') && kinds.length === 1) {
      orders = await service.listMyOrders(session.principal.id);
    } else if (kinds && kinds.includes('LOGO') && kinds.length === 1) {
      orders = await service.listMyLogoOrders(session.principal.id);
    } else {
      orders = await service.listMyServiceOrders(session.principal.id, kinds);
    }
    
    return successResponse(orders, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
