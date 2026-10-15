import { errorResponse, successResponse } from '@/api/response';
import { listenService } from '@/app/api/v1/line/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/** POST /api/v1/line/listen/[id]/join — gabung sebagai pendengar (maks 12). */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const data = await listenService().joinAsListener(auth.principal, id);
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
