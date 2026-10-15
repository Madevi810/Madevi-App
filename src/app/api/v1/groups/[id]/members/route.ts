import { errorResponse, successResponse } from '@/api/response';
import { socialService } from '@/app/api/v1/social/route-utils';
import { authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    const { id } = await context.params;
    return successResponse(await socialService().listGroupMembers(auth.principal, id), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
