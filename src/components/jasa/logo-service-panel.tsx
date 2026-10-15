'use client';

/**
 * LogoServicePanel — Jasa Logo/Banner (Prompt 06)
 * Galeri + kontak + form private (ukuran, warna, gaya, referensi).
 * Admin mengirim preview/revisi dan tautan unduh akhir rahasia.
 */

import { useEffect, useState } from 'react';
import { DEFAULT_ACCENT_HEX } from '@/lib/theme-values';

interface LogoWork {
  id: string;
  kind: string;
  title: string;
  width_px: number | null;
  height_px: number | null;
  primary_color: string;
  style_note: string;
}

export function LogoServicePanel({ isId }: { isId: boolean }) {
  const [works, setWorks] = useState<LogoWork[] | null>(null);
  const [kind, setKind] = useState<'LOGO' | 'BANNER'>('LOGO');
  const [title, setTitle] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [color, setColor] = useState('');
  const [style, setStyle] = useState('');
  const [ref, setRef] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ secretToken: string } | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/v1/jasa/logo?gallery=1', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j: { data?: LogoWork[] }) => {
        if (active) setWorks(j.data ?? []);
      })
      .catch(() => {
        if (active) setWorks([]);
      });
    return () => {
      active = false;
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResult(null);
    if (!title.trim()) {
      setError(isId ? 'Judul wajib diisi.' : 'Title is required.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/v1/jasa/logo', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind,
          title,
          widthPx: width ? parseInt(width, 10) : undefined,
          heightPx: height ? parseInt(height, 10) : undefined,
          primaryColor: color,
          styleNote: style,
          referenceUrl: ref,
        }),
      });
      const json = (await res.json()) as {
        data?: { secretToken: string };
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
        ? `${window.location.origin}/jasa/undangan/order?token=${result.secretToken}`
        : `/jasa/undangan/order?token=${result.secretToken}`;
    return (
      <div className="rumus-result">
        <h3>{isId ? 'Permintaan terkirim' : 'Request submitted'}</h3>
        <p>{isId ? 'Status: Menunggu persetujuan Admin.' : 'Status: Pending Admin approval.'}</p>
        <h4>{isId ? 'Tautan private Anda (rahasia)' : 'Your private link (secret)'}</h4>
        <p className="invitation-link">
          <a href={privateUrl}>{privateUrl}</a>
        </p>
      </div>
    );
  }

  return (
    <div className="logo-service">
      <div className="logo-service__intro">
        <h2>{isId ? 'Jasa Logo & Banner' : 'Logo & Banner Service'}</h2>
        <p>
          {isId
            ? 'Madevi menetapkan harga setelah brief diperiksa. Setelah disetujui, Anda mengisi form private untuk ukuran, warna, gaya, dan referensi.'
            : 'Madevi sets the price after reviewing the brief. After approval, you fill a private form for size, color, style, and references.'}
        </p>
        <div className="logo-service__contact">
          <span>{isId ? 'Kontak Admin:' : 'Admin contact:'}</span>
          <a href="mailto:admin@madevi.local">admin@madevi.local</a>
        </div>
      </div>

      {/* Galeri karya selesai — kosong jujur sampai Admin menyelesaikan order */}
      <section
        className="logo-service__gallery"
        aria-label={isId ? 'Galeri karya' : 'Work gallery'}
      >
        <h3>{isId ? 'Galeri karya' : 'Work gallery'}</h3>
        {works === null ? (
          <p className="rnav__status">{isId ? 'Memuat galeri…' : 'Loading gallery…'}</p>
        ) : works.length === 0 ? (
          <p className="r1-empty-hint">
            {isId
              ? 'Belum ada contoh karya yang dipublikasikan.'
              : 'No published work samples yet.'}
          </p>
        ) : (
          <ul className="logo-works">
            {works.map((w) => (
              <li key={w.id} className="logo-work">
                <span
                  className="logo-work__swatch"
                  style={{ backgroundColor: w.primary_color || 'var(--accent)' }}
                  aria-hidden="true"
                />
                <span className="logo-work__title">{w.title}</span>
                <span className="logo-work__meta">
                  {w.kind}
                  {w.width_px && w.height_px ? ` · ${w.width_px}×${w.height_px}` : ''}
                </span>
                {w.style_note && <span className="logo-work__note">{w.style_note}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <form className="info-form" onSubmit={submit}>
        <div className="info-form__field">
          <span>{isId ? 'Jenis' : 'Kind'}</span>
          <div className="capsule-group" role="group" aria-label={isId ? 'Jenis' : 'Kind'}>
            {(
              [
                ['LOGO', isId ? 'Logo' : 'Logo'],
                ['BANNER', isId ? 'Banner' : 'Banner'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`capsule-btn${kind === value ? ' capsule-btn--active' : ''}`}
                onClick={() => setKind(value)}
                aria-pressed={kind === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <label className="info-form__field">
          <span>{isId ? 'Judul / nama' : 'Title / name'} *</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <div className="logo-service__dims">
          <label className="info-form__field">
            <span>{isId ? 'Lebar (px)' : 'Width (px)'}</span>
            <input
              type="number"
              inputMode="numeric"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </label>
          <label className="info-form__field">
            <span>{isId ? 'Tinggi (px)' : 'Height (px)'}</span>
            <input
              type="number"
              inputMode="numeric"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </label>
        </div>
        <label className="info-form__field">
          <span>{isId ? 'Warna utama' : 'Primary color'}</span>
          <input
            type="color"
            value={color || DEFAULT_ACCENT_HEX}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        <label className="info-form__field">
          <span>{isId ? 'Catatan gaya' : 'Style note'}</span>
          <textarea rows={3} value={style} onChange={(e) => setStyle(e.target.value)} />
        </label>
        <label className="info-form__field">
          <span>{isId ? 'URL referensi' : 'Reference URL'}</span>
          <input type="url" value={ref} onChange={(e) => setRef(e.target.value)} />
        </label>
        <button type="submit" className="button button--small" disabled={busy}>
          {busy
            ? isId
              ? 'Mengirim…'
              : 'Submitting…'
            : isId
              ? 'Kirim permintaan'
              : 'Submit request'}
        </button>
        {error && (
          <p className="r5-software-detail__msg--error" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
