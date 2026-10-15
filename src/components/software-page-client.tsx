'use client';

import { useRouter } from 'next/navigation';
import { readCookie } from '@/lib/cookies';
import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';

interface Software {
  id: string;
  name: string;
  slug: string;
  developer: string;
  official_site: string;
  license_info: string;
  description: string;
}

interface VersionRow {
  id: string;
  version: string;
  release_date: string | null;
  changelog: string | null;
  requirements_system: string | null;
  scan_status: string;
  size_bytes: string | number | null;
}


export function SoftwarePageClient() {
  const router = useRouter();
  const { language } = useLanguage();
  const isId = language === 'id';
  const [items, setItems] = useState<Software[]>([]);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [versions, setVersions] = useState<Record<string, VersionRow[]>>({});
  const [rating, setRating] = useState<Record<string, string>>({});
  const [reportKind, setReportKind] = useState<Record<string, string>>({
    MALWARE: 'MALWARE',
  } as Record<string, string>);
  const [reportDesc, setReportDesc] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    const r = await fetch('/api/v1/software?limit=50');
    const j = await r.json();
    setItems(j.data?.items ?? []);
  }, []);
  // The loader updates state from an asynchronous API response.
  useEffect(() => {
    load();
  }, [load]);

  async function toggle(slug: string, id: string) {
    if (openSlug === slug) {
      setOpenSlug(null);
      return;
    }
    setOpenSlug(slug);
    try {
      const r = await fetch(`/api/v1/software/versions/${id}`);
      const j = await r.json();
      setVersions((prev) => ({ ...prev, [slug]: j.data?.items ?? [] }));
    } catch {
      /* abaikan */
    }
  }

  async function sendReview(slug: string, softwareId: string) {
    const score = Number(rating[slug] ?? 0);
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      setMessage(isId ? 'Rating 1–5.' : 'Rating 1–5.');
      return;
    }
    const r = await fetch(`/api/v1/software/${slug}/review`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-csrf-token': readCookie('madevi_csrf') },
      body: JSON.stringify({ softwareId, rating: score }),
    });
    if (r.status === 401) {
      router.push('/auth');
      return;
    }
    const j = await r.json();
    setMessage(j.error?.message ?? (isId ? 'Ulasan terkirim.' : 'Review sent.'));
  }

  async function downloadVersion(versionId: string) {
    setMessage('');
    try {
      const r = await fetch(`/api/v1/software/versions/${versionId}/download`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csrf-token': readCookie('madevi_csrf') },
      });
      if (r.status === 401) {
        router.push('/auth');
        return;
      }
      const j = await r.json();
      if (r.ok && j.data) {
        setMessage(
          isId
            ? 'Unduhan siap. Status pemeriksaan lokal berkas adalah CLEAN; pemindaian semantik penuh tidak diklaim.'
            : 'Download ready. Local file check is CLEAN; no full semantic scan is claimed.',
        );
      } else {
        setMessage(j.error?.message ?? (isId ? 'Unduhan gagal.' : 'Download failed.'));
      }
    } catch {
      setMessage(isId ? 'Gagal memulai unduhan (jaringan).' : 'Download failed (network).');
    }
  }

  async function sendReport(slug: string, softwareId: string) {
    const kind = reportKind[slug] ?? 'MALWARE';
    const r = await fetch(`/api/v1/software/${slug}/report`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-csrf-token': readCookie('madevi_csrf') },
      body: JSON.stringify({ softwareId, kind, description: (reportDesc[slug] ?? '').trim() }),
    });
    if (r.status === 401) {
      router.push('/auth');
      return;
    }
    const j = await r.json();
    if (j.error) {
      setMessage(j.error?.message ?? 'Gagal');
      return;
    }
    setMessage(
      isId
        ? 'Laporan terkirim. Risiko tinggi menonaktifkan unduhan sementara.'
        : 'Report sent. High risk temporarily disables downloads.',
    );
  }

  return (
    <div className="page-shell software-page">
      <h1>{isId ? 'Software' : 'Software'}</h1>
      <p className="shop-label">
        {isId
          ? 'Unduh butuh login. File gagal/berisiko tidak dapat diunduh.'
          : 'Login required to download. Failed/risky files cannot be downloaded.'}
      </p>
      {message && <p className="info-form__status">{message}</p>}
      {items.map((app) => (
        <article key={app.id} className="software-card">
          <header className="software-card__header">
            <div className="software-card__identity">
              <h2 className="software-card__name">{app.name}</h2>
              {app.developer && (
                <p className="software-card__developer">
                  <span className="software-card__meta-label">{isId ? 'Pengembang' : 'Developer'}</span>
                  <span className="software-card__meta-value">{app.developer}</span>
                </p>
              )}
            </div>
          </header>
          <p className="software-card__desc">{app.description}</p>
          {app.license_info && (
            <dl className="software-card__facts">
              <div>
                <dt>{isId ? 'Lisensi' : 'License'}</dt>
                <dd>{app.license_info}</dd>
              </div>
            </dl>
          )}
          <div className="shop-card__actions software-card__actions">
            {app.official_site && (
              <a
                href={app.official_site}
                target="_blank"
                rel="noopener noreferrer"
                className="button button--small button--secondary"
              >
                {isId ? 'Situs resmi' : 'Official site'}
              </a>
            )}
            <button
              type="button"
              className="button button--small button--secondary"
              onClick={() => void toggle(app.slug, app.id)}
            >
              {openSlug === app.slug
                ? isId
                  ? 'Tutup versi'
                  : 'Hide versions'
                : isId
                  ? 'Versi & unduhan'
                  : 'Versions & downloads'}
            </button>
          </div>
          {openSlug === app.slug && (
            <div className="software-versions">
              {(versions[app.slug] ?? []).map((v) => (
                <div key={v.id} className="software-version">
                  <p className="software-version__meta">
                    <strong>{v.version}</strong> ·{' '}
                    <span
                      className={`software-version__scan${
                        v.scan_status === 'CLEAN' ? ' software-version__scan--clean' : ''
                      }`}
                    >
                      {v.scan_status}
                    </span>
                    {v.release_date && <> · {new Date(v.release_date).toLocaleDateString()}</>}
                  </p>
                  {v.changelog && (
                    <p className="software-version__changelog">
                      {v.changelog}
                    </p>
                  )}
                  {v.scan_status === 'CLEAN' ? (
                    <button
                      type="button"
                      className="button button--small button--primary software-version__download"
                      onClick={() => void downloadVersion(v.id)}
                    >
                      <DownloadGlyph />
                      {isId ? 'Unduh berkas (status CLEAN)' : 'Download file (CLEAN status)'}
                    </button>
                  ) : (
                    <span className="software-version__locked">
                      <LockGlyph />
                      {isId
                        ? 'Dalam karantina / Tidak dapat diunduh'
                        : 'Quarantined / Cannot download'}
                    </span>
                  )}
                </div>
              ))}
              {(versions[app.slug] ?? []).length === 0 && (
                <p>{isId ? 'Belum ada versi aman.' : 'No safe versions yet.'}</p>
              )}
              <div className="software-review">
                <label>
                  {isId ? 'Rating (1–5)' : 'Rating (1–5)'}
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={rating[app.slug] ?? ''}
                    onChange={(e) => setRating((prev) => ({ ...prev, [app.slug]: e.target.value }))}
                  />
                </label>
                <button
                  type="button"
                  className="button button--small"
                  onClick={() => void sendReview(app.slug, app.id)}
                >
                  {isId ? 'Kirim ulasan' : 'Send review'}
                </button>
              </div>
              <div className="software-review">
                <div className="info-form__field">
                  <span>{isId ? 'Lapor' : 'Report'}</span>
                  <div
                    className="capsule-group"
                    role="group"
                    aria-label={isId ? 'Jenis laporan' : 'Report kind'}
                  >
                    {(
                      [
                        ['MALWARE', 'MALWARE'],
                        ['DAMAGED', isId ? 'RUSAK' : 'DAMAGED'],
                        ['LICENSE', isId ? 'LISENSI' : 'LICENSE'],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className={`capsule-btn${(reportKind[app.slug] ?? 'MALWARE') === value ? ' capsule-btn--active' : ''}`}
                        onClick={() => setReportKind((prev) => ({ ...prev, [app.slug]: value }))}
                        aria-pressed={(reportKind[app.slug] ?? 'MALWARE') === value}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={reportDesc[app.slug] ?? ''}
                  onChange={(e) =>
                    setReportDesc((prev) => ({ ...prev, [app.slug]: e.target.value }))
                  }
                  placeholder={isId ? 'Keterangan…' : 'Details…'}
                  maxLength={2000}
                />
                <button
                  type="button"
                  className="button button--small button--secondary"
                  onClick={() => void sendReport(app.slug, app.id)}
                >
                  {isId ? 'Lapor' : 'Report'}
                </button>
              </div>
            </div>
          )}
        </article>
      ))}
      {!items.length && <p>{isId ? 'Belum ada software' : 'No software yet'}</p>}
    </div>
  );
}

function DownloadGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 19h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}
