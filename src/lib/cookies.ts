/**
 * Utilitas cookie sisi klien — konsolidasi 2026-10-15.
 * Menggantikan duplikasi `readCookie` di belasan komponen.
 */
export function readCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const prefix = `${name}=`;
  const item = document.cookie
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith(prefix));
  return item ? decodeURIComponent(item.slice(prefix.length)) : '';
}

export function writeCookie(name: string, value: string, maxAgeSeconds = 31536000): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Strict`;
}
