import { errorResponse, successResponse } from '@/api/response';
import { aiService, currentPrincipal, guestSessionHash } from '@/app/api/v1/ai/route-utils';
import { assertRequestCsrf, authenticateRequest, parseCookies } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const principal = await currentPrincipal(request);
    const result = await aiService().getConversation(id, principal, guestSessionHash(request));
    return successResponse(result, requestId);
  } catch (err) {
    return errorResponse(err, requestId);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const principal = await currentPrincipal(request);
    if (principal) {
      const cookies = parseCookies(request.headers.get('cookie'));
      const audience = cookies.has('madevi_owner_access') ? 'OWNER' : 'MEMBER';
      const authenticated = await authenticateRequest(request, audience);
      await assertRequestCsrf(request, authenticated.sessionId, audience);
    }
    await aiService().deleteConversation(id, principal, guestSessionHash(request));
    return successResponse({ deleted: true }, requestId);
  } catch (err) {
    return errorResponse(err, requestId);
  }
}
