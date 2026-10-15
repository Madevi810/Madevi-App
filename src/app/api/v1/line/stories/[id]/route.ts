import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { storyService } from '@/app/api/v1/line/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/** GET /api/v1/line/stories/[id] — baca utas: bab kanon + ajuan pekan berjalan. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    // Viewer login untuk menandai "saya sudah vote"; tamu tetap boleh baca.
    let viewerId: string | null = null;
    try {
      const auth = await authenticateRequest(request, 'MEMBER');
      viewerId = auth.principal.id;
    } catch {
      viewerId = null;
    }
    const data = await storyService().readThread(id, viewerId);
    if (!data) return errorResponse(new Error('NOT_FOUND'), requestId);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** PATCH /api/v1/line/stories/[id] — tutup utas (pembuat utas saja). */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    if (requiredText(body.action, 'action') === 'close') {
      const data = await storyService().closeThread(auth.principal, id);
      return successResponse(data, requestId);
    }
    return errorResponse(new Error('VALIDATION_ERROR'), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
