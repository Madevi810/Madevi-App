import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from '@/api/response';
import { getPool } from '@/db/pool';
import { SecurityService } from '@/services/security';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(req, auth.sessionId, 'OWNER');
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const payload = typeof body.payload === 'string' ? body.payload : '';
    const endpoint =
      typeof body.endpoint === 'string' && body.endpoint.startsWith('/')
        ? body.endpoint
        : '/api/unknown';
    const pool = await getPool();
    const service = new SecurityService(pool);
    const result = await service.inspectPayload(
      payload,
      endpoint,
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1',
    );
    return NextResponse.json({ data: result });
  } catch (e: unknown) {
    return errorResponse(e, randomUUID());
  }
}
