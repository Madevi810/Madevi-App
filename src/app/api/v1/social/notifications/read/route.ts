import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { socialService } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/social/notifications/read — tandai dibaca.
 * Body { ids?: string[] }; tanpa ids menandai semua yang belum dibaca.
 */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const ids = Array.isArray(body.ids) ? body.ids.filter(i => typeof i === 'string') : undefined;
    const data = await socialService().markNotificationsRead(
      auth.principal,
      ids as string[] | undefined,
    );
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
