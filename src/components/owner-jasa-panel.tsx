'use client';

/**
 * OwnerJasaPanel — manajemen Jasa & Undangan (Prompt 06, sisi Admin)
 *
 * Kontrak:
 *  - Admin tambah/edit/terbit/arsip template undangan.
 *  - Admin lihat semua order undangan + logo, dan transisi status
 *    sesuai alur: PENDING_APPROVAL -> APPROVED -> IN_REVISION -> COMPLETED.
 *  - Admin tetapkan harga disepakati (priceAgreed).
 *  - Tidak ada <select>; transisi memakai capsule.
 */

import { useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';

interface TemplateRow {
  id: string;
  slug: string;
  name: string;
  lifecycle_status: string;
  price_starts_from: string;
  sort_order: number;
  updated_at: string;
}
interface InvitationRow {
  id: string;
  groom_name: string;
  bride_name: string;
  city: string;
  package_format: string;
  status: string;
  revision_count: number;
  price_agreed: string | null;
  event_date: string | null;
}
interface LogoRow {
  id: string;
  kind: string;
  title: string;
  status: string;
  revision_count: number;
  price_agreed: string | null;
}
interface ServiceRow {
  id: string;
  kind: string;
  status: string;
  revision_count: number;
  revision_limit: number;
  price_snapshot: {
    snapshotPrice?: number;
    serviceTitle?: string;
    pricingStatus?: 'FIXED' | 'QUOTE_PENDING' | 'QUOTED';
  } | null;
  principal_username: string | null;
  created_at: string;
}

const NEXT_STATUS: Record<string, string[]> = {
  PENDING_APPROVAL: ['APPROVED', 'REJECTED'],
  APPROVED: ['IN_REVISION', 'COMPLETED'],
  IN_REVISION: ['COMPLETED', 'APPROVED'],
};

const STATUS_LABEL: Record<string, string> = {
  PENDING_APPROVAL: 'Menunggu Persetujuan',
  APPROVED: 'Disetujui',
  IN_REVISION: 'Dalam Revisi',
  COMPLETED: 'Selesai',
  REJECTED: 'Ditolak',
  ARCHIVED: 'Diarsipkan',
};

const TEMPLATE_FORMATS = ['ONLINE', 'PRINT'] as const;

const EMPTY_TEMPLATE_DRAFT = {
  slug: '',
  name: '',
  description: '',
  priceStartsFrom: '0',
  coverImageUrl: '',
  previewUrl: '',
  sortOrder: '0',
};

function csrf() {
  const prefix = 'madevi_owner_csrf=';
  const item = document.cookie
    .split(';')
    .map((v) => v.trim())
    .find((v) => v.startsWith(prefix));
  return item ? decodeURIComponent(item.slice(prefix.length)) : '';
}

export function OwnerJasaPanel({ isId }: { isId: boolean }) {
  const { language } = useLanguage();
  const lang = language === 'id' ? 'id' : 'en';
  const [tab, setTab] = useState<'TEMPLATE' | 'UNDANGAN' | 'LOGO' | 'SERVICE'>('TEMPLATE');
  const [templates, setTemplates] = useState<TemplateRow[] | null>(null);
  const [templatesLoadError, setTemplatesLoadError] = useState('');
  const [invitations, setInvitations] = useState<InvitationRow[] | null>(null);
  const [logos, setLogos] = useState<LogoRow[] | null>(null);
  const [serviceOrders, setServiceOrders] = useState<ServiceRow[] | null>(null);
  const [ordersLoadError, setOrdersLoadError] = useState('');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');
  const [quoteByOrderId, setQuoteByOrderId] = useState<Record<string, string>>({});
  const [templateEditorOpen, setTemplateEditorOpen] = useState(false);
  const [templateDraft, setTemplateDraft] = useState(EMPTY_TEMPLATE_DRAFT);
  const [templateFormats, setTemplateFormats] = useState<Array<(typeof TEMPLATE_FORMATS)[number]>>([
    'ONLINE',
  ]);

  async function loadTemplates() {
    setTemplatesLoadError('');
    try {
      const r = await fetch('/api/v1/admin/jasa/templates', { cache: 'no-store' });
      const j = (await r.json()) as { data?: TemplateRow[] };
      if (!r.ok || !Array.isArray(j.data)) throw new Error('template catalogue unavailable');
      setTemplates(j.data ?? []);
    } catch {
      setTemplates(null);
      setTemplatesLoadError(
        language === 'id'
          ? 'Katalog template tidak dapat dimuat. Periksa sesi Owner atau koneksi layanan.'
          : 'The template catalogue could not be loaded. Check the Owner session or service connection.',
      );
    }
  }
  async function loadInvitations() {
    try {
      const r = await fetch('/api/v1/admin/jasa/orders?kind=UNDANGAN', { cache: 'no-store' });
      const j = (await r.json()) as { data?: InvitationRow[] };
      if (!r.ok || !Array.isArray(j.data)) throw new Error('invitation orders unavailable');
      setInvitations(j.data);
    } catch {
      setInvitations(null);
      setOrdersLoadError(
        language === 'id'
          ? 'Daftar undangan tidak dapat dimuat. Periksa sesi Owner atau koneksi layanan.'
          : 'The invitation list could not be loaded. Check the Owner session or service connection.',
      );
    }
  }
  async function loadLogos() {
    try {
      const r = await fetch('/api/v1/admin/jasa/orders?kind=LOGO', { cache: 'no-store' });
      const j = (await r.json()) as { data?: LogoRow[] };
      if (!r.ok || !Array.isArray(j.data)) throw new Error('logo orders unavailable');
      setLogos(j.data);
    } catch {
      setLogos(null);
      setOrdersLoadError(
        language === 'id'
          ? 'Daftar logo tidak dapat dimuat. Periksa sesi Owner atau koneksi layanan.'
          : 'The logo list could not be loaded. Check the Owner session or service connection.',
      );
    }
  }

  // L04 AC3/AC5: antrean order generik (CUSTOM_DESIGN/PCB_LAYOUT/LAYOUT).
  // Tanpa URL file privat: hanya ringkasan + status + transisi.
  async function loadServiceOrders() {
    try {
      const r = await fetch('/api/v1/admin/jasa/orders?kind=SERVICE', { cache: 'no-store' });
      const j = (await r.json()) as { data?: ServiceRow[] };
      if (!r.ok || !Array.isArray(j.data)) throw new Error('service orders unavailable');
      setServiceOrders(j.data);
    } catch {
      setServiceOrders(null);
      setOrdersLoadError(
        language === 'id'
          ? 'Daftar order layanan tidak dapat dimuat. Periksa sesi Owner atau koneksi layanan.'
          : 'The service order list could not be loaded. Check the Owner session or service connection.',
      );
    }
  }

  useEffect(() => {
    loadTemplates();
    loadInvitations();
    loadLogos();
    loadServiceOrders();
  }, []);

  async function transition(
    kind: 'UNDANGAN' | 'LOGO' | 'SERVICE',
    id: string,
    status: string,
    priceAgreed?: number,
  ) {
    setError('');
    setBusyId(id);
    try {
      const r = await fetch(`/api/v1/admin/jasa/orders/${id}/transition`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json', 'x-csrf-token': csrf() },
        body: JSON.stringify({ kind, nextStatus: status, ...(priceAgreed === undefined ? {} : { priceAgreed }) }),
      });
      const j = (await r.json()) as { error?: { message?: string } };
      if (!r.ok) {
        setError(j.error?.message ?? (isId ? 'Transisi gagal.' : 'Transition failed.'));
      } else {
        if (kind === 'UNDANGAN') loadInvitations();
        else if (kind === 'LOGO') loadLogos();
        else loadServiceOrders();
      }
    } catch {
      setError(isId ? 'Layanan lokal tidak dapat dihubungi.' : 'Local service unavailable.');
    } finally {
      setBusyId('');
    }
  }

  async function setLifecycle(id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') {
    setError('');
    setBusyId(id);
    try {
      const r = await fetch(`/api/v1/admin/jasa/templates/${id}?status=${status}`, {
        method: 'PUT',
        headers: { 'x-csrf-token': csrf() },
      });
      const j = (await r.json()) as { error?: { message?: string } };
      if (!r.ok) {
        setError(
          j.error?.message ?? (isId ? 'Gagal mengubah status.' : 'Failed to change status.'),
        );
      } else {
        loadTemplates();
      }
    } catch {
      setError(isId ? 'Layanan lokal tidak dapat dihubungi.' : 'Local service unavailable.');
    } finally {
      setBusyId('');
    }
  }

  function updateTemplateDraft(key: keyof typeof EMPTY_TEMPLATE_DRAFT, value: string) {
    setTemplateDraft((current) => ({ ...current, [key]: value }));
  }

  function toggleTemplateFormat(format: (typeof TEMPLATE_FORMATS)[number]) {
    setTemplateFormats((current) =>
      current.includes(format)
        ? current.length === 1
          ? current
          : current.filter((item) => item !== format)
        : [...current, format],
    );
  }

  async function createTemplate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const slug = templateDraft.slug.trim().toLowerCase();
    const name = templateDraft.name.trim();
    const priceStartsFrom = Number(templateDraft.priceStartsFrom);
    const sortOrder = Number(templateDraft.sortOrder);
    setError('');

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError(t('Slug gunakan huruf kecil, angka, dan tanda hubung.', 'Use lowercase letters, numbers, and hyphens in the slug.'));
      return;
    }
    if (name.length < 3) {
      setError(t('Nama template minimal 3 karakter.', 'Template name needs at least 3 characters.'));
      return;
    }
    if (!Number.isFinite(priceStartsFrom) || priceStartsFrom < 0 || !Number.isFinite(sortOrder)) {
      setError(t('Harga dan urutan harus bernilai valid.', 'Price and order must be valid values.'));
      return;
    }

    setBusyId('template:create');
    try {
      const response = await fetch('/api/v1/admin/jasa/templates', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csrf-token': csrf() },
        body: JSON.stringify({
          slug,
          name,
          description: templateDraft.description.trim(),
          formats: templateFormats,
          priceStartsFrom,
          coverImageUrl: templateDraft.coverImageUrl.trim(),
          previewUrl: templateDraft.previewUrl.trim(),
          sortOrder,
        }),
      });
      const payload = (await response.json()) as { error?: { message?: string } };
      if (!response.ok) {
        setError(payload.error?.message ?? t('Template tidak dapat dibuat.', 'The template could not be created.'));
        return;
      }
      setTemplateDraft(EMPTY_TEMPLATE_DRAFT);
      setTemplateFormats(['ONLINE']);
      setTemplateEditorOpen(false);
      loadTemplates();
    } catch {
      setError(t('Layanan lokal tidak dapat dihubungi.', 'Local service unavailable.'));
    } finally {
      setBusyId('');
    }
  }

  const t = (idTxt: string, enTxt: string) => (lang === 'id' ? idTxt : enTxt);

  return (
    <section className="owner-panel">
      <h2>{t('Jasa: Undangan & Logo/Banner', 'Services: Invitations & Logo/Banner')}</h2>
      <p className="owner-panel__hint">
        {t(
          'Terbitkan template, kemudian tangani order. Jasa custom harus memiliki penawaran harga eksplisit sebelum dapat disetujui; nilai Rp0 tanpa quote bukan “Gratis”.',
          'Publish templates, then handle orders. Custom services need an explicit price quote before approval; a bare Rp0 is not “Free”.',
        )}
      </p>

      <div className="capsule-group" role="group" aria-label={t('Bagian', 'Section')}>
        {(
          [
            ['TEMPLATE', t('Template', 'Templates')],
            ['UNDANGAN', t('Order Undangan', 'Invitation Orders')],
            ['LOGO', t('Order Logo', 'Logo Orders')],
            ['SERVICE', t('Order Custom/PCB', 'Custom/PCB Orders')],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`capsule-btn${tab === id ? ' capsule-btn--active' : ''}`}
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
          >
            {label}
          </button>
        ))}
      </div>

      {ordersLoadError && (
        <p className="r5-software-detail__msg--error" role="alert">
          {ordersLoadError}
        </p>
      )}

      {error && (
        <p className="r5-software-detail__msg--error" role="alert">
          {error}
        </p>
      )}

      {tab === 'TEMPLATE' && (
        <div className="owner-template-workspace">
          <div className="owner-template-workspace__header">
            <div>
              <h3>{t('Katalog template undangan', 'Invitation template catalogue')}</h3>
              <p>
                {t(
                  'Buat sebagai draft, periksa detailnya, lalu terbitkan saat sudah siap muncul pada galeri publik.',
                  'Create as a draft, review its details, then publish when it is ready for the public gallery.',
                )}
              </p>
            </div>
            <button
              type="button"
              className="button button--small"
              onClick={() => setTemplateEditorOpen((open) => !open)}
              aria-expanded={templateEditorOpen}
            >
              {templateEditorOpen ? t('Tutup editor', 'Close editor') : t('Buat template', 'Create template')}
            </button>
          </div>

          {templateEditorOpen && (
            <form className="owner-template-editor" onSubmit={(event) => void createTemplate(event)}>
              <div className="owner-template-editor__intro">
                <p className="eyebrow">{t('Template baru', 'New template')}</p>
                <p>
                  {t(
                    'Draft tidak akan tampil bagi pengguna sampai Anda menekan Terbit pada tabel.',
                    'A draft stays hidden from users until you select Publish in the table.',
                  )}
                </p>
              </div>
              <div className="owner-template-editor__grid">
                <label className="info-form__field">
                  <span>{t('Nama template', 'Template name')} *</span>
                  <input value={templateDraft.name} onChange={(event) => updateTemplateDraft('name', event.target.value)} required minLength={3} maxLength={120} />
                </label>
                <label className="info-form__field">
                  <span>{t('Slug URL', 'URL slug')} *</span>
                  <input value={templateDraft.slug} onChange={(event) => updateTemplateDraft('slug', event.target.value.toLowerCase())} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={120} placeholder="undangan-garden" />
                </label>
                <label className="info-form__field owner-template-editor__wide">
                  <span>{t('Deskripsi katalog', 'Catalogue description')}</span>
                  <textarea rows={3} value={templateDraft.description} onChange={(event) => updateTemplateDraft('description', event.target.value)} maxLength={2000} />
                </label>
                <label className="info-form__field">
                  <span>{t('Harga mulai (IDR)', 'Starting price (IDR)')}</span>
                  <input type="number" min={0} step="1" value={templateDraft.priceStartsFrom} onChange={(event) => updateTemplateDraft('priceStartsFrom', event.target.value)} required />
                </label>
                <label className="info-form__field">
                  <span>{t('Urutan katalog', 'Catalogue order')}</span>
                  <input type="number" step="1" value={templateDraft.sortOrder} onChange={(event) => updateTemplateDraft('sortOrder', event.target.value)} required />
                </label>
                <label className="info-form__field">
                  <span>{t('URL gambar cover', 'Cover image URL')}</span>
                  <input type="url" value={templateDraft.coverImageUrl} onChange={(event) => updateTemplateDraft('coverImageUrl', event.target.value)} placeholder="https://…" />
                </label>
                <label className="info-form__field">
                  <span>{t('URL pratinjau', 'Preview URL')}</span>
                  <input type="url" value={templateDraft.previewUrl} onChange={(event) => updateTemplateDraft('previewUrl', event.target.value)} placeholder="https://…" />
                </label>
              </div>
              <fieldset className="owner-template-editor__formats">
                <legend>{t('Format yang tersedia', 'Available formats')}</legend>
                {TEMPLATE_FORMATS.map((format) => (
                  <label key={format}>
                    <input type="checkbox" checked={templateFormats.includes(format)} onChange={() => toggleTemplateFormat(format)} />
                    <span>{format === 'ONLINE' ? t('Undangan online', 'Online invitation') : t('Cetak fisik', 'Physical print')}</span>
                  </label>
                ))}
              </fieldset>
              <div className="owner-template-editor__actions">
                <button type="submit" className="button button--small" disabled={busyId === 'template:create'}>
                  {busyId === 'template:create' ? t('Membuat draft…', 'Creating draft…') : t('Simpan sebagai draft', 'Save as draft')}
                </button>
                <button type="button" className="button button--small button--secondary" onClick={() => setTemplateEditorOpen(false)} disabled={busyId === 'template:create'}>
                  {t('Batal', 'Cancel')}
                </button>
              </div>
            </form>
          )}

          <div className="owner-table-wrap">
          {templatesLoadError ? (
            <div className="utility-empty-state" role="alert">
              <p>{templatesLoadError}</p>
              <button type="button" className="button button--small button--secondary" onClick={() => void loadTemplates()}>
                {t('Coba lagi', 'Try again')}
              </button>
            </div>
          ) : templates === null ? (
            <p className="rnav__status">{t('Memuat…', 'Loading…')}</p>
          ) : templates.length === 0 ? (
            <div className="utility-empty-state">
              <p>{t('Belum ada template. Buat draft pertama dari editor di atas.', 'No templates yet. Create the first draft in the editor above.')}</p>
            </div>
          ) : (
            <table className="owner-table">
              <thead>
                <tr>
                  <th>{t('Nama', 'Name')}</th>
                  <th>{t('Status', 'Status')}</th>
                  <th>{t('Harga katalog', 'Catalog price')}</th>
                  <th>{t('Aksi', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((tpl) => (
                  <tr key={tpl.id}>
                    <td>
                      <strong>{tpl.name}</strong>
                      <br />
                      <span className="r1-empty-hint">/{tpl.slug}</span>
                    </td>
                    <td>
                      <span className="r5-badge r5-badge--clean">{tpl.lifecycle_status}</span>
                    </td>
                    <td>{Number(tpl.price_starts_from ?? 0).toLocaleString(lang)}</td>
                    <td>
                      <div className="capsule-group">
                        {tpl.lifecycle_status !== 'PUBLISHED' && (
                          <button
                            type="button"
                            className="capsule-btn"
                            disabled={busyId === tpl.id}
                            onClick={() => setLifecycle(tpl.id, 'PUBLISHED')}
                          >
                            {t('Terbit', 'Publish')}
                          </button>
                        )}
                        {tpl.lifecycle_status === 'PUBLISHED' && (
                          <button
                            type="button"
                            className="capsule-btn"
                            disabled={busyId === tpl.id}
                            onClick={() => setLifecycle(tpl.id, 'ARCHIVED')}
                          >
                            {t('Arsip', 'Archive')}
                          </button>
                        )}
                        {tpl.lifecycle_status === 'ARCHIVED' && (
                          <button
                            type="button"
                            className="capsule-btn"
                            disabled={busyId === tpl.id}
                            onClick={() => setLifecycle(tpl.id, 'DRAFT')}
                          >
                            {t('Jadi draft', 'Make draft')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          </div>
        </div>
      )}

      {tab === 'UNDANGAN' && (
        <div className="owner-table-wrap">
          {invitations === null ? (
            <p className="rnav__status">{t('Memuat…', 'Loading…')}</p>
          ) : invitations.length === 0 ? (
            <p className="r1-empty-hint">
              {t('Belum ada order undangan.', 'No invitation orders yet.')}
            </p>
          ) : (
            <table className="owner-table">
              <thead>
                <tr>
                  <th>{t('Pasangan', 'Couple')}</th>
                  <th>{t('Paket', 'Package')}</th>
                  <th>{t('Status', 'Status')}</th>
                  <th>{t('Revisi', 'Revisions')}</th>
                  <th>{t('Aksi', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((o) => (
                  <tr key={o.id}>
                    <td>
                      {o.groom_name} &amp; {o.bride_name}
                      {o.city ? <br /> : null}
                      {o.city && <span className="r1-empty-hint">{o.city}</span>}
                    </td>
                    <td>{o.package_format}</td>
                    <td>
                      <span className="r5-badge r5-badge--clean">
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td>{o.revision_count}</td>
                    <td>
                      <div className="capsule-group">
                        {(NEXT_STATUS[o.status] ?? []).map((next) => (
                          <button
                            key={next}
                            type="button"
                            className="capsule-btn"
                            disabled={busyId === o.id}
                            onClick={() => transition('UNDANGAN', o.id, next)}
                          >
                            {STATUS_LABEL[next] ?? next}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'LOGO' && (
        <div className="owner-table-wrap">
          {logos === null ? (
            <p className="rnav__status">{t('Memuat…', 'Loading…')}</p>
          ) : logos.length === 0 ? (
            <p className="r1-empty-hint">{t('Belum ada order logo.', 'No logo orders yet.')}</p>
          ) : (
            <table className="owner-table">
              <thead>
                <tr>
                  <th>{t('Judul', 'Title')}</th>
                  <th>{t('Jenis', 'Kind')}</th>
                  <th>{t('Status', 'Status')}</th>
                  <th>{t('Aksi', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {logos.map((o) => (
                  <tr key={o.id}>
                    <td>{o.title}</td>
                    <td>{o.kind}</td>
                    <td>
                      <span className="r5-badge r5-badge--clean">
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td>
                      <div className="capsule-group">
                        {(NEXT_STATUS[o.status] ?? []).map((next) => (
                          <button
                            key={next}
                            type="button"
                            className="capsule-btn"
                            disabled={busyId === o.id}
                            onClick={() => transition('LOGO', o.id, next)}
                          >
                            {STATUS_LABEL[next] ?? next}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'SERVICE' && (
        <div className="owner-table-wrap">
          {serviceOrders === null ? (
            <p className="rnav__status">{t('Memuat…', 'Loading…')}</p>
          ) : serviceOrders.length === 0 ? (
            <p className="r1-empty-hint">
              {t('Belum ada order custom/PCB.', 'No custom/PCB orders yet.')}
            </p>
          ) : (
            <table className="owner-table">
              <thead>
                <tr>
                  <th>{t('Jenis', 'Kind')}</th>
                  <th>{t('Harga snapshot', 'Snapshot price')}</th>
                  <th>{t('Status', 'Status')}</th>
                  <th>{t('Revisi', 'Revisions')}</th>
                  <th>{t('Aksi', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {serviceOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong>{o.kind}</strong>
                      <br />
                      <span className="r1-empty-hint">
                        {o.price_snapshot?.serviceTitle ?? o.id.slice(0, 8)}
                      </span>
                    </td>
                    <td>
                      {o.price_snapshot?.pricingStatus === 'QUOTE_PENDING'
                        ? t('Menunggu penawaran', 'Quote pending')
                        : o.price_snapshot?.pricingStatus === 'FIXED' &&
                            o.price_snapshot?.snapshotPrice === 0
                          ? t('Gratis (katalog)', 'Free (catalog)')
                          : `Rp${Number(o.price_snapshot?.snapshotPrice ?? 0).toLocaleString(lang)}`}
                    </td>
                    <td>
                      <span className="r5-badge r5-badge--clean">
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td>
                      {o.revision_count}/{o.revision_limit}
                    </td>
                    <td>
                      <div className="owner-service-actions">
                        {o.status === 'PENDING_APPROVAL' &&
                          o.price_snapshot?.pricingStatus === 'QUOTE_PENDING' && (
                            <label className="owner-service-quote">
                              <span>{t('Harga quote (Rp)', 'Quote amount (IDR)')}</span>
                              <input
                                type="number"
                                inputMode="numeric"
                                min={0}
                                step={1}
                                value={quoteByOrderId[o.id] ?? ''}
                                onChange={(event) =>
                                  setQuoteByOrderId((current) => ({
                                    ...current,
                                    [o.id]: event.currentTarget.value,
                                  }))
                                }
                                placeholder="0"
                              />
                            </label>
                          )}
                        <div className="capsule-group">
                          {(NEXT_STATUS[o.status] ?? []).map((next) => (
                            <button
                              key={next}
                              type="button"
                              className="capsule-btn"
                              disabled={busyId === o.id}
                              onClick={() => {
                                if (
                                  next === 'APPROVED' &&
                                  o.price_snapshot?.pricingStatus === 'QUOTE_PENDING'
                                ) {
                                  const rawPrice = quoteByOrderId[o.id]?.trim() ?? '';
                                  const price = Number(rawPrice);
                                  if (!rawPrice || !Number.isSafeInteger(price) || price < 0) {
                                    setError(
                                      t(
                                        'Masukkan harga quote IDR berupa bilangan bulat 0 atau lebih sebelum menyetujui.',
                                        'Enter a whole-number IDR quote of 0 or more before approving.',
                                      ),
                                    );
                                    return;
                                  }
                                  void transition('SERVICE', o.id, next, price);
                                  return;
                                }
                                void transition('SERVICE', o.id, next);
                              }}
                            >
                              {STATUS_LABEL[next] ?? next}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}
