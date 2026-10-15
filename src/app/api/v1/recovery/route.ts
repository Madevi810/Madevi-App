import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { parseJsonObject } from '@/api/validation';
import { accountsService, bodyText } from '@/app/api/v1/auth/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';
import { getPool } from '@/db/pool';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const guard = await new SecurityService(await getPool()).checkActionRateLimit(clientIp(request), 'recovery');
    if (!guard.allowed) throw new ApiError('RATE_LIMITED', 'Permintaan terlalu sering. Coba lagi nanti.');
    const body = await parseJsonObject(request);
    const data = await accountsService().requestRecovery(bodyText(body, 'identifier', 254));
    return successResponse(data, requestId, { status: 202 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
