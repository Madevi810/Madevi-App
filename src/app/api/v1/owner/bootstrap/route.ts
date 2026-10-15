import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { accountsService, bodyText } from '@/app/api/v1/auth/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';
import { getPool } from '@/db/pool';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';
import { ApiError } from '@/api/errors';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const guard = await new SecurityService(await getPool()).checkActionRateLimit(
      clientIp(request),
      'login_admin',
    );
    if (!guard.allowed) throw new ApiError('RATE_LIMITED', 'Batas bootstrap Admin tercapai.');
    const body = await parseJsonObject(request, 16 * 1024);
    const data = await accountsService().bootstrapOwner({
      bootstrapKey: bodyText(body, 'bootstrapKey', 256),
      username: bodyText(body, 'username', 32),
      email: bodyText(body, 'email', 254),
      password: bodyText(body, 'password', 128),
      deviceLabel: bodyText(body, 'deviceLabel', 120),
      publicKeyPem: bodyText(body, 'publicKeyPem', 1000),
    });
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
