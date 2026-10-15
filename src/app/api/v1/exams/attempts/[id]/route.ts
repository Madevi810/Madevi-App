import { errorResponse, successResponse } from '@/api/response';
import { authenticateMemberOrOwner, examService } from '@/app/api/v1/exams/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateMemberOrOwner(request);
    const { id } = await params;
    const data = await examService().getAttempt(auth.principal, id);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
