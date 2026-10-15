import { errorResponse, successResponse } from '@/api/response';
import { requestIdFromHeaders } from '@/server/request-id';
import { getSessionPrincipal } from '@/auth/session';
import { examService } from '@/app/api/v1/exams/route-utils';
import { aiService } from '@/app/api/v1/ai/route-utils';

/**
 * L06: availability bekerja untuk guest/member tanpa membuka data.
 * - Guest: examActive=false (guest tidak ikut ujian).
 * - Member: exam gate server diperiksa.
 * - Selalu sertakan capability retrieval lokal yang jujur (bukan klaim provider online).
 */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    let principal = null;
    try {
      principal = await getSessionPrincipal(request);
    } catch {
      principal = null;
    }
    let examActive = false;
    if (principal) {
      try {
        const availability = await examService().getAiAvailability(principal);
        examActive = (availability as { examActive?: boolean })?.examActive === true;
      } catch {
        examActive = false;
      }
    }
    const capability = await aiService().getCapability({ principal, examActive });
    return successResponse(
      {
        allowed: capability.allowed,
        reason: capability.unavailableReason,
        mode: capability.mode,
        free: capability.free,
        userQuota: false,
        protection: 'ACTION_RATE_LIMIT',
        allowedSources: capability.allowedSources,
        note: capability.note,
      },
      requestId,
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
