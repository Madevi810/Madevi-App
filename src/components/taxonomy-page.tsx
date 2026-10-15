'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useLanguage } from './theme-provider';

interface Node {
  id: string;
  name: string;
  slug: string;
  path: string;
  level?: string;
  children?: Node[];
}

interface Counts {
  children: number;
  articles: number;
}

function parseTaxonomy(json: unknown): {
  path: Node[];
  node: Node | null;
  children: Node[];
  cursor: string | null;
} {
  const data = (
    json as {
      data?: {
        breadcrumb?: Node[];
        node?: Node | null;
        children?: Node[];
        page?: { nextCursor?: string | null };
      };
    }
  ).data;
  return {
    path: data?.breadcrumb ?? [],
    node: data?.node ?? null,
    children: data?.children ?? [],
    cursor: data?.page?.nextCursor ?? null,
  };
}

interface ArticleSummary {
  id: string;
  title: string;
  summary: string;
  creator_name?: string | null;
  reading_minutes?: number;
  published_at?: string | null;
}

export function TaxonomyPage({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [path, setPath] = useState<Node[]>([]);
  const [current, setCurrent] = useState<Node | null>(null);
  const [children, setChildren] = useState<Node[]>([]);
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [counts, setCounts] = useState<Counts>({ children: 0, articles: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(async () => {
      if (cancelled) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetch(
          `/api/v1/taxonomy?path=${encodeURIComponent(slug)}&q=${encodeURIComponent(activeQuery)}`,
        );
        if (!res.ok)
          throw new Error(
            isId
              ? 'Data ruang belum dapat dimuat. Silakan coba lagi atau tunggu paket Admin.'
              : 'Space data is not available yet. Please try again or wait for an Admin package.',
          );
        const json = await res.json();
        if (cancelled) return;
        const redirect = (json as { data?: { redirectPath?: string } }).data?.redirectPath;
        if (redirect) {
          window.location.replace(`/ruang/${redirect}`);
          return;
        }
        const parsed = parseTaxonomy(json);
        setPath(parsed.path);
        setCurrent(parsed.node);
        setChildren(parsed.children);
        setCursor(parsed.cursor);
        const fetchedCounts = (json as { data?: { counts?: Counts } }).data?.counts ?? {
          children: parsed.children.length,
          articles: 0,
        };
        setCounts(fetchedCounts);

        if (parsed.node) {
          try {
            const artRes = await fetch(
              `/api/v1/articles?taxonomyNodeId=${encodeURIComponent(parsed.node.id)}&limit=20`,
            );
            if (artRes.ok && !cancelled) {
              const artJson = await artRes.json();
              const items = Array.isArray(artJson.data) ? artJson.data : [];
              setArticles(items);
            }
          } catch {
            if (!cancelled) setArticles([]);
          }
        } else {
          setArticles([]);
        }
      } catch (reason) {
        if (cancelled) return;
        setPath([]);
        setCurrent(null);
        setChildren([]);
        setCursor(null);
        setCounts({ children: 0, articles: 0 });
        setError(
          reason instanceof Error
            ? reason.message
            : isId
              ? 'Data ruang belum dapat dimuat. Silakan coba lagi atau tunggu paket Admin.'
              : 'Space data is not available yet. Please try again or wait for an Admin package.',
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeQuery, isId, slug]);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveQuery(query.trim());
  }

  async function loadMore() {
    if (!cursor) return;
    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/v1/taxonomy?path=${encodeURIComponent(slug)}&q=${encodeURIComponent(activeQuery)}&cursor=${encodeURIComponent(cursor)}`,
      );
      if (!res.ok)
        throw new Error(
          isId ? 'Cabang berikutnya gagal dimuat.' : 'The next branches could not be loaded.',
        );
      const parsed = parseTaxonomy(await res.json());
      setChildren((prev) => [...prev, ...parsed.children]);
      setCursor(parsed.cursor);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : isId
            ? 'Cabang berikutnya gagal dimuat.'
            : 'The next branches could not be loaded.',
      );
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="taxonomy-page">
      <nav className="taxonomy-breadcrumb" aria-label={isId ? 'Navigasi' : 'Breadcrumb'}>
        <Link href="/">{isId ? 'Beranda' : 'Home'}</Link>
        {path.map((p) => (
          <span key={p.id}>
            {' '}
            / <Link href={`/ruang/${p.path}`}>{p.name}</Link>
          </span>
        ))}
      </nav>
      <div className="taxonomy-toolbar">
        <button
          type="button"
          className="button button--secondary"
          onClick={() => window.history.back()}
        >
          {isId ? 'Kembali' : 'Back'}
        </button>
        <form onSubmit={search} className="taxonomy-search">
          <label htmlFor="taxonomy-query">{isId ? 'Cari cabang' : 'Search branch'}</label>
          <input
            id="taxonomy-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={120}
          />
          <button type="submit" className="button button--small">
            {isId ? 'Cari' : 'Search'}
          </button>
        </form>
      </div>
      {current && <h1>{current.name}</h1>}
      {current && (
        <p className="taxonomy-counts">
          {counts.children} {isId ? 'anak' : 'children'} · {counts.articles}{' '}
          {isId ? 'artikel' : 'articles'}
        </p>
      )}
      {loading ? (
        <p className="taxonomy-empty">{isId ? 'Memuat ruang…' : 'Loading space…'}</p>
      ) : error ? (
        <p className="taxonomy-empty" role="alert">
          {error}
        </p>
      ) : (
        <div className="taxonomy-grid">
          {children.map((c) => (
            <Link key={c.id} href={`/ruang/${c.path}`} className="taxonomy-card">
              <h2 className="taxonomy-card__name">{c.name}</h2>
              <hr className="taxonomy-card__divider" />
              {c.children && c.children.length > 0 && (
                <ul className="taxonomy-card__children">
                  {c.children.slice(0, 5).map((ch) => (
                    <li key={ch.id}>{ch.name}</li>
                  ))}
                </ul>
              )}
            </Link>
          ))}
        </div>
      )}
      {articles.length > 0 && (
        <section className="taxonomy-articles">
          <h2 className="taxonomy-articles__title">
            {isId ? 'Materi & Artikel' : 'Materials & Articles'}
          </h2>
          <div className="taxonomy-grid">
            {articles.map((art) => (
              <Link key={art.id} href={`/artikel/${art.id}`} className="taxonomy-card">
                <h3 className="taxonomy-card__name taxonomy-card__name--article">{art.title}</h3>
                <hr className="taxonomy-card__divider" />
                {art.summary && <p className="taxonomy-card__summary">{art.summary}</p>}
                {art.reading_minutes && (
                  <span className="taxonomy-card__reading-time">
                    ⏱ {art.reading_minutes} {isId ? 'menit baca' : 'min read'}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
      {!loading && !error && !children.length && !articles.length && (
        <p className="taxonomy-empty">
          {current?.level === 'J'
            ? isId
              ? 'Materi sedang disiapkan.'
              : 'Materials are being prepared.'
            : isId
              ? 'Cabang belum tersedia pada struktur aktif.'
              : 'No branch is available in the active structure.'}
        </p>
      )}
      {cursor && (
        <button type="button" className="button" onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? (isId ? 'Memuat…' : 'Loading…') : isId ? 'Muat lainnya' : 'Load more'}
        </button>
      )}
    </div>
  );
}
