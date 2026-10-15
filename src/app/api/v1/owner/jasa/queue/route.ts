import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { JasaService } from '@/services/jasa';
import { getDatabaseClients } from '@/db/client';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

const service = () => new JasaService(getDatabaseClients().pool);

/**
 * Antrean Admin terpadu (P11 + L04): filter urgensi + "menunggu siapa".
 * GET /api/v1/owner/jasa/queue?urgency=HIGH&waitingOn=ADMIN&kind=UNDANGAN
 * kind juga menerima LAYOUT | CUSTOM_DESIGN | PCB_LAYOUT (service_orders).
 */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await authenticateRequest(request, 'OWNER', { humanActivity: true });
    const url = new URL(request.url);
    const urgency = url.searchParams.get('urgency');
    const waitingOn = url.searchParams.get('waitingOn');
    const kind = url.searchParams.get('kind');
    const queue = await service().adminQueue({
      urgency:
        urgency === 'HIGH' || urgency === 'MEDIUM' || urgency === 'NORMAL' ? urgency : undefined,
      waitingOn:
        waitingOn === 'ADMIN' || waitingOn === 'USER' || waitingOn === 'NONE'
          ? waitingOn
          : undefined,
      kind:
        kind === 'UNDANGAN' ||
        kind === 'LOGO' ||
        kind === 'LAYOUT' ||
        kind === 'CUSTOM_DESIGN' ||
        kind === 'PCB_LAYOUT'
          ? kind
          : undefined,
    });
    return successResponse(queue, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/**
 * Manajemen tautan privat + batas revisi (P11: "expiry/revoke", "batas revisi").
 * PATCH /api/v1/owner/jasa/queue dengan aksi:
 *   { kind, orderId, action: 'REVOKE' | 'SET_EXPIRY' | 'SET_REVISION_LIMIT', ... }
 */
export async function PATCH(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const body = await parseJsonObject(request);
    const kind = body.kind === 'LOGO' ? 'LOGO' : body.kind === 'SERVICE' ? 'SERVICE' : 'UNDANGAN';
    const orderId = typeof body.orderId === 'string' ? body.orderId.trim() : '';
    if (!orderId) return errorResponse(new Error('orderId diperlukan'), requestId);
    const action = typeof body.action === 'string' ? body.action : '';

    switch (action) {
      case 'REVOKE': {
        const result = await service().revokeOrderToken(kind, orderId);
        return successResponse(result, requestId);
      }
      case 'SET_EXPIRY': {
        const days = Number(body.expiresInDays);
        if (!Number.isFinite(days) || days <= 0 || days > 365) {
          return errorResponse(new Error('expiresInDays harus 1–365'), requestId);
        }
        const expiresAt = new Date(Date.now() + days * 24 * 60 * 60_000);
        const result = await service().setOrderTokenExpiry(kind, orderId, expiresAt);
        return successResponse(result, requestId);
      }
      case 'SET_REVISION_LIMIT': {
        const limit = Number(body.limit);
        const result = await service().setRevisionLimit(kind, orderId, limit);
        return successResponse(result, requestId);
      }
      default:
        return errorResponse(new Error('Aksi tidak dikenal'), requestId);
    }
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
