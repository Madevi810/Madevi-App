import { errorResponse, successResponse } from '@/api/response';
import { authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { SocialService } from '@/services/social';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/profiles/[username] — kartu profil minimal viewer-aware (L05 G-03).
 * Tamu atau pasangan block mendapat NOT_FOUND generik. Selalu noindex di page.
 */
export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    let viewerId: string | null = null;
    try {
      const auth = await authenticateRequest(request, 'MEMBER');
      viewerId = auth.principal.id;
    } catch {
      viewerId = null;
    }
    const { username } = await params;
    const data = await new SocialService(getDatabaseClients().pool, getDatabaseSchema()).viewProfileCard(
      viewerId,
      username,
    );
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
