import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { requestIdFromHeaders } from '@/server/request-id';
import { TaxonomyService } from '@/services/taxonomy';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    const value = new URL(request.url).searchParams.get('revision');
    if (!value || !/^\d+$/.test(value))
      throw new ApiError('VALIDATION_FAILED', 'Revisi export wajib');
    const data = await new TaxonomyService(getDatabaseClients().pool).exportSnapshot(
      auth.principal,
      Number(value),
    );
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
