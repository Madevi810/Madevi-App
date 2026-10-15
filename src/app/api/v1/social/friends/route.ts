import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { socialService } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/** GET /api/v1/social/friends — daftar teman (L05 G-06). */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    const data = await socialService().listFriends(auth.principal);
    return successResponse(data.items, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** DELETE /api/v1/social/friends — hapus pertemanan { friendId }. */
export async function DELETE(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await socialService().removeFriend(
      auth.principal,
      requiredText(body.friendId, 'friendId'),
    );
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
