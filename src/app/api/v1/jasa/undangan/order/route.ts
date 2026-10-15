import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { requestIdFromHeaders } from '@/server/request-id';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { JasaService } from '@/services/jasa';
import { getDatabaseClients } from '@/db/client';
import { SecurityService } from '@/services/security';
import { ApiError } from '@/api/errors';
import { clientIp } from '@/server/client-ip';

export const dynamic = 'force-dynamic';

const service = () => new JasaService(getDatabaseClients().pool);

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== 'string' || !value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/**
 * POST /api/v1/jasa/undangan/order — buat order undangan.
 * Login dianjurkan tapi guest boleh (form private). Status PENDING_APPROVAL.
 */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    // P1 fix (audit 2026-10-15): rate limit order jasa — cegah spam/DB bloat dari guest.
    const guard = await new SecurityService(getDatabaseClients().pool).checkActionRateLimit(
      clientIp(request),
      'jasa_order',
    );
    if (!guard.allowed) {
      return errorResponse(
        new ApiError('RATE_LIMITED', 'Terlalu banyak order. Coba lagi nanti.'),
        requestId,
      );
    }

    // Guest boleh mulai; principal & CSRF hanya bila ada sesi member.
    let principalId: string | undefined;
    try {
      const auth = await authenticateRequest(request, 'MEMBER');
      await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
      principalId = auth.principal.id;
    } catch {
      principalId = undefined;
    }

    const body = await parseJsonObject(request, 128 * 1024);
    const format = body.packageFormat;
    if (format !== 'ONLINE' && format !== 'PRINT' && format !== 'BOTH') {
      return errorResponse(new Error('Paket harus ONLINE, PRINT, atau BOTH.'), requestId);
    }
    const groom = typeof body.groomName === 'string' ? body.groomName.trim() : '';
    const bride = typeof body.brideName === 'string' ? body.brideName.trim() : '';
    if (!groom || !bride) {
      return errorResponse(new Error('Nama pasangan wajib diisi.'), requestId);
    }

    const order = await service().createInvitationOrder({
      principalId,
      templateId: typeof body.templateId === 'string' ? body.templateId : undefined,
      groomName: groom,
      brideName: bride,
      eventDate: parseDate(body.eventDate),
      venue: typeof body.venue === 'string' ? body.venue : '',
      city: typeof body.city === 'string' ? body.city : '',
      note: typeof body.note === 'string' ? body.note : '',
      packageFormat: format,
    });

    return successResponse(order, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
