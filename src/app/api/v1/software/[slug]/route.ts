import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { softwareService } from '@/app/api/v1/software/route-utils';
import { getSessionPrincipal } from '@/auth/session';
import { requestIdFromHeaders } from '@/server/request-id';
import { SoftwareError } from '@/services/software';

type RouteParams = { params: Promise<{ slug: string }> };

// GET /api/v1/software/[slug] — detail katalog publik
export async function GET(request: Request, { params }: RouteParams) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { slug } = await params;
    if (!slug || typeof slug !== 'string') {
      return errorResponse(new ApiError('VALIDATION_FAILED', 'Slug tidak valid'), requestId);
    }
    let principal = null;
    try {
      principal = await getSessionPrincipal(request);
    } catch {
      principal = null;
    }
    const row = await softwareService().getByIdOrSlug(principal, slug);

    return successResponse(row, requestId);
  } catch (err) {
    if (err instanceof SoftwareError) {
      const code =
        err.code === 'NOT_FOUND'
          ? 'NOT_FOUND'
          : err.code === 'FORBIDDEN'
            ? 'ACCESS_DENIED'
            : 'VALIDATION_FAILED';
      return errorResponse(new ApiError(code as ApiError['code'], err.message), requestId);
    }
    return errorResponse(err, requestId);
  }
}
