import { NextRequest, NextResponse } from 'next/server';
import { errorMessage } from '@/api/error-message';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getPool } from '@/db/pool';
import { PaymentService } from '@/services/payment';

// POST /api/v1/owner/payment/chargeback { orderId, reason } — bekukan order sengketa (sosial tetap).
export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req, 'OWNER');
    await assertRequestCsrf(req, auth.sessionId, 'OWNER');
    const body = (await req.json()) as { orderId?: unknown; reason?: unknown };
    if (typeof body.orderId !== 'string' || typeof body.reason !== 'string') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_FAILED', message: 'orderId dan reason wajib diisi' } },
        { status: 400 },
      );
    }
    const pool = await getPool();
    const service = new PaymentService(pool);
    const data = await service.recordChargeback(body.orderId, body.reason);
    return NextResponse.json({ data });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_FAILED', message: errorMessage(e) } },
      { status: 400 },
    );
  }
}
