import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { appendSessionCookies, refreshTokenFromRequest, sessionService } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const refresh = refreshTokenFromRequest(request, 'OWNER');
    if (!refresh) throw new ApiError('AUTHENTICATION_REQUIRED', 'Refresh Admin diperlukan');
    const session = await sessionService().rotate(refresh, 'OWNER');
    return appendSessionCookies(
      successResponse({ status: 'REFRESHED', accessExpiresAt: session.accessExpiresAt }, requestId),
      session,
      request.url,
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
