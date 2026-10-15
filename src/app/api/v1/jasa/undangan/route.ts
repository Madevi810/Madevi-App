import { errorResponse, successResponse } from '@/api/response';
import { requestIdFromHeaders } from '@/server/request-id';
import { JasaService } from '@/services/jasa';
import { getDatabaseClients } from '@/db/client';

export const dynamic = 'force-dynamic';

const service = () => new JasaService(getDatabaseClients().pool);

/** GET /api/v1/jasa/undangan — galeri template terbit (publik) */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const templates = await service().listPublishedTemplates();
    return successResponse(templates, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
