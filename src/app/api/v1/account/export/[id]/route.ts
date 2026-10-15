import { errorResponse, successResponse } from '@/api/response';
import { authenticateRequest } from '@/auth/http';
import { accountsService } from '@/app/api/v1/auth/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    const { id } = await params;
    const token = new URL(request.url).searchParams.get('token') ?? '';
    const data = await accountsService().downloadExport(auth.principal, id, token);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
