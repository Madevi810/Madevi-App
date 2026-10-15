/**
 * Membaca CSRF token non-HttpOnly (`madevi_csrf`) untuk header `x-csrf-token`.
 * Dipakai bersama fetch JSON/FormData ke route MEMBER yang memakai
 * `assertRequestCsrf` (double-submit cookie).
 */
export function csrfToken(): string {
  if (typeof document === 'undefined') return '';
  const prefix = 'madevi_csrf=';
  const item = document.cookie
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith(prefix));
  return item ? decodeURIComponent(item.slice(prefix.length)) : '';
}

/** Header CSRF siap pakai untuk fetch. */
export function csrfHeaders(): Record<string, string> {
  return { 'x-csrf-token': csrfToken() };
}
