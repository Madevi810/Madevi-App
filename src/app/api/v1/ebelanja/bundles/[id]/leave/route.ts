import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { requestIdFromHeaders } from '@/server/request-id';
import { BundleService } from '@/services/bundle';

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/v1/ebelanja/bundles/[id]/leave — keluar sebelum PENUH (member).
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const data = await new BundleService(
      getDatabaseClients().pool,
      getDatabaseSchema(),
    ).leaveBundle(auth.principal.id, id);
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
