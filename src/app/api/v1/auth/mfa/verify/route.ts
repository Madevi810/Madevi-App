import { errorResponse, successResponse } from '@/api/response';
import { appendSessionCookies } from '@/auth/http';
import { parseJsonObject } from '@/api/validation';
import { accountsService, bodyText } from '@/app/api/v1/auth/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const body = await parseJsonObject(request);
    const session = await accountsService().verifyLoginMfa({
      challengeId: bodyText(body, 'challengeId', 36),
      code: bodyText(body, 'code', 12),
    });
    const response = successResponse(
      { status: 'AUTHENTICATED', accessExpiresAt: session.accessExpiresAt },
      requestId,
    );
    return appendSessionCookies(response, session, request.url);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
