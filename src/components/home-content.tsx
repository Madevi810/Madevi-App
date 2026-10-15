'use client';

import { useEffect, useState } from 'react';

import { LanjutkanMembaca } from '@/components/lanjutkan-membaca';

import Link from 'next/link';

import type { SpaceContract, SpacePresentationKey } from '@/contracts/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useLanguage } from './theme-provider';

type HomeArticle = {
  id: string;
  title: string;
  category: string;
  summary: string;
};

type SpaceNeedCopy = {
  intentId: string;
  intentEn: string;
  quickId: string;
  quickEn: string;
  planId: string;
  planEn: string;
};

/* Copy ini hanya membantu memilih salah satu dari tujuh route yang memang
   tersedia. Ia tidak membuat layanan, artikel, atau tindakan baru. */
const SPACE_NEED_COPY: Record<SpacePresentationKey, SpaceNeedCopy> = {
  explore: {
    intentId: 'Saya ingin memahami topik atau mencari konteks',
    intentEn: 'I want to understand a topic or find context',
    quickId: 'Cari konteks',
    quickEn: 'Find context',
    planId: 'Telusuri kategori dan jalur pengetahuan yang sudah diterbitkan.',
    planEn: 'Browse published knowledge categories and paths.',
  },
  tutorial: {
    intentId: 'Saya ingin memperbaiki atau membuat sesuatu',
    intentEn: 'I want to repair or make something',
    quickId: 'Buat atau perbaiki',
    quickEn: 'Make or repair',
    planId: 'Mulai dari panduan praktis dan periksa batas aman sebelum bertindak.',
    planEn: 'Start with a practical guide and check safety boundaries before acting.',
  },
  school: {
    intentId: 'Saya ingin belajar menurut jenjang',
    intentEn: 'I want to learn by education level',
    quickId: 'Belajar per jenjang',
    quickEn: 'Learn by level',
    planId: 'Pilih jenjang serta materi yang tersedia untuk dipelajari.',
    planEn: 'Choose an available level and learning material.',
  },
  line: {
    intentId: 'Saya ingin berbincang atau berbagi dengan aman',
    intentEn: 'I want to discuss or share safely',
    quickId: 'Diskusi dengan aman',
    quickEn: 'Discuss safely',
    planId: 'Masuk ke ruang sosial dengan kendali privasi dan keselamatan.',
    planEn: 'Enter the social space with privacy and safety controls.',
  },
  services: {
    intentId: 'Saya membutuhkan desain atau tata letak',
    intentEn: 'I need design or layout help',
    quickId: 'Desain dan tata letak',
    quickEn: 'Design and layout',
    planId: 'Pilih template, brief desain, atau brief PCB sesuai kebutuhan.',
    planEn: 'Choose a template, design brief, or PCB brief for the need.',
  },
  shop: {
    intentId: 'Saya ingin menilai produk atau peralatan',
    intentEn: 'I want to assess a product or piece of equipment',
    quickId: 'Nilai produk',
    quickEn: 'Assess products',
    planId: 'Tinjau katalog, detail, simpanan, atau pertanyaan sebelum memutuskan.',
    planEn: 'Review the catalog, details, saves, or questions before deciding.',
  },
  tools: {
    intentId: 'Saya ingin mengolah hitungan, berkas, atau dokumen',
    intentEn: 'I want to process calculations, files, or documents',
    quickId: 'Hitung dan berkas',
    quickEn: 'Calculations and files',
    planId: 'Pilih alat Formula, PDF, atau dokumen karier yang tersedia.',
    planEn: 'Choose an available Formula, PDF, or career document tool.',
  },
};

function ArrowGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type TaxNode = {
  name: string;
  path: string;
};

/** Statistik dashboard: angka jujur dari data nyata. */
function StatsSection({
  isId,
  rooms,
  articles,
  toolsCount,
}: {
  isId: boolean;
  rooms: number;
  articles: number;
  toolsCount: number;
}) {
  return (
    <section className="home-stats" aria-label={isId ? 'Statistik Madevi' : 'Madevi statistics'}>
      <div className="home-stat">
        <span className="home-stat__num">{rooms}</span>
        <span className="home-stat__cap">{isId ? 'Ruang' : 'Spaces'}</span>
      </div>
      <div className="home-stat">
        <span className="home-stat__num">{articles}</span>
        <span className="home-stat__cap">{isId ? 'Baris artikel seed' : 'Article seed rows'}</span>
      </div>
      <div className="home-stat">
        <span className="home-stat__num">{toolsCount}</span>
        <span className="home-stat__cap">{isId ? 'Tools' : 'Tools'}</span>
      </div>
    </section>
  );
}

