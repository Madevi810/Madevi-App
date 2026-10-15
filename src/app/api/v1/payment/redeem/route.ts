import { NextRequest, NextResponse } from 'next/server';
import { errorMessage } from '@/api/error-message';
import { getPool } from '@/db/pool';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { PaymentService } from '@/services/payment';

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req, 'MEMBER');
    await assertRequestCsrf(req, auth.sessionId, 'MEMBER');
    const body = await req.json();
    const pool = await getPool();
    const service = new PaymentService(pool);
    const result = await service.redeemCode(auth.principal.id, body.code);
    return NextResponse.json({ data: result });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: { code: 'INVALID_CODE', message: errorMessage(e) } },
      { status: 400 },
    );
  }
}
