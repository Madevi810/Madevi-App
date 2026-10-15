import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { moderationService } from '@/app/api/v1/moderation/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
type Context = { params: Promise<{ id: string }> };
const decisions = ['CLEAR', 'CONFIRM_GENERAL', 'CONFIRM_CRITICAL', 'KEEP_QUARANTINED'] as const;
const sanctions = ['NONE', 'MUTE_7D', 'MUTE_30D', 'PERMANENT_BLOCK'] as const;
export async function POST(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const body = await parseJsonObject(request);
    if (!decisions.includes(body.decision as (typeof decisions)[number]))
      throw new ApiError('VALIDATION_FAILED', 'Keputusan tidak valid');
    if (
      body.criticalSanction !== undefined &&
      !sanctions.includes(body.criticalSanction as (typeof sanctions)[number])
    )
      throw new ApiError('VALIDATION_FAILED', 'Sanksi kritis tidak valid');
    const { id } = await context.params;
    const data = await moderationService().decideCase(auth.principal, id, {
      decision: body.decision as (typeof decisions)[number],
      reason: requiredText(body.reason, 'reason', { minimum: 10, maximum: 1000 }),
      criticalSanction: body.criticalSanction as (typeof sanctions)[number] | undefined,
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
