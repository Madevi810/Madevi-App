import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { parseJsonObject } from '@/api/validation';
import { accountsService, bodyText } from '@/app/api/v1/auth/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';
import { clientIp } from '@/server/client-ip';
import { getPool } from '@/db/pool';
import { SecurityService } from '@/services/security';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    // Rate limit: cegah banjir challengeId acak.
    const guard = await new SecurityService(await getPool()).checkActionRateLimit(
      clientIp(request),
      'verify_contact',
    );
    if (!guard.allowed) {
      throw new ApiError('RATE_LIMITED', 'Terlalu banyak percobaan verifikasi. Coba lagi nanti.');
    }

    const body = await parseJsonObject(request);
    const data = await accountsService().verifyContact({
      challengeId: bodyText(body, 'challengeId', 36),
      code: bodyText(body, 'code', 12),
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
