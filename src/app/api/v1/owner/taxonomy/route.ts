import { errorResponse, successResponse } from '@/api/response';
import { authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { requestIdFromHeaders } from '@/server/request-id';
import { TaxonomyService } from '@/services/taxonomy';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    if (auth.principal.role !== 'OWNER') throw new Error('Audience Admin tanpa role Admin');
    const data = await new TaxonomyService(getDatabaseClients().pool).summary();
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
