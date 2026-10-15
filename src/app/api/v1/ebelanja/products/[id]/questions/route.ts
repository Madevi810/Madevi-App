import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { getPool } from '@/db/pool';
import { requestIdFromHeaders } from '@/server/request-id';
import { EBelanjaService } from '@/services/ebelanja';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    if (!UUID.test(id)) throw new ApiError('VALIDATION_FAILED', 'ID produk tidak valid.');
    const questions = await new EBelanjaService(await getPool()).listPublicProductQuestions(id);
    return successResponse(questions, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