function SpaceGlyph({ space }: { space: SpacePresentationKey }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (space) {
    case 'tutorial':
      return <svg {...common}><path d="m14.6 5.2 4.2 4.2M4 20l3.4-.9L18.6 7.9a1.5 1.5 0 0 0-2.1-2.1L5.3 17 4 20Z" /><path d="m12.9 7.4 3.7 3.7M4.8 4.8l2.5 2.5M4.8 7.3l2.5-2.5" /></svg>;
    case 'school':
      return <svg {...common}><path d="m3 10 9-5 9 5-9 5-9-5Z" /><path d="M7 12.2V16c2.8 2.2 7.2 2.2 10 0v-3.8M21 10v5" /></svg>;
    case 'line':
      return <svg {...common}><path d="M20 11.5a7.2 7.2 0 0 1-7.5 7.5 8.7 8.7 0 0 1-3.3-.66L4 20l1.66-4.44A7.26 7.26 0 0 1 4.8 12 7.2 7.2 0 0 1 12.3 4.5 7.2 7.2 0 0 1 20 11.5Z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="2.4" /></svg>;
    case 'services':
      return <svg {...common}><path d="m14.8 4.4 4.8 4.8M4 20l3.1-.8L18.8 7.5a1.7 1.7 0 0 0-2.4-2.4L4.8 16.8 4 20Z" /><path d="m13.6 6.3 4.1 4.1" /></svg>;
    case 'shop':
      return <svg {...common}><path d="M5.5 9h13l-1 11h-11l-1-11ZM9 9V7a3 3 0 0 1 6 0v2" /></svg>;
    case 'tools':
      return <svg {...common}><path d="M4 7h16M4 17h16M8 4v6M16 14v6" /><circle cx="8" cy="7" r="2" /><circle cx="16" cy="17" r="2" /></svg>;
    case 'explore':
    default:
      return <svg {...common}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /><path d="M8 6h8M8 10h6" /></svg>;
  }
}

function ConstellationField() {
  return (
    <div className="home-cosmos" aria-hidden="true">
      <span className="home-cosmos__veil home-cosmos__veil--amethyst" />
      <span className="home-cosmos__veil home-cosmos__veil--ember" />
      <svg className="home-cosmos__map" viewBox="0 0 1200 620" fill="none" preserveAspectRatio="none">
        <path d="M-40 470C164 326 292 590 468 422s281-269 772-168" />
        <path d="M76 126c154 66 187 203 374 176 199-28 231-180 416-138 127 30 207 109 353 53" />
        <circle cx="88" cy="170" r="2" />
        <circle cx="171" cy="370" r="3" />
        <circle cx="451" cy="302" r="3" />
        <circle cx="783" cy="226" r="2" />
        <circle cx="1024" cy="294" r="3" />
        <circle cx="1113" cy="144" r="2" />
        <circle cx="334" cy="86" r="2" />
      </svg>
    </div>
  );
}

function ArticleCard({ article, isId }: { article: HomeArticle; isId: boolean }) {
  return (
    <Card asChild variant="interactive" className="article-card">
      <article data-motion-scroll>
        <Link
          href={`/artikel/${article.id}`}
          className="article-card__link"
          aria-label={`${isId ? 'Baca artikel' : 'Read article'}: ${article.title}`}
        >
          <div className="article-card__body">
            <p className="article-card__meta">{article.category}</p>
            <h3 className="article-card__title">{article.title}</h3>
            <p className="article-card__excerpt">{article.summary}</p>
            <span className="article-card__more" aria-hidden="true">
              {isId ? 'Baca artikel' : 'Read article'} <ArrowGlyph />
            </span>
          </div>
        </Link>
      </article>
    </Card>
  );
}

