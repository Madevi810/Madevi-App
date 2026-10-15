import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { accountsService } from '@/app/api/v1/auth/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const { id } = await params;
    const data = await accountsService().revokeOwnerDevice(auth.principal, id);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
