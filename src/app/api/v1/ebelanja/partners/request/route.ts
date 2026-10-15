import { NextRequest, NextResponse } from 'next/server';
import { errorMessage } from '@/api/error-message';
import { getPool } from '@/db/pool';
import { EBelanjaService } from '@/services/ebelanja';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';

// POST /api/v1/ebelanja/partners/request — form kerja sama mitra (K-20, login)
export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req, 'MEMBER');
    await assertRequestCsrf(req, auth.sessionId, 'MEMBER');
    const pool = await getPool();
    const service = new EBelanjaService(pool);
    const body = await req.json();
    const partner = await service.requestPartner({ name: body.name, domain: body.domain });
    return NextResponse.json({ data: partner }, { status: partner.duplicate ? 200 : 201 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_FAILED', message: errorMessage(e) } },
      { status: 400 },
    );
  }
}
