import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { aiService, currentPrincipal, guestSessionHash } from '@/app/api/v1/ai/route-utils';
import { examService } from '@/app/api/v1/exams/route-utils';
import { assertRequestCsrf, authenticateRequest, parseCookies } from '@/auth/http';
import { getPool } from '@/db/pool';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';
import { requestIdFromHeaders } from '@/server/request-id';

// GET /api/v1/ai/conversations
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const principal = await currentPrincipal(request);
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') ?? undefined;
    const limit = Number(searchParams.get('limit') ?? '20');
    const result = await aiService().listConversations(
      principal,
      guestSessionHash(request),
      cursor,
      limit,
    );
    return successResponse(result.items, requestId);
  } catch (err) {
    return errorResponse(err, requestId);
  }
}

// POST /api/v1/ai/conversations
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    // P17: rate limit per aksi — resource abuse AI (di samping kuota harian).
    // 0024 harus terpasang agar rate_limits_by_action tersedia.
    const guard = await new SecurityService(await getPool()).checkActionRateLimit(
      clientIp(request),
      'ai_conversation',
    );
    if (!guard.allowed) {
      return errorResponse(
        new ApiError(
          'RATE_LIMITED',
          guard.retryAfterSeconds > 0
            ? `Batas AI tercapai. Coba lagi dalam ${guard.retryAfterSeconds} detik.`
            : 'Batas AI tercapai. Coba lagi nanti.',
        ),
        requestId,
      );
    }
    const principal = await currentPrincipal(request);
    if (principal) {
      const cookies = parseCookies(request.headers.get('cookie'));
      const audience = cookies.has('madevi_owner_access') ? 'OWNER' : 'MEMBER';
      const authenticated = await authenticateRequest(request, audience);
      await assertRequestCsrf(request, authenticated.sessionId, audience);
    }
    const sessionHash = guestSessionHash(request);
    const body = (await request.json()) as { message?: string; conversationId?: string };
    if (
      !body.message ||
      typeof body.message !== 'string' ||
      body.message.length < 2 ||
      body.message.length > 4000
    ) {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Pesan harus 2–4000 karakter'),
        requestId,
      );
    }

    // Periksa apakah pengguna sedang dalam ujian aktif (hanya untuk login).
    let examActive = false;
    if (principal) {
      const avail = await examService().getAiAvailability(principal);
      if (!avail.allowed) examActive = true;
    }

    const result = await aiService().ask({
      principal,
      sessionHash,
      conversationId: typeof body.conversationId === 'string' ? body.conversationId : undefined,
      message: body.message,
      examActive,
    });
    return successResponse(result, requestId, { status: 201 });
  } catch (err) {
    return errorResponse(err, requestId);
  }
}
