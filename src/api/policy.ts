import { ApiError } from '@/api/errors';
import type { Principal } from '@/contracts/services';

export function requirePrincipal(principal: Principal | null): Principal {
  if (!principal) throw new ApiError('AUTHENTICATION_REQUIRED', 'Sesi server diperlukan');
  return principal;
}

export function requireApproved(principal: Principal) {
  if (principal.approvalStatus !== 'APPROVED') {
    throw new ApiError('ACCESS_DENIED', 'Akun belum disetujui');
  }
}

export function canReadOwnedRecord(principal: Principal, ownerPrincipalId: string) {
  return principal.role === 'OWNER' || principal.id === ownerPrincipalId;
}
