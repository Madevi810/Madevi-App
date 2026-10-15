'use client';

/**
 * RuangNavigator — R2, R3, R4, R5 (Revisi-promt4.md P04-B/C/D/E)
 *
 * Pola bersama (A3):
 *   1 kapsul pembuka → popup pemilih awal di tengah layar
 *   → pilihan awal → POPUP TUTUP OTOMATIS
 *   → halaman Ruang yang sama menampilkan cabang INLINE (list/accordion +
 *     breadcrumb + search internal + rel A–Z bila > 12 item)
 *   → leaf Judul → ROUTE /artikel (R5: leaf contentKind software →
 *     R5SoftwareDetail, tidak ganti route)
 *
 * Per-Ruang (perbedaan hanya pada jenis menu):
 *   R2 — grid 2 kolom 5 Domain, domain ke-5 ukuran sama
 *   R3 — daftar A–Z + search, bobot visual seragam (netralitas agama)
 *   R4 — dua kapsul kecil: Dunia & Global | Negara (A–Z + kode negara)
 *   R5 — daftar A–Z + search kategori alat/software
 *
 * Aturan yang ditegakkan:
 *  - Tidak ada <select> native.
 *  - Tidak ada refresh/route change sebelum halaman akhir (artikel).
 *  - Node dipakai sebagai entitas ber-ID; jenis leaf dibaca dari
 *    contentKind, bukan ditebak dari slug/judul.
 *  - Data cabang dasar yang belum dipetakan Admin → empty state netral
 *    + tombol kembali (bukan halaman palsu).
 */

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { R5SoftwareDetail } from './r5-software-detail';
import { useLanguage } from './theme-provider';

/* ============================================================ Tipe */

export interface NavNode {
  id: string;
  parentId?: string | null;
  level?: string;
  code?: string;
  name: string;
  slug: string;
  path: string;
  order?: number;
  status?: string;
  empty?: boolean;
  childCount?: number;
  articleCount?: number;
  contentKind?: string;
  softwareId?: string;
  children?: NavNode[];
}

interface NavArticle {
  id: string;
  title: string;
  summary?: string;
  reading_minutes?: number;
  position?: number | null;
}

interface NavData {
  node: NavNode | null;
  breadcrumb: NavNode[];
  children: NavNode[];
}

/* ============================================================ Helper */

function parseNav(json: unknown): NavData {
  const data = (json as { data?: NavData })?.data ?? (json as NavData);
  return {
    node: data?.node ?? null,
    breadcrumb: data?.breadcrumb ?? [],
    children: data?.children ?? [],
  };
}

function isSoftwareLeaf(node: NavNode | null): boolean {
  if (!node) return false;
  const kind = (node.contentKind ?? '').toLowerCase();
  return kind === 'software' || kind === 'tool';
}

