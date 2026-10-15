import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
import { ContributionService } from '@/services/contribution';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';

function getContributionService() {
  return new ContributionService(getDatabaseClients().pool, getDatabaseSchema());
}

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    const service = getContributionService();
    const rows = await service.listByUser(auth.principal);
    return successResponse({ items: rows }, requestId);
  } catch (err) {
    return errorResponse(err, requestId);
  }
}

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const sources = typeof body.sources === 'string' ? body.sources.trim() : '';
    if (!title || !description) {
      throw new ApiError('VALIDATION_FAILED', 'Title dan deskripsi wajib diisi');
    }

    const service = getContributionService();
    const row = await service.create(auth.principal, {
      title: title.slice(0, 200),
      description: description.slice(0, 4000),
      sources: sources.slice(0, 2000),
    });

    return successResponse(row, requestId, { status: 201 });
  } catch (err) {
    return errorResponse(err, requestId);
  }
}
