import { NextRequest, NextResponse } from 'next/server';
import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { getPool } from '@/db/pool';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { PaymentService } from '@/services/payment';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';
import { requestIdFromHeaders } from '@/server/request-id';
import { parseJsonObject } from '@/api/validation';
import {
  assertSimulationEnabled,
} from '@/server/simulation';
import {
  isSimulatedPaymentMethod,
} from '@/contracts/simulation';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

/**
 * Ringkasan order milik member — untuk halaman pembayaran simulasi.
 */
export async function GET(req: NextRequest, context: Ctx) {
  const requestId = requestIdFromHeaders(req.headers);
  try {
    assertSimulationEnabled();
    const { id } = await context.params;
    const pool = await getPool();
    const auth = await authenticateRequest(req, 'MEMBER');
    const order = await new PaymentService(pool).getOrderSummary(id, auth.principal.id);
    if (!order) throw new ApiError('NOT_FOUND', 'Order tidak ditemukan');
    return successResponse({ data: { ...order, simulated: true } }, requestId);
  } catch (e: unknown) {
    return errorResponse(e, requestId);
  }
}

/**
 * Bayar order via Mode Simulasi: pilih metode -> klik bayar -> langsung PAID.
 *
 * Body: { method: 'TRANSFER_BANK' | 'E_WALLET' | 'QRIS' | 'GERAI' }
 * Tidak ada uang nyata yang bergerak; kode akses diterbitkan seperti
 * konfirmasi gateway, lalu member me-redeem seperti biasa.
 */
export async function POST(req: NextRequest, context: Ctx) {
  const requestId = requestIdFromHeaders(req.headers);
  try {
    assertSimulationEnabled();
    const { id } = await context.params;
    const pool = await getPool();
    const guard = await new SecurityService(pool).checkActionRateLimit(
      clientIp(req),
      'payment_simulate',
    );
    if (!guard.allowed) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Terlalu banyak percobaan pembayaran. Coba lagi nanti.', requestId } },
        { status: 429 },
      );
    }
    const auth = await authenticateRequest(req, 'MEMBER');
    await assertRequestCsrf(req, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(req);
    const method = body['method'];
    if (!isSimulatedPaymentMethod(method)) {
      throw new ApiError('VALIDATION_FAILED', 'Metode pembayaran simulasi tidak valid');
    }
    const result = await new PaymentService(pool).payWithSimulation(
      id,
      auth.principal.id,
      method,
    );
    return successResponse({ data: result }, requestId, { status: 200 });
  } catch (e: unknown) {
    return errorResponse(e, requestId);
  }
}
