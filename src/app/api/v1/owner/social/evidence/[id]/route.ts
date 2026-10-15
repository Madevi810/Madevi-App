import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { socialService } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
type Context = { params: Promise<{ id: string }> };
export async function POST(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const body = await parseJsonObject(request);
    const { id } = await context.params;
    return successResponse(
      await socialService().getMessageEvidence(
        auth.principal,
        id,
        requiredText(body.accessReason, 'accessReason', { minimum: 10, maximum: 500 }),
      ),
      requestId,
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
