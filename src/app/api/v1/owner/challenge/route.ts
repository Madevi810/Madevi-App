import { successResponse } from '@/api/response';
import { requestIdFromHeaders } from '@/server/request-id';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  return successResponse({ obsolete: true }, requestId, { status: 410 });
}
