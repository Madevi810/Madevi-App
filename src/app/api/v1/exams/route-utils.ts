import { ApiError, type ApiErrorCode } from '@/api/errors';
import { authenticateRequest, parseCookies } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { ExamService } from '@/services/exam';
import { AccessPolicyResolver, policyReasonMessage } from '@/api/access-policy';

export function examService() {
  return new ExamService(getDatabaseClients().pool, getDatabaseSchema());
}

export async function authenticateMemberOrOwner(request: Request) {
  const cookies = parseCookies(request.headers.get('cookie'));
  if (cookies.has('madevi_owner_access')) {
    return authenticateRequest(request, 'OWNER', { humanActivity: true });
  }
  if (cookies.has('madevi_access')) return authenticateRequest(request, 'MEMBER');
  throw new ApiError('AUTHENTICATION_REQUIRED', 'Sesi server diperlukan');
}

/** Server-side School gate: Free hanya brosur; PRO/LOVE (dan Admin) boleh. */
export async function assertSchoolAccess(principalId: string) {
  const resolver = new AccessPolicyResolver(getDatabaseClients().pool, getDatabaseSchema());
  const decision = resolver.decideSchoolAccess(await resolver.loadPrincipalContext(principalId));
  if (!decision.allowed) {
    const code: ApiErrorCode =
      decision.reason === 'PACKAGE_INSUFFICIENT'
        ? 'PACKAGE_INSUFFICIENT'
        : decision.reason === 'AUTHENTICATION_REQUIRED'
          ? 'AUTHENTICATION_REQUIRED'
          : 'ACCESS_DENIED';
    throw new ApiError(
      code,
      policyReasonMessage(decision.reason),
      decision.context
        ? Object.fromEntries(Object.entries(decision.context).map(([key, value]) => [key, String(value)]))
        : undefined,
    );
  }
}

export function optionalString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
