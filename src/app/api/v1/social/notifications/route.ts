import { errorResponse, successResponse } from '@/api/response';
import { parseLimit } from '@/api/validation';
import { socialService } from '@/app/api/v1/social/route-utils';
import { authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/** GET /api/v1/social/notifications — inbox milik sendiri + jumlah belum dibaca (L05 G-10). */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    const url = new URL(request.url);
    const data = await socialService().listNotifications(auth.principal, {
      cursor: url.searchParams.get('cursor') ?? undefined,
      limit: parseLimit(url.searchParams.get('limit')),
    });
    return successResponse(
      { items: data.items, unread: data.unread },
      requestId,
      { page: { nextCursor: data.nextCursor, limit: parseLimit(url.searchParams.get('limit')) } },
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
