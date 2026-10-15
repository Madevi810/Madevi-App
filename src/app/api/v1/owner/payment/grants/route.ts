import { NextRequest, NextResponse } from 'next/server';
import { errorMessage } from '@/api/error-message';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getPool } from '@/db/pool';
import { PaymentService } from '@/services/payment';

// POST /api/v1/owner/payment/grants { principalId, reason } — kode BANTUAN Admin (tanpa order).
export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req, 'OWNER');
    await assertRequestCsrf(req, auth.sessionId, 'OWNER');
    const body = (await req.json()) as { principalId?: unknown; reason?: unknown };
    if (typeof body.principalId !== 'string' || typeof body.reason !== 'string') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_FAILED', message: 'principalId dan reason wajib diisi' } },
        { status: 400 },
      );
    }
    const pool = await getPool();
    const service = new PaymentService(pool);
    const data = await service.issueGrant(auth.principal.id, body.principalId, body.reason);
    return NextResponse.json({ data }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_FAILED', message: errorMessage(e) } },
      { status: 400 },
    );
  }
}
