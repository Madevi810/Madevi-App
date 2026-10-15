import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { getDatabaseClients } from '@/db/client';
import { requestIdFromHeaders } from '@/server/request-id';
import { PublicFeedbackService } from '@/services/public-feedback';
import type { PublicFeedbackKind } from '@/services/public-feedback';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    // P1 fix (audit 2026-10-15): rate limit feedback publik — cegah spam tak terbatas.
    const guard = await new SecurityService(getDatabaseClients().pool).checkActionRateLimit(
      clientIp(request),
      'public_feedback',
    );
    if (!guard.allowed) {
      return errorResponse(
        new ApiError('RATE_LIMITED', 'Terlalu banyak masukan. Coba lagi nanti.'),
        requestId,
      );
    }

    const body = await parseJsonObject(request, 8 * 1024);
    const allowedFields = new Set(['kind', 'topic', 'message', 'website']);
    if (Object.keys(body).some((field) => !allowedFields.has(field))) {
      throw new ApiError('VALIDATION_FAILED', 'Field tidak dikenal');
    }
    if (typeof body.website === 'string' && body.website.length > 0) {
      throw new ApiError('VALIDATION_FAILED', 'Form tidak valid');
    }
    if (body.kind !== 'REVIEW' && body.kind !== 'REPORT') {
      throw new ApiError('VALIDATION_FAILED', 'Jenis masukan tidak valid', {
        kind: 'REVIEW atau REPORT',
      });
    }
    const data = await new PublicFeedbackService(getDatabaseClients().pool).enqueue({
      kind: body.kind as PublicFeedbackKind,
      topic: requiredText(body.topic, 'topic', { minimum: 2, maximum: 80 }),
      message: requiredText(body.message, 'message', { minimum: 10, maximum: 1000 }),
      idempotencyKey: request.headers.get('idempotency-key') ?? '',
    });
    return successResponse(data, requestId, { status: 202 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
