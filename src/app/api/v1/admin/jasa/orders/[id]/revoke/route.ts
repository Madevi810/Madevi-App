import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { assertRequestCsrf, authenticateAdmin } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { JasaService } from '@/services/jasa';
import { requestIdFromHeaders } from '@/server/request-id';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const adminSession = await authenticateAdmin(request, { humanActivity: true });
    await assertRequestCsrf(request, adminSession.sessionId, 'ADMIN');
    const { id } = await context.params;
    const body = await request.json();
    const { kind } = body as { kind: 'UNDANGAN' | 'LOGO' | 'SERVICE' };

    if (!kind) {
      throw new Error('Kind is required');
    }

    const service = new JasaService(getDatabaseClients().pool, getDatabaseSchema());
    const result = await service.revokeOrderToken(kind, id);

    if (!result.revoked) {
      return errorResponse(new ApiError('VALIDATION_FAILED', 'Failed to revoke token or order not found'), requestId);
    }

    return successResponse({ message: 'Token revoked successfully' }, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
