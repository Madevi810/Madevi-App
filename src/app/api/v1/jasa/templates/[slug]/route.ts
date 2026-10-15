import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { JasaService } from '@/services/jasa';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { slug } = await context.params;
    const service = new JasaService(getDatabaseClients().pool, getDatabaseSchema());
    const template = await service.getTemplateBySlug(slug);
    
    if (!template) {
      return errorResponse(new ApiError('NOT_FOUND', 'Template not found'), requestId);
    }
    
    return successResponse(template, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
