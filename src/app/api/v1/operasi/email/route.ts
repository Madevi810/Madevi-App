import { NextRequest, NextResponse } from 'next/server';
import { errorMessage } from '@/api/error-message';
import { getPool } from '@/db/pool';
import { getPrincipal } from '@/lib/session';
import { OperasiService } from '@/services/operasi';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(req, auth.sessionId, 'OWNER');
    const principal = await getPrincipal(req);
    if (!principal || principal.role !== 'OWNER')
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Hanya Admin' } },
        { status: 403 },
      );
    const body = await req.json();
    const pool = await getPool();
    const service = new OperasiService(pool);
    const result = await service.queueEmail({
      recipientEmail: body.recipientEmail,
      templateId: body.templateId,
      templateData: body.templateData,
      idempotencyKey: body.idempotencyKey,
    });
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: errorMessage(e) } },
      { status: 500 },
    );
  }
}
