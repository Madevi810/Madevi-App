import { errorResponse, successResponse } from '@/api/response';
import { socialService } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ principalId: string }> };

async function mutate(request: Request, context: Context, muted: boolean) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const { principalId } = await context.params;
    return successResponse(await socialService().setMute(auth.principal, principalId, muted), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** PUT /api/v1/social/mutes/[principalId] — mute satu-arah (L05 G-04). */
export function PUT(request: Request, context: Context) {
  return mutate(request, context, true);
}

/** DELETE /api/v1/social/mutes/[principalId] — batalkan mute. */
export function DELETE(request: Request, context: Context) {
  return mutate(request, context, false);
}
