import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from '@/api/response';
import { getPool } from '@/db/pool';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { PaymentService } from '@/services/payment';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(req: NextRequest) {
  const requestId = requestIdFromHeaders(req.headers);
  try {
    const pool = await getPool();
    const guard = await new SecurityService(pool).checkActionRateLimit(clientIp(req), 'payment_create');
    if (!guard.allowed) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Terlalu banyak permintaan pembayaran. Coba lagi nanti.', requestId } },
        { status: 429 },
      );
    }
    const auth = await authenticateRequest(req, 'MEMBER');
    await assertRequestCsrf(req, auth.sessionId, 'MEMBER');
    const body = await req.json();
    const service = new PaymentService(pool);
    // P06: packageKind wajib dari body; harga tetap dihitung server (bukan dari UI).
    const order = await service.createOrder(auth.principal.id, {
      packageKind: body.packageKind,
      promoCode: body.promoCode,
    });
    return NextResponse.json({ data: order, requestId }, { status: 201 });
  } catch (e: unknown) {
    // L03: error domain (VALIDATION_FAILED, PACKAGE_INSUFFICIENT, CSRF, dsb.)
    // dipetakan ke status yang tepat via errorResponse, bukan selalu 500.
    // errorResponse tidak mencerminkan exception driver/jaringan ke browser.
    return errorResponse(e, requestId);
  }
}
