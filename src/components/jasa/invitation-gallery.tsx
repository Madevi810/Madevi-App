'use client';

/**
 * InvitationGallery — Jasa Undangan Nikah (Prompt 06)
 * Galeri template publik + harga tetap Madevi + buka form order.
 * Dipercantik dengan layout grid modern.
 */

import { useEffect, useState } from 'react';
import { RUNTIME_LAYOUT_CATALOG } from '@/content/service-catalog';
import { useLanguage } from '../theme-provider';
import { InvitationOrderForm } from './invitation-order-form';

interface Template {
  id: string;
  slug: string;
  name: string;
  description: string;
  formats: string[];
  price_starts_from: string;
  currency: string;
  cover_image_url: string;
  preview_url: string;
  isExample?: boolean;
}

const EXAMPLE_TEMPLATES: Template[] = RUNTIME_LAYOUT_CATALOG.map((item) => ({
  id: `example-${item.id}`,
  slug: `example-${item.id}`,
  name: item.title,
  description: item.summary,
  formats: ['Contoh lokal'],
  price_starts_from: String(item.price),
  currency: item.currency,
  cover_image_url: '',
  preview_url: '',
  isExample: true,
}));

export function InvitationGallery({ isId }: { isId: boolean }) {
  const { language } = useLanguage();
  const [templates, setTemplates] = useState<Template[] | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setError('');
        const res = await fetch('/api/v1/jasa/undangan', { cache: 'no-store' });
        const json = (await res.json()) as { data?: Template[] };
        if (!res.ok || !Array.isArray(json.data)) throw new Error('catalogue unavailable');
        if (!active) return;
         setTemplates(json.data.length > 0 ? json.data : EXAMPLE_TEMPLATES);
      } catch {
        if (!active) return;
        setTemplates([]);
        setError(isId ? 'Katalog template tidak dapat dimuat.' : 'The template catalogue could not be loaded.');
      }
    })();
    return () => {
      active = false;
    };
  }, [isId, reloadKey]);

  function formatPrice(t: Template) {
    const n = Number(t.price_starts_from ?? 0);
    if (!n) return isId ? 'Gratis' : 'Free';
    return new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: t.currency || 'IDR',
      maximumFractionDigits: 0,
    }).format(n);
  }

  if (templates === null) {
    return (
      <div className="invitation-gallery__grid" role="status" aria-label={isId ? 'Memuat katalog' : 'Loading catalog'}>
        <span className="sr-only">{isId ? 'Memuat pilihan undangan…' : 'Loading invitation choices…'}</span>
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="skeleton-card" aria-hidden="true" key={index}>
            <div className="skeleton skeleton-card__media" />
            <div className="skeleton-card__body">
              <div className="skeleton" style={{ width: '70%', height: '1.1rem' }} />
              <div className="skeleton" style={{ width: '95%', height: '0.9rem' }} />
              <div className="skeleton" style={{ width: '50%', height: '1.5rem', marginTop: '0.5rem' }} />
              <div className="skeleton" style={{ width: '100%', height: '2.5rem', borderRadius: '9999px', marginTop: 'auto' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="utility-empty-state" role="alert">
        <p>{error}</p>
        <button type="button" className="button button--small button--secondary" onClick={() => setReloadKey((key) => key + 1)}>
          {isId ? 'Muat ulang katalog' : 'Reload catalogue'}
        </button>
      </div>
    );
  }

  const showingExamples = templates.every((template) => template.isExample === true);

  if (templates.length === 0) {
    return (
      <section className="invitation-gallery__custom" aria-labelledby="custom-invitation-heading">
        <div>
          <p className="eyebrow">{isId ? 'Layanan tetap aktif' : 'Service remains active'}</p>
          <h3 id="custom-invitation-heading">
            {isId ? 'Belum ada template yang diterbitkan' : 'No templates have been published yet'}
          </h3>
          <p>
            {isId
              ? 'Jangan memesan dari contoh palsu. Anda tetap dapat mengirim brief undangan custom; Owner akan memilih atau menyiapkan layout setelah meninjau kebutuhan Anda.'
              : 'Do not order from a fabricated sample. You can still submit a custom invitation brief; the Owner will select or prepare a layout after reviewing your needs.'}
          </p>
        </div>
        <InvitationOrderForm
          isId={isId}
          templateName={isId ? 'Undangan custom' : 'Custom invitation'}
          templateLabel={isId ? 'Jenis pesanan' : 'Order type'}
        />
      </section>
    );
  }

  return (
    <div className="invitation-gallery">
      {showingExamples && (
        <div className="invitation-gallery__notice" role="note">
          <InfoIcon />
          <p>
            {isId
              ? 'Contoh layout lokal ditampilkan agar katalog tidak kosong. Contoh ini hanya untuk pratinjau dan belum dapat dipesan; template terbit akan muncul setelah disahkan Owner.'
              : 'Local layout examples are shown so the catalogue is not blank. They are preview-only and cannot be ordered; published templates appear after Owner approval.'}
          </p>
        </div>
      )}
      <div className="invitation-gallery__notice">
        <InfoIcon />
        <p>
          {isId
            ? 'Pratinjau adalah contoh tata letak — bukan hasil final Anda. Hasil disesuaikan dengan data acara Anda setelah persetujuan dan tidak ada watermark.'
            : 'Previews are layout samples — not your final result. The result is tailored to your event data after approval with no watermarks.'}
        </p>
      </div>
      <div className="invitation-gallery__grid">
        {templates.map((t) => (
          <article 
            key={t.id} 
            className="invitation-card"
          >
            {t.cover_image_url ? (
              <img src={t.cover_image_url} alt={t.name} className="invitation-card__img" />
            ) : (
              <div className="invitation-card__placeholder" aria-hidden="true">
                <InvitationGlyph />
              </div>
            )}
            
            <div className="invitation-card__body">
              <div className="invitation-card__heading">
                <h3>{t.name}</h3>
              </div>
              
              <p className="invitation-card__description">
                {t.description}
              </p>
              
              <div className="invitation-card__formats">
                {t.formats.map((fmt) => (
                  <span key={fmt} className="invitation-card__format">
                    {fmt}
                  </span>
                ))}
              </div>
              
              <div className="invitation-card__price-row">
                <p className="invitation-card__price">{t.isExample ? (isId ? 'Contoh lokal' : 'Local example') : formatPrice(t)}</p>
              </div>

              <div className="invitation-card__actions">
                {t.preview_url && !t.isExample && (
                  <a href={t.preview_url} target="_blank" rel="noopener noreferrer" className="button button--small button--secondary">
                    {isId ? 'Preview' : 'Preview'}
                  </a>
                )}
                {!t.isExample && (
                  <button type="button" className="button button--small button--primary" onClick={() => setActiveSlug(activeSlug === t.slug ? null : t.slug)}>
                    {isId ? 'Pilih & pesan' : 'Select & order'}
                  </button>
                )}
              </div>
              
                {activeSlug === t.slug && (
                <div className="invitation-card__order">
                  <InvitationOrderForm isId={isId} templateId={t.id} templateName={t.name} />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function InvitationGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6.5h16v11H4zM4 7l8 5 8-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 4.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
