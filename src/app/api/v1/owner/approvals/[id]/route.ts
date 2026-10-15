import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { accountsService } from '@/app/api/v1/auth/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const body = await parseJsonObject(request);
    if (typeof body.approved !== 'boolean') {
      throw new ApiError('VALIDATION_FAILED', 'Keputusan approval tidak valid');
    }
    const { id } = await params;
    const data = await accountsService().approveRegistration(auth.principal, id, body.approved);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
