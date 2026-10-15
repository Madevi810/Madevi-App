'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SearchResult {
  entryType: string;
  objectId: string;
  title: string;
  slug: string;
  summary: string;
  accessLevel: string;
  snippet: string;
  /** L06: deep-link kanonis dari server; UI tidak menebak route. */
  targetHref?: string;
  spaceKey?: string | null;
}

interface Props {
  query: string;
  /** Optional so the standalone overlay remains safe while its parent initializes. */
  categories?: string[];
  spaces?: string[];
  onCategoriesChange?: (categories: string[]) => void;
  onSpacesChange?: (spaces: string[]) => void;
  onClose: () => void;
  language: 'id' | 'en';
  onSelectSearch?: (term: string) => void;
}

const CATEGORIES = [
  'MENU',
  'ARTICLE',
  'PROFILE',
  'SOFTWARE',
  'PAGE',
  'SERVICE',
  'PRODUCT',
  'POST',
] as const;

/** L06: filter ruang kanonis (bukan kategori bebas). */
const SPACES = [
  { key: 'explore', label: 'Explore & Learn' },
  { key: 'tutorial', label: 'Tutorial & Problem Solve' },
  { key: 'school', label: 'Madevi School' },
  { key: 'line', label: 'Madevi Line' },
  { key: 'services', label: 'Madevi Services' },
  { key: 'shop', label: 'Madevi Shop' },
  { key: 'tools', label: 'Tools & Equipment' },
] as const;

/**
 * Default filter stabil: default parameter `[]` membuat identitas array baru
 * di setiap render sehingga effect ber-dependensi [categories, spaces] akan
 * terpicu ulang tanpa henti saat overlay dipakai standalone (tanpa props).
 */
const EMPTY_FILTER: string[] = [];

