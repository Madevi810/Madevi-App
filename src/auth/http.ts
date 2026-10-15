import { ApiError } from '@/api/errors';
import type { SessionAudience, SessionBundle } from '@/auth/session';
import { SessionService } from '@/auth/session';
import {
  ADMIN_COOKIES,
  LEGACY_OWNER_COOKIES,
  USER_COOKIES,
  appAudienceFromSession,
} from '@/contracts/identity';
import { getDatabaseClients } from '@/db/client';

/**
 * L07: vocabulary aplikasi ADMIN/USER dengan adapter kompatibel.
 * - Database/sesi legacy OWNER/MEMBER tetap dibaca via adapter (bukan rename).
 * - Cookie canonical: madevi_admin_* (Admin), madevi_* (User).
 * - Alias legacy madevi_owner_* diterima selama transisi; bila cookie
 *   audience ganda ambigu/tidak konsisten → fail-closed (tidak rotasi sesi).
 */

const COOKIE_NAMES = {
  MEMBER: { access: 'madevi_access', refresh: 'madevi_refresh', csrf: 'madevi_csrf' },
  OWNER: {
    access: 'madevi_owner_access',
    refresh: 'madevi_owner_refresh',
    csrf: 'madevi_owner_csrf',
  },
} as const;

type AppAudienceInput = SessionAudience | 'ADMIN' | 'USER';

function toStorageAudience(audience: AppAudienceInput): SessionAudience {
  if (audience === 'ADMIN') return 'OWNER';
  if (audience === 'USER') return 'MEMBER';
  return audience;
}

function cookieSetFor(audience: SessionAudience): {
  access: string;
  refresh: string;
  csrf: string;
} {
  if (audience === 'OWNER') {
    return {
      access: `${ADMIN_COOKIES.access}|${LEGACY_OWNER_COOKIES.access}`,
      refresh: `${ADMIN_COOKIES.refresh}|${LEGACY_OWNER_COOKIES.refresh}`,
      csrf: `${ADMIN_COOKIES.csrf}|${LEGACY_OWNER_COOKIES.csrf}`,
    };
  }
  return { ...USER_COOKIES };
}

export async function authenticateRequest(
  request: Request,
  audience: AppAudienceInput,
  options: { humanActivity?: boolean } = {},
) {
  const storageAudience = toStorageAudience(audience);
  // Guard: audience tak dikenal ditolak fail-closed.
  if (!appAudienceFromSession(storageAudience)) {
    throw new ApiError('ACCESS_DENIED', 'Audience tidak dikenal');
  }
  const cookies = parseCookies(request.headers.get('cookie'));
  // Canonical dulu, lalu alias legacy (Admin). Ambiguitas ganda ditolak.
  const candidates =
    storageAudience === 'OWNER'
      ? [ADMIN_COOKIES.access, LEGACY_OWNER_COOKIES.access, COOKIE_NAMES.OWNER.access]
      : [USER_COOKIES.access, COOKIE_NAMES.MEMBER.access];
  const present = candidates.filter((name) => cookies.get(name));
  if (present.length > 1) {
    // Dua cookie audience berbeda/duplikat → fail-closed, jangan pilih diam-diam.
    const values = new Set(present.map((name) => cookies.get(name)));
    if (values.size > 1) throw new ApiError('ACCESS_DENIED', 'Sesi ambigu; login ulang diperlukan');
  }
  const token =
    cookies.get(candidates[0] as string) ??
    cookies.get(candidates[1] as string) ??
    cookies.get(candidates[2] as string);
  if (!token) throw new ApiError('AUTHENTICATION_REQUIRED', 'Sesi server diperlukan');
  const auth = await sessionService().authenticateAccess(token, storageAudience, options);
  // L07: MEMBER tidak pernah dieskalasi menjadi ADMIN via alias.
  if (audience === 'ADMIN' && auth.principal.role !== 'OWNER') {
    throw new ApiError('ACCESS_DENIED', 'Hanya Admin');
  }
  if (audience === 'USER' && auth.principal.role === 'SERVICE') {
    throw new ApiError('ACCESS_DENIED', 'Sesi layanan bukan user');
  }
  return auth;
}

/** Alias eksplisit untuk caller Admin baru (vocabulary ADMIN). */
export async function authenticateAdmin(
  request: Request,
  options: { humanActivity?: boolean } = {},
) {
  return authenticateRequest(request, 'ADMIN', options);
}

export async function assertRequestCsrf(
  request: Request,
  sessionId: string,
  audience: AppAudienceInput,
) {
  const storageAudience = toStorageAudience(audience);
  const cookies = parseCookies(request.headers.get('cookie'));
  const csrfNames =
    storageAudience === 'OWNER'
      ? [ADMIN_COOKIES.csrf, LEGACY_OWNER_COOKIES.csrf]
      : [USER_COOKIES.csrf];
  const cookieToken =
    cookies.get(csrfNames[0] as string) ?? (csrfNames[1] ? cookies.get(csrfNames[1] as string) : null) ?? null;
  await sessionService().assertCsrf(
    sessionId,
    request.headers.get('x-csrf-token'),
    cookieToken,
  );
}

