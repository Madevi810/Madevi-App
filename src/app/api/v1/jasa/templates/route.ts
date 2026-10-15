import { errorResponse, successResponse } from '@/api/response';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { JasaService } from '@/services/jasa';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const service = new JasaService(getDatabaseClients().pool, getDatabaseSchema());
    const templates = await service.listPublishedTemplates();
    return successResponse(templates, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
