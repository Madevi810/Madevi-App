'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLanguage } from './theme-provider';

type PracticalNode = {
  id: string;
  name: string;
  slug: string;
  path: string;
  childCount?: number;
  articleCount?: number;
};

type PracticalArticle = {
  id: string;
  title: string;
  summary?: string | null;
  reading_minutes?: number | null;
};

type NavigationData = {
  node: PracticalNode | null;
  breadcrumb: PracticalNode[];
  children: PracticalNode[];
  redirectPath?: string;
  page: { nextCursor: string | null };
};

type LoadState = 'idle' | 'loading' | 'ready' | 'error' | 'unavailable';
type BrowserView = 'categories' | 'path';

const ROOT_PATH = 'tutorial-problem-solve';
const ROOT_HREF = `/ruang/${ROOT_PATH}`;

class TaxonomyRequestError extends Error {
  constructor(public readonly status: number) {
    super('taxonomy_unavailable');
  }
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Skeleton memakai sistem overhaul: .card-grid + .skeleton (shimmer) */
function TutorialSkeletonGrid({ label }: { label: string }) {
  return (
    <div className="card-grid" role="status" aria-label={label}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="skeleton" aria-hidden="true" />
      ))}
    </div>
  );
}

function SafetyIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.5 20 7v5.3c0 4.5-3.1 7.4-8 8.8-4.9-1.4-8-4.3-8-8.8V7l8-3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m8.5 12 2.2 2.2 4.9-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function parseNavigation(payload: unknown): NavigationData {
  const response = payload as { data?: Partial<NavigationData> };
  const data: Partial<NavigationData> = response.data ?? (payload as Partial<NavigationData>);
  return {
    node: data.node ?? null,
    breadcrumb: Array.isArray(data.breadcrumb) ? data.breadcrumb : [],
    children: Array.isArray(data.children) ? data.children : [],
    redirectPath: typeof data.redirectPath === 'string' ? data.redirectPath : undefined,
    page: {
      nextCursor: typeof data.page?.nextCursor === 'string' ? data.page.nextCursor : null,
    },
  };
}

function practicalPathFromQuery(value: string | null) {
  if (!value) return null;
  const path = value.replace(/^\/+|\/+$/g, '');
  if (path === ROOT_PATH) return null;
  return new RegExp(`^${ROOT_PATH}/[a-z0-9]+(?:-[a-z0-9]+)*(?:/[a-z0-9]+(?:-[a-z0-9]+)*)*$`).test(path)
    ? path
    : null;
}

function practicalHref(path?: string) {
  return path ? `${ROOT_HREF}?path=${encodeURIComponent(path)}` : ROOT_HREF;
}

function mergeNodes(current: PracticalNode[], incoming: PracticalNode[]) {
  const ids = new Set(current.map((item) => item.id));
  return [...current, ...incoming.filter((item) => !ids.has(item.id))];
}

function nodeLabel(node: PracticalNode, isId: boolean) {
  if ((node.childCount ?? 0) > 0) {
    return isId ? `${node.childCount} jalur lanjutan` : `${node.childCount} next paths`;
  }
  if ((node.articleCount ?? 0) > 0) {
    return isId ? `${node.articleCount} panduan terbit` : `${node.articleCount} published guides`;
  }
  return isId ? 'Jalur tersedia' : 'Available path';
}

type FoundationDomain = {
  id: string;
  code: string;
  nameId: string;
  nameEn: string;
  summaryId: string;
  summaryEn: string;
  boundaryId: string;
  boundaryEn: string;
};

