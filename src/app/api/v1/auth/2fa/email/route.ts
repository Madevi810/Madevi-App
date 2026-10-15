import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { accountsService, bodyText } from '@/app/api/v1/auth/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const service = accountsService();
    const data =
      body.action === 'confirm'
        ? await service.confirmEmailMfa(
            auth.principal,
            bodyText(body, 'challengeId', 36),
            bodyText(body, 'code', 12),
          )
        : await service.enableEmailMfa(auth.principal);
    return successResponse(data, requestId, { status: body.action === 'confirm' ? 200 : 202 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
