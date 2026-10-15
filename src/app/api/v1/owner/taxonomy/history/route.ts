import { errorResponse, successResponse } from '@/api/response';
import { authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { requestIdFromHeaders } from '@/server/request-id';
import { TaxonomyService } from '@/services/taxonomy';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    const rawLimit = Number(new URL(request.url).searchParams.get('limit') ?? '50');
    const data = await new TaxonomyService(getDatabaseClients().pool).history(
      auth.principal,
      Number.isSafeInteger(rawLimit) ? rawLimit : 50,
    );
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
