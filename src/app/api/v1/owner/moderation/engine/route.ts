import { errorResponse, successResponse } from '@/api/response';
import { moderationService } from '@/app/api/v1/moderation/route-utils';
import { authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    return successResponse(await moderationService().engineInventory(auth.principal), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
