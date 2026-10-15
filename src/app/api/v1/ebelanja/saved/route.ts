import { NextRequest, NextResponse } from 'next/server';
import { errorMessage } from '@/api/error-message';
import { getSessionPrincipal } from '@/auth/session';
import { getPool } from '@/db/pool';
import { EBelanjaService } from '@/services/ebelanja';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';

// GET /api/v1/ebelanja/saved — daftar simpanan (login)
export async function GET(req: NextRequest) {
  try {
    const principal = await getSessionPrincipal(req);
    if (!principal) {
      return NextResponse.json(
        { error: { code: 'AUTHENTICATION_REQUIRED', message: 'Login diperlukan' } },
        { status: 401 },
      );
    }
    const pool = await getPool();
    const service = new EBelanjaService(pool);
    const items = await service.listSavedProducts(principal.id);
    return NextResponse.json({ data: { items } });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: errorMessage(e) } },
      { status: 500 },
    );
  }
}

// POST /api/v1/ebelanja/saved {productId} — simpan (login)
export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req, 'MEMBER');
    await assertRequestCsrf(req, auth.sessionId, 'MEMBER');
    const principal = auth.principal;
    const pool = await getPool();
    const service = new EBelanjaService(pool);
    const body = await req.json();
    const result = await service.saveProduct(principal.id, body.productId);
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_FAILED', message: errorMessage(e) } },
      { status: 400 },
    );
  }
}

// DELETE /api/v1/ebelanja/saved?productId=... — batal simpan (login)
export async function DELETE(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req, 'MEMBER');
    await assertRequestCsrf(req, auth.sessionId, 'MEMBER');
    const principal = auth.principal;
    const pool = await getPool();
    const service = new EBelanjaService(pool);
    const { searchParams } = new URL(req.url);
    const result = await service.unsaveProduct(principal.id, searchParams.get('productId') ?? '');
    return NextResponse.json({ data: result });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_FAILED', message: errorMessage(e) } },
      { status: 400 },
    );
  }
}
