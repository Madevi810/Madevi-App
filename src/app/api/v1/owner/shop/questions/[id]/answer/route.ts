import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getPool } from '@/db/pool';
import { requestIdFromHeaders } from '@/server/request-id';
import { EBelanjaService } from '@/services/ebelanja';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const { id } = await params;
    if (!UUID.test(id)) throw new ApiError('VALIDATION_FAILED', 'ID pertanyaan tidak valid.');
    const body = await request.json() as { answer?: unknown };
    const answer = typeof body.answer === 'string' ? body.answer : '';
    const question = await new EBelanjaService(await getPool()).answerProductQuestion(
      auth.principal.id,
      id,
      answer,
    );
    return successResponse(question, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
