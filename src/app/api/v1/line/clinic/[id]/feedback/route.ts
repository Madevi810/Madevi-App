import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { clinicService } from '@/app/api/v1/line/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
import { ApiError } from '@/api/errors';
import type { ClinicFeedbackKind } from '@/services/clinic';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/line/clinic/[id]/feedback — tambah feedback.
 *
 * Body: { kind: 'PERTANYAAN' | 'SARAN' | 'APRESIASI', body: string }.
 * Kind diperbolehkan hanya sesuai fase aktif (dipaksa server-side):
 * BERTANYA→PERTANYAAN, MEMBEDAH→SARAN, APRESIASI→APRESIASI.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id } = await params;
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const kind = requiredText(body.kind, 'kind') as ClinicFeedbackKind;
    const validKinds: ClinicFeedbackKind[] = ['PERTANYAAN', 'SARAN', 'APRESIASI'];
    if (!validKinds.includes(kind)) {
      throw new ApiError('VALIDATION_FAILED', 'kind tidak valid');
    }
    const data = await clinicService().addFeedback(
      auth.principal,
      id,
      kind,
      requiredText(body.body, 'body'),
    );
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
