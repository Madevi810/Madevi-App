import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { accountsService, bodyText } from '@/app/api/v1/auth/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    if (body.kind !== 'REGISTRATION' && body.kind !== 'NO_GUARDIAN') {
      throw new ApiError('VALIDATION_FAILED', 'Jenis banding tidak valid');
    }
    const data = await accountsService().submitAppeal(
      auth.principal,
      body.kind,
      bodyText(body, 'reason', 2000),
    );
    return successResponse(data, requestId, { status: 202 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
