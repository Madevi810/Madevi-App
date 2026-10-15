import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { JasaService } from '@/services/jasa';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const session = await authenticateRequest(request, 'USER');
    const { id } = await context.params;

    const service = new JasaService(getDatabaseClients().pool, getDatabaseSchema());
    const order = await service.getMyServiceOrder(session.principal.id, id);
    
    if (!order) {
      return errorResponse(new ApiError('NOT_FOUND', 'Order not found or access denied'), requestId);
    }
    
    return successResponse(order, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
