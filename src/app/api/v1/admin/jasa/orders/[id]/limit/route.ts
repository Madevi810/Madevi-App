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
    const { kind, limit } = body as { kind: 'UNDANGAN' | 'LOGO' | 'SERVICE', limit: number };

    if (!kind || limit === undefined) {
      throw new Error('Kind and limit are required');
    }

    const service = new JasaService(getDatabaseClients().pool, getDatabaseSchema());
    const result = await service.setRevisionLimit(kind, id, limit);

    if (!result.set) {
      return errorResponse(new ApiError('VALIDATION_FAILED', 'Failed to set revision limit or order not found'), requestId);
    }

    return successResponse({ message: 'Revision limit set successfully' }, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
