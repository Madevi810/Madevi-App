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
    
    const service = new JasaService(getDatabaseClients().pool, getDatabaseSchema());
    const result = await service.updateCatalogItem(id, body);
    
    if (!result.updated) {
      return errorResponse(new ApiError('VALIDATION_FAILED', 'Failed to update catalog item'), requestId);
    }
    
    return successResponse({ message: 'Catalog item updated successfully' }, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const adminSession = await authenticateAdmin(request, { humanActivity: true });
    await assertRequestCsrf(request, adminSession.sessionId, 'ADMIN');
    const { id } = await context.params;
    
    const service = new JasaService(getDatabaseClients().pool, getDatabaseSchema());
    const result = await service.deleteCatalogItem(id);
    
    if (!result.deleted) {
      return errorResponse(new ApiError('VALIDATION_FAILED', 'Failed to delete catalog item or item not found'), requestId);
    }
    
    return successResponse({ message: 'Catalog item deleted successfully' }, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
