import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject, requiredText } from '@/api/validation';
import { sidangService } from '@/app/api/v1/line/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { requestIdFromHeaders } from '@/server/request-id';
import { ApiError } from '@/api/errors';
import type { SidangVoteChoice } from '@/services/sidang';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/line/sidang/[id]/vote — suara anonim (fase VOTING).
 *
 * Body: { choice: 'SETUJU' | 'TOLAK' | 'ABSTAIN' }. Identitas pemilih
 * dicatat sebagai HMAC hash, bukan id mentah.
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
    const choice = requiredText(body.choice, 'choice') as SidangVoteChoice;
    const validChoices: SidangVoteChoice[] = ['SETUJU', 'TOLAK', 'ABSTAIN'];
    if (!validChoices.includes(choice)) {
      throw new ApiError('VALIDATION_FAILED', 'choice harus SETUJU/TOLAK/ABSTAIN');
    }
    const data = await sidangService().castVote(auth.principal, id, choice);
    return successResponse(data, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
