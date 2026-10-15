import { errorResponse, successResponse } from '@/api/response';
import { authenticateRequest } from '@/auth/http';
import { getPool } from '@/db/pool';
import { requestIdFromHeaders } from '@/server/request-id';
import { EBelanjaService } from '@/services/ebelanja';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await authenticateRequest(request, 'OWNER', { humanActivity: true });
    const questions = await new EBelanjaService(await getPool()).listOwnerProductQuestions();
    return successResponse(questions, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
