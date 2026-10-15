import { NextRequest, NextResponse } from 'next/server';
import { errorMessage } from '@/api/error-message';
import { getPool } from '@/db/pool';
import { getPrincipal } from '@/lib/session';
import { OperasiService } from '@/services/operasi';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req, 'MEMBER', { humanActivity: true });
    await assertRequestCsrf(req, auth.sessionId, 'MEMBER');
    const principal = await getPrincipal(req);
    if (!principal)
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Belum login' } },
        { status: 401 },
      );
    const body = await req.json();
    const pool = await getPool();
    const service = new OperasiService(pool);
    await service.logUserActivity(
      principal.id,
      body.action,
      req.headers.get('x-forwarded-for') || undefined,
      req.headers.get('user-agent') || undefined,
    );
    return NextResponse.json({ data: { logged: true } });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: errorMessage(e) } },
      { status: 500 },
    );
  }
}