export function refreshTokenFromRequest(request: Request, audience: AppAudienceInput) {
  const storageAudience = toStorageAudience(audience);
  const cookies = parseCookies(request.headers.get('cookie'));
  if (storageAudience === 'OWNER') {
    return (
      cookies.get(ADMIN_COOKIES.refresh) ?? cookies.get(LEGACY_OWNER_COOKIES.refresh) ?? null
    );
  }
  return parseCookies(request.headers.get('cookie')).get(COOKIE_NAMES[audience as SessionAudience].refresh) ?? null;
}

export function appendSessionCookies(
  response: Response,
  bundle: SessionBundle,
  requestUrl: string,
) {
  // `/owner` masih surface kompatibilitas dan banyak consumer legacy membaca
  // `madevi_owner_*`. Terbitkan pasangan alias dengan nilai identik selama
  // transisi; authenticateRequest menerima keduanya hanya bila nilainya sama.
  const nameSets =
    bundle.audience === 'OWNER'
      ? [
          { access: ADMIN_COOKIES.access, refresh: ADMIN_COOKIES.refresh, csrf: ADMIN_COOKIES.csrf },
          {
            access: LEGACY_OWNER_COOKIES.access,
            refresh: LEGACY_OWNER_COOKIES.refresh,
            csrf: LEGACY_OWNER_COOKIES.csrf,
          },
        ]
      : [COOKIE_NAMES[bundle.audience]];
  void cookieSetFor;
  const secure = secureCookieFlag(requestUrl);
  const refreshMaxAge = Math.max(
    0,
    Math.floor((new Date(bundle.refreshExpiresAt).getTime() - Date.now()) / 1000),
  );
  for (const names of nameSets) {
    response.headers.append(
      'set-cookie',
      serializeCookie(names.access, bundle.accessToken, {
        httpOnly: true,
        secure,
        sameSite: 'Strict',
        maxAge: 600,
      }),
    );
    response.headers.append(
      'set-cookie',
      serializeCookie(names.refresh, bundle.refreshToken, {
        httpOnly: true,
        secure,
        sameSite: 'Strict',
        maxAge: refreshMaxAge,
      }),
    );
    response.headers.append(
      'set-cookie',
      serializeCookie(names.csrf, bundle.csrfToken, {
        httpOnly: false,
        secure,
        sameSite: 'Strict',
        maxAge: refreshMaxAge,
      }),
    );
  }
  return response;
}

export function clearSessionCookies(
  response: Response,
  audience: AppAudienceInput,
  requestUrl: string,
) {
  const storageAudience = toStorageAudience(audience);
  const secure = secureCookieFlag(requestUrl);
  // Clear canonical + legacy agar tidak ada sesi sisa di salah satu nama.
  const sets: string[] =
    storageAudience === 'OWNER'
      ? [
          ADMIN_COOKIES.access,
          ADMIN_COOKIES.refresh,
          ADMIN_COOKIES.csrf,
          LEGACY_OWNER_COOKIES.access,
          LEGACY_OWNER_COOKIES.refresh,
          LEGACY_OWNER_COOKIES.csrf,
        ]
      : Object.values(COOKIE_NAMES[storageAudience]);
  for (const name of sets) {
    const isCsrf = name.endsWith('_csrf');
    response.headers.append(
      'set-cookie',
      serializeCookie(name, '', {
        httpOnly: !isCsrf,
        secure,
        sameSite: 'Strict',
        maxAge: 0,
      }),
    );
  }
  return response;
}

export function sessionService() {
  return new SessionService(getDatabaseClients().pool);
}

export function parseCookies(header: string | null) {
  const result = new Map<string, string>();
  for (const part of header?.split(';') ?? []) {
    const separator = part.indexOf('=');
    if (separator <= 0) continue;
    const name = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    try {
      result.set(name, decodeURIComponent(value));
    } catch {
      // Cookie malformed diabaikan dan autentikasi akan gagal tertutup.
    }
  }
  return result;
}

function serializeCookie(
  name: string,
  value: string,
  options: { httpOnly: boolean; secure: boolean; sameSite: 'Strict'; maxAge: number },
) {
  return [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${options.maxAge}`,
    options.httpOnly ? 'HttpOnly' : '',
    options.secure ? 'Secure' : '',
    `SameSite=${options.sameSite}`,
    'Priority=High',
  ]
    .filter(Boolean)
    .join('; ');
}

function secureCookieFlag(requestUrl: string) {
  const url = new URL(requestUrl);
  if (url.protocol === 'https:') return true;
  if (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)) return false;
  throw new ApiError(
    'ACCESS_DENIED',
    'Cookie autentikasi hanya tersedia pada HTTPS atau localhost',
  );
}
