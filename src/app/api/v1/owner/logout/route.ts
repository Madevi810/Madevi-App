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
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    await sessionService().revokeSession(auth.sessionId, 'LOGOUT');
    return clearSessionCookies(
      successResponse({ status: 'LOGGED_OUT' }, requestId),
      'OWNER',
      request.url,
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