const FOUNDATION_DOMAINS: FoundationDomain[] = [
  {
    id: 'home-installation',
    code: 'R7.D1',
    nameId: 'Rumah, Listrik & Instalasi',
    nameEn: 'Home, Electricity & Installation',
    summaryId: 'Pemeriksaan rumah tangga, air, dan instalasi dasar dengan batas risiko yang eksplisit.',
    summaryEn: 'Household checks, water, and basic installation with explicit risk boundaries.',
    boundaryId: 'Berhenti pada listrik bertegangan, gas, atau instalasi yang tidak dapat diisolasi.',
    boundaryEn: 'Stop for live electricity, gas, or an installation that cannot be isolated.',
  },
  {
    id: 'vehicle-motorcycle',
    code: 'R7.D2',
    nameId: 'Kendaraan & Motor',
    nameEn: 'Vehicles & Motorcycles',
    summaryId: 'Perawatan dan diagnosis dasar kendaraan; area keselamatan selalu dipisahkan dari pekerjaan biasa.',
    summaryEn: 'Basic vehicle care and diagnosis; safety-critical areas stay separate from ordinary work.',
    boundaryId: 'Rem, kemudi, bahan bakar, dan gejala berbahaya memerlukan eskalasi ke ahli.',
    boundaryEn: 'Brakes, steering, fuel, and dangerous symptoms require escalation to an expert.',
  },
  {
    id: 'digital-electronics',
    code: 'R7.D3',
    nameId: 'Perangkat Digital & Elektronik',
    nameEn: 'Digital Devices & Electronics',
    summaryId: 'Diagnostik perangkat, data, koneksi, dan komponen yang dapat diperiksa tanpa menyamarkan risiko.',
    summaryEn: 'Device, data, connection, and component diagnosis without obscuring risk.',
    boundaryId: 'Data penting, baterai rusak, cairan, dan komponen bertegangan memerlukan prosedur khusus.',
    boundaryEn: 'Critical data, damaged batteries, liquids, and live components need special handling.',
  },
  {
    id: 'kitchen-household',
    code: 'R7.D4',
    nameId: 'Dapur & Rumah Tangga',
    nameEn: 'Kitchen & Household',
    summaryId: 'Peralatan, bahan, kebersihan, dan proses sehari-hari yang perlu hasil yang dapat diverifikasi.',
    summaryEn: 'Equipment, ingredients, hygiene, and everyday processes that need verifiable outcomes.',
    boundaryId: 'Keamanan pangan, panas tinggi, dan bahan kimia harus memiliki tanda berhenti yang jelas.',
    boundaryEn: 'Food safety, high heat, and chemicals need clear stop conditions.',
  },
  {
    id: 'making-diy',
    code: 'R7.D5',
    nameId: 'Karya & DIY',
    nameEn: 'Making & DIY',
    summaryId: 'Membuat, memperbaiki, dan merakit karya dengan alat, bahan, ukuran, dan hasil yang terdokumentasi.',
    summaryEn: 'Making, repairing, and assembling work with documented tools, materials, dimensions, and outcome.',
    boundaryId: 'Alat potong, debu, beban, dan bahan reaktif memerlukan pelindung serta batas kerja.',
    boundaryEn: 'Cutting tools, dust, loads, and reactive materials need protection and work limits.',
  },
  {
    id: 'work-equipment',
    code: 'R7.D6',
    nameId: 'Kerja & Peralatan',
    nameEn: 'Work & Equipment',
    summaryId: 'Alat kerja, penataan proses, dokumen, dan perawatan peralatan untuk pekerjaan harian.',
    summaryEn: 'Work tools, process setup, documents, and equipment care for daily work.',
    boundaryId: 'Izin kerja, alat industri, dan pekerjaan di ketinggian mengikuti prosedur resmi setempat.',
    boundaryEn: 'Work permits, industrial tools, and work at height follow official local procedures.',
  },
  {
    id: 'daily-care',
    code: 'R7.D7',
    nameId: 'Perawatan & Kehidupan Sehari-hari',
    nameEn: 'Care & Everyday Life',
    summaryId: 'Rutinitas, perawatan benda, dan kebutuhan sehari-hari yang memerlukan urutan tindakan yang jelas.',
    summaryEn: 'Routines, object care, and everyday needs that require a clear action sequence.',
    boundaryId: 'Kondisi kesehatan, keselamatan diri, dan keadaan darurat tidak digantikan oleh panduan umum.',
    boundaryEn: 'Health conditions, personal safety, and emergencies are not replaced by general guides.',
  },
];

