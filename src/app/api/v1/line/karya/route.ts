import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { lineageService } from '@/app/api/v1/line/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/** GET /api/v1/line/karya — daftar karya (opsional filter badge). */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const url = new URL(request.url);
    const badge = url.searchParams.get('badge') ?? undefined;
    const limit = Number.parseInt(url.searchParams.get('limit') ?? '20', 10);
    const data = await lineageService().listKarya({
      badge,
      limit: Number.isFinite(limit) ? limit : 20,
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/**
 * POST /api/v1/line/karya — tetapkan parent karya (remix-of).
 *
 * Body: { postId: string, parentKaryaId: string }.
 */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await lineageService().setParent(
      auth.principal,
      requiredText(body.postId, 'postId'),
      requiredText(body.parentKaryaId, 'parentKaryaId'),
    );
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
