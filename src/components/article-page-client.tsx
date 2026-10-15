'use client';

import Link from 'next/link';
import { readCookie } from '@/lib/cookies';
import { useEffect, useState } from 'react';
import { ChecklistInteraktif } from '@/components/checklist-interaktif';
import { recordArticleRead } from '@/components/lanjutkan-membaca';
import { FokusBacaToggle } from '@/components/fokus-baca';
import { DaftarIsi } from '@/components/daftar-isi';
import {
  DANGER_LABELS,
  DEFAULT_PPE,
  guardrailFor,
  requiresProfessional,
  type ContentKind,
  type DangerLevel,
} from '@/contracts/content-guardrails';
import { ConceptMap, type ConceptNode, type ConceptRelation } from './concept-map';
import { useLanguage } from './theme-provider';
import { ArticleReadingTools } from './article-reading-tools';

interface ArticleBlock {
  id: string;
  blockType: string;
  position: number;
  content: Record<string, unknown>;
  storageObjectId: string | null;
  caption: string | null;
}

interface ArticleSource {
  id: string;
  title: string;
  authorOrOrg: string;
  publisher: string;
  url: string | null;
  isbn: string | null;
  doi: string | null;
  documentNumber: string | null;
}

interface ArticleData {
  id: string;
  title: string;
  summary: string;
  creator_name: string | null;
  created_at: string;
  published_at?: string | null;
  reading_minutes: number;
  access_level: string;
  status: string;
  blocks: ArticleBlock[];
  sources: ArticleSource[];
  taxonomyBreadcrumb?: Array<{ id: string; name: string; path_slug: string; level: string }>;
  bodyLocked?: boolean;
  /** R2: label Domain kecil di atas judul (level D pertama dari breadcrumb). */
  domainLabel?: string | null;
  /** R3: jenis sudut pandang konten — netral, bukan penilaian. */
  viewpoint?: string | null;
  /** R4: metadata hukum — yurisdiksi, nomor/tahun, status berlaku, tanggal diperiksa. */
  legalJurisdiction?: string | null;
  legalNumber?: string | null;
  legalStatus?: string | null;
  checkedAt?: string | null;
  /**
   * P09 guardrail: klasifikasi konten untuk disclaimer keselamatan.
   * Datang dari data artikel (paket Menu/Artikel terpisah); TIDAK ditebak
   * dari teks. null = tidak butuh disclaimer.
   */
  contentKind?: 'HEALTH' | 'PSYCHOLOGY' | 'RELIGION' | 'CONFLICT' | 'RISKY_TUTORIAL' | null;
  /** P09: level bahaya tutorial berisiko (hanya untuk RISKY_TUTORIAL). */
  dangerLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' | null;
  /** P09: alat pelindung yang direkomendasikan (hanya untuk RISKY_TUTORIAL). */
  protectiveEquipment?: string[] | null;
  /**
   * P09: status kualitas — sinyal transparan, bukan janji. Datang dari
   * moderasi; null = belum dinilai.
   */
  qualityStatus?: 'REVIEWED' | 'PARTIALLY_REVIEWED' | 'COMMUNITY' | null;
}

interface RelatedArticle {
  id: string;
  title: string;
  summary: string;
  reading_minutes: number;
}

const UNSAFE_KEYS = new Set([
  '__html',
  'dangerouslySetInnerHTML',
  'script',
  'onclick',
  'onerror',
  'onload',
]);


/** Ambil string tampilan dari konten blok tanpa pernah injeksi HTML. React meng-escape teks otomatis. */
function textsOf(content: Record<string, unknown>): string[] {
  const out: string[] = [];
  const visit = (v: unknown) => {
    if (typeof v === 'string') {
      const t = v.trim();
      if (t) out.push(t);
    } else if (Array.isArray(v)) {
      for (const item of v) visit(item);
    } else if (v && typeof v === 'object') {
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (!UNSAFE_KEYS.has(k)) visit(val);
      }
    }
  };
  visit(content);
  return out.slice(0, 50);
}

function isSafeHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