function TutorialFoundationCatalog({ isId }: { isId: boolean }) {
  const [selectedDomainId, setSelectedDomainId] = useState(FOUNDATION_DOMAINS[0].id);
  const selectedDomain = FOUNDATION_DOMAINS.find((domain) => domain.id === selectedDomainId) ?? FOUNDATION_DOMAINS[0];

  return (
    <section className="tutorial-foundation-catalog" aria-labelledby="tutorial-foundation-catalog-title">
      <header className="tutorial-foundation-catalog__heading">
        <div>
          <p className="tutorial-problem__section-label">{isId ? 'FONDASI KATALOG · BELUM TERBIT' : 'CATALOG FOUNDATION · NOT PUBLISHED'}</p>
          <h3 id="tutorial-foundation-catalog-title">{isId ? 'Menu awal ruang praktis' : 'The practical-space starting menu'}</h3>
          <p>{isId ? 'Taxonomy lokal belum dipublikasikan. Menu ini adalah fondasi yang nyata untuk menyusun jalur, bukan daftar panduan yang sudah tersedia.' : 'The local taxonomy is not published yet. This is a real foundation for arranging paths, not a list of guides that already exist.'}</p>
        </div>
        <span className="tutorial-foundation-catalog__count">{isId ? '7 bidang dasar' : '7 base fields'}</span>
      </header>

      <div className="tutorial-foundation-catalog__layout">
        <div className="tutorial-foundation-catalog__menu" aria-label={isId ? 'Konsep menu tutorial' : 'Tutorial menu concept'}>
          {FOUNDATION_DOMAINS.map((domain) => {
            const selected = domain.id === selectedDomain.id;
            return (
              <button
                key={domain.id}
                type="button"
                className={`tutorial-foundation-catalog__menu-item${selected ? ' tutorial-foundation-catalog__menu-item--active' : ''}`}
                onClick={() => setSelectedDomainId(domain.id)}
                aria-pressed={selected}
              >
                <span>{domain.code}</span>
                <strong>{isId ? domain.nameId : domain.nameEn}</strong>
              </button>
            );
          })}
        </div>

        <article className="tutorial-foundation-catalog__domain" aria-live="polite">
          <p className="tutorial-foundation-catalog__domain-code">{selectedDomain.code}</p>
          <h4>{isId ? selectedDomain.nameId : selectedDomain.nameEn}</h4>
          <p>{isId ? selectedDomain.summaryId : selectedDomain.summaryEn}</p>
          <div>
            <strong>{isId ? 'Batas awal' : 'Initial boundary'}</strong>
            <p>{isId ? selectedDomain.boundaryId : selectedDomain.boundaryEn}</p>
          </div>
        </article>
      </div>

      <article className="tutorial-foundation-catalog__article">
        <div>
          <p className="eyebrow">{isId ? 'SATU JUDUL FONDASI · DRAFT' : 'ONE FOUNDATION TITLE · DRAFT'}</p>
          <h4 className="article-title">{isId ? 'Memulai Perbaikan dengan Pemeriksaan Aman' : 'Starting a Repair with a Safe Check'}</h4>
          <p>{isId ? 'Judul ini menjadi pintu masuk lintas bidang: pahami gejala, tentukan batas aman, siapkan alat dan bukti, lalu pilih apakah pekerjaan dapat dilanjutkan atau harus dieskalasi.' : 'This title is the cross-field entry point: understand the symptom, set a safety boundary, prepare tools and evidence, then decide whether work can continue or must be escalated.'}</p>
        </div>
        <Link href="/kontribusi" className="button button--outline">{isId ? 'Usulkan urutan panduan' : 'Suggest guide order'}</Link>
      </article>
    </section>
  );
}

