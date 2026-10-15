import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { requestIdFromHeaders } from '@/server/request-id';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { JasaService } from '@/services/jasa';
import { getDatabaseClients } from '@/db/client';

export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ id: string }> };

const VALID_STATUS = [
  'PENDING_APPROVAL',
  'APPROVED',
  'IN_REVISION',
  'COMPLETED',
  'REJECTED',
  'ARCHIVED',
];

/**
 * PUT /api/v1/owner/jasa/orders/[id]?kind=UNDANGAN|LOGO|SERVICE
 * Body: { status, priceAgreed? }
 * Transisi hanya boleh mengikuti alur kontrak.
 */
export async function PUT(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const { id } = await context.params;
    const url = new URL(request.url);
    const kindParam = url.searchParams.get('kind');
    const kind = kindParam === 'LOGO' ? 'LOGO' : kindParam === 'SERVICE' ? 'SERVICE' : 'UNDANGAN';
    const body = await parseJsonObject(request, 32 * 1024);
    const status = typeof body.status === 'string' ? body.status : '';
    if (!VALID_STATUS.includes(status)) {
      return errorResponse(new Error('Status tidak valid.'), requestId);
    }
    const priceAgreed =
      typeof body.priceAgreed === 'number' &&
      Number.isSafeInteger(body.priceAgreed) &&
      body.priceAgreed >= 0
        ? body.priceAgreed
        : undefined;
    const svc = new JasaService(getDatabaseClients().pool);
    const result =
      kind === 'LOGO'
        ? await svc.transitionLogoOrder(id, status as never, priceAgreed)
        : kind === 'SERVICE'
          ? await svc.transitionServiceOrder(id, status as never, { priceAgreed })
          : await svc.transitionInvitationOrder(id, status as never, priceAgreed);
    if ('transitioned' in result && !result.transitioned) {
      return errorResponse(new Error(result.reason ?? 'Transisi gagal.'), requestId);
    }
    return successResponse(result, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