/** Renderer aman untuk 14 blok konten artikel */
function ChapterNav({
  isId,
  headings,
}: {
  isId: boolean;
  headings: Array<{ position: number; text: string }>;
}) {
  const [idx, setIdx] = useState(0);
  const n = headings.length;

  function go(to: number) {
    const clamped = Math.max(0, Math.min(n - 1, to));
    setIdx(clamped);
    const el = document.getElementById(`heading-${headings[clamped].position}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav className="chapter-nav" aria-label={isId ? 'Navigasi bab' : 'Chapter navigation'}>
      <button
        type="button"
        className="art-ctl"
        disabled={idx === 0}
        onClick={() => go(idx - 1)}
      >
        {'‹'} {isId ? 'Bab sebelumnya' : 'Previous chapter'}
      </button>
      <span className="chapter-nav__pg" aria-live="polite">
        {isId ? 'Bab' : 'Chapter'} {idx + 1} {isId ? 'dari' : 'of'} {n}
      </span>
      <button
        type="button"
        className="art-ctl"
        disabled={idx === n - 1}
        onClick={() => go(idx + 1)}
      >
        {isId ? 'Bab berikutnya' : 'Next chapter'} {'›'}
      </button>
    </nav>
  );
}

function BlockView({ block, isId, articleId }: { block: ArticleBlock; isId: boolean; articleId: string }) {
  const texts = textsOf(block.content ?? {});
  const first = texts[0] ?? '';

  switch (block.blockType) {
    case 'HEADING':
      return (
        <h2 id={`heading-${block.position}`} className="article-heading">
          {first}
        </h2>
      );

    case 'PARAGRAPH':
      return (
        <p className="article-paragraph">
          {texts.map((t, i) => (
            <span key={i}>{t} </span>
          ))}
        </p>
      );

    case 'LIST': {
      const items = texts.length ? texts : [block.caption ?? ''].filter(Boolean);
      // Daftar langkah jadi checklist interaktif (progres tersimpan lokal).
      return (
        <ChecklistInteraktif articleId={articleId} items={items} isId={isId} />
      );
    }

    case 'IMAGE': {
      const imageUrl = typeof block.content?.url === 'string' ? block.content.url : '';
      const imageAlt = typeof block.content?.alt === 'string' ? block.content.alt : first;
      if (imageUrl && isSafeHttpUrl(imageUrl)) {
        return (
          <figure className="article-figure">
            {/* URL media hanya dirender setelah validasi http(s); caption tetap di-escape React. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={imageAlt || 'Ilustrasi artikel'} loading="lazy" />
            {block.caption && <figcaption>{block.caption}</figcaption>}
          </figure>
        );
      }
      return (
        <figure className="article-figure-placeholder">
          <div className="article-figure-placeholder__inner">
            <span className="article-figure-placeholder__icon">🖼️</span>
            <p className="article-figure-placeholder__text">
              {texts[0] || (isId ? 'Ilustrasi materi pembelajaran' : 'Educational illustration')}
            </p>
          </div>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    }

    case 'TABLE': {
      const rawRows = block.content?.rows;
      const rawHeaders = block.content?.headers;
      const headers = Array.isArray(rawHeaders) ? (rawHeaders as string[]) : [];
      const rows = Array.isArray(rawRows) ? (rawRows as string[][]) : [];

      return (
        <div className="article-table-wrapper">
          <table className="article-table">
            {headers.length > 0 && (
              <thead>
                <tr>
                  {headers.map((h, idx) => (
                    <th key={idx}>{h}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.length > 0 ? (
                rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {Array.isArray(row) ? (
                      row.map((cell, cIdx) => <td key={cIdx}>{String(cell)}</td>)
                    ) : (
                      <td>{String(row)}</td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Math.max(headers.length, 1)}>{texts.join(' | ')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    case 'FORMULA':
      return (
        <div className="article-formula">
          <code>{texts.join(' ')}</code>
        </div>
      );

    case 'CODE':
      return (
        <pre className="article-code">
          <code>{texts.join('\n')}</code>
        </pre>
      );

    case 'QUOTE':
      return (
        <blockquote className="article-quote">
          {texts.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </blockquote>
      );

    case 'NOTE':
      return (
        <aside className="article-callout article-callout--note">
          <strong>ℹ️ {isId ? 'Catatan:' : 'Note:'}</strong>
          {texts.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </aside>
      );

    case 'WARNING':
      return (
        <aside className="article-callout article-callout--warning">
          <strong>⚠️ {isId ? 'Peringatan:' : 'Warning:'}</strong>
          {texts.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </aside>
      );

    case 'EXAMPLE':
      return (
        <aside className="article-callout article-callout--example">
          <strong>💡 {isId ? 'Contoh:' : 'Example:'}</strong>
          {texts.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </aside>
      );

    case 'STEP':
      return (
        <div className="article-step-card">
          <span className="article-step-card__label">
            {isId ? `Langkah ${block.position + 1}:` : `Step ${block.position + 1}:`}
          </span>
          {texts.join(' ')}
        </div>
      );

    case 'VIDEO':
      return (
        <figure className="article-video">
          <div className="article-video__placeholder">
            <span className="article-video__icon">▶</span>
            <p className="article-video__title">
              {isId ? 'Video Terverifikasi Edukasi' : 'Verified Educational Video'}
            </p>
            <p className="article-video__desc">
              {texts[0] ||
                (isId ? 'Pemutar video offline terverifikasi' : 'Verified offline video')}
            </p>
          </div>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    case 'LINK': {
      const url = texts.find((t) => isSafeHttpUrl(t));
      return (
        <p className="article-link-block">
          <span>{first}</span>
          {url && first !== url && (
            <>
              {' '}
              —{' '}
              <a href={url} target="_blank" rel="noopener noreferrer nofollow">
                {url}
              </a>
            </>
          )}
        </p>
      );
    }

    default:
      return (
        <p className="article-paragraph">
          {texts.map((t, i) => (
            <span key={i}>{t} </span>
          ))}
        </p>
      );
  }
}

export function ArticlePageClient({ id }: { id: string }) {
  const { language, setLanguage } = useLanguage();
  const isId = language === 'id';
  const [art, setArt] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);

  // Actions state
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTocMobile, setShowTocMobile] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showSources, setShowSources] = useState(false);

  // Correction Form state
  const [corrLocation, setCorrLocation] = useState('');
  const [corrIssueType, setCorrIssueType] = useState('TYPO');
  const [corrDesc, setCorrDesc] = useState('');
  const [corrSuggestion, setCorrSuggestion] = useState('');
  const [corrSource, setCorrSource] = useState('');
  const [corrLoading, setCorrLoading] = useState(false);
  const [corrMessage, setCorrMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Related articles
  const [related, setRelated] = useState<RelatedArticle[]>([]);

  useEffect(() => {
    // Check saved bookmark in localStorage
    try {
      const savedList = JSON.parse(localStorage.getItem('madevi_saved_articles') || '[]');
      if (Array.isArray(savedList)) {
        setSaved(savedList.includes(id));
      }
    } catch {
      // Ignore storage errors
    }

    setLoading(true);
    setLocked(false);
    fetch(`/api/v1/articles/${id}`)
      .then(async (r) => {
        const j = await r.json();
        const data = (j.data as ArticleData | undefined) ?? null;
        if (r.status === 403 || r.status === 401) {
          setLocked(true);
          setArt(data);
          return;
        }
        setLocked(Boolean(data?.bodyLocked));
        setArt(data);
        if (data?.id && data?.title) {
          recordArticleRead({ id: data.id, title: data.title, slug: (data as { slug?: string }).slug });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Fetch related articles
    fetch('/api/v1/articles?limit=3')
      .then(async (r) => {
        if (r.ok) {
          const j = await r.json();
          const items = Array.isArray(j.data) ? j.data : [];
          setRelated(items.filter((item: RelatedArticle) => item.id !== id).slice(0, 3));
        }
      })
      .catch(() => {});
  }, [id]);

  function toggleSaveBookmark() {
    try {
      const savedList: string[] = JSON.parse(localStorage.getItem('madevi_saved_articles') || '[]');
      let updated: string[];
      if (savedList.includes(id)) {
        updated = savedList.filter((item) => item !== id);
        setSaved(false);
      } else {
        updated = [...savedList, id];
        setSaved(true);
      }
      localStorage.setItem('madevi_saved_articles', JSON.stringify(updated));
    } catch {
      setSaved(!saved);
    }
  }

  async function handleCopyLink() {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  }

  async function handleShare() {
    const title = art?.title ?? 'Madevi';
    const url = typeof window !== 'undefined' ? window.location.href : '';
    // Web Share API (HP) — fallback ke salin tautan.
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await (navigator as Navigator & { share: (d: { title: string; url: string }) => Promise<void> }).share({ title, url });
        return;
      } catch {
        // Dibatalkan user atau gagal — fallback ke clipboard.
      }
    }
    handleCopyLink();
  }

  async function handleCorrectionSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!corrLocation.trim() || corrDesc.trim().length < 10) {
      setCorrMessage({
        type: 'error',
        text: isId
          ? 'Mohon lengkapi lokasi dan deskripsi minimal 10 karakter.'
          : 'Please provide location and description with at least 10 characters.',
      });
      return;
    }
    setCorrLoading(true);
    setCorrMessage(null);
    try {
      const csrf = readCookie('madevi_csrf');
      const res = await fetch(`/api/v1/articles/${id}/corrections`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrf,
        },
        body: JSON.stringify({
          locationHint: corrLocation.trim(),
          issueType: corrIssueType,
          description: corrDesc.trim(),
          suggestion: corrSuggestion.trim() || undefined,
          sourceReference: corrSource.trim() || undefined,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error?.message ||
            (isId ? 'Gagal mengirim usulan koreksi.' : 'Failed to submit correction.'),
        );
      }
      setCorrMessage({
        type: 'success',
        text: isId
          ? 'Koreksi berhasil dikirim dan menunggu tinjauan Admin.'
          : 'Correction submitted and awaiting Admin review.',
      });
      setCorrLocation('');
      setCorrDesc('');
      setCorrSuggestion('');
      setCorrSource('');
      setTimeout(() => {
        setShowCorrectionModal(false);
        setCorrMessage(null);
      }, 2500);
    } catch (err) {
      setCorrMessage({
        type: 'error',
        text:
          err instanceof Error ? err.message : isId ? 'Terjadi kesalahan.' : 'An error occurred.',
      });
    } finally {
      setCorrLoading(false);
    }
  }

  if (loading)
    return (
      <div className="page-shell page-container">
        <div className="card" style={{ padding: '1.5rem', display: 'grid', gap: '0.6rem' }} role="status" aria-hidden="true">
          <span className="skeleton" style={{ width: '35%' }} />
          <span className="skeleton" style={{ width: '80%', minHeight: '2.5rem' }} />
          <span className="skeleton" style={{ width: '60%' }} />
          <span className="skeleton" style={{ width: '95%' }} />
          <span className="skeleton" style={{ width: '88%' }} />
          <span className="skeleton" style={{ width: '92%' }} />
        </div>
      </div>
    );

  if (!art && !locked)
    return (
      <div className="page-shell page-container">
        <div className="line-empty">
          <p className="line-empty__title">{isId ? 'Artikel tidak ditemukan' : 'Article not found'}</p>
          <p className="line-empty__hint">
            {isId
              ? 'Coba kembali ke katalog School atau jelajahi ruang pengetahuan.'
              : 'Go back to the School catalogue or explore the knowledge spaces.'}
          </p>
        </div>
      </div>
    );

  const headings = (art?.blocks || []).filter((b) => b.blockType === 'HEADING');

  return (
    <div className="page-shell article-detail-container page-container" data-motion-reading>
      {/* Breadcrumb R1-R5 */}
      <nav className="taxonomy-breadcrumb" aria-label={isId ? 'Navigasi' : 'Breadcrumb'}>
        <Link href="/">{isId ? 'Beranda' : 'Home'}</Link> /{' '}
        <Link href="/ruang">{isId ? 'Ruang Pengetahuan' : 'Spaces'}</Link>
        {(art?.taxonomyBreadcrumb ?? []).map((node) => (
          <span key={node.id}>
            {' '}
            / <Link href={`/ruang/${node.path_slug}`}>{node.name}</Link>
          </span>
        ))}
        {' / '}
        <span>{art?.title ?? (isId ? 'Artikel terkunci' : 'Locked article')}</span>
      </nav>

      {/* Header Info */}
      <header className="article-header">
        <div className="article-header__meta">
          <span
            className={`article-header__badge ${art?.access_level === 'PUBLIC' ? 'article-header__badge--public' : 'article-header__badge--member'}`}
          >
            {art?.access_level === 'PUBLIC'
              ? isId
                ? 'PUBLIK'
                : 'PUBLIC'
              : isId
                ? 'ANGGOTA'
                : 'MEMBER'}
          </span>
          {art?.reading_minutes && (
            <span className="article-header__reading-time">
              ⏱ {art.reading_minutes} {isId ? 'menit baca' : 'min read'}
            </span>
          )}
        </div>

        <h1 className="article-header__title article-title">
          {art?.title ?? (isId ? 'Artikel terkunci' : 'Locked article')}
        </h1>

        {art && (
          <p className="article-header__byline">
            {art.creator_name ? `${isId ? 'Disusun oleh' : 'By'} ${art.creator_name} · ` : ''}
            {art.published_at
              ? new Date(art.published_at).toLocaleDateString()
              : art.created_at
                ? new Date(art.created_at).toLocaleDateString()
                : ''}
          </p>
        )}

        {art?.summary && <p className="article-header__summary">{art.summary}</p>}

        {/* Label Domain kecil (R2) — hanya bila data ada */}
        {art?.domainLabel && <p className="article-header__domain-label">{art.domainLabel}</p>}

        {/* Sudut pandang konten (R3) — netral, bukan penilaian */}
        {art?.viewpoint && (
          <p className="article-header__viewpoint">
            {isId ? 'Sudut pandang: ' : 'Viewpoint: '}
            <span>{art.viewpoint}</span>
          </p>
        )}

        {/* P09: status kualitas — transparan, bukan janji. */}
        {/* P09: status kualitas — transparan, bukan janji. */}
        {art?.qualityStatus && (
          <p className="article-quality">
            {isId ? 'Status kualitas: ' : 'Quality status: '}
            <span>
              {art.qualityStatus === 'REVIEWED'
                ? isId
                  ? 'Sudah ditinjau'
                  : 'Reviewed'
                : art.qualityStatus === 'PARTIALLY_REVIEWED'
                  ? isId
                    ? 'Sebagian ditinjau'
                    : 'Partially reviewed'
                  : isId
                    ? 'Komunitas'
                    : 'Community'}
            </span>
          </p>
        )}

        {/* Metadata hukum (R4) — hanya bila data ada */}
        {(art?.legalJurisdiction || art?.legalNumber || art?.legalStatus || art?.checkedAt) && (
          <div className="article-legal">
            <h2 className="article-legal__title">{isId ? 'Metadata Hukum' : 'Legal Metadata'}</h2>
            <dl className="article-legal__grid">
              {art.legalJurisdiction && (
                <div className="article-legal__cell">
                  <dt>{isId ? 'Yurisdiksi' : 'Jurisdiction'}</dt>
                  <dd>{art.legalJurisdiction}</dd>
                </div>
              )}
              {art.legalNumber && (
                <div className="article-legal__cell">
                  <dt>{isId ? 'Nomor/Tahun' : 'Number/Year'}</dt>
                  <dd>{art.legalNumber}</dd>
                </div>
              )}
              {art.legalStatus && (
                <div className="article-legal__cell">
                  <dt>{isId ? 'Status berlaku' : 'Enforcement status'}</dt>
                  <dd>{art.legalStatus}</dd>
                </div>
              )}
              {art.checkedAt && (
                <div className="article-legal__cell">
                  <dt>{isId ? 'Tanggal diperiksa' : 'Checked on'}</dt>
                  <dd>{new Date(art.checkedAt).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="article-actions-bar">
          {/* Simpan */}
          <button
            type="button"
            className={`button button--small ${saved ? 'button--primary' : 'button--secondary'}`}
            onClick={toggleSaveBookmark}
            title={isId ? 'Simpan artikel ke bookmark' : 'Bookmark article'}
          >
            {saved ? (isId ? '★ Tersimpan' : '★ Saved') : isId ? '☆ Simpan' : '☆ Save'}
          </button>

          <FokusBacaToggle isId={isId} />

          <button
            type="button"
            className="button button--small button--secondary"
            onClick={handleShare}
            title={isId ? 'Bagikan artikel' : 'Share article'}
          >
            {isId ? '📤 Bagikan' : '📤 Share'}
          </button>

          {/* Salin Tautan */}
          <button
            type="button"
            className="button button--small button--secondary"
            onClick={handleCopyLink}
            title={isId ? 'Salin alamat artikel' : 'Copy article link'}
          >
            {copied
              ? isId
                ? '✓ Tersalin!'
                : '✓ Copied!'
              : isId
                ? '🔗 Salin Tautan'
                : '🔗 Copy Link'}
          </button>

          {/* Ganti Bahasa */}
          <button
            type="button"
            className="button button--small button--secondary"
            onClick={() => setLanguage(isId ? 'en' : 'id')}
            title={isId ? 'Ubah bahasa tampilan' : 'Switch language'}
          >
            🌐 {isId ? 'English' : 'Bahasa Indonesia'}
          </button>

          {/* Ajukan Koreksi */}
          <button
            type="button"
            className="button button--small button--secondary"
            onClick={() => setShowCorrectionModal(true)}
            title={isId ? 'Usulkan koreksi materi' : 'Suggest a correction'}
          >
            ✍️ {isId ? 'Ajukan Koreksi' : 'Suggest Correction'}
          </button>

          {/* Tombol Ujian */}
          <Link
            href="/belajar"
            className="button button--small button--secondary"
            title={isId ? 'Buka jalur pembelajaran dan ujian' : 'Open learning paths and exams'}
          >
            📝 {isId ? 'Ujian Materi' : 'Take Exam'}
          </Link>

          {/* Toggle TOC Mobile */}
          {headings.length > 0 && (
            <button
              type="button"
              className="button button--small button--secondary"
              onClick={() => setShowTocMobile(!showTocMobile)}
              style={{ marginLeft: 'auto' }}
            >
              📑 {isId ? 'Daftar Isi' : 'TOC'} {showTocMobile ? '▲' : '▼'}
            </button>
          )}
        </div>
      </header>

      {/* Main Content Layout with Sidebar TOC */}
      <div className="article-body-layout">
        <article className="article-body-wrapper" style={{ minWidth: 0 }}>
          {/* Mobile TOC Drawer */}
          {headings.length > 0 && showTocMobile && (
            <nav className="article-toc-mobile">
              <strong className="article-toc-mobile__title">
                📑 {isId ? 'Daftar Isi Materi' : 'Table of Contents'}
              </strong>
              <ul>
                {headings.map((h, i) => {
                  const t = textsOf(h.content ?? {})[0] || `Bagian ${i + 1}`;
                  return (
                    <li key={h.id}>
                      <a href={`#heading-${h.position}`} onClick={() => setShowTocMobile(false)}>
                        {t}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          <ArticleReadingTools
            isId={isId}
            speakText={(art?.blocks || [])
              .flatMap((b) => textsOf(b.content ?? {}))
              .join(' ')
              .slice(0, 8000)}
          >
            {(() => {
              const disclaimer = guardrailFor(art?.contentKind as ContentKind | null);
              if (!disclaimer) return null;
              const danger = art?.dangerLevel as DangerLevel | null;
              const ppe = art?.protectiveEquipment?.length
                ? art.protectiveEquipment
                : DEFAULT_PPE.map((p) => (isId ? p.id : p.en));
              return (
                <aside className="article-guardrail" role="note">
                  <p className="article-guardrail__title">
                    <span aria-hidden="true">{disclaimer.icon}</span>{' '}
                    {isId ? disclaimer.titleId : disclaimer.titleEn}
                  </p>
                  <p className="article-guardrail__body">
                    {isId ? disclaimer.bodyId : disclaimer.bodyEn}
                  </p>
                  {danger && (
                    <p className="article-guardrail__danger">
                      <strong>{isId ? 'Level bahaya: ' : 'Danger level: '}</strong>
                      {isId ? DANGER_LABELS[danger].id : DANGER_LABELS[danger].en}
                      {requiresProfessional(danger) && (
                        <em>
                          {' '}
                          {isId
                            ? '— sebaiknya hanya dilakukan profesional.'
                            : '— best left to professionals.'}
                        </em>
                      )}
                    </p>
                  )}
                  {ppe.length > 0 && (
                    <p className="article-guardrail__ppe">
                      <strong>{isId ? 'Alat pelindung: ' : 'Protective equipment: '}</strong>
                      {ppe.join(', ')}
                    </p>
                  )}
                </aside>
              );
            })()}
            {/* Locked Paywall Notification */}
            {(locked || art?.bodyLocked) && (
              <div className="article-locked-banner">
                <span className="article-locked-banner__icon">🔒</span>
                <h3 className="article-locked-banner__title">
                  {isId ? 'Materi Khusus Anggota' : 'Member-Only Material'}
                </h3>
                <p className="article-locked-banner__desc">
                  {isId
                    ? 'Bagian isi materi ini dilindungi. Masuk dengan akun anggota terdaftar untuk membuka seluruh konten pembelajaran.'
                    : 'This article body is protected. Log in with an approved member account to access the full learning material.'}
                </p>
                <Link href="/auth" className="button button--primary">
                  {isId ? 'Masuk ke Akun' : 'Log In to Account'}
                </Link>
              </div>
            )}

            {/* Daftar Isi */}
            {!locked && art?.blocks && art.blocks.length > 0 && (
              <DaftarIsi
                isId={isId}
                items={art.blocks
                  .filter((b) => b.blockType === 'HEADING')
                  .map((b) => {
                    const texts = textsOf(b.content ?? {});
                    return {
                      position: b.position,
                      text: texts[0] ?? `Bagian ${b.position}`,
                    };
                  })}
              />
            )}

            {/* Render Blocks */}
            {!locked && art?.blocks && art.blocks.length > 0 && (
              <div className="article-blocks prose">
                {art.blocks.map((b) => (
                  <BlockView key={b.id} block={b} isId={isId} articleId={art?.id ?? 'unknown'} />
                ))}
              </div>
            )}

            {/* Navigasi bab (kontrak visual v15): untuk artikel dengan beberapa bab. */}
            {!locked && headings.length > 1 && (
              <ChapterNav isId={isId} headings={headings.map((h) => ({
                position: h.position,
                text: textsOf(h.content ?? {})[0] || `Bagian ${h.position}`,
              }))} />
            )}

            {!locked && (!art?.blocks || art.blocks.length === 0) && (
              <p className="article-empty">
                {isId ? 'Isi materi artikel sedang disiapkan.' : 'Article body is being prepared.'}
              </p>
            )}
            {art?.sources && art.sources.length > 0 && (
              <section className="article-sources article-sources--compact">
                <button
                  type="button"
                  className="article-sources__trigger button button--small button--secondary"
                  onClick={() => setShowSources((open) => !open)}
                >
                  📚 {isId ? `Sumber (${art.sources.length})` : `Sources (${art.sources.length})`}
                </button>
                {showSources && (
                  <div
                    className="article-sources__popup"
                    role="dialog"
                    aria-label={isId ? 'Sumber referensi' : 'References'}
                  >
                    <h2>{isId ? 'Sumber Referensi' : 'References'}</h2>
                    <ul>
                      {art.sources.map((s) => (
                        <li key={s.id}>
                          {s.url && isSafeHttpUrl(s.url) ? (
                            <a href={s.url} target="_blank" rel="noopener noreferrer nofollow">
                              {s.title}
                            </a>
                          ) : (
                            <strong>{s.title}</strong>
                          )}
                          {(s.authorOrOrg || s.publisher) && (
                            <span>
                              {' '}
                              — {[s.authorOrOrg, s.publisher].filter(Boolean).join(', ')}
                            </span>
                          )}
                          {![s.url].some((u) => u && isSafeHttpUrl(u ?? '')) &&
                            (s.isbn || s.doi || s.documentNumber) && (
                              <span>
                                {' '}
                                ({[s.isbn, s.doi, s.documentNumber].filter(Boolean).join(' · ')})
                              </span>
                            )}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="button button--small button--secondary"
                      onClick={() => setShowSources(false)}
                    >
                      {isId ? 'Tutup' : 'Close'}
                    </button>
                  </div>
                )}
              </section>
            )}
          </ArticleReadingTools>

          {/* Related Articles Section */}
          {related.length > 0 && (
            <section className="article-related">
              <h2 className="article-related__title">
                🔍 {isId ? 'Artikel Terkait' : 'Related Articles'}
              </h2>
              <div className="article-related__grid">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/artikel/${item.id}`}
                    className="article-related__card"
                  >
                    <h3>{item.title}</h3>
                    {item.summary && <p>{item.summary.slice(0, 100)}…</p>}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* P09: Peta Konsep — relasi kuat di luar kedalaman menu.
           * Node datang dari breadcrumb + related + serial (data artikel),
           * bukan hard-code taxonomy. */}
          {(() => {
            const nodes: ConceptNode[] = (art?.taxonomyBreadcrumb ?? []).map((node, i) => ({
              id: node.id,
              name: node.name,
              href: `/ruang/${node.path_slug}`,
              level: i,
            }));
            const relations: ConceptRelation[] = [
              ...related.map((item) => ({
                id: item.id,
                title: item.title,
                href: `/artikel/${item.id}`,
                kind: 'RELATED' as const,
              })),
            ];
            return <ConceptMap nodes={nodes} relations={relations} />;
          })()}

          {/* Member Discussion / Comments Section */}
          <section
            className="article-comments-section"
            style={{
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--madevi-border)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
              💬 {isId ? 'Diskusi & Tanggapan Anggota' : 'Member Discussion'}
            </h2>
            <div
              style={{
                background: 'var(--madevi-surface)',
                border: '1px solid var(--madevi-border)',
                borderRadius: '8px',
                padding: '1rem',
              }}
            >
              <p
                style={{ fontSize: '0.9rem', color: 'var(--madevi-muted)', margin: '0 0 0.75rem' }}
              >
                {isId
                  ? 'Diskusi materi pendidikan dimoderasi untuk menjamin lingkungan belajar yang aman dan ilmiah.'
                  : 'Educational discussions are moderated to ensure a safe and scholarly environment.'}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Link href="/sosial" className="button button--small button--secondary">
                  {isId ? 'Buka Ruang Diskusi' : 'Open Discussion Forum'}
                </Link>
                <button
                  type="button"
                  className="button button--small button--secondary"
                  onClick={() => setShowCorrectionModal(true)}
                >
                  ✍️ {isId ? 'Beri Catatan Koreksi' : 'Add Correction Note'}
                </button>
              </div>
            </div>
          </section>
        </article>

        {/* Desktop Sidebar Table of Contents */}
        {headings.length > 0 && (
          <aside
            className="article-toc-sidebar"
            style={{
              position: 'sticky',
              top: '1rem',
              background: 'var(--madevi-surface)',
              border: '1px solid var(--madevi-border)',
              borderRadius: '8px',
              padding: '1.25rem',
              maxHeight: 'calc(100vh - 2rem)',
              overflowY: 'auto',
            }}
          >
            <h3 style={{ fontSize: '1rem', margin: '0 0 0.75rem' }}>
              📑 {isId ? 'Daftar Isi' : 'Table of Contents'}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
              {headings.map((h, i) => {
                const t = textsOf(h.content ?? {})[0] || `Bagian ${i + 1}`;
                return (
                  <li key={h.id} style={{ margin: '0.5rem 0' }}>
                    <a
                      href={`#heading-${h.position}`}
                      style={{
                        color: 'var(--madevi-accent)',
                        textDecoration: 'none',
                        lineHeight: 1.4,
                        display: 'block',
                      }}
                    >
                      {t}
                    </a>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}
      </div>

      {/* Suggest Correction Modal Dialog */}
      {showCorrectionModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: 'var(--madevi-bg, #fff)',
              color: 'var(--madevi-text, #111)',
              borderRadius: '8px',
              padding: '1.5rem',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                ✍️ {isId ? 'Ajukan Usulan Koreksi' : 'Suggest Correction'}
              </h2>
              <button
                type="button"
                className="button button--small button--secondary"
                onClick={() => {
                  setShowCorrectionModal(false);
                  setCorrMessage(null);
                }}
              >
                ✕
              </button>
            </div>

            {corrMessage && (
              <p
                role="alert"
                style={{
                  padding: '0.75rem',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  backgroundColor: corrMessage.type === 'success' ? '#e8f5e9' : '#ffebee',
                  color: corrMessage.type === 'success' ? '#2e7d32' : '#c62828',
                  border: `1px solid ${corrMessage.type === 'success' ? '#a5d6a7' : '#ef9a9a'}`,
                }}
              >
                {corrMessage.text}
              </p>
            )}

            <form onSubmit={handleCorrectionSubmit}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                  }}
                >
                  {isId ? 'Lokasi Masalah' : 'Location in Article'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    isId
                      ? 'Contoh: Paragraf 3, Tabel 1, atau Rumus Energi'
                      : 'e.g. Paragraph 3 or Table 1'
                  }
                  value={corrLocation}
                  onChange={(e) => setCorrLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--madevi-border)',
                  }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                  }}
                >
                  {isId ? 'Jenis Masalah' : 'Issue Type'}
                </label>
                <div
                  className="corr-issue-grid"
                  role="group"
                  aria-label={isId ? 'Jenis masalah' : 'Issue type'}
                >
                  {(
                    [
                      ['TYPO', isId ? 'Kesalahan Ketik' : 'Typo'],
                      ['FACTUAL', isId ? 'Fakta / Data Keliru' : 'Factual / Data Error'],
                      ['OUTDATED', isId ? 'Informasi Usang' : 'Outdated Information'],
                      ['BROKEN_LINK', isId ? 'Tautan Rusak' : 'Broken Link'],
                      ['OTHER', isId ? 'Lainnya' : 'Other'],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`corr-issue-btn${corrIssueType === value ? ' corr-issue-btn--active' : ''}`}
                      onClick={() => setCorrIssueType(value)}
                      aria-pressed={corrIssueType === value}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                  }}
                >
                  {isId ? 'Deskripsi Masalah (Minimal 10 karakter)' : 'Description (min 10 chars)'}{' '}
                  *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={
                    isId
                      ? 'Jelaskan kekeliruan atau ketidaksesuaian yang ditemukan…'
                      : 'Describe the inaccuracy found…'
                  }
                  value={corrDesc}
                  onChange={(e) => setCorrDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--madevi-border)',
                  }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                  }}
                >
                  {isId ? 'Usulan Perbaikan' : 'Proposed Suggestion'}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    isId
                      ? 'Usulan teks atau formula yang benar…'
                      : 'Suggested correct text or formula…'
                  }
                  value={corrSuggestion}
                  onChange={(e) => setCorrSuggestion(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--madevi-border)',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                  }}
                >
                  {isId ? 'Sumber Referensi Pendukung' : 'Supporting Reference Source'}
                </label>
                <input
                  type="text"
                  placeholder={
                    isId
                      ? 'Buku, Jurnal, Standar Resmi, atau URL'
                      : 'Book, Journal, Official Standard, or URL'
                  }
                  value={corrSource}
                  onChange={(e) => setCorrSource(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--madevi-border)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => {
                    setShowCorrectionModal(false);
                    setCorrMessage(null);
                  }}
                  disabled={corrLoading}
                >
                  {isId ? 'Batal' : 'Cancel'}
                </button>
                <button type="submit" className="button button--primary" disabled={corrLoading}>
                  {corrLoading
                    ? isId
                      ? 'Mengirim…'
                      : 'Submitting…'
                    : isId
                      ? 'Kirim Koreksi'
                      : 'Submit Correction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
