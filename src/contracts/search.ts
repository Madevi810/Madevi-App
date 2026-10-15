/**
 * Kontrak Search L06 — satu DTO runtime berotorisasi untuk seluruh ruang utama.
 *
 * - SearchSpace: ruang kanonis (bukan kategori bebas).
 * - SearchResultView: hasil selalu membawa targetHref relative tervalidasi
 *   server-side; UI tidak boleh menebak route dari slug/objectId.
 * - SearchProjectionInput: input tunggal proyektor lifecycle → indeks.
 *
 * Kontrak ini dibaca SearchService, SearchProjectionService, AI retrieval,
 * dan SearchOverlay. Cache privat (bila kelak ada) wajib mengandung
 * principal/entitlement/visibility dalam key.
 */

export type SearchSpaceKey = 'explore' | 'tutorial' | 'school' | 'line' | 'services' | 'shop' | 'tools';

export type SearchEntryType =
  | 'MENU'
  | 'ARTICLE'
  | 'PROFILE'
  | 'SOFTWARE'
  | 'PAGE'
  | 'SERVICE'
  | 'PRODUCT'
  | 'POST';

export type SearchVisibility = 'PUBLIC' | 'MEMBER' | 'PRIVATE' | 'DRAFT';
export type SearchPublicationState = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';

export interface SearchResultView {
  entryType: SearchEntryType;
  objectId: string;
  title: string;
  slug: string;
  summary: string;
  snippet: string;
  accessLevel: 'PUBLIC' | 'MEMBER';
  /** Ruang kanonis hasil; null hanya untuk entry legacy pra-L06. */
  spaceKey: SearchSpaceKey | null;
  /** Deep-link kanonis tervalidasi server (selalu relative, whitelist). */
  targetHref: string;
  /** Subject/owner untuk policy block/visibility (post/profile). */
  subjectPrincipalId: string | null;
  visibility: SearchVisibility;
}

export interface SearchProjectionInput {
  entryType: SearchEntryType;
  objectId: string;
  sourceKey: string;
  title: string;
  slug: string;
  summary: string;
  searchableBody: string;
  accessLevel: 'PUBLIC' | 'MEMBER';
  spaceKey: SearchSpaceKey;
  targetHref: string;
  subjectPrincipalId?: string | null;
  visibility?: SearchVisibility;
  publicationState?: SearchPublicationState;
  language?: 'id' | 'en';
  /** false menonaktifkan entry (archive/trash/lock/block) tanpa menghapus baris. */
  indexed: boolean;
  isTest?: boolean;
}

/** Route kanonis yang boleh menjadi target hasil (whitelist L06). */
export const SEARCH_TARGET_ALLOWLIST: readonly RegExp[] = [
  /^\/ruang\/[a-z0-9][a-z0-9/-]{0,120}$/,
  /^\/artikel\/[0-9a-f-]{36}$/,
  /^\/artikel\/[a-z0-9][a-z0-9-]{2,120}$/,
  /^\/sosial$/,
  /^\/profil\/[a-z0-9][a-z0-9-]{2,32}$/,
  /^\/jasa(\/[a-z0-9][a-z0-9/-]{0,120})?$/,
  /^\/belanja(\/[0-9a-f-]{36})?$/,
  /^\/belanja\/[a-z0-9][a-z0-9-]{2,120}$/,
  /^\/alat-bantu(\/[a-z0-9][a-z0-9/-]{0,120})?$/,
  /^\/brosur-sekolah$/,
  /^\/[a-z0-9][a-z0-9/-]{0,120}$/,
];

/**
 * Validasi targetHref: relative, tanpa //, tanpa skema, masuk whitelist.
 * Fail-closed: kembalikan null bila tidak valid.
 */
export function resolveSearchTarget(href: string | null | undefined): string | null {
  if (!href || typeof href !== 'string') return null;
  if (href.length < 1 || href.length > 500) return null;
  if (!href.startsWith('/')) return null;
  if (href.startsWith('//')) return null;
  if (/^[a-z]+:/i.test(href)) return null;
  if (href.includes('..') || href.includes('\\') || href.includes(' ')) return null;
  if (!/^\/[a-z0-9/_.-]*$/i.test(href)) return null;
  const clean = href.split('?')[0].split('#')[0];
  if (!clean || clean.length < 1) return null;
  const allowed = SEARCH_TARGET_ALLOWLIST.some((re) => re.test(clean));
  return allowed ? clean : null;
}

/** Pemetaan entryType → ruang kanonis default (dipakai bila domain tidak menyebut lain). */
export const SEARCH_ENTRY_SPACE: Record<SearchEntryType, SearchSpaceKey> = {
  MENU: 'explore',
  ARTICLE: 'explore',
  PROFILE: 'line',
  SOFTWARE: 'tools',
  PAGE: 'explore',
  SERVICE: 'services',
  PRODUCT: 'shop',
  POST: 'line',
};
