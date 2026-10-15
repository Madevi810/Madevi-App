'use client';

import Link from 'next/link';
import { readCookie } from '@/lib/cookies';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useLanguage } from '@/components/theme-provider';

interface ProductDetail {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  original_price: number;
  currency: string;
  stock_status: string;
  brand: string;
  category: string;
  subcategory: string;
  condition: string;
  source_description: string;
  owner_description: string;
  external_url: string;
  last_checked_at: string;
  partner_name?: string | null;
  partner_domain?: string | null;
  media?: ProductMedia[];
}

interface ProductMedia {
  id: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
}

interface ProductQuestion {
  id: string;
  authorLabel: string;
  questionText: string;
  answerText: string;
  createdAt: string;
  answeredAt: string | null;
}

function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 11.3c0 4.2-3.65 7.55-8.15 7.55-1.1 0-2.16-.2-3.12-.6L4 20l1.35-3.9A7.15 7.15 0 0 1 3.7 11.3c0-4.17 3.65-7.55 8.15-7.55S20 7.13 20 11.3Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.4 11.3h.01M11.85 11.3h.01M15.3 11.3h.01" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}

function SavedCartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5.5h2l1.35 8.1a1.8 1.8 0 0 0 1.78 1.5h7.84a1.8 1.8 0 0 0 1.74-1.33L20 8H7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 19.25h.01M17 19.25h.01" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13.5 5H19v5.5M11 13l8-8M19 13.5v4.25A1.25 1.25 0 0 1 17.75 19H6.25A1.25 1.25 0 0 1 5 17.75V6.25A1.25 1.25 0 0 1 6.25 5h4.25" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProductDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { language } = useLanguage();
  const isId = language === 'id';
  const askInputRef = useRef<HTMLTextAreaElement>(null);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [askText, setAskText] = useState('');
  const [questionOpen, setQuestionOpen] = useState(false);
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState('');
  const [notice, setNotice] = useState('');
  const [pendingAction, setPendingAction] = useState<'save' | 'ask' | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setMissing(false);
    setLoadError('');
    try {
      const response = await fetch(`/api/v1/ebelanja/products/${id}`, { cache: 'no-store' });
      if (response.status === 404) {
        setMissing(true);
        return;
      }
      const payload = (await response.json().catch(() => null)) as { data?: ProductDetail; error?: { message?: string } } | null;
      if (!response.ok) throw new Error(payload?.error?.message ?? (isId ? 'Produk belum dapat dimuat.' : 'The product could not be loaded.'));
      if (!payload?.data) {
        setMissing(true);
        return;
      }
      setProduct(payload.data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : (isId ? 'Produk belum dapat dimuat.' : 'The product could not be loaded.'));
    } finally {
      setLoading(false);
    }
  }, [id, isId]);

  useEffect(() => {
    void load();
  }, [load]);

  const loadQuestions = useCallback(async () => {
    setQuestionsLoading(true);
    setQuestionsError('');
    try {
      const response = await fetch(`/api/v1/ebelanja/products/${id}/questions`, { cache: 'no-store' });
      const payload = (await response.json().catch(() => null)) as { data?: ProductQuestion[]; error?: { message?: string } } | null;
      if (!response.ok) throw new Error(payload?.error?.message ?? (isId ? 'Tanya jawab belum dapat dimuat.' : 'Questions could not be loaded.'));
      setQuestions(Array.isArray(payload?.data) ? payload.data : []);
    } catch (error) {
      setQuestionsError(error instanceof Error ? error.message : (isId ? 'Tanya jawab belum dapat dimuat.' : 'Questions could not be loaded.'));
    } finally {
      setQuestionsLoading(false);
    }
  }, [id, isId]);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    if (questionOpen) askInputRef.current?.focus({ preventScroll: false });
  }, [questionOpen]);

  async function save() {
    setNotice('');
    setPendingAction('save');
    try {
      const response = await fetch('/api/v1/ebelanja/saved', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csrf-token': readCookie('madevi_csrf') },
        body: JSON.stringify({ productId: id }),
      });
      if (response.status === 401) {
        router.push('/auth');
        return;
      }
      const payload = (await response.json().catch(() => null)) as { data?: unknown; error?: { message?: string } } | null;
      setNotice(payload?.data ? (isId ? 'Produk disimpan.' : 'Product saved.') : (payload?.error?.message ?? (isId ? 'Produk tidak dapat disimpan.' : 'The product could not be saved.')));
    } catch {
      setNotice(isId ? 'Produk tidak dapat disimpan karena koneksi bermasalah.' : 'The product could not be saved because the connection failed.');
    } finally {
      setPendingAction(null);
    }
  }

  async function ask() {
    if (askText.trim().length < 10) {
      setNotice(isId ? 'Pertanyaan minimal 10 karakter.' : 'Your question needs at least 10 characters.');
      return;
    }
    setNotice('');
    setPendingAction('ask');
    try {
      const response = await fetch('/api/v1/ebelanja/questions', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csrf-token': readCookie('madevi_csrf') },
        body: JSON.stringify({ productId: id, message: askText.trim() }),
      });
      if (response.status === 401) {
        router.push('/auth');
        return;
      }
      const payload = (await response.json().catch(() => null)) as { data?: { created?: boolean; duplicate?: boolean }; error?: { message?: string } } | null;
      if (payload?.data?.created) {
        setAskText('');
        setQuestionOpen(false);
        setNotice(isId ? 'Pertanyaan diterima dan akan tampil setelah Owner menjawabnya.' : 'Question received and will appear once the Owner answers.');
      } else if (payload?.data?.duplicate) {
        setQuestionOpen(false);
        setNotice(isId ? 'Pertanyaan serupa sudah diterima. Tunggu jawaban Owner agar tidak membuat pengulangan.' : 'A similar question has already been received. Wait for the Owner response to avoid repetition.');
        void loadQuestions();
      } else {
        setNotice(payload?.error?.message ?? (isId ? 'Pertanyaan tidak dapat dikirim.' : 'The question could not be sent.'));
      }
    } catch {
      setNotice(isId ? 'Pertanyaan tidak dapat dikirim karena koneksi bermasalah.' : 'The question could not be sent because the connection failed.');
    } finally {
      setPendingAction(null);
    }
  }

  if (loading) {
    return (
      <div className="page-shell shop-detail shop-detail--state" role="status" aria-label={isId ? 'Memuat produk' : 'Loading product'}>
        <span className="sr-only">{isId ? 'Memuat catatan produk…' : 'Loading product record…'}</span>
        <div className="shop-detail__record" aria-hidden="true">
          <div className="skeleton" style={{ aspectRatio: '4 / 3', width: '100%' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="skeleton" style={{ width: '30%', height: '0.75rem' }} />
            <div className="skeleton" style={{ width: '85%', height: '1.75rem' }} />
            <div className="skeleton" style={{ width: '45%', height: '2rem', marginTop: '0.5rem' }} />
            <div className="skeleton" style={{ width: '100%', height: '0.9rem' }} />
            <div className="skeleton" style={{ width: '90%', height: '0.9rem' }} />
            <div className="skeleton" style={{ width: '100%', height: '2.75rem', borderRadius: '9999px', marginTop: '1rem' }} />
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page-shell shop-detail shop-detail--state">
        <section className="shop-page__error" role="alert">
          <div>
            <h1>{isId ? 'Produk belum dapat dimuat' : 'The product could not be loaded'}</h1>
            <p>{loadError}</p>
          </div>
          <button type="button" className="button button--secondary" onClick={() => void load()}>{isId ? 'Coba lagi' : 'Try again'}</button>
        </section>
      </div>
    );
  }

  if (missing || !product) {
    return (
      <div className="page-shell shop-detail shop-detail--state">
        <p>{isId ? 'Produk tidak ditemukan di katalog lokal.' : 'The product was not found in the local catalog.'}</p>
        <Link className="shop-detail__back-link" href="/belanja"><BackArrow />{isId ? 'Kembali ke katalog' : 'Back to catalog'}</Link>
      </div>
    );
  }

  const partner = product.partner_name ?? product.partner_domain ?? (isId ? 'Belum dicantumkan' : 'Not provided');
  const media = product.media?.length
    ? [...product.media].sort((a, b) => a.sortOrder - b.sortOrder)
    : product.image_url
      ? [{ id: 'primary', imageUrl: product.image_url, altText: product.title, sortOrder: 0 }]
      : [];
  const stockLabel = product.stock_status === 'IN_STOCK'
    ? (isId ? 'Tersedia menurut mitra' : 'Available according to partner')
    : product.stock_status === 'OUT_OF_STOCK'
      ? (isId ? 'Tidak tersedia menurut mitra' : 'Unavailable according to partner')
      : (isId ? 'Belum dikonfirmasi mitra' : 'Not confirmed by partner');
  const productId = product.id;

  function focusQuestion() {
    setQuestionOpen(true);
  }

  function trackBuyIntent() {
    const endpoint = `/api/v1/ebelanja/products/${productId}/track-click`;
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      navigator.sendBeacon(endpoint);
      return;
    }
    void fetch(endpoint, { method: 'POST', keepalive: true });
  }

  return (
    <div className="page-shell shop-detail">
      <nav className="taxonomy-breadcrumb" aria-label={isId ? 'Jejak halaman' : 'Breadcrumb'}>
        <Link href="/">{isId ? 'Beranda' : 'Home'}</Link><span aria-hidden="true">/</span><Link href="/belanja">Madevi Shop</Link><span aria-hidden="true">/</span><span aria-current="page">{product.title}</span>
      </nav>

      <header className="shop-detail__header">
        <Link
          href="/simpan"
          className="shop-detail__saved-shortcut"
          aria-label={isId ? 'Buka produk tersimpan' : 'Open saved products'}
          title={isId ? 'Simpanan' : 'Saved items'}
        >
          <SavedCartIcon />
        </Link>
        <div>
          <p className="eyebrow">{isId ? 'DETAIL BARANG' : 'PRODUCT DETAIL'}</p>
          <h1>{product.title}</h1>
          <p>{isId ? 'Informasi dari katalog Madevi.' : 'Information from the Madevi catalog.'}</p>
        </div>
      </header>

      <section className="shop-detail__record" aria-label={isId ? 'Informasi produk' : 'Product information'}>
        <section className="shop-detail__gallery" aria-label={isId ? 'Galeri foto produk' : 'Product photo gallery'}>
          {media.length ? (
            <div className="shop-detail__gallery-viewport">
              {media.map((item, index) => (
                <figure id={`product-media-${item.id}`} className="shop-detail__gallery-slide" key={item.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.altText || `${product.title} · ${index + 1}`} />
                </figure>
              ))}
            </div>
          ) : (
            <div className="shop-detail__img"><span aria-hidden="true">{product.brand?.[0] || 'P'}</span></div>
          )}
          {media.length > 1 ? (
            <nav className="shop-detail__gallery-nav" aria-label={isId ? 'Pilih foto produk' : 'Choose product photo'}>
              {media.map((item, index) => <a href={`#product-media-${item.id}`} key={item.id}>{isId ? `Foto ${index + 1}` : `Photo ${index + 1}`}</a>)}
            </nav>
          ) : null}
          <p className="shop-detail__image-note">{media.length > 1 ? (isId ? 'Geser foto untuk melihat setiap sudut produk.' : 'Swipe through photos to view each product angle.') : (isId ? 'Foto produk ditampilkan penuh tanpa dipotong.' : 'The product photo is shown in full without cropping.')}</p>
        </section>

        <div className="shop-detail__summary">
          <div className="shop-detail__decision">
            <p className="shop-detail__price">{formatPrice(product.original_price, product.currency, language)}</p>
            <p className={`shop-detail__stock shop-detail__stock--${product.stock_status.toLowerCase()}`}><span aria-hidden="true" />{stockLabel}</p>
          </div>
          <dl className="shop-detail__facts">
            <div><dt>{isId ? 'Merek' : 'Brand'}</dt><dd>{product.brand || '—'}</dd></div>
            <div><dt>{isId ? 'Kategori' : 'Category'}</dt><dd>{[product.category, product.subcategory].filter(Boolean).join(' / ') || '—'}</dd></div>
            <div><dt>{isId ? 'Kondisi' : 'Condition'}</dt><dd>{product.condition || '—'}</dd></div>
            <div><dt>{isId ? 'Mitra sumber' : 'Source partner'}</dt><dd>{partner}{product.partner_name && product.partner_domain ? ` · ${product.partner_domain}` : ''}</dd></div>
            <div><dt>{isId ? 'Terakhir dicek' : 'Last checked'}</dt><dd>{formatCheckedAt(product.last_checked_at, language)}</dd></div>
          </dl>
        </div>
      </section>

      {(product.source_description || product.owner_description) && (
        <section className="shop-detail__description" aria-label={isId ? 'Deskripsi produk' : 'Product description'}>
          <p className="eyebrow">{isId ? 'DESKRIPSI' : 'DESCRIPTION'}</p>
          <h2>{isId ? 'Tentang barang ini' : 'About this product'}</h2>
          {product.source_description && <p>{product.source_description}</p>}
          {product.owner_description && <p className="shop-detail__owner-note">{product.owner_description}</p>}
        </section>
      )}

      <section className="shop-detail__questions" aria-labelledby="shop-detail-questions-title">
        <header>
          <div>
            <p className="eyebrow">{isId ? 'TANYA & JAWAB' : 'QUESTIONS & ANSWERS'}</p>
            <h2 id="shop-detail-questions-title">{isId ? 'Jawaban untuk pertanyaan pengguna' : 'Answers to user questions'}</h2>
          </div>
          <span>{questions.length}</span>
        </header>
        {questionsLoading ? <p className="shop-detail__questions-state" role="status">{isId ? 'Memuat tanya jawab…' : 'Loading questions…'}</p> : null}
        {questionsError ? <p className="shop-detail__questions-state" role="alert">{questionsError}</p> : null}
        {!questionsLoading && !questionsError && !questions.length ? <p className="shop-detail__questions-state">{isId ? 'Belum ada pertanyaan yang sudah dijawab. Gunakan footer bila Anda membutuhkan klarifikasi baru.' : 'There are no answered questions yet. Use the footer if you need a new clarification.'}</p> : null}
        <ol className="shop-detail__question-list">
          {questions.map((question) => (
            <li key={question.id}>
              <article className="shop-detail__question">
                <p className="shop-detail__question-label">{question.authorLabel}</p>
                <h3>{question.questionText}</h3>
                <div>
                  <p className="shop-detail__answer-label">{isId ? 'Jawaban Admin' : 'Owner answer'}</p>
                  <p>{question.answerText}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>
      {notice && <p className="info-form__status shop-detail__notice" aria-live="polite">{notice}</p>}
      <footer className={`shop-detail__action-bar${questionOpen ? ' shop-detail__action-bar--composer' : ''}`} aria-label={isId ? 'Aksi barang' : 'Product actions'}>
        <div className="shop-detail__action-row">
          <button type="button" className="shop-detail__action shop-detail__action--ask" onClick={focusQuestion} aria-expanded={questionOpen} aria-controls="shop-detail-footer-question">
            <ChatIcon />
            <span>{isId ? 'Tanyakan barang' : 'Ask about item'}</span>
          </button>
          <button type="button" className="shop-detail__action shop-detail__action--save" onClick={() => void save()} disabled={pendingAction === 'save'}>
            <SavedCartIcon />
            <span>{pendingAction === 'save' ? (isId ? 'Menyimpan…' : 'Saving…') : (isId ? 'Simpan' : 'Save')}</span>
          </button>
          <a className="shop-detail__action shop-detail__action--buy" href={product.external_url} target="_blank" rel="noopener noreferrer sponsored" onClick={trackBuyIntent}>
            <ExternalLinkIcon />
            <span>{isId ? 'Beli langsung' : 'Buy now'}</span>
          </a>
        </div>
        <p className="shop-detail__affiliate-note">
          {isId
            ? `Tautan afiliasi — pembelian dilakukan di ${partner} (tautan eksternal), bukan di Madevi.`
            : `Affiliate link — purchase happens at ${partner} (external link), not on Madevi.`}
        </p>
        {questionOpen ? (
          <form id="shop-detail-footer-question" className="shop-detail__footer-question" onSubmit={(event) => { event.preventDefault(); void ask(); }}>
            <label htmlFor="shop-detail-question">{isId ? 'Pertanyaan baru · cek tanya jawab di atas agar tidak berulang' : 'New question · check the answers above first'}</label>
            <textarea ref={askInputRef} id="shop-detail-question" value={askText} onChange={(event) => setAskText(event.target.value)} rows={3} maxLength={1000} minLength={10} placeholder={isId ? 'Tulis pertanyaan yang belum terjawab (10–1000 karakter)…' : 'Ask an unanswered question (10–1000 chars)…'} />
            <div>
              <button type="button" className="button button--small button--secondary" onClick={() => setQuestionOpen(false)}>{isId ? 'Batal' : 'Cancel'}</button>
              <button type="submit" className="button button--small button--primary" disabled={pendingAction === 'ask'}>{pendingAction === 'ask' ? (isId ? 'Mengirim…' : 'Sending…') : (isId ? 'Kirim pertanyaan' : 'Send question')}</button>
            </div>
          </form>
        ) : null}
      </footer>
    </div>
  );
}

function formatPrice(value: number, currency: string, language: 'id' | 'en') {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `${currency} —`;
  try {
    return new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString(language === 'id' ? 'id-ID' : 'en-US')}`;
  }
}

function formatCheckedAt(value: string, language: 'id' | 'en') {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
