import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { moderationService } from '@/app/api/v1/moderation/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const body = await parseJsonObject(request);
    if (body.confirmMaintenance !== true)
      throw new ApiError('VALIDATION_FAILED', 'Konfirmasi maintenance diperlukan');
    return successResponse(await moderationService().expireCleanWindows(auth.principal), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
