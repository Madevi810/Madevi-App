'use client';

import { useState } from 'react';
import { csrfHeaders } from '../csrf-token';

const CATEGORIES = [
  'UNDANGAN_CUSTOM',
  'LOGO_CUSTOM',
  'CV_PORTFOLIO',
  'CERTIFICATE',
  'PHOTO_EDIT',
  'LAYOUT_CUSTOM',
  'LAINNYA',
] as const;

type Category = (typeof CATEGORIES)[number];

const CATEGORY_LABEL: Record<Category, { id: string; en: string }> = {
  UNDANGAN_CUSTOM: { id: 'Undangan', en: 'Invitation' },
  LOGO_CUSTOM: { id: 'Logo & Banner', en: 'Logo & Banner' },
  CV_PORTFOLIO: { id: 'CV & Portofolio', en: 'CV & Portfolio' },
  CERTIFICATE: { id: 'Sertifikat', en: 'Certificate' },
  PHOTO_EDIT: { id: 'Edit Foto', en: 'Photo Edit' },
  LAYOUT_CUSTOM: { id: 'Layout Custom', en: 'Custom Layout' },
  LAINNYA: { id: 'Lainnya', en: 'Other' },
};

export function CustomOrderForm({ isId }: { isId: boolean }) {
  const [category, setCategory] = useState<Category>('UNDANGAN_CUSTOM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [refUrl, setRefUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ id: string; secret_token: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResult(null);
    if (title.trim().length < 3 || description.trim().length < 20) {
      setError(
        isId
          ? 'Judul minimal 3 karakter dan deskripsi minimal 20 karakter.'
          : 'Title needs 3+ characters and description 20+ characters.',
      );
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/v1/jasa/custom', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({
          category,
          title: title.trim(),
          description: description.trim(),
          referenceUrls: refUrl.trim() ? [refUrl.trim()] : [],
        }),
      });
      const json = (await res.json()) as {
        data?: { id: string; secret_token: string };
        error?: { message?: string };
      };
      if (!res.ok || !json.data) {
        setError(json.error?.message ?? (isId ? 'Gagal mengirim.' : 'Failed to submit.'));
        return;
      }
      setResult(json.data);
    } catch {
      setError(isId ? 'Gagal mengirim.' : 'Failed to submit.');
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    const privateUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/jasa/order?token=${result.secret_token}&kind=CUSTOM_DESIGN`
        : `/jasa/order?token=${result.secret_token}&kind=CUSTOM_DESIGN`;

    return (
      <article className="custom-order-form__result" role="status" aria-live="polite">
        <span className="custom-order-form__result-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <div className="custom-order-form__result-copy">
          <h3>{isId ? 'Brief terkirim' : 'Brief submitted'}</h3>
          <p>
            {isId
              ? 'Menunggu pemeriksaan Admin. Harga ditetapkan Madevi setelah brief diperiksa secara menyeluruh. Tim kami akan segera meninjau pesanan Anda.'
              : 'Pending Admin review. Madevi sets the price after reviewing the brief thoroughly. Our team will review your order soon.'}
          </p>
        </div>

        <section className="custom-order-form__private-link" aria-labelledby="custom-order-private-link-title">
          <h4 id="custom-order-private-link-title">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {isId ? 'Tautan private Anda (rahasia)' : 'Your private link (secret)'}
          </h4>
          <a className="custom-order-form__private-url" href={privateUrl}>
            {privateUrl}
          </a>
          <p className="custom-order-form__private-note">
            {isId ? 'Simpan tautan ini untuk melacak status pesanan Anda.' : 'Save this link to track your order status.'}
          </p>
        </section>
      </article>
    );
  }

  return (
    <form className="info-form custom-order-form" onSubmit={submit} aria-busy={busy}>
      <fieldset className="custom-order-form__categories">
        <legend>{isId ? 'Kategori jasa' : 'Service category'}</legend>
        <div className="custom-order-form__category-list">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={`custom-order-form__category${category === item ? ' custom-order-form__category--selected' : ''}`}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {isId ? CATEGORY_LABEL[item].id : CATEGORY_LABEL[item].en}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="info-form__field custom-order-form__field" htmlFor="title-input">
        <span>{isId ? 'Judul kebutuhan' : 'Requirement title'}</span>
        <input
          id="title-input"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
          minLength={3}
          maxLength={200}
          placeholder={isId ? 'Misal: Desain Undangan Pernikahan Tema Rustic' : 'e.g: Rustic Wedding Invitation Design'}
        />
      </label>

      <label className="info-form__field custom-order-form__field" htmlFor="desc-input">
        <span>
          {isId ? 'Deskripsi detail brief' : 'Detailed brief description'}
          <small>{isId ? 'Minimal 20 karakter' : 'At least 20 characters'}</small>
        </span>
        <textarea
          id="desc-input"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          required
          minLength={20}
          maxLength={8000}
          rows={5}
          placeholder={isId ? 'Jelaskan visi, warna, konten utama, dan referensi yang Anda inginkan...' : 'Describe your vision, colors, main content, and desired references...'}
        />
      </label>

      <label className="info-form__field custom-order-form__field" htmlFor="url-input">
        <span>{isId ? 'URL referensi (opsional)' : 'Reference URL (optional)'}</span>
        <span className="custom-order-form__url-control">
          <svg className="custom-order-form__url-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <input
            id="url-input"
            value={refUrl}
            onChange={(e) => setRefUrl(e.currentTarget.value)}
            type="url"
            placeholder="https://…"
          />
        </span>
      </label>

      <aside className="custom-order-form__notice" aria-label={isId ? 'Informasi penawaran' : 'Quote information'}>
        <p>
          {isId
            ? 'Madevi akan menerbitkan penawaran berisi harga, ruang lingkup, batas revisi, dan hasil sebelum pekerjaan dimulai. Harga tidak akan berubah tanpa persetujuan Anda.'
            : 'Madevi will issue a quote with price, scope, revision limit, and deliverables before work starts. The price will not change without your approval.'}
        </p>
      </aside>

      {error && (
        <p className="info-form__status info-form__status--error custom-order-form__status" role="alert">
          {error}
        </p>
      )}

      <button className="button button--primary custom-order-form__submit" disabled={busy} type="submit">
        {busy ? (
          <>
            <svg className="custom-order-form__spinner" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
            <span>{isId ? 'Mengirim...' : 'Sending...'}</span>
          </>
        ) : (
          <>
            <span>{isId ? 'Kirim brief & dapatkan penawaran' : 'Submit brief & get quote'}</span>
            <svg className="custom-order-form__submit-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
