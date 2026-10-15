import { getSessionPrincipal } from '@/auth/session';
import type { Principal } from '@/contracts/services';

export async function getPrincipal(req?: Request): Promise<Principal | null> {
  return await getSessionPrincipal(req as Request);
}

export type { Principal };
