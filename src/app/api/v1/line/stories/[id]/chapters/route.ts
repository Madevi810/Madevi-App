import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { storyService } from '@/app/api/v1/line/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/** POST /api/v1/line/stories/[id]/chapters — ajukan bab lanjutan (member). */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await storyService().submitChapter(
      auth.principal,
      id,
      requiredText(body.body, 'body', { minimum: 20, maximum: 2400 }),
    );
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
