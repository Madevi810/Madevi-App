import { errorResponse, successResponse } from '@/api/response';
import {
  assertRequestCsrf,
  authenticateRequest,
  clearSessionCookies,
  sessionService,
} from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    await sessionService().revokeSession(auth.sessionId, 'LOGOUT');
    return clearSessionCookies(
      successResponse({ status: 'LOGGED_OUT' }, requestId),
      'MEMBER',
      request.url,
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
