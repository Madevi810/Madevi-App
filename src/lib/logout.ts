/**
 * Utilitas logout bersama — konsolidasi 2026-10-16.
 * Menggantikan duplikasi fungsi logout di admin-shell, owner-shell, owner-console.
 */
import { readCookie } from './cookies';

export type LogoutAudience = 'admin' | 'owner' | 'user';

const LOGOUT_ENDPOINTS: Record<LogoutAudience, string[]> = {
  admin: ['/api/v1/admin/logout', '/api/v1/owner/logout'],
  owner: ['/api/v1/owner/logout'],
  user: ['/api/v1/auth/logout'],
};

const CSRF_COOKIES: Record<LogoutAudience, string[]> = {
  admin: ['madevi_admin_csrf', 'madevi_owner_csrf', 'madevi_csrf'],
  owner: ['madevi_owner_csrf', 'madevi_admin_csrf', 'madevi_csrf'],
  user: ['madevi_csrf'],
};

export async function performLogout(audience: LogoutAudience): Promise<boolean> {
  const csrf = CSRF_COOKIES[audience]
    .map((name) => readCookie(name))
    .find((value) => value.length > 0) ?? '';

  for (const endpoint of LOGOUT_ENDPOINTS[audience]) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: csrf ? { 'x-csrf-token': csrf } : {},
      });
      if (response.ok) return true;
    } catch {
      // Coba endpoint berikutnya
    }
  }
  return false;
}
