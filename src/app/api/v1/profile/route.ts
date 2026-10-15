import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { AccountsService } from '@/services/accounts';
import { getDatabaseClients } from '@/db/client';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    const data = await new AccountsService(getDatabaseClients().pool).privateProfile(
      auth.principal,
    );
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

export async function PATCH(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request);
    const data = await new AccountsService(getDatabaseClients().pool).updateProfile(
      auth.principal,
      {
        ...(typeof body.description === 'string' ? { description: body.description } : {}),
        ...(body.themePreference === 'light' ||
        body.themePreference === 'dark' ||
        body.themePreference === 'madevi-on'
          ? { themePreference: body.themePreference }
          : {}),
        ...(body.languagePreference === 'id' || body.languagePreference === 'en'
          ? { languagePreference: body.languagePreference }
          : {}),
        // Zona Tenang (INOVASI-0841): flag calmMode di ui_preferences JSONB.
        ...(body.uiPreferences &&
        typeof body.uiPreferences === 'object' &&
        typeof (body.uiPreferences as Record<string, unknown>).calmMode === 'boolean'
          ? {
              calmModePreference: (body.uiPreferences as Record<string, unknown>)
                .calmMode as boolean,
            }
          : {}),
        // L03: status pendidikan tervalidasi di service; tidak mengubah entitlement.
        ...(typeof body.educationStatus === 'string'
          ? {
              educationStatus: body.educationStatus as
                | 'TIDAK_BERSEKOLAH'
                | 'ALUMNI'
                | 'SD'
                | 'SMP'
                | 'SMA_SMK'
                | 'PERGURUAN_TINGGI',
            }
          : {}),
      },
    );
    return successResponse(data, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
