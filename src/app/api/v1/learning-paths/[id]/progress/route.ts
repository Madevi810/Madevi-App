import { errorResponse, successResponse } from '@/api/response';
import { assertSchoolAccess, authenticateMemberOrOwner, examService } from '@/app/api/v1/exams/route-utils';
import { requestIdFromHeaders } from '@/server/request-id';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateMemberOrOwner(request);
    await assertSchoolAccess(auth.principal.id);
    const { id } = await params;
    return successResponse(await examService().getProgress(auth.principal, id), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
