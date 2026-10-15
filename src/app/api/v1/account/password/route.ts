import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { accountsService, bodyText } from '@/app/api/v1/auth/route-utils';
import { assertRequestCsrf, authenticateRequest, clearSessionCookies } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await accountsService().changePassword(
      auth.principal,
      bodyText(body, 'currentPassword', 128),
      bodyText(body, 'newPassword', 128),
    );
    return clearSessionCookies(successResponse(data, requestId), 'MEMBER', request.url);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
