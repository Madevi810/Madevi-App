import { NextRequest, NextResponse } from 'next/server';
import { errorResponse, successResponse } from '@/api/response';
import { getPool } from '@/db/pool';
import { requestIdFromHeaders } from '@/server/request-id';
import { EBelanjaService } from '@/services/ebelanja';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';

// POST /api/v1/ebelanja/questions { productId, message } — antrean Q&A produk (login).
export async function POST(req: NextRequest) {
  const requestId = requestIdFromHeaders(req.headers);
  try {
    const auth = await authenticateRequest(req, 'MEMBER');
    await assertRequestCsrf(req, auth.sessionId, 'MEMBER');
    const principal = auth.principal;
    const body = (await req.json()) as { productId?: unknown; message?: unknown };
    if (typeof body.productId !== 'string' || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_FAILED', message: 'productId dan message wajib diisi' } },
        { status: 400 },
      );
    }
    const pool = await getPool();
    const service = new EBelanjaService(pool);
    const data = await service.askAbout(principal.id, body.productId, body.message);
    return successResponse(data, requestId, { status: data.created ? 201 : 200 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
