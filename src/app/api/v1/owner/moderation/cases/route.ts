import { errorResponse, successResponse } from '@/api/response';
import { parseLimit } from '@/api/validation';
import { moderationService } from '@/app/api/v1/moderation/route-utils';
import { authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    const url = new URL(request.url);
    const data = await moderationService().listCases(auth.principal, {
      risk: url.searchParams.get('risk') ?? undefined,
      status: url.searchParams.get('status') ?? undefined,
      category: url.searchParams.get('category') ?? undefined,
      limit: parseLimit(url.searchParams.get('limit')),
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
