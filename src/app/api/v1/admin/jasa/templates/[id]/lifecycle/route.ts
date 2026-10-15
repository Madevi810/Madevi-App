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
    const { status } = body as { status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' };
    
    if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      throw new Error('Invalid status');
    }

    const service = new JasaService(getDatabaseClients().pool, getDatabaseSchema());
    const result = await service.setTemplateLifecycle(id, status);
    
    if (!result.updated) {
      return errorResponse(new ApiError('VALIDATION_FAILED', 'Failed to update template lifecycle'), requestId);
    }
    
    return successResponse({ message: 'Template lifecycle updated successfully' }, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