/** Ambil huruf pertama untuk rel A–Z (fallback '#'). */
function firstLetter(name: string): string {
  const ch = (name.trim()[0] ?? '#').toUpperCase();
  return /[A-Z]/.test(ch) ? ch : '#';
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

/* ============================================================ Popup shell */

type RoomMode = 'R2' | 'R3' | 'R4' | 'R5';

function EntryPopup({
  title,
  onClose,
  isId,
  children,
}: {
  title: string;
  onClose: () => void;
  isId: boolean;
  children: React.ReactNode;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  return (
    <div
      ref={backdropRef}
      className="r1-popup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="r1-popup rnav-entry-modal">
        <div className="r1-popup__header">
          <h2 className="r1-popup__title">{title}</h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="r1-popup__close"
            onClick={onClose}
            aria-label={isId ? 'Tutup' : 'Close'}
          >
            ✕
          </button>
        </div>
        <div className="r1-popup__body">{children}</div>
      </div>
    </div>
  );
}

/* ============================================================ Komponen utama */

export function RuangNavigator({ fullSlug, rootName }: { fullSlug: string; rootName?: string }) {
  const { language } = useLanguage();
  const isId = language === 'id';

  const rootBase = fullSlug.split('/')[0];
  const displayRootName = rootName ?? rootBase;

  /* Mode Ruang dari path dasar (bukan dari judul) */
  const roomMode: RoomMode = rootBase.includes('agama')
    ? 'R3'
    : rootBase.includes('negara') || rootBase.includes('sejarah') || rootBase.includes('hukum')
      ? 'R4'
      : rootBase.includes('alat') || rootBase.includes('software') || rootBase.includes('perangkat')
        ? 'R5'
        : 'R2';

  const capsuleLabel = {
    R2: 'Explore & Learn',
    R3: isId ? 'Jelajahi Agama & Kepercayaan' : 'Explore Religion & Belief',
    R4: isId ? 'Jelajahi Negara & Masyarakat' : 'Explore Country & Society',
    R5: isId ? 'Jelajahi Alat & Software' : 'Explore Tools & Software',
  }[roomMode];

  /* --- state --- */
  const [rootChildren, setRootChildren] = useState<NavNode[]>([]);
  const [branch, setBranch] = useState<NavNode[]>([]); // jalur cabang aktif: [rootChoice, ...]
  const [currentChildren, setCurrentChildren] = useState<NavNode[]>([]);
  const [articles, setArticles] = useState<NavArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEntry, setShowEntry] = useState(false);
  const [query, setQuery] = useState('');
  const [azJump, setAzJump] = useState<string | null>(null);

  const isDeep = fullSlug.includes('/');
  const current = branch[branch.length - 1] ?? null;

  /* --- memuat anak dari sebuah node path --- */
  const loadChildren = useCallback(async (path: string): Promise<NavData> => {
    const res = await fetch(`/api/v1/taxonomy?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error('not_found');
    const json = await res.json();
    const parsed = parseNav(json);
    const redirect = (json as { data?: { redirectPath?: string } })?.data?.redirectPath;
    if (redirect) {
      const r2 = await fetch(`/api/v1/taxonomy?path=${encodeURIComponent(redirect)}`);
      return r2.ok ? parseNav(await r2.json()) : { node: null, breadcrumb: [], children: [] };
    }
    return parsed;
  }, []);

  /* --- muat artikel terbit pada node daun (D05: daftar runtime, bukan fixture) --- */
  const loadArticles = useCallback(async (nodeId: string): Promise<void> => {
    try {
      const res = await fetch(
        `/api/v1/articles?taxonomyNodeId=${encodeURIComponent(nodeId)}&limit=20`,
      );
      if (!res.ok) throw new Error('articles_unavailable');
      const json = (await res.json()) as {
        data?: Array<{ id: string; title: string; summary?: string; reading_minutes?: number }>;
      };
      setArticles(
        (json.data ?? []).map((row) => ({
          id: row.id,
          title: row.title,
          summary: row.summary,
          reading_minutes: row.reading_minutes,
        })),
      );
    } catch {
      setArticles([]);
    }
  }, []);

  /* --- muat root children sekali --- */
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const data = await loadChildren(rootBase);
        if (!active) return;
        setRootChildren(data.children);
        // Bila masuk via deep link, bangun branch dari breadcrumb
        if (isDeep) {
          const data2 = await loadChildren(fullSlug);
          if (!active) return;
          const trail = [...data2.breadcrumb].filter((b) => b.path !== rootBase);
          setBranch(trail);
          setCurrentChildren(data2.children);
          if (data2.node && data2.children.length === 0) void loadArticles(data2.node.id);
          else setArticles([]);
        }
      } catch {
        if (!active) return;
        setRootChildren([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootBase]);


  /* --- pilih pilihan awal di popup: TUTUP OTOMATIS, tampilkan cabang inline --- */
  function pickEntry(node: NavNode) {
    setShowEntry(false);
    setBranch([node]);
    setQuery('');
    setAzJump(null);
    void loadBranchChildren(node);
  }

  async function loadBranchChildren(node: NavNode) {
    setLoading(true);
    setArticles([]);
    try {
      const data = await loadChildren(node.path);
      setCurrentChildren(data.children);
      if (data.children.length === 0 && data.node) void loadArticles(data.node.id);
    } catch {
      setCurrentChildren([]);
    } finally {
      setLoading(false);
    }
  }

  /* --- masuk lebih dalam (inline, TIDAK ganti route) --- */
  async function drillDeeper(node: NavNode) {
    const next = [...branch, node];
    setBranch(next);
    setQuery('');
    setAzJump(null);
    void loadBranchChildren(node);
  }

  /* --- kembali ke node tertentu di breadcrumb --- */
  function jumpTo(node: NavNode) {
    const idx = branch.findIndex((b) => b.id === node.id);
    if (idx < 0) return;
    const next = branch.slice(0, idx + 1);
    setBranch(next);
    setQuery('');
    setAzJump(null);
    const target = next[next.length - 1];
    void loadBranchChildren(target);
  }

  /* --- daftar yang ditampilan di panel inline (dengan search + A–Z) --- */
  const visibleChildren = currentChildren.filter((n) =>
    n.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const azFiltered =
    azJump && azJump !== '#'
      ? visibleChildren.filter((n) => firstLetter(n.name) === azJump)
      : azJump === '#'
        ? visibleChildren.filter((n) => !/^[A-Za-z]/.test(n.name.trim()))
        : visibleChildren;

  const showAzRail = currentChildren.length > 12;

  /* --- R4: dua pilihan awal --- */
  function pickR4(kind: 'DUNIA' | 'NEGARA') {
    setShowEntry(false);
    setQuery('');
    setAzJump(null);
    if (kind === 'DUNIA' && rootChildren.length > 0) {
      // Domain global adalah domain pertama menurut urutan menu (R→D).
      pickEntry(rootChildren[0]);
    } else {
      // Negara: daftar A–Z semua entitas tingkat root.
      setBranch([
        {
          id: 'negara-list',
          name: isId ? 'Negara' : 'Countries',
          slug: rootBase,
          path: rootBase,
          level: 'D',
        },
      ]);
      setCurrentChildren(rootChildren);
    }
  }

  /* ============================================================ Render */

  /* Header: breadcrumb + judul + search kecil */
  function renderBreadcrumb() {
    const isRootActive = branch.length === 0;
    return (
      <nav className="taxonomy-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{isId ? 'Beranda' : 'Home'}</Link>
        <span aria-hidden="true"> / </span>
        {isRootActive ? (
          <span className="taxonomy-breadcrumb__current" aria-current="page">
            {displayRootName}
          </span>
        ) : (
          <button
            type="button"
            className="r1-bc-btn"
            onClick={() => {
              setBranch([]);
              setCurrentChildren([]);
              setArticles([]);
            }}
          >
            {displayRootName}
          </button>
        )}
        {branch.map((b, index) => {
          const isCurrent = index === branch.length - 1;
          return (
            <span key={b.id}>
              <span aria-hidden="true"> / </span>
              {isCurrent ? (
                <span className="taxonomy-breadcrumb__current" aria-current="page">
                  {b.name}
                </span>
              ) : (
                <button type="button" className="r1-bc-btn" onClick={() => jumpTo(b)}>
                  {b.name}
                </button>
              )}
            </span>
          );
        })}
      </nav>
    );
  }

  const isLeaf = !loading && current !== null && currentChildren.length === 0;

  return (
    <div className="r1-navigator">
      {renderBreadcrumb()}

      <div className="r1-nav-bar">
        <h1 className="r1-nav-bar__title">{displayRootName}</h1>
        {branch.length > 0 && (
          <div className="r1-search-wrap">
            <input
              type="search"
              className="r1-search-input"
              placeholder={isId ? 'Cari di kategori ini…' : 'Search in this category…'}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setAzJump(null);
              }}
              aria-label={isId ? 'Cari' : 'Search'}
            />
          </div>
        )}
      </div>

      {/* Kapsul pembuka — tampil saat belum memilih pilihan awal */}
      {branch.length === 0 && !loading && (
        <div className="rnav-entry-trigger">
          <button
            type="button"
            className="r1-main-capsule rnav-main-capsule"
            onClick={() => setShowEntry(true)}
          >
            {capsuleLabel}
          </button>
        </div>
      )}

      {/* Context bar: ganti topik utama */}
      {branch.length > 0 && (
        <div className="r1-context-bar">
          <span className="r1-context-bar__label">
            <strong>{branch[0].name}</strong>
          </span>
          <button
            type="button"
            className="r1-context-bar__change"
            onClick={() => setShowEntry(true)}
          >
            {isId ? 'Ganti Topik Utama' : 'Change Main Topic'}
          </button>
        </div>
      )}

      {/* ==================== PANEL CABANG INLINE ==================== */}
      {branch.length > 0 && !loading && (
        <div className="rnav-branch">
          {showAzRail && (
            <div
              className="rnav-az-rail"
              role="group"
              aria-label={isId ? 'Indeks A–Z' : 'A–Z index'}
            >
              {ALPHABET.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  className={`rnav-az-rail__btn${azJump === letter ? ' rnav-az-rail__btn--active' : ''}`}
                  onClick={() => setAzJump((prev) => (prev === letter ? null : letter))}
                  aria-pressed={azJump === letter}
                >
                  {letter}
                </button>
              ))}
            </div>
          )}

          {azFiltered.length > 0 ? (
            <div className="r1-kelas-list">
              {azFiltered.map((node) => {
                const isSw = isSoftwareLeaf(node) || (node.childCount ?? 0) === 0;
                return (
                  <button
                    key={node.id}
                    type="button"
                    className="r1-list-row"
                    onClick={() => {
                      if ((node.childCount ?? 0) > 0) void drillDeeper(node);
                      else if (isSoftwareLeaf(node)) void drillDeeper(node);
                      else void drillDeeper(node);
                    }}
                  >
                    <span>
                      {node.name}
                      {roomMode === 'R4' && node.code ? (
                        <span className="rnav-country-code" aria-hidden="true">
                          {' '}
                          {node.code}
                        </span>
                      ) : null}
                      {(node.childCount ?? 0) > 0 && (
                        <span className="rnav-child-count"> ({node.childCount})</span>
                      )}
                    </span>
                    <span className="r1-list-row__chevron" aria-hidden="true">
                      {isSw ? '→' : '›'}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="r1-empty">
              <span className="r1-empty-icon" aria-hidden="true">
                🔍
              </span>
              <p className="r1-empty-title">
                {isId ? 'Tidak ada yang cocok.' : 'No matches found.'}
              </p>
              <p className="r1-empty-hint">
                {isId ? 'Coba kata kunci atau huruf lain.' : 'Try a different keyword or letter.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ==================== LEAF ==================== */}
      {isLeaf &&
        (isSoftwareLeaf(current) ? (
          <R5SoftwareDetail softwareId={current?.softwareId || current?.slug || ''} />
        ) : (
          <div className="rnav-articles">
            {articles.length > 0 ? (
              articles.map((art) => (
                <Link key={art.id} href={`/artikel/${art.id}`} className="rnav-article-card">
                  <h3 className="rnav-article-card__title">{art.title}</h3>
                  {art.summary && <p className="rnav-article-card__summary">{art.summary}</p>}
                  <span className="rnav-article-card__meta">
                    ⏱ {art.reading_minutes ?? 5} {isId ? 'menit' : 'min'}
                  </span>
                </Link>
              ))
            ) : (
              <div className="r1-empty">
                <span className="r1-empty-icon" aria-hidden="true">
                  📄
                </span>
                <p className="r1-empty-title">
                  {isId ? 'Belum ada artikel di sini.' : 'No articles here yet.'}
                </p>
                <p className="r1-empty-hint">
                  {isId
                    ? 'Konten menunggu paket data yang disetujui Admin.'
                    : 'Content is waiting for Admin-approved data packages.'}
                </p>
                {current && (
                  <button
                    type="button"
                    className="r1-empty-back"
                    onClick={() => jumpTo(branch[branch.length - 2] ?? branch[0])}
                  >
                    {isId ? '← Kembali' : '← Back'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

      {loading && branch.length > 0 && <p className="r1-status">{isId ? 'Memuat…' : 'Loading…'}</p>}

      {/* ==================== POPUP PEMILIH AWAL ==================== */}
      {showEntry && (
        <EntryPopup title={capsuleLabel} onClose={() => setShowEntry(false)} isId={isId}>
          {/* R2: grid 2 kolom, 5 Domain, ukuran sama */}
          {roomMode === 'R2' && (
            <div className="rnav-entry-grid">
              {rootChildren.length === 0 ? (
                <p className="r1-popup-note">
                  {isId
                    ? 'Domain pengetahuan menunggu paket data Admin.'
                    : 'Knowledge domains are waiting for Admin data packages.'}
                </p>
              ) : (
                rootChildren.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className="r1-school-card"
                    onClick={() => pickEntry(n)}
                  >
                    {n.name}
                  </button>
                ))
              )}
            </div>
          )}

          {/* R3 & R5: search + daftar A–Z bobot sama */}
          {(roomMode === 'R3' || roomMode === 'R5') && (
            <div className="rnav-az-wrap">
              <input
                type="search"
                className="rnav-az-search"
                placeholder={
                  roomMode === 'R3'
                    ? isId
                      ? 'Cari agama atau kepercayaan…'
                      : 'Search religion or belief…'
                    : isId
                      ? 'Cari alat atau software…'
                      : 'Search tool or software…'
                }
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setAzJump(null);
                }}
                aria-label={isId ? 'Cari' : 'Search'}
              />
              <div className="rnav-az-rail rnav-az-rail--popup" role="group" aria-label="A–Z">
                {ALPHABET.map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    className={`rnav-az-rail__btn${azJump === letter ? ' rnav-az-rail__btn--active' : ''}`}
                    onClick={() => setAzJump((prev) => (prev === letter ? null : letter))}
                    aria-pressed={azJump === letter}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <div className="rnav-az-list">
                {(() => {
                  // Di popup awal: sumber daftar adalah rootChildren langsung.
                  const base = rootChildren.filter((n) =>
                    n.name.toLowerCase().includes(query.trim().toLowerCase()),
                  );
                  const list =
                    azJump && azJump !== '#'
                      ? base.filter((n) => firstLetter(n.name) === azJump)
                      : azJump === '#'
                        ? base.filter((n) => !/^[A-Za-z]/.test(n.name.trim()))
                        : base;
                  if (list.length === 0) {
                    return (
                      <p className="r1-popup-note">
                        {isId
                          ? 'Daftar menunggu paket data Admin.'
                          : 'The list is waiting for Admin data packages.'}
                      </p>
                    );
                  }
                  return list.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className="r1-list-row"
                      onClick={() => pickEntry(n)}
                    >
                      <span>{n.name}</span>
                      <span className="r1-list-row__chevron" aria-hidden="true">
                        ›
                      </span>
                    </button>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* R4: dua kapsul kecil */}
          {roomMode === 'R4' && (
            <div className="r1-main-capsules">
              <button
                type="button"
                className="r1-main-capsule"
                onClick={() => pickR4('DUNIA')}
                disabled={rootChildren.length === 0}
              >
                {isId ? 'Dunia & Global' : 'World & Global'}
              </button>
              <button
                type="button"
                className="r1-main-capsule"
                onClick={() => pickR4('NEGARA')}
                disabled={rootChildren.length === 0}
              >
                {isId ? 'Negara' : 'Country'}
              </button>
            </div>
          )}
          {roomMode === 'R4' && rootChildren.length === 0 && (
            <p className="r1-popup-note">
              {isId
                ? 'Daftar negara/topik dunia menunggu paket data Admin.'
                : 'Country/world topic list is waiting for Admin data packages.'}
            </p>
          )}
        </EntryPopup>
      )}
    </div>
  );
}
