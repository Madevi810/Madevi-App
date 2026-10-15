import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { socialService } from '@/app/api/v1/social/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ id: string }> };

/**
 * PUT /api/v1/social/conversations/[id]/preference — arsip/keluar per anggota.
 * Body { archived?: boolean; leave?: boolean }. Keluar satu arah dan tidak
 * menghapus bukti pihak lain (L05 G-07).
 */
export async function PUT(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const { id } = await context.params;
    const body = await parseJsonObject(request);
    const data = await socialService().setConversationPref(auth.principal, id, {
      archived: typeof body.archived === 'boolean' ? body.archived : undefined,
      leave: body.leave === true,
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
