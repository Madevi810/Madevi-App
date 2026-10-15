'use client';

/**
 * CareerPanel — Karier (Prompt 06)
 * CV/Resume, Surat Lamaran, Portofolio. Form -> template -> export.
 * Dokumen tersimpan privat di workspace akun; ekspor dipakai bila ingin berbagi.
 */

import { useState } from 'react';
import { useCurrentUser } from './use-current-user';
import { csrfHeaders } from '../csrf-token';
import { CV_DOCUMENT_COLORS } from '@/lib/theme-values';

type CareerKind = 'CV' | 'LETTER' | 'PORTFOLIO';
type CareerTemplate = 'PROFESSIONAL' | 'EDITORIAL' | 'COMPACT';

interface CvData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  city: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
}

const EMPTY: CvData = {
  fullName: '',
  title: '',
  email: '',
  phone: '',
  city: '',
  summary: '',
  experience: '',
  education: '',
  skills: '',
};

const CAREER_TEMPLATES: Array<{
  id: CareerTemplate;
  labelId: string;
  labelEn: string;
  detailId: string;
  detailEn: string;
}> = [
  {
    id: 'PROFESSIONAL',
    labelId: 'Profesional',
    labelEn: 'Professional',
    detailId: 'Struktur formal dan mudah dipindai.',
    detailEn: 'Formal structure that is easy to scan.',
  },
  {
    id: 'EDITORIAL',
    labelId: 'Editorial',
    labelEn: 'Editorial',
    detailId: 'Ritme tipografi untuk peran kreatif.',
    detailEn: 'Typographic rhythm for creative roles.',
  },
  {
    id: 'COMPACT',
    labelId: 'Ringkas',
    labelEn: 'Compact',
    detailId: 'Padat untuk satu halaman.',
    detailEn: 'Compact for a single-page document.',
  },
];