function HeroSection({ isId, spaces }: { isId: boolean; spaces: readonly SpaceContract[] }) {
  const quickPaths = spaces.filter((space) =>
    ['explore', 'tutorial', 'tools'].includes(space.presentationKey),
  );

  return (
    <section className="welcome-card welcome-card--hero home-hero" aria-labelledby="hero-title">
        <div className="welcome-card__body home-hero__copy">
          <div className="home-hero__wordmark" aria-hidden="true">
            <span className="home-hero__wordmark-orbit" />
            <span className="home-hero__wordmark-letters">
              <span>M</span><span>a</span><span>d</span><span>e</span><span>v</span><span>i</span>
            </span>
          </div>
          <p className="home-hero__kicker">
            {isId ? 'Mulai dari kebutuhan Anda' : 'Start with what you need'}
          </p>
          <h1 id="hero-title" className="welcome-card__title" data-motion-enter>
            {isId
              ? 'Apa yang ingin Anda kerjakan?'
              : 'What would you like to work on?'}
          </h1>
          <p className="welcome-card__desc" data-motion-enter data-motion-intro>
            {isId
              ? 'Baca dan telusuri pengetahuan, ikuti panduan, olah berkas, atau kirim brief. Mulai dari ruang yang sesuai dengan pekerjaan Anda.'
              : 'Explore knowledge, follow a guide, process files, or send a brief. Start in the space that fits your work.'}
          </p>
          <div className="welcome-card__actions" data-motion-enter>
            <Button asChild size="lg" className="button welcome-card__cta">
              <Link href="#kebutuhan-ruang">
                {isId ? 'Jelajahi ruang' : 'Explore spaces'}
                <ArrowGlyph />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="welcome-card__text-link">
              <Link href="/auth">
                {isId ? 'Masuk atau daftar' : 'Sign in or register'}
              </Link>
            </Button>
          </div>
        </div>
        {quickPaths.length > 0 && (
          <nav
            className="home-hero__paths"
            aria-label={isId ? 'Mulai dari ruang pilihan' : 'Start from a chosen space'}
            data-motion-enter
          >
            <div>
              {quickPaths.map((space) => {
                const copy = SPACE_NEED_COPY[space.presentationKey];

                return (
                  <Link key={space.id} href={space.href} data-space={space.presentationKey}>
                    <SpaceGlyph space={space.presentationKey} />
                    <span className="home-hero__path-copy">
                      <span className="home-hero__path-name">{isId ? space.nameId : space.nameEn}</span>
                      <span className="home-hero__path-intent">{isId ? copy.quickId : copy.quickEn}</span>
                    </span>
                    <ArrowGlyph />
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
    </section>
  );
}

function SpacesSection({ isId, spaces }: { isId: boolean; spaces: readonly SpaceContract[] }) {
  const activeSpaces = spaces.filter((space) => space.status === 'ACTIVE');
  const [openKey, setOpenKey] = useState<SpacePresentationKey | null>(null);
  const [roots, setRoots] = useState<TaxNode[] | null>(null);
  const [children, setChildren] = useState<Partial<Record<SpacePresentationKey, TaxNode[]>>>({});
  const [loadingKey, setLoadingKey] = useState<SpacePresentationKey | null>(null);

  // Muat node taksonomi tingkat atas sekali; gagal = accordion tampil jujur tanpa sub.
  useEffect(() => {
    let cancelled = false;
    async function loadRoots() {
      try {
        const res = await fetch('/api/v1/taxonomy?limit=30', { credentials: 'same-origin' });
        if (!res.ok || cancelled) return;
        const json = (await res.json()) as { data?: { children?: TaxNode[] } };
        if (cancelled) return;
        setRoots(Array.isArray(json.data?.children) ? json.data!.children! : []);
      } catch {
        if (!cancelled) setRoots([]);
      }
    }
    void loadRoots();
    return () => {
      cancelled = true;
    };
  }, []);

  function rootFor(space: SpaceContract): TaxNode | undefined {
    if (!roots) return undefined;
    const slug = space.href.split('/').filter(Boolean).pop() ?? '';
    return roots.find(
      (n) => n.path === slug || n.path.endsWith(`/${slug}`) || slug.includes(n.path),
    );
  }

  async function toggle(space: SpaceContract) {
    const key = space.presentationKey;
    if (openKey === key) {
      setOpenKey(null);
      return;
    }
    setOpenKey(key);
    if (children[key] || loadingKey === key) return;
    const root = rootFor(space);
    if (!root) {
      setChildren((prev) => ({ ...prev, [key]: [] }));
      return;
    }
    setLoadingKey(key);
    try {
      const res = await fetch(`/api/v1/taxonomy?path=${encodeURIComponent(root.path)}&limit=30`, {
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error('bad');
      const json = (await res.json()) as { data?: { children?: TaxNode[] } };
      setChildren((prev) => ({
        ...prev,
        [key]: Array.isArray(json.data?.children) ? json.data!.children! : [],
      }));
    } catch {
      setChildren((prev) => ({ ...prev, [key]: [] }));
    } finally {
      setLoadingKey((cur) => (cur === key ? null : cur));
    }
  }

  return (
    <section id="kebutuhan-ruang" className="home-rooms" aria-labelledby="needs-title">
      <h2 id="needs-title" className="home-rooms__title">
        {isId ? 'Tujuh Ruang' : 'Seven Spaces'}
      </h2>
      <div className="home-rooms__list">
        {activeSpaces.map((space) => {
          const key = space.presentationKey;
          const isOpen = openKey === key;
          const subs = children[key];
          return (
            <div key={space.id} className="room-acc">
              <div className="room-acc__top">
                <Link href={space.href} className="room-acc__main" data-space={key}>
                  <span className="room-acc__icon" aria-hidden="true">
                    <SpaceGlyph space={key} />
                  </span>
                  <span className="room-acc__name">{isId ? space.nameId : space.nameEn}</span>
                </Link>
                <button
                  type="button"
                  className={`room-acc__exp${isOpen ? ' room-acc__exp--open' : ''}`}
                  aria-expanded={isOpen}
                  aria-label={
                    isOpen
                      ? isId ? `Tutup ${space.nameId}` : `Collapse ${space.nameEn}`
                      : isId ? `Buka sub-kategori ${space.nameId}` : `Expand ${space.nameEn} subcategories`
                  }
                  onClick={() => void toggle(space)}
                >
                  <ChevronGlyph />
                </button>
              </div>
              {isOpen && (
                <div className="room-acc__sub">
                  {loadingKey === key && (
                    <p className="room-acc__empty">{isId ? 'Memuat…' : 'Loading…'}</p>
                  )}
                  {loadingKey !== key && subs && subs.length === 0 && (
                    <p className="room-acc__empty">
                      {isId
                        ? 'Belum ada sub-kategori yang diterbitkan.'
                        : 'No published subcategories yet.'}
                    </p>
                  )}
                  {subs &&
                    subs.map((sub) => (
                      <Link key={sub.path} href={space.href} className="room-acc__subitem">
                        {sub.name}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LatestArticlesSection({ isId, articles }: { isId: boolean; articles: readonly HomeArticle[] }) {
  const selectedArticles = articles.slice(0, 3);

  return (
    <section className="home-latest" aria-labelledby="latest-articles-title">
      <header className="section-heading section-heading--with-action" data-motion-scroll>
        <div>
          <h2 id="latest-articles-title">{isId ? 'Ide untuk diteruskan' : 'Ideas to carry forward'}</h2>
        </div>
        <Link href="/belajar" className="section-heading__link">
          {isId ? 'Lihat semua' : 'View all'} <ArrowGlyph />
        </Link>
      </header>
      {selectedArticles.length > 0 ? (
        <div className="article-list">
          {selectedArticles.map((article) => <ArticleCard key={article.id} article={article} isId={isId} />)}
        </div>
      ) : (
        <p className="home-latest__empty">{isId ? 'Belum ada artikel yang dapat ditampilkan.' : 'There are no articles to show yet.'}</p>
      )}
    </section>
  );
}

export function HomeContent({
  articles,
  spaces,
  toolsCount = 0,
}: {
  articles: readonly HomeArticle[];
  spaces: readonly SpaceContract[];
  toolsCount?: number;
}) {
  const { language } = useLanguage();
  const isId = language === 'id';
  const activeCount = spaces.filter((s) => s.status === 'ACTIVE').length;

  return (
    <div className="home-content-wrapper">
      <ConstellationField />
      <HeroSection isId={isId} spaces={spaces} />
      <StatsSection isId={isId} rooms={activeCount} articles={667} toolsCount={toolsCount} />
      <SpacesSection isId={isId} spaces={spaces} />
      <LanjutkanMembaca isId={isId} />
      <LatestArticlesSection isId={isId} articles={articles} />
    </div>
  );
}
