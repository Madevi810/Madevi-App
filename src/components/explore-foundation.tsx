'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import { useLanguage } from './theme-provider';

type ExploreNode = {
  id: string;
  name: string;
  slug: string;
  path: string;
  childCount?: number;
  articleCount?: number;
};

type NavigationData = {
  node: ExploreNode | null;
  breadcrumb: ExploreNode[];
  children: ExploreNode[];
  redirectPath?: string;
  page: {
    nextCursor: string | null;
  };
};

type SampleArticle = {
  id: string;
  title: string;
  category: string;
  summary: string;
};

type LoadState = 'idle' | 'loading' | 'ready' | 'error';
type BrowserView = 'categories' | 'paths' | 'titles';

const ROOT_PATH = 'jelajahi-pengetahuan';
const ROOT_HREF = `/ruang/${ROOT_PATH}`;

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="m16 16 4 4M8.5 10.8h4.6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 2.5 20h19L12 3Z" />
      <path d="M12 10v4M12 17.5h.01" />
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

function explorePathFromQuery(value: string | null) {
  if (!value) return null;
  const path = value.replace(/^\/+|\/+$/g, '');
  if (path === ROOT_PATH) return null;
  return new RegExp(`^${ROOT_PATH}/[a-z0-9]+(?:-[a-z0-9]+)*(?:/[a-z0-9]+(?:-[a-z0-9]+)*)*$`).test(path)
    ? path
    : null;
}

function exploreHref(path?: string) {
  return path ? `${ROOT_HREF}?path=${encodeURIComponent(path)}` : ROOT_HREF;
}

function mergeNodes(current: ExploreNode[], incoming: ExploreNode[]) {
  const ids = new Set(current.map((item) => item.id));
  return [...current, ...incoming.filter((item) => !ids.has(item.id))];
}

function countLabel(node: ExploreNode, isId: boolean) {
  if ((node.childCount ?? 0) > 0) {
    return isId ? `${node.childCount} subkategori` : `${node.childCount} subcategories`;
  }
  if ((node.articleCount ?? 0) > 0) {
    return isId
      ? `${node.articleCount} artikel`
      : `${node.articleCount} article${node.articleCount === 1 ? '' : 's'}`;
  }
  return isId ? 'Jalur tersedia' : 'Available path';
}

function SkeletonGrid() {
  return (
    <div className="card-grid" role="status" aria-label="Memuat">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="skeleton" aria-hidden="true" />
      ))}
    </div>
  );
}