export function TutorialProblemFoundation() {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isId = language === 'id';
  const selectedPath = practicalPathFromQuery(searchParams.get('path'));
  const [view, setView] = useState<BrowserView>('categories');
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<PracticalNode[]>([]);
  const [categoryState, setCategoryState] = useState<LoadState>('loading');
  const [categoryCursor, setCategoryCursor] = useState<string | null>(null);
  const [categoryMoreState, setCategoryMoreState] = useState<LoadState>('idle');
  const [activeNode, setActiveNode] = useState<PracticalNode | null>(null);
  const [activeTrail, setActiveTrail] = useState<PracticalNode[]>([]);
  const [children, setChildren] = useState<PracticalNode[]>([]);
  const [pathState, setPathState] = useState<LoadState>('idle');
  const [pathCursor, setPathCursor] = useState<string | null>(null);
  const [pathMoreState, setPathMoreState] = useState<LoadState>('idle');
  const [articles, setArticles] = useState<PracticalArticle[]>([]);
  const [articleState, setArticleState] = useState<LoadState>('idle');
  const categoryRequest = useRef(0);
  const pathRequest = useRef(0);
  const articleRequest = useRef(0);

  const loadNavigation = useCallback(async (path: string, cursor?: string | null) => {
    const parameters = new URLSearchParams({ path, limit: '24' });
    if (cursor) parameters.set('cursor', cursor);
    const response = await fetch(`/api/v1/taxonomy?${parameters.toString()}`);
    if (!response.ok) throw new TaxonomyRequestError(response.status);
    return parseNavigation(await response.json());
  }, []);

  const loadArticles = useCallback(async (nodeId: string) => {
    const request = ++articleRequest.current;
    setArticleState('loading');
    setArticles([]);
    try {
      const response = await fetch(`/api/v1/articles?taxonomyNodeId=${encodeURIComponent(nodeId)}&limit=20`);
      if (!response.ok) throw new Error('guides_unavailable');
      const payload = await response.json() as { data?: PracticalArticle[] };
      if (request !== articleRequest.current) return;
      setArticles(Array.isArray(payload.data) ? payload.data : []);
      setArticleState('ready');
    } catch {
      if (request !== articleRequest.current) return;
      setArticles([]);
      setArticleState('error');
    }
  }, []);

  const loadCategories = useCallback(async (cursor?: string | null) => {
    const request = ++categoryRequest.current;
    if (cursor) {
      setCategoryMoreState('loading');
    } else {
      setCategoryState('loading');
      setCategoryMoreState('idle');
    }
    try {
      const data = await loadNavigation(ROOT_PATH, cursor);
      if (request !== categoryRequest.current) return;
      setCategories((current) => cursor ? mergeNodes(current, data.children) : data.children);
      setCategoryCursor(data.page.nextCursor);
      setCategoryState('ready');
      setCategoryMoreState('idle');
    } catch (reason) {
      if (request !== categoryRequest.current) return;
      if (cursor) {
        setCategoryMoreState('error');
      } else {
        setCategories([]);
        setCategoryCursor(null);
        setCategoryState(reason instanceof TaxonomyRequestError && reason.status === 404 ? 'unavailable' : 'error');
      }
    }
  }, [loadNavigation]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => () => {
    categoryRequest.current += 1;
    pathRequest.current += 1;
    articleRequest.current += 1;
  }, []);

  const loadPath = useCallback(async (path: string, fallbackNode?: PracticalNode, cursor?: string | null) => {
    const request = ++pathRequest.current;
    articleRequest.current += 1;
    if (cursor) {
      setPathMoreState('loading');
    } else {
      setActiveNode(fallbackNode ?? null);
      setActiveTrail(fallbackNode ? [fallbackNode] : []);
      setChildren([]);
      setPathCursor(null);
      setPathState('loading');
      setPathMoreState('idle');
      setArticles([]);
      setArticleState('idle');
    }
    try {
      const data = await loadNavigation(path, cursor);
      if (request !== pathRequest.current) return;
      if (data.redirectPath) {
        router.replace(practicalHref(data.redirectPath));
        return;
      }
      const currentNode = data.node ?? fallbackNode ?? null;
      setActiveNode(currentNode);
      setActiveTrail(data.breadcrumb.filter((item) => item.path !== ROOT_PATH));
      setChildren((current) => cursor ? mergeNodes(current, data.children) : data.children);
      setPathCursor(data.page.nextCursor);
      setPathState('ready');
      setPathMoreState('idle');
      if (!cursor && currentNode && data.children.length === 0) void loadArticles(currentNode.id);
    } catch {
      if (request !== pathRequest.current) return;
      if (cursor) {
        setPathMoreState('error');
      } else {
        setPathCursor(null);
        setPathState('error');
      }
    }
  }, [loadArticles, loadNavigation, router]);

  useEffect(() => {
    if (!selectedPath) {
      pathRequest.current += 1;
      articleRequest.current += 1;
      setView('categories');
      setActiveNode(null);
      setActiveTrail([]);
      setChildren([]);
      setPathCursor(null);
      setPathMoreState('idle');
      setPathState('idle');
      setArticles([]);
      setArticleState('idle');
      return;
    }
    setView('path');
    setQuery('');
    void loadPath(selectedPath);
  }, [loadPath, selectedPath]);

  const openPath = useCallback((node: PracticalNode) => {
    pathRequest.current += 1;
    articleRequest.current += 1;
    setView('path');
    setQuery('');
    setActiveNode(node);
    setActiveTrail([node]);
    setChildren([]);
    setPathCursor(null);
    setPathMoreState('idle');
    setPathState('loading');
    setArticles([]);
    setArticleState('idle');
    if (node.path === selectedPath) {
      void loadPath(node.path, node);
      return;
    }
    router.push(practicalHref(node.path));
  }, [loadPath, router, selectedPath]);

  function resetToCategories() {
    pathRequest.current += 1;
    articleRequest.current += 1;
    setView('categories');
    setQuery('');
    setActiveNode(null);
    setActiveTrail([]);
    setChildren([]);
    setPathCursor(null);
    setPathMoreState('idle');
    setPathState('idle');
    setArticles([]);
    setArticleState('idle');
    if (searchParams.has('path')) router.push(ROOT_HREF);
  }

  const visibleCategories = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return normalized
      ? categories.filter((item) => item.name.toLocaleLowerCase().includes(normalized))
      : categories;
  }, [categories, query]);

  const visibleChildren = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return normalized
      ? children.filter((item) => item.name.toLocaleLowerCase().includes(normalized))
      : children;
  }, [children, query]);

  const browserTitle = view === 'categories'
    ? (isId ? 'Pilih kebutuhan' : 'Choose a need')
    : (isId ? 'Telusuri jalur panduan' : 'Browse the guide path');

  const browserDescription = view === 'categories'
    ? (isId ? 'Mulai dari bidang yang sesuai. Hanya kategori yang sudah diterbitkan tampil di sini.' : 'Start with the relevant field. Only published categories appear here.')
    : (isId ? 'Lanjutkan satu tingkat demi satu tingkat agar langkah tetap sesuai konteks masalah.' : 'Move one level at a time so each step remains in the problem context.');

  return (
    <div className="tutorial-problem">

      <header className="tutorial-problem__header">
        <p className="eyebrow">{isId ? 'RUANG PRAKTIS' : 'PRACTICAL SPACE'}</p>
        <h1>Tutorial &amp; Problem Solve</h1>
        <p>
          {isId
            ? 'Temukan jalur untuk memperbaiki, membuat, dan menangani kebutuhan sehari-hari. Ruang ini memusatkan tindakan; konsep dan studi tetap berada di Explore.'
            : 'Find paths to repair, make, and handle everyday needs. This space focuses on action; concepts and studies remain in Explore.'}
        </p>
      </header>

      <section className="tutorial-problem__browser" aria-labelledby="tutorial-browser-title">
        <header className="tutorial-problem__browser-heading">
          <div>
            <p className="tutorial-problem__section-label">{isId ? 'PETA TINDAKAN' : 'ACTION MAP'}</p>
            <h2 id="tutorial-browser-title">{browserTitle}</h2>
            <p>{browserDescription}</p>
          </div>
          <label className="tutorial-problem__search">
            <span className="sr-only">{isId ? 'Saring menu panduan' : 'Filter guide menus'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.4" stroke="currentColor" strokeWidth="1.8" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={isId ? 'Cari kebutuhan atau alat' : 'Search a need or tool'}
            />
          </label>
        </header>

        <aside className="tutorial-problem__safety" aria-label={isId ? 'Batas keselamatan panduan' : 'Guide safety boundaries'}>
          <SafetyIcon />
          <div>
            <strong>{isId ? 'Utamakan batas aman' : 'Keep safety first'}</strong>
            <p>{isId ? 'Listrik bertegangan, gas, rem kendaraan, obat, dan kondisi berbahaya hanya boleh memiliki panduan yang telah direview serta tanda berhenti yang jelas.' : 'Live electricity, gas, vehicle brakes, medicines, and hazardous conditions may only have reviewed guides with clear stop conditions.'}</p>
          </div>
        </aside>

        <div className="tutorial-problem__panel">
          {view === 'categories' && (
            <section aria-label={isId ? 'Daftar kebutuhan praktis' : 'Practical needs list'}>
              {categoryState === 'loading' ? (
                <TutorialSkeletonGrid label={isId ? 'Memuat bidang panduan' : 'Loading guide fields'} />
              ) : categoryState === 'unavailable' ? (
                <TutorialFoundationCatalog isId={isId} />
              ) : categoryState === 'error' ? (
                <div className="tutorial-problem__state">
                  <p>{isId ? 'Bidang panduan belum dapat dimuat. Coba lagi tanpa menganggap katalog kosong.' : 'Guide fields could not load. Try again; this is not an empty-catalog state.'}</p>
                  <button type="button" className="button button--outline" onClick={() => void loadCategories()}>
                    {isId ? 'Coba lagi' : 'Try again'}
                  </button>
                </div>
              ) : (
                <>
                  {visibleCategories.length > 0 ? (
                    <ol className="tutorial-problem__menu-list tps-category-grid">
                      {visibleCategories.map((node, index) => {
                        const hasChildren = (node.childCount ?? 0) > 0;
                        return (
                        <li key={node.id}>
                          <button type="button" className="card tutorial-problem__menu-item tps-category-card" onClick={() => openPath(node)}>
                            <span className="tutorial-problem__menu-index tps-category-card__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                            <span className="tutorial-problem__menu-copy tps-category-card__copy">
                              <span className="tps-badge-row">
                                <span className={`tps-badge${hasChildren ? ' tps-badge--path' : ' tps-badge--guide'}`}>
                                  {hasChildren ? (isId ? 'Jalur' : 'Path') : (isId ? 'Panduan' : 'Guide')}
                                </span>
                              </span>
                              <strong>{node.name}</strong>
                              <span className="tps-category-card__meta">{nodeLabel(node, isId)}</span>
                            </span>
                            <span className="tutorial-problem__menu-arrow tps-category-card__arrow" aria-hidden="true"><ArrowIcon /></span>
                          </button>
                        </li>
                        );
                      })}
                    </ol>
                  ) : (
                    <div className="tutorial-problem__state">
                      <p>{query ? (isId ? 'Tidak ada bidang yang sesuai dengan saringan.' : 'No field matches the filter.') : (isId ? 'Belum ada bidang panduan publik yang diterbitkan.' : 'No public guide field has been published yet.')}</p>
                      {!query && <Link href="/kontribusi" className="button button--outline">{isId ? 'Usulkan kebutuhan' : 'Suggest a need'}</Link>}
                    </div>
                  )}
                  {categoryCursor && (
                    <div className="tutorial-problem__load-more" aria-live="polite">
                      {categoryMoreState === 'error' && <p role="alert">{isId ? 'Bidang berikutnya belum dapat dimuat.' : 'The next fields could not be loaded.'}</p>}
                      <button type="button" className="button button--outline" onClick={() => void loadCategories(categoryCursor)} disabled={categoryMoreState === 'loading'}>
                        {categoryMoreState === 'loading' ? (isId ? 'Memuat bidang…' : 'Loading fields…') : (isId ? 'Tampilkan bidang berikutnya' : 'Show more fields')}
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {view === 'path' && (
            <section aria-label={isId ? 'Jalur panduan aktif' : 'Active guide path'}>
              {!activeNode ? (
                pathState === 'loading' ? (
                  <TutorialSkeletonGrid label={isId ? 'Memuat jalur panduan' : 'Loading guide path'} />
                ) : pathState === 'error' && selectedPath ? (
                  <div className="tutorial-problem__state">
                    <p>{isId ? 'Jalur dari tautan ini belum dapat dimuat. Data tidak dianggap kosong.' : 'The path from this link could not be loaded. Its data is not treated as empty.'}</p>
                    <button type="button" className="button button--outline" onClick={() => void loadPath(selectedPath)}>{isId ? 'Coba lagi' : 'Try again'}</button>
                  </div>
                ) : (
                  <div className="tutorial-problem__state">
                    <p>{isId ? 'Pilih bidang terlebih dahulu agar panduan selalu mengikuti kebutuhan yang jelas.' : 'Choose a field first so guides always follow a clear need.'}</p>
                    <button type="button" className="button button--outline" onClick={resetToCategories}>{isId ? 'Buka bidang' : 'Open fields'}</button>
                  </div>
                )
              ) : (
                <>
                  <nav className="tutorial-problem__trail" aria-label={isId ? 'Jalur panduan' : 'Guide path'}>
                    <button type="button" onClick={resetToCategories}>{isId ? 'Kebutuhan' : 'Needs'}</button>
                    {activeTrail.map((item, index) => {
                      const isCurrent = index === activeTrail.length - 1;
                      return (
                        <span key={item.id}>
                          <span aria-hidden="true">/</span>
                          {isCurrent ? <strong aria-current="page">{item.name}</strong> : <button type="button" onClick={() => openPath(item)}>{item.name}</button>}
                        </span>
                      );
                    })}
                  </nav>
                  {pathState === 'loading' ? (
                    <TutorialSkeletonGrid label={isId ? 'Memuat jalur panduan' : 'Loading guide path'} />
                  ) : pathState === 'error' ? (
                    <div className="tutorial-problem__state">
                      <p>{isId ? 'Jalur ini belum dapat dimuat. Data tidak dianggap kosong.' : 'This path could not be loaded. Its data is not treated as empty.'}</p>
                      <button type="button" className="button button--outline" onClick={() => void loadPath(activeNode.path, activeNode)}>{isId ? 'Coba lagi' : 'Try again'}</button>
                    </div>
                  ) : children.length > 0 ? (
                    <>
                      {visibleChildren.length > 0 ? (
                        <ol className="tutorial-problem__menu-list tps-timeline">
                          {visibleChildren.map((node, index) => (
                            <li key={node.id} className="tps-timeline__item">
                              <button type="button" className="tutorial-problem__menu-item tps-timeline__node" onClick={() => openPath(node)}>
                                <span className="tutorial-problem__menu-index tps-timeline__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                                <span className="tutorial-problem__menu-copy">
                                  <strong>{node.name}</strong>
                                  <span>{nodeLabel(node, isId)}</span>
                                </span>
                                <span className="tutorial-problem__menu-arrow" aria-hidden="true"><ArrowIcon /></span>
                              </button>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <div className="tutorial-problem__state">
                          <p>{isId ? 'Tidak ada jalur yang sesuai dengan saringan ini.' : 'No path matches this filter.'}</p>
                        </div>
                      )}
                      {pathCursor && (
                        <div className="tutorial-problem__load-more" aria-live="polite">
                          {pathMoreState === 'error' && <p role="alert">{isId ? 'Jalur berikutnya belum dapat dimuat.' : 'The next paths could not be loaded.'}</p>}
                          <button type="button" className="button button--outline" onClick={() => void loadPath(activeNode.path, activeNode, pathCursor)} disabled={pathMoreState === 'loading'}>
                            {pathMoreState === 'loading' ? (isId ? 'Memuat jalur…' : 'Loading paths…') : (isId ? 'Tampilkan jalur berikutnya' : 'Show more paths')}
                          </button>
                        </div>
                      )}
                    </>
                  ) : articleState === 'loading' ? (
                    <TutorialSkeletonGrid label={isId ? 'Memuat panduan terbit' : 'Loading published guides'} />
                  ) : articleState === 'error' ? (
                    <div className="tutorial-problem__state">
                      <p>{isId ? 'Panduan pada jalur ini belum dapat dimuat. Coba lagi tanpa menganggapnya kosong.' : 'Guides in this path could not be loaded. Try again; this is not an empty state.'}</p>
                      <button type="button" className="button button--outline" onClick={() => void loadArticles(activeNode.id)}>{isId ? 'Coba lagi' : 'Try again'}</button>
                    </div>
                  ) : articles.length > 0 ? (
                    <ol className="tutorial-problem__guide-list tps-guide-grid">
                      {articles.map((article) => (
                        <li key={article.id}>
                          <Link href={`/artikel/${article.id}`} className="card tutorial-problem__guide-item tps-guide-card">
                            <span className="tutorial-problem__guide-copy tps-guide-card__copy">
                              <span className="tps-badge-row">
                                <span className="tps-badge tps-badge--guide">{isId ? 'Panduan' : 'Guide'}</span>
                                {typeof article.reading_minutes === 'number' && article.reading_minutes > 0 && (
                                  <span className="tps-badge tps-badge--time">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
                                      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                    {article.reading_minutes} {isId ? 'mnt' : 'min'}
                                  </span>
                                )}
                              </span>
                              <strong className="article-title">{article.title}</strong>
                              <span className="tps-guide-card__summary">{article.summary || (isId ? 'Panduan terbit' : 'Published guide')}</span>
                            </span>
                            <span className="tutorial-problem__menu-arrow tps-guide-card__arrow" aria-hidden="true"><ArrowIcon /></span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="tutorial-problem__state">
                      <p>{isId ? 'Belum ada panduan terbit pada jalur ini. Gunakan kembali ke bidang lain atau usulkan kebutuhan yang belum tercakup.' : 'There is no published guide in this path yet. Return to another field or suggest an uncovered need.'}</p>
                      <div className="tutorial-problem__state-actions">
                        <button type="button" className="button button--outline" onClick={resetToCategories}>{isId ? 'Pilih bidang lain' : 'Choose another field'}</button>
                        <Link href="/kontribusi" className="button button--outline">{isId ? 'Usulkan kebutuhan' : 'Suggest a need'}</Link>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          )}
        </div>
      </section>

      <aside className="tutorial-problem__foundation" aria-label={isId ? 'Fondasi panduan praktis' : 'Practical guide foundation'}>
        <div>
          <strong>{isId ? 'Cara ruang ini bekerja' : 'How this space works'}</strong>
          <p>{isId ? 'Kebutuhan → pemeriksaan → langkah → verifikasi. Panduan terbit harus dapat ditelusuri, memiliki batas aman, dan tidak menggantikan bantuan ahli pada kondisi berisiko.' : 'Need → check → steps → verification. Published guides must be traceable, include safety boundaries, and never replace expert help for risky conditions.'}</p>
        </div>
        <Link href="/ruang/jelajahi-pengetahuan" className="tutorial-problem__explore-link">
          {isId ? 'Buka Explore untuk konsep' : 'Open Explore for concepts'} <ArrowIcon />
        </Link>
      </aside>
    </div>
  );
}
