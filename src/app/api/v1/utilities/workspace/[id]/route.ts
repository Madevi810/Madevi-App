import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { requestIdFromHeaders } from '@/server/request-id';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { UtilitiesService } from '@/services/utilities';
import { validateCircuit } from '@/lib/emulator/circuit-model';
import { getDatabaseClients } from '@/db/client';

export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ id: string }> };

function validWorkspaceId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

/** GET /api/v1/utilities/workspace/[id] — muat skema emulator milik akun saja. */
export async function GET(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    const { id } = await context.params;
    if (!validWorkspaceId(id)) throw new ApiError('NOT_FOUND', 'Workspace tidak ditemukan.');

    const item = await new UtilitiesService(getDatabaseClients().pool).getSaved(
      auth.principal.id,
      id,
    );
    if (!item) throw new ApiError('NOT_FOUND', 'Workspace tidak ditemukan.');
    const input = item.input as Record<string, unknown>;
    return successResponse(
      {
        id: item.id,
        title: item.title,
        circuit: validateCircuit(input?.circuit),
        updatedAt: item.updated_at,
      },
      requestId,
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** DELETE /api/v1/utilities/workspace/[id] — hapus skema emulator milik akun saja. */
export async function DELETE(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const { id } = await context.params;
    if (!validWorkspaceId(id)) throw new ApiError('NOT_FOUND', 'Workspace tidak ditemukan.');

    const url = new URL(request.url);
    const kind = url.searchParams.get('kind');
    if (kind !== null && kind !== 'EMULATOR') {
      throw new ApiError('VALIDATION_FAILED', 'Kind filter hapus tidak valid.');
    }
    const result = await new UtilitiesService(getDatabaseClients().pool).deleteSaved(
      auth.principal.id,
      id,
      kind ?? undefined,
    );
    if (!result.deleted) throw new ApiError('NOT_FOUND', 'Workspace tidak ditemukan.');
    return successResponse(result, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
