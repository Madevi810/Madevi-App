import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateAdmin } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { JasaService } from '@/services/jasa';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const adminSession = await authenticateAdmin(request, { humanActivity: true });
    await assertRequestCsrf(request, adminSession.sessionId, 'ADMIN');
    const body = await request.json();
    const service = new JasaService(getDatabaseClients().pool, getDatabaseSchema());
    const result = await service.createCatalogItem(body);
    return successResponse(result, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