export function SearchOverlay({
  query,
  categories = EMPTY_FILTER,
  spaces = EMPTY_FILTER,
  onCategoriesChange = () => {},
  onSpacesChange = () => {},
  onClose,
  language,
  onSelectSearch,
}: Props) {
  const isId = language === 'id';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [debounced, setDebounced] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const RECENT_KEY = 'madevi:recent-searches';
  const MAX_RECENT = 8;

  // Muat riwayat pencarian.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        if (Array.isArray(arr)) setRecentSearches(arr.slice(0, MAX_RECENT));
      }
    } catch {
      // Abaikan.
    }
  }, []);

  const saveRecentSearch = useCallback((q: string) => {
    const term = q.trim();
    if (term.length < 2) return;
    setRecentSearches((prev) => {
      const next = [term, ...prev.filter((x) => x.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // Abaikan.
      }
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      // Abaikan.
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebounced(query), 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  useEffect(() => {
    if (!debounced || debounced.length < 2) {
      abortRef.current?.abort();
      setResults([]);
      setError(false);
      setLoading(false);
      setNextCursor(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(false);
    setResults([]);

    const params = new URLSearchParams({ q: debounced, limit: '20' });
    if (categories.length) params.set('category', categories.join(','));
    if (spaces.length) params.set('space', spaces.join(','));
    void fetch(`/api/v1/search?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const payload: unknown = await response.json();
        if (!response.ok || !isSearchResponse(payload)) throw new Error('Search request failed');
        setResults(payload.data);
        setNextCursor(payload.page?.nextCursor ?? null);
        if (payload.data.length > 0) saveRecentSearch(debounced);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setResults([]);
        setError(true);
      })
      .finally(() => {
        if (abortRef.current === controller) setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [categories, debounced, spaces, retryKey]);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const params = new URLSearchParams({ q: debounced, limit: '20', cursor: nextCursor });
      if (categories.length) params.set('category', categories.join(','));
      if (spaces.length) params.set('space', spaces.join(','));
      const response = await fetch(`/api/v1/search?${params}`);
      const payload: unknown = await response.json();
      if (!response.ok || !isSearchResponse(payload)) throw new Error('Search request failed');
      setResults((current) => [...current, ...payload.data]);
      setNextCursor(payload.page?.nextCursor ?? null);
    } catch {
      setError(true);
    } finally {
      setLoadingMore(false);
    }
  }

  function toggleCategory(category: string) {
    onCategoriesChange(
      categories.includes(category)
        ? categories.filter((item) => item !== category)
        : [...categories, category],
    );
  }

  function toggleSpace(space: string) {
    onSpacesChange(
      spaces.includes(space) ? spaces.filter((s) => s !== space) : [...spaces, space],
    );
  }

  /**
   * L06: gunakan targetHref tervalidasi server. Fallback legacy hanya untuk
   * entry pra-0031 yang belum punya target (tidak lagi menebak sub-menu
   * sebagai route ruang; brosur-program → /brosur-sekolah).
   */
  const linkFor = useCallback((r: SearchResult): string => {
    if (typeof r.targetHref === 'string' && r.targetHref.startsWith('/')) return r.targetHref;
    const map: Record<string, () => string> = {
      MENU: () => (r.slug === 'brosur-program' ? '/brosur-sekolah' : `/ruang/${r.slug}`),
      ARTICLE: () => `/artikel/${r.objectId}`,
      PROFILE: () => `/profil/${r.slug}`,
      SOFTWARE: () => '/alat-bantu',
      PAGE: () => `/${r.slug}`,
      SERVICE: () => '/jasa',
      PRODUCT: () => `/belanja/${r.objectId}`,
      POST: () => '/sosial',
    };
    return map[r.entryType]?.() ?? '/';
  }, []);

  return (
    <div className="search-overlay" aria-label={isId ? 'Hasil pencarian Madevi' : 'Madevi search results'}>
      <div className="search-overlay__bar">
        <button
          type="button"
          className="search-overlay__close"
          onClick={onClose}
          aria-label={isId ? 'Tutup pencarian' : 'Close search'}
        >
          ×
        </button>
      </div>
      <div className="search-overlay__body" aria-live="polite">
        <fieldset className="search-overlay__filters">
          <legend>{isId ? 'Filter ruang' : 'Space filters'}</legend>
          {SPACES.map((space) => (
            <button
              key={space.key}
              type="button"
              className={`search-overlay__filter${spaces.includes(space.key) ? ' search-overlay__filter--active' : ''}`}
              aria-pressed={spaces.includes(space.key)}
              onClick={() => toggleSpace(space.key)}
            >
              {space.label}
            </button>
          ))}
        </fieldset>
        <fieldset className="search-overlay__filters">
          <legend>{isId ? 'Filter kategori' : 'Category filters'}</legend>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`search-overlay__filter${categories.includes(category) ? ' search-overlay__filter--active' : ''}`}
              aria-pressed={categories.includes(category)}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </button>
          ))}
        </fieldset>
        {debounced.length < 2 && (
          <p className="search-overlay__hint">
            {isId
              ? 'Ketik minimal dua karakter untuk mencari.'
              : 'Type at least two characters to search.'}
          </p>
        )}
        {loading && <p className="search-overlay__loading">{isId ? 'Mencari…' : 'Searching…'}</p>}
        {error && !loading && (
          <p className="search-overlay__error" role="alert">
            {isId
              ? 'Pencarian belum dapat dimuat. Coba lagi.'
              : 'Search could not load. Try again.'}
            <button type="button" className="button button--small" onClick={() => setRetryKey((key) => key + 1)}>
              {isId ? 'Coba lagi' : 'Retry'}
            </button>
          </p>
        )}
        {!loading && debounced.length < 2 && recentSearches.length > 0 && (
          <div className="search-overlay__recent">
            <div className="search-overlay__recent-header">
              <span>{isId ? 'Pencarian terakhir' : 'Recent searches'}</span>
              <button
                type="button"
                className="search-overlay__recent-clear"
                onClick={clearRecentSearches}
              >
                {isId ? 'Hapus' : 'Clear'}
              </button>
            </div>
            <ul className="search-overlay__recent-list">
              {recentSearches.map((term) => (
                <li key={term}>
                  <button
                    type="button"
                    className="search-overlay__recent-item"
                    onClick={() => onSelectSearch?.(term)}
                    title={term}
                  >
                    🕐 {term}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!loading && !error && debounced.length >= 2 && results.length === 0 && (
          <p className="search-overlay__empty">
            {isId
              ? 'Tidak ditemukan. Coba kata kunci lain atau filter ruang berbeda.'
              : 'No results. Try another keyword or space filter.'}
          </p>
        )}
        {results.length > 0 && (
          <ul className="search-overlay__results" role="list">
            {results.map((r, i) => (
              <li key={`${r.entryType}:${r.objectId}` || i}>
                <Link href={linkFor(r)} className="search-overlay__item" onClick={onClose}>
                  <span className="search-overlay__type">
                    {r.spaceKey ? `${r.spaceKey} · ${r.entryType}` : r.entryType}
                  </span>
                  <span className="search-overlay__title">
                    <HighlightedText text={r.title} query={debounced} />
                  </span>
                  <span className="search-overlay__snippet">
                    <HighlightedText
                      text={(r.snippet || r.summary).substring(0, 120)}
                      query={debounced}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {nextCursor && !loading && (
          <button
            type="button"
            className="button search-overlay__more"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (isId ? 'Memuat…' : 'Loading…') : isId ? 'Muat hasil lain' : 'Load more'}
          </button>
        )}
      </div>
    </div>
  );
}

function isSearchResponse(
  value: unknown,
): value is { data: SearchResult[]; page?: { nextCursor?: string | null } } {
  return (
    typeof value === 'object' && value !== null && 'data' in value && Array.isArray(value.data)
  );
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const terms = [
    ...new Set(
      query
        .trim()
        .split(/\s+/)
        .filter((term) => term.length > 1),
    ),
  ];
  if (!terms.length) return text;
  const escaped = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pieces = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'));
  return (
    <>
      {pieces.map((piece, index) =>
        escaped.some((term) => new RegExp(`^${term}$`, 'i').test(piece)) ? (
          <mark key={index}>{piece}</mark>
        ) : (
          piece
        ),
      )}
    </>
  );
}
