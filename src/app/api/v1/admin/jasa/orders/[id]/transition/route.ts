import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { assertRequestCsrf, authenticateAdmin } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { JasaService, OrderStatus } from '@/services/jasa';
import { requestIdFromHeaders } from '@/server/request-id';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const adminSession = await authenticateAdmin(request, { humanActivity: true });
    await assertRequestCsrf(request, adminSession.sessionId, 'ADMIN');
    const { id } = await context.params;
    const body = await request.json();
    const { kind, nextStatus, priceAgreed } = body as { kind: string, nextStatus: OrderStatus, priceAgreed?: number };

    if (!kind || !nextStatus) {
      throw new Error('Kind and nextStatus are required');
    }

    const service = new JasaService(getDatabaseClients().pool, getDatabaseSchema());
    let result;

    if (kind === 'UNDANGAN') {
      result = await service.transitionInvitationOrder(id, nextStatus, priceAgreed);
    } else if (kind === 'LOGO') {
      result = await service.transitionLogoOrder(id, nextStatus, priceAgreed);
    } else {
      // General service order
      result = await service.transitionServiceOrder(id, nextStatus, { priceAgreed, actor: adminSession.principal.id });
    }

    if (!result.transitioned) {
      return errorResponse(new ApiError('VALIDATION_FAILED', result.reason || 'Failed to transition order'), requestId);
    }

    return successResponse(result, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
