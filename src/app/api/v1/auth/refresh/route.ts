import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { appendSessionCookies, refreshTokenFromRequest, sessionService } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const refresh = refreshTokenFromRequest(request, 'MEMBER');
    if (!refresh) throw new ApiError('AUTHENTICATION_REQUIRED', 'Refresh session diperlukan');
    const session = await sessionService().rotate(refresh, 'MEMBER');
    const response = successResponse(
      { status: 'REFRESHED', accessExpiresAt: session.accessExpiresAt },
      requestId,
    );
    return appendSessionCookies(response, session, request.url);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
