import { errorResponse, successResponse } from '@/api/response';
import { socialService } from '@/app/api/v1/social/route-utils';
import { authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

// GET /api/v1/social/conversations — daftar percakapan langsung milik sendiri (login).
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    return successResponse(await socialService().listConversations(auth.principal), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
