import { errorResponse, successResponse } from '@/api/response';
import { parseLimit } from '@/api/validation';
import { authenticateRequest } from '@/auth/http';
import { examService } from '@/app/api/v1/exams/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    const limit = parseLimit(new URL(request.url).searchParams.get('limit'));
    return successResponse(await examService().listGradingQueue(auth.principal, limit), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
