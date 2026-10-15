import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { requestIdFromHeaders } from '@/server/request-id';
import { TaxonomyService } from '@/services/taxonomy';

const ACTIONS = new Set(['EDIT', 'REORDER', 'MOVE', 'ARCHIVE', 'RESTORE']);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const body = await parseJsonObject(request);
    if (
      typeof body.action !== 'string' ||
      !ACTIONS.has(body.action) ||
      !Number.isSafeInteger(body.expectedRevision) ||
      typeof body.confirmedImpact !== 'boolean'
    ) {
      throw new ApiError('VALIDATION_FAILED', 'Aksi, revisi, atau konfirmasi tidak valid');
    }
    const { id } = await params;
    const data = await new TaxonomyService(getDatabaseClients().pool).mutate(auth.principal, {
      action: body.action as 'EDIT' | 'REORDER' | 'MOVE' | 'ARCHIVE' | 'RESTORE',
      expectedRevision: Number(body.expectedRevision),
      confirmedImpact: body.confirmedImpact,
      nodeId: id,
      parentId: optionalText(body.parentId),
      name: optionalText(body.name),
      slug: optionalText(body.slug),
      sortOrder: Number.isSafeInteger(body.sortOrder) ? Number(body.sortOrder) : undefined,
    });
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

function optionalText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
