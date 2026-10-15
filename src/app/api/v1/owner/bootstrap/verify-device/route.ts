import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { accountsService, bodyText } from '@/app/api/v1/auth/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const body = await parseJsonObject(request);
    const data = await accountsService().verifyOwnerDevice({
      deviceId: bodyText(body, 'deviceId', 36),
      challengeId: bodyText(body, 'challengeId', 36),
      code: bodyText(body, 'code', 12),
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
