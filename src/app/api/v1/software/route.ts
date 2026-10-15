import { errorResponse, successResponse } from '@/api/response';
import { softwareService } from '@/app/api/v1/software/route-utils';
import { getSessionPrincipal } from '@/auth/session';
import { requestIdFromHeaders } from '@/server/request-id';

// GET /api/v1/software?cursor=...&limit=50 — katalog publik, login opsional
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    let principal = null;
    try {
      principal = await getSessionPrincipal(request);
    } catch {
      principal = null;
    }
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') ?? undefined;
    const rawLimit = Number(searchParams.get('limit') ?? '20');
    const limit = Number.isSafeInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : 20;

    const result = await softwareService().list(principal, cursor, limit);

    return successResponse(result, requestId, {
      page: { nextCursor: result.nextCursor, limit },
    });
  } catch (err) {
    return errorResponse(err, requestId);
  }
}