export function CareerPanel({ isId }: { isId: boolean }) {
  const { loggedIn } = useCurrentUser();
  const [kind, setKind] = useState<CareerKind>('CV');
  const [template, setTemplate] = useState<CareerTemplate>('PROFESSIONAL');
  const [data, setData] = useState<CvData>(EMPTY);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof CvData>(key: K, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function exportHtml() {
    const doc = buildExportDocument(kind, template, data, isId);
    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kind.toLowerCase()}-${(data.fullName || 'dokumen').replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function printDocument() {
    setError('');
    const printable = window.open('', '_blank');
    if (!printable) {
      setError(isId ? 'Jendela cetak diblokir browser.' : 'The print window was blocked by the browser.');
      return;
    }
    printable.document.open();
    printable.document.write(buildExportDocument(kind, template, data, isId));
    printable.document.close();
    printable.focus();
    printable.print();
  }

  async function savePrivate() {
    if (!loggedIn) {
      setError(
        isId ? 'Login diperlukan untuk simpan privat.' : 'Login required to save privately.',
      );
      return;
    }
    setError('');
    try {
      const res = await fetch('/api/v1/utilities/workspace', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({
          kind: kind === 'PORTFOLIO' ? 'PORTOFOLIO' : 'CV',
          title: `${kind} — ${data.fullName || 'Tanpa nama'}`,
          input: { ...data, template, documentKind: kind },
          result: { exportedAt: new Date().toISOString() },
          isPrivate: true,
        }),
      });
      if (!res.ok) throw new Error('save failed');
      setSaved(true);
    } catch {
      setError(isId ? 'Gagal menyimpan.' : 'Failed to save.');
    }
  }

  const fields: Array<{ key: keyof CvData; labelId: string; labelEn: string; area?: boolean }> = [
    { key: 'fullName', labelId: 'Nama lengkap', labelEn: 'Full name' },
    { key: 'title', labelId: 'Judul / profesi', labelEn: 'Title / profession' },
    { key: 'email', labelId: 'Email', labelEn: 'Email' },
    { key: 'phone', labelId: 'Telepon', labelEn: 'Phone' },
    { key: 'city', labelId: 'Kota', labelEn: 'City' },
    { key: 'summary', labelId: 'Ringkasan diri', labelEn: 'Summary', area: true },
    { key: 'experience', labelId: 'Pengalaman', labelEn: 'Experience', area: true },
    { key: 'education', labelId: 'Pendidikan', labelEn: 'Education', area: true },
    { key: 'skills', labelId: 'Keahlian', labelEn: 'Skills', area: true },
  ];

  return (
    <div className="career-panel">
      <div
        className="capsule-group"
        role="group"
        aria-label={isId ? 'Jenis dokumen' : 'Document type'}
      >
        {(
          [
            ['CV', isId ? 'CV / Resume' : 'CV / Resume'],
            ['LETTER', isId ? 'Surat Lamaran' : 'Cover Letter'],
            ['PORTFOLIO', isId ? 'Portofolio' : 'Portfolio'],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            className={`capsule-btn${kind === k ? ' capsule-btn--active' : ''}`}
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
          >
            {label}
          </button>
        ))}
      </div>

      <fieldset className="career-panel__templates">
        <legend>{isId ? 'Gaya template' : 'Template style'}</legend>
        <div className="career-panel__template-grid">
          {CAREER_TEMPLATES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`career-template-card${template === item.id ? ' career-template-card--active' : ''}`}
              onClick={() => setTemplate(item.id)}
              aria-pressed={template === item.id}
            >
              <strong>{isId ? item.labelId : item.labelEn}</strong>
              <span>{isId ? item.detailId : item.detailEn}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="career-panel__form">
        {fields.map((f) => (
          <label key={f.key} className="info-form__field">
            <span>{isId ? f.labelId : f.labelEn}</span>
            {f.area ? (
              <textarea
                rows={4}
                value={data[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
              />
            ) : (
              <input
                type={f.key === 'email' ? 'email' : 'text'}
                value={data[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
              />
            )}
          </label>
        ))}
      </div>

      <p className="career-panel__privacy">
        {isId
          ? 'Simpan ke workspace selalu bersifat privat. Gunakan ekspor HTML atau cetak/simpan PDF untuk membagikan dokumen.'
          : 'Workspace saves are always private. Use HTML export or print/save PDF to share the document.'}
      </p>

      <div className="career-panel__actions">
        <button type="button" className="button button--small" onClick={exportHtml}>
          {isId ? 'Ekspor HTML' : 'Export HTML'}
        </button>
        <button type="button" className="button button--small button--secondary" onClick={printDocument}>
          {isId ? 'Cetak / simpan PDF' : 'Print / save PDF'}
        </button>
        <button
          type="button"
          className="button button--small button--secondary"
          onClick={() => void savePrivate()}
          disabled={!loggedIn}
          title={!loggedIn ? (isId ? 'Login untuk simpan' : 'Login to save') : undefined}
        >
          {isId ? 'Simpan ke workspace' : 'Save to workspace'}
        </button>
      </div>

      {error && (
        <p className="r5-software-detail__msg--error" role="alert">
          {error}
        </p>
      )}
      {saved && (
        <p className="r5-software-detail__msg">
          {isId
            ? 'Tersimpan privat di workspace — tidak diindeks publik.'
            : 'Saved privately in your workspace — not publicly indexed.'}
        </p>
      )}

      <details className="career-panel__preview" open>
        <summary>{isId ? 'Pratinjau langsung' : 'Live preview'}</summary>
        <div
          className="career-panel__preview-body"
          aria-live="polite"
          dangerouslySetInnerHTML={{ __html: buildDocument(kind, template, data, isId) }}
        />
      </details>
    </div>
  );
}

/** Bangun dokumen HTML sederhana (templates MDV sendiri). */
function buildDocument(kind: CareerKind, template: CareerTemplate, d: CvData, isId: boolean): string {
  const esc = (s: string) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const head = `<div class="cdoc__name">${esc(d.fullName || '—')}</div>
    <div class="cdoc__title">${esc(d.title || '')}</div>
    <div class="cdoc__contact">${esc(d.email)} · ${esc(d.phone)} · ${esc(d.city)}</div>`;

  if (kind === 'LETTER') {
    return `<div class="career-doc career-doc--${template.toLowerCase()}"><div class="cdoc__body"><p>${esc(d.summary || '')}</p><p>${esc(
      d.experience || '',
    )}</p></div></div>`;
  }

  return `<div class="career-doc career-doc--${template.toLowerCase()}">
    ${head}
    <div class="cdoc__body">
      <h4>${isId ? 'Ringkasan' : 'Summary'}</h4><p>${esc(d.summary || '—')}</p>
      <h4>${isId ? 'Pengalaman' : 'Experience'}</h4><p>${esc(d.experience || '—')}</p>
      <h4>${isId ? 'Pendidikan' : 'Education'}</h4><p>${esc(d.education || '—')}</p>
      <h4>${isId ? 'Keahlian' : 'Skills'}</h4><p>${esc(d.skills || '—')}</p>
    </div>
  </div>`;
}

function buildExportDocument(
  kind: CareerKind,
  template: CareerTemplate,
  data: CvData,
  isId: boolean,
) {
  return `<!doctype html>
<html lang="${isId ? 'id' : 'en'}"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(`${kind} — ${data.fullName || 'Madevi'}`)}</title>
<style>
  :root {
    --cdoc-ink: ${CV_DOCUMENT_COLORS.ink};
    --cdoc-paper: ${CV_DOCUMENT_COLORS.paper};
    --cdoc-accent: ${CV_DOCUMENT_COLORS.accent};
    --cdoc-muted: ${CV_DOCUMENT_COLORS.muted};
    --cdoc-body: ${CV_DOCUMENT_COLORS.body};
    --cdoc-editorial: ${CV_DOCUMENT_COLORS.editorialAccent};
    color: var(--cdoc-ink); background: var(--cdoc-paper); font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
  body { max-width: 760px; margin: 0 auto; padding: 48px 32px; }
  .career-doc { color: var(--cdoc-ink); }
  .cdoc__name { font-size: 30px; font-weight: 760; letter-spacing: -0.04em; }
  .cdoc__title { margin-top: 4px; color: var(--cdoc-accent); font-size: 15px; font-weight: 650; }
  .cdoc__contact { margin-top: 12px; color: var(--cdoc-muted); font-size: 13px; }
  .cdoc__body { margin-top: 28px; }
  .cdoc__body h4 { margin: 22px 0 6px; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; }
  .cdoc__body p { margin: 0; color: var(--cdoc-body); line-height: 1.65; white-space: pre-wrap; }
  .career-doc--editorial .cdoc__name { font-family: Georgia, serif; font-size: 38px; font-weight: 500; }
  .career-doc--editorial .cdoc__body h4 { color: var(--cdoc-editorial); }
  .career-doc--compact { font-size: 13px; }
  .career-doc--compact .cdoc__body { margin-top: 18px; }
  .career-doc--compact .cdoc__body h4 { margin-top: 14px; }
  @media print { body { max-width: none; padding: 0; } }
</style></head><body>${buildDocument(kind, template, data, isId)}</body></html>`;
}

function escapeHtml(value: string) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
