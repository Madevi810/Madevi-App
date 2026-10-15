import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { softwareService } from '@/app/api/v1/software/route-utils';
import { getSessionPrincipal } from '@/auth/session';
import { requestIdFromHeaders } from '@/server/request-id';
import { SoftwareError } from '@/services/software';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/v1/software/versions/[id] — daftar versi untuk satu softwareId
export async function GET(request: Request, { params }: RouteParams) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return errorResponse(new ApiError('VALIDATION_FAILED', 'ID software tidak valid'), requestId);
    }
    let principal = null;
    try {
      principal = await getSessionPrincipal(request);
    } catch {
      principal = null;
    }

    const versions = await softwareService().listVersions(principal, id);

    return successResponse({ items: versions }, requestId);
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