export function ExploreFoundation({ sampleArticle }: { sampleArticle: SampleArticle | null }) {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isId = language === 'id';
  const selectedPath = explorePathFromQuery(searchParams.get('path'));
  const [view, setView] = useState<BrowserView>('categories');
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<ExploreNode[]>([]);
  const [categoryState, setCategoryState] = useState<LoadState>('loading');
  const [categoryCursor, setCategoryCursor] = useState<string | null>(null);
  const [categoryMoreState, setCategoryMoreState] = useState<LoadState>('idle');
  const [activeNode, setActiveNode] = useState<ExploreNode | null>(null);
  const [activeTrail, setActiveTrail] = useState<ExploreNode[]>([]);
  const [children, setChildren] = useState<ExploreNode[]>([]);
  const [pathState, setPathState] = useState<LoadState>('idle');
  const [pathCursor, setPathCursor] = useState<string | null>(null);
  const [pathMoreState, setPathMoreState] = useState<LoadState>('idle');
  const categoryRequest = useRef(0);
  const pathRequest = useRef(0);

  const loadNavigation = useCallback(async (path: string, cursor?: string | null) => {
    const parameters = new URLSearchParams({ path, limit: '24' });
    if (cursor) parameters.set('cursor', cursor);
    const response = await fetch(`/api/v1/taxonomy?${parameters.toString()}`);
    if (!response.ok) throw new Error('navigation_unavailable');
    return parseNavigation(await response.json());
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
    } catch {
      if (request !== categoryRequest.current) return;
      if (cursor) {
        setCategoryMoreState('error');
      } else {
        setCategories([]);
        setCategoryCursor(null);
        setCategoryState('error');
      }
    }
  }, [loadNavigation]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => () => {
    categoryRequest.current += 1;
    pathRequest.current += 1;
  }, []);

  const loadPath = useCallback(async (path: string, fallbackNode?: ExploreNode, cursor?: string | null) => {
    const request = ++pathRequest.current;
    if (cursor) {
      setPathMoreState('loading');
    } else {
      setActiveNode(fallbackNode ?? null);
      setActiveTrail(fallbackNode ? [fallbackNode] : []);
      setChildren([]);
      setPathCursor(null);
      setPathState('loading');
      setPathMoreState('idle');
    }
    try {
      const data = await loadNavigation(path, cursor);
      if (request !== pathRequest.current) return;
      if (data.redirectPath) {
        router.replace(exploreHref(data.redirectPath));
        return;
      }
      setActiveNode(data.node ?? fallbackNode ?? null);
      setActiveTrail(data.breadcrumb.filter((item) => item.path !== ROOT_PATH));
      setChildren((current) => cursor ? mergeNodes(current, data.children) : data.children);
      setPathCursor(data.page.nextCursor);
      setPathState('ready');
      setPathMoreState('idle');
    } catch {
      if (request !== pathRequest.current) return;
      if (cursor) {
        setPathMoreState('error');
      } else {
        setPathCursor(null);
        setPathState('error');
      }
    }
  }, [loadNavigation, router]);

  useEffect(() => {
    if (!selectedPath) {
      pathRequest.current += 1;
      setView('categories');
      setActiveNode(null);
      setActiveTrail([]);
      setChildren([]);
      setPathCursor(null);
      setPathMoreState('idle');
      setPathState('idle');
      return;
    }
    setView('paths');
    setQuery('');
    void loadPath(selectedPath);
  }, [loadPath, selectedPath]);

  const openPath = useCallback((node: ExploreNode) => {
    pathRequest.current += 1;
    setView('paths');
    setQuery('');
    setActiveNode(node);
    setActiveTrail([node]);
    setChildren([]);
    setPathCursor(null);
    setPathMoreState('idle');
    setPathState('loading');
    if (node.path === selectedPath) {
      void loadPath(node.path, node);
      return;
    }
    router.push(exploreHref(node.path));
  }, [loadPath, router, selectedPath]);

  function resetToCategories() {
    pathRequest.current += 1;
    setView('categories');
    setQuery('');
    setActiveNode(null);
    setActiveTrail([]);
    setChildren([]);
    setPathCursor(null);
    setPathMoreState('idle');
    setPathState('idle');
    if (searchParams.has('path')) router.push(ROOT_HREF);
  }

  const visibleCategories = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return categories;
    return categories.filter((item) => item.name.toLocaleLowerCase().includes(normalized));
  }, [categories, query]);

  const visibleChildren = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return children;
    return children.filter((item) => item.name.toLocaleLowerCase().includes(normalized));
  }, [children, query]);

  const browserTitle = view === 'categories'
    ? (isId ? 'Kategori pengetahuan' : 'Knowledge categories')
    : view === 'paths'
      ? (isId ? 'Jalur kategori' : 'Category path')
      : (isId ? 'Contoh struktur judul' : 'Title structure example');

  const browserDescription = view === 'categories'
    ? (isId ? 'Pilih kategori untuk menelusuri subkategori dan artikel di dalamnya.' : 'Choose a category to browse its subcategories and articles.')
    : view === 'paths'
      ? (isId ? 'Telusuri satu tingkat dalam satu waktu tanpa kehilangan konteks.' : 'Browse one level at a time without losing context.')
      : (isId ? 'Contoh format judul artikel sebelum katalog diperluas.' : 'Example article title format before the catalog expands.');

  function renderCategoryCards(nodes: ExploreNode[]) {
    return (
      <ul className="card-grid mdv2-cat-list">
        {nodes.map((node) => (
          <li key={node.id}>
            <button type="button" className="card mdv2-cat-card" onClick={() => openPath(node)}>
              <span className="mdv2-cat-card__icon" aria-hidden="true"><FolderIcon /></span>
              <span className="mdv2-cat-card__copy">
                <strong>{node.name}</strong>
                <span>{countLabel(node, isId)}</span>
              </span>
              <span className="mdv2-cat-card__chev" aria-hidden="true"><ChevronIcon /></span>
            </button>
          </li>
        ))}
      </ul>
    );
  }

  function renderLoadMore(
    cursor: string | null,
    moreState: LoadState,
    onLoadMore: () => void,
  ) {
    if (!cursor) return null;
    return (
      <div className="mdv2-load-more" aria-live="polite">
        {moreState === 'error' && (
          <p role="alert">{isId ? 'Data berikutnya belum dapat dimuat.' : 'More data could not be loaded.'}</p>
        )}
        <Button
          variant="outline"
          onClick={onLoadMore}
          disabled={moreState === 'loading'}
        >
          {moreState === 'loading'
            ? (isId ? 'Memuat…' : 'Loading…')
            : (isId ? 'Tampilkan lebih banyak' : 'Show more')}
        </Button>
      </div>
    );
  }

  return (
    <div className="mdv2-page">

      <header className="mdv2-explore-head">
        <p className="mdv2-kicker">{isId ? 'Ruang pengetahuan' : 'Knowledge space'}</p>
        <h1>Explore &amp; Learn</h1>
        <p>
          {isId
            ? 'Telusuri kategori dan jalur pengetahuan yang sudah diterbitkan. Mulai dari yang umum, persempit sampai ke topik yang Anda cari.'
            : 'Browse published knowledge categories and paths. Start broad, narrow down to the topic you need.'}
        </p>
      </header>

      <section aria-labelledby="explore-browser-title">
        <div className="mdv2-section-head">
          <div>
            <h2 id="explore-browser-title">{browserTitle}</h2>
            <p>{browserDescription}</p>
          </div>
        </div>

        <div className="mdv2-toolbar">
          {view !== 'titles' && (
            <label className="mdv2-search">
              <span className="sr-only">{isId ? 'Saring kategori' : 'Filter categories'}</span>
              <SearchIcon />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={isId ? 'Cari kategori…' : 'Search categories…'}
              />
            </label>
          )}
          <nav className="mdv2-tabs" aria-label={isId ? 'Mode tampilan' : 'View mode'}>
            <button type="button" aria-pressed={view === 'categories'} onClick={resetToCategories}>
              {isId ? 'Kategori' : 'Categories'}
            </button>
            <button
              type="button"
              aria-pressed={view === 'paths'}
              onClick={() => { setView('paths'); }}
            >
              {isId ? 'Jalur' : 'Paths'}
            </button>
            <button
              type="button"
              aria-pressed={view === 'titles'}
              onClick={() => { setView('titles'); setQuery(''); }}
            >
              {isId ? 'Contoh judul' : 'Title sample'}
            </button>
          </nav>
        </div>

        <div className="mdv2-browser-body">
          {view === 'categories' && (
            <>
              {categoryState === 'loading' ? (
                <SkeletonGrid />
              ) : categoryState === 'error' ? (
                <div className="mdv2-state mdv2-state--error" role="alert">
                  <span className="mdv2-state__icon" aria-hidden="true"><AlertIcon /></span>
                  <p className="mdv2-state__title">{isId ? 'Kategori tidak dapat dimuat' : 'Categories could not be loaded'}</p>
                  <p>{isId ? 'Koneksi atau server bermasalah. Data Anda aman — coba muat ulang.' : 'A connection or server issue. Your data is safe — try reloading.'}</p>
                  <Button variant="outline" onClick={() => void loadCategories()}>
                    {isId ? 'Coba lagi' : 'Try again'}
                  </Button>
                </div>
              ) : visibleCategories.length > 0 ? (
                <>
                  {renderCategoryCards(visibleCategories)}
                  {renderLoadMore(categoryCursor, categoryMoreState, () => void loadCategories(categoryCursor))}
                </>
              ) : (
                <div className="mdv2-state">
                  <span className="mdv2-state__icon" aria-hidden="true"><EmptyIcon /></span>
                  <p className="mdv2-state__title">{isId ? 'Tidak ada hasil' : 'No results'}</p>
                  <p>
                    {query
                      ? (isId ? `Tidak ada kategori yang cocok dengan "${query}". Coba kata kunci lain.` : `No category matches "${query}". Try another keyword.`)
                      : (isId ? 'Belum ada kategori yang diterbitkan.' : 'No categories published yet.')}
                  </p>
                  {query && (
                    <Button variant="ghost" onClick={() => setQuery('')}>
                      {isId ? 'Hapus saringan' : 'Clear filter'}
                    </Button>
                  )}
                </div>
              )}
            </>
          )}

          {view === 'paths' && (
            <>
              {!activeNode ? (
                pathState === 'loading' ? (
                  <SkeletonGrid />
                ) : (
                  <div className="mdv2-state">
                    <span className="mdv2-state__icon" aria-hidden="true"><FolderIcon /></span>
                    <p className="mdv2-state__title">{isId ? 'Pilih kategori dulu' : 'Choose a category first'}</p>
                    <p>{isId ? 'Jalur mengikuti kategori yang Anda pilih dari daftar.' : 'Paths follow the category you pick from the list.'}</p>
                    <Button variant="outline" onClick={resetToCategories}>
                      {isId ? 'Buka kategori' : 'Open categories'}
                    </Button>
                  </div>
                )
              ) : (
                <>
                  <nav className="mdv2-trail" aria-label={isId ? 'Jalur kategori' : 'Category breadcrumb'}>
                    <button type="button" onClick={resetToCategories}>
                      {isId ? 'Kategori' : 'Categories'}
                    </button>
                    {activeTrail.map((item, index) => {
                      const isCurrent = index === activeTrail.length - 1;
                      return (
                        <span key={item.id} className="mdv2-trail__item">
                          <span className="mdv2-trail__sep" aria-hidden="true">/</span>
                          {isCurrent ? (
                            <strong aria-current="page">{item.name}</strong>
                          ) : (
                            <button type="button" onClick={() => openPath(item)}>{item.name}</button>
                          )}
                        </span>
                      );
                    })}
                  </nav>
                  {pathState === 'loading' ? (
                    <SkeletonGrid />
                  ) : pathState === 'error' ? (
                    <div className="mdv2-state mdv2-state--error" role="alert">
                      <span className="mdv2-state__icon" aria-hidden="true"><AlertIcon /></span>
                      <p className="mdv2-state__title">{isId ? 'Jalur tidak dapat dimuat' : 'Path could not be loaded'}</p>
                      <p>{isId ? 'Data tidak hilang — coba muat ulang jalur ini.' : 'Your data is intact — try reloading this path.'}</p>
                      <Button variant="outline" onClick={() => void loadPath(activeNode.path, activeNode)}>
                        {isId ? 'Coba lagi' : 'Try again'}
                      </Button>
                    </div>
                  ) : visibleChildren.length > 0 ? (
                    <>
                      {renderCategoryCards(visibleChildren)}
                      {renderLoadMore(pathCursor, pathMoreState, () => void loadPath(activeNode.path, activeNode, pathCursor))}
                    </>
                  ) : (
                    <div className="mdv2-state">
                      <span className="mdv2-state__icon" aria-hidden="true"><EmptyIcon /></span>
                      <p className="mdv2-state__title">{isId ? 'Belum ada isi' : 'Nothing here yet'}</p>
                      <p>
                        {query
                          ? (isId ? `Tidak ada yang cocok dengan "${query}" di jalur ini.` : `Nothing matches "${query}" in this path.`)
                          : (isId ? 'Jalur ini belum memiliki subkategori atau artikel.' : 'This path has no subcategories or articles yet.')}
                      </p>
                      <Button variant="ghost" onClick={resetToCategories}>
                        {isId ? 'Pilih kategori lain' : 'Choose another category'}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {view === 'titles' && (
            <>
              {sampleArticle ? (
                <article className="mdv2-sample">
                  <p className="mdv2-sample__label">{isId ? 'Contoh struktur · Draft' : 'Structure sample · Draft'}</p>
                  <h3 className="article-title">{sampleArticle.title}</h3>
                  <span className="mdv2-sample__cat">{sampleArticle.category}</span>
                  <p>{sampleArticle.summary}</p>
                  <div>
                    <Button asChild variant="outline">
                      <Link href={`/artikel/${sampleArticle.id}`}>
                        {isId ? 'Buka contoh artikel' : 'Open sample article'}
                      </Link>
                    </Button>
                  </div>
                </article>
              ) : (
                <div className="mdv2-state">
                  <span className="mdv2-state__icon" aria-hidden="true"><EmptyIcon /></span>
                  <p className="mdv2-state__title">{isId ? 'Belum ada contoh' : 'No sample yet'}</p>
                  <p>{isId ? 'Contoh judul artikel belum disediakan.' : 'A sample article title has not been provided yet.'}</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <aside className="mdv2-foundation" aria-label={isId ? 'Fondasi katalog' : 'Catalog foundation'}>
        <div>
          <strong>{isId ? 'Cara kerja katalog' : 'How the catalog works'}</strong>
          <p>
            {isId
              ? 'Kategori → subkategori → artikel. Setiap tingkat tumbuh tanpa membuat halaman awal penuh sesak. Untuk panduan tindakan sehari-hari, buka '
              : 'Category → subcategory → article. Each level grows without crowding the opening page. For everyday action guides, open '}
            <Link href="/ruang/tutorial-problem-solve">Tutorial &amp; Problem Solve</Link>.
          </p>
        </div>
        <ol aria-label={isId ? 'Susunan informasi' : 'Information structure'}>
          <li>{isId ? 'Kategori' : 'Categories'}</li>
          <li>{isId ? 'Subkategori' : 'Subcategories'}</li>
          <li>{isId ? 'Artikel' : 'Articles'}</li>
        </ol>
      </aside>
    </div>
  );
}
