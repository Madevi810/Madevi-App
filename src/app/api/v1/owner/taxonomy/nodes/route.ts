import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { requestIdFromHeaders } from '@/server/request-id';
import { TaxonomyService } from '@/services/taxonomy';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const body = await parseJsonObject(request);
    if (!Number.isSafeInteger(body.expectedRevision) || typeof body.confirmedImpact !== 'boolean') {
      throw new ApiError('VALIDATION_FAILED', 'Revisi dan konfirmasi dampak wajib');
    }
    const data = await new TaxonomyService(getDatabaseClients().pool).mutate(auth.principal, {
      action: 'ADD',
      expectedRevision: Number(body.expectedRevision),
      confirmedImpact: body.confirmedImpact,
      parentId: requiredText(body.parentId, 'parentId'),
      name: requiredText(body.name, 'name', { maximum: 500 }),
      slug: requiredText(body.slug, 'slug', { maximum: 240 }),
      localCode: requiredText(body.localCode, 'localCode', { maximum: 12 }),
      sortOrder: optionalInteger(body.sortOrder),
    });
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

function optionalInteger(value: unknown) {
  return Number.isSafeInteger(value) ? Number(value) : undefined;
}
