/**
 * Kontrak identitas aplikasi L07 — vocabulary ADMIN/USER.
 *
 * - Database/principal role legacy OWNER/MEMBER tetap tersimpan sebagai
 *   detail persistence transisional (bukan rename buta).
 * - Kontrak/UI/API baru memakai ADMIN/USER; adapter ini satu-satunya tempat
 *   conversion. Audit mencatat audience aplikasi + storage role bila perlu.
 * - Cookie canonical Admin/User dengan penerimaan alias madevi_owner_* dan
 *   madevi_* selama transisi. Ambigu (audience ganda) → fail-closed.
 */

export type AppRole = 'ADMIN' | 'USER';
export type StorageRole = 'OWNER' | 'MEMBER' | 'SERVICE';
export type SessionAudienceLegacy = 'OWNER' | 'MEMBER';
export type AppAudience = 'ADMIN' | 'USER';

const STORAGE_TO_APP: Record<string, AppRole | null> = {
  OWNER: 'ADMIN',
  MEMBER: 'USER',
  SERVICE: null,
};

const APP_TO_STORAGE: Record<AppRole, StorageRole> = {
  ADMIN: 'OWNER',
  USER: 'MEMBER',
};

const AUDIENCE_TO_APP: Record<string, AppRole | null> = {
  OWNER: 'ADMIN',
  MEMBER: 'USER',
  ADMIN: 'ADMIN',
  USER: 'USER',
};

/** Storage role → aplikasi. SERVICE tidak dipetakan (null = bukan user operasional). */
export function appRoleFromStorage(role: string): AppRole | null {
  return STORAGE_TO_APP[role] ?? null;
}

/** Aplikasi → storage legacy (untuk query persistence). */
export function storageRoleFromApp(role: AppRole): StorageRole {
  return APP_TO_STORAGE[role];
}

/** Audience sesi/API → aplikasi. Null = ditolak fail-closed. */
export function appAudienceFromSession(audience: string): AppRole | null {
  return AUDIENCE_TO_APP[audience] ?? null;
}

/** True bila principal storage adalah Admin aplikasi. */
export function isAppAdmin(storageRole: string): boolean {
  return appRoleFromStorage(storageRole) === 'ADMIN';
}

export const ADMIN_COOKIES = {
  access: 'madevi_admin_access',
  refresh: 'madevi_admin_refresh',
  csrf: 'madevi_admin_csrf',
} as const;

export const USER_COOKIES = {
  access: 'madevi_access',
  refresh: 'madevi_refresh',
  csrf: 'madevi_csrf',
} as const;

export const LEGACY_OWNER_COOKIES = {
  access: 'madevi_owner_access',
  refresh: 'madevi_owner_refresh',
  csrf: 'madevi_owner_csrf',
} as const;
