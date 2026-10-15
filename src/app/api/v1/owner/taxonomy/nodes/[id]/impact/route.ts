import { errorResponse, successResponse } from '@/api/response';
import { authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { requestIdFromHeaders } from '@/server/request-id';
import { TaxonomyService } from '@/services/taxonomy';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    const { id } = await params;
    const url = new URL(request.url);
    const data = await new TaxonomyService(getDatabaseClients().pool).impact(auth.principal, {
      nodeId: id,
      targetParentId: url.searchParams.get('targetParentId') ?? undefined,
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
