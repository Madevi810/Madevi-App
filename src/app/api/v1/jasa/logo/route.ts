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

/** GET /api/v1/jasa/logo — daftar order saya (login) atau galeri karya (publik) */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const url = new URL(request.url);
    // ?gallery=1 → portofolio publik karya selesai (tanpa data privat)
    if (url.searchParams.get('gallery') === '1') {
      const works = await service().listCompletedLogoWorks();
      return successResponse(works, requestId);
    }
    const auth = await authenticateRequest(request, 'MEMBER');
    const orders = await service().listMyLogoOrders(auth.principal.id);
    return successResponse(orders, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** POST /api/v1/jasa/logo — buat order logo/banner (form private) */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    // P1 fix (audit 2026-10-15): rate limit order jasa.
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

    let principalId: string | undefined;
    try {
      const auth = await authenticateRequest(request, 'MEMBER');
      await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
      principalId = auth.principal.id;
    } catch {
      principalId = undefined;
    }

    const body = await parseJsonObject(request, 128 * 1024);
    const kind = body.kind === 'BANNER' ? 'BANNER' : 'LOGO';
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) return errorResponse(new Error('Judul wajib diisi.'), requestId);

    const toInt = (v: unknown) =>
      typeof v === 'number' ? v : typeof v === 'string' ? parseInt(v, 10) : undefined;

    const order = await service().createLogoOrder({
      principalId,
      kind,
      title,
      widthPx: toInt(body.widthPx),
      heightPx: toInt(body.heightPx),
      primaryColor: typeof body.primaryColor === 'string' ? body.primaryColor : '',
      styleNote: typeof body.styleNote === 'string' ? body.styleNote : '',
      referenceUrl: typeof body.referenceUrl === 'string' ? body.referenceUrl : '',
    });

    return successResponse(order, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
