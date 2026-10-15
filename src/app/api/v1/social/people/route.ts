import { errorResponse, successResponse } from '@/api/response';
import { authenticateRequest } from '@/auth/http';
import { socialService } from '@/app/api/v1/social/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/social/people?q= — people lookup minimal (L05).
 * Hanya untuk memilih target hubungan/pesan; pasangan block dan akun
 * non-sosial disembunyikan. Bukan global Search (L06 tidak tersentuh).
 */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    const url = new URL(request.url);
    const data = await socialService().searchPeople(
      auth.principal,
      url.searchParams.get('q') ?? '',
      Number(url.searchParams.get('limit') ?? 10),
    );
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
