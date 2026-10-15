import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { requestIdFromHeaders } from '@/server/request-id';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { ApiError } from '@/api/errors';
import { JasaService } from '@/services/jasa';
import { getDatabaseClients } from '@/db/client';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';

export const dynamic = 'force-dynamic';

const service = () => new JasaService(getDatabaseClients().pool);

const CATEGORIES = [
  'UNDANGAN_CUSTOM',
  'LOGO_CUSTOM',
  'CV_PORTFOLIO',
  'CERTIFICATE',
  'PHOTO_EDIT',
  'LAYOUT_CUSTOM',
  'LAINNYA',
] as const;

/** GET /api/v1/jasa/custom — order custom milik saya (login). */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    const orders = await service().listMyServiceOrders(auth.principal.id, ['CUSTOM_DESIGN']);
    return successResponse(orders, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/**
 * POST /api/v1/jasa/custom — buat order custom.
 * Guest boleh mulai; principal & CSRF hanya bila ada sesi member.
 * Status PENDING_APPROVAL. Harga snapshot dari katalog atau 0 =
 * penetapan Admin setelah brief diperiksa (bukan nego bebas).
 */
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
    const category = typeof body.category === 'string' ? body.category : '';
    if (!(CATEGORIES as readonly string[]).includes(category)) {
      throw new ApiError('VALIDATION_FAILED', 'Kategori custom tidak valid');
    }
    const referenceUrls = Array.isArray(body.referenceUrls)
      ? body.referenceUrls.filter((u): u is string => typeof u === 'string')
      : [];

    const order = await service().createCustomOrder({
      principalId,
      catalogItemId: typeof body.catalogItemId === 'string' ? body.catalogItemId : undefined,
      category: category as (typeof CATEGORIES)[number],
      title: typeof body.title === 'string' ? body.title : '',
      description: typeof body.description === 'string' ? body.description : '',
      referenceUrls,
    });

    return successResponse(order, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
