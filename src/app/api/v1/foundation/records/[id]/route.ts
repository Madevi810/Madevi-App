import { errorResponse, successResponse } from '@/api/response';
import { authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { RecordsService } from '@/services/records';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    const { id } = await params;
    const service = new RecordsService(getDatabaseClients().pool);
    const data = await service.get({ principal: auth.principal, id });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
