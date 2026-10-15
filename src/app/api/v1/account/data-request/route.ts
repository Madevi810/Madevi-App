import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { accountsService } from '@/app/api/v1/auth/route-utils';
import { ApiError } from '@/api/errors';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    if (body.kind !== 'EXPORT' && body.kind !== 'DELETE') {
      throw new ApiError('VALIDATION_FAILED', 'Jenis permintaan data tidak valid');
    }
    const data = await accountsService().requestDataAction(auth.principal, body.kind);
    return successResponse(data, requestId, { status: 202 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
