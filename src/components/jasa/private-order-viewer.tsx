'use client';

/**
 * PrivateOrderViewer — lihat status order via secret token (Prompt 06).
 * Saat status APPROVED / IN_REVISION, pemilik token dapat mengisi form
 * private (data pasangan lengkap). Secret token adalah kredensialnya.
 */

import { useState } from 'react';

export interface InvitationOrder {
  id: string;
  status: string;
  groom_name: string;
  bride_name: string;
  event_date: string | Date | null;
  venue: string;
  city: string;
  note: string;
  package_format: string;
  public_slug: string | null;
  revision_count: number;
  template_name?: string;
}
export interface LogoOrder {
  id: string;
  status: string;
  kind: string;
  title: string;
  width_px: number | null;
  height_px: number | null;
  primary_color: string;
  style_note: string;
  reference_url: string;
  revision_count: number;
}

const STATUS_LABEL: Record<string, { id: string; en: string }> = {
  PENDING_APPROVAL: { id: 'Menunggu persetujuan Admin', en: 'Pending Admin approval' },
  APPROVED: { id: 'Disetujui', en: 'Approved' },
  IN_REVISION: { id: 'Dalam revisi', en: 'In revision' },
  COMPLETED: { id: 'Selesai', en: 'Completed' },
  REJECTED: { id: 'Ditolak', en: 'Rejected' },
  ARCHIVED: { id: 'Diarsipkan', en: 'Archived' },
};

export function PrivateOrderViewer({
  invitation,
  logo,
  hasToken,
  token,
  isId = true,
}: {
  invitation: InvitationOrder | null;
  logo: LogoOrder | null;
  hasToken: boolean;
  token?: string;
  isId?: boolean;
}) {
  const [editGroom, setEditGroom] = useState('');
  const [editBride, setEditBride] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editNote, setEditNote] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formOk, setFormOk] = useState('');

  function openForm() {
    if (!invitation) return;
    setEditGroom(invitation.groom_name || '');
    setEditBride(invitation.bride_name || '');
    setEditDate(invitation.event_date ? String(invitation.event_date).slice(0, 10) : '');
    setEditVenue(invitation.venue || '');
    setEditCity(invitation.city || '');
    setEditNote(invitation.note || '');
    setFormError('');
    setFormOk('');
    setFormOpen(true);
  }

  async function saveForm(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setFormError('');
    setFormOk('');
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/jasa/undangan/order/${token}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          groomName: editGroom,
          brideName: editBride,
          eventDate: editDate || undefined,
          venue: editVenue,
          city: editCity,
          note: editNote,
        }),
      });
      const json = (await res.json()) as {
        data?: { publicSlug?: string | null };
        error?: { message?: string };
      };
      if (!res.ok || !json.data) {
        setFormError(json.error?.message ?? (isId ? 'Gagal menyimpan.' : 'Failed to save.'));
        return;
      }
      setFormOk(
        isId
          ? 'Data tersimpan. Halaman undangan diperbarui.'
          : 'Details saved. The invitation page has been updated.',
      );
      if (json.data.publicSlug && invitation) {
        invitation.public_slug = json.data.publicSlug;
        invitation.groom_name = editGroom;
        invitation.bride_name = editBride;
      }
      setFormOpen(false);
    } catch {
      setFormError(isId ? 'Layanan lokal tidak dapat dihubungi.' : 'Local service unavailable.');
    } finally {
      setSaving(false);
    }
  }
  if (!hasToken) {
    return (
      <div className="r1-empty">
        <p className="r1-empty-title">{isId ? 'Akses private' : 'Private access'}</p>
        <p className="r1-empty-hint">
          {isId
            ? 'Gunakan tautan rahasia yang dikirim ke Anda.'
            : 'Use the secret link that was sent to you.'}
        </p>
      </div>
    );
  }

  if (!invitation && !logo) {
    return (
      <div className="r1-empty">
        <p className="r1-empty-title">{isId ? 'Order tidak ditemukan.' : 'Order not found.'}</p>
        <p className="r1-empty-hint">
          {isId ? 'Tautan tidak valid atau sudah diarsipkan.' : 'Link is invalid or archived.'}
        </p>
      </div>
    );
  }

  if (invitation) {
    const st = STATUS_LABEL[invitation.status] ?? { id: invitation.status, en: invitation.status };
    return (
      <article className="rumus-result">
        <h2>{isId ? 'Status pesanan undangan' : 'Invitation order status'}</h2>
        <p>
          <strong>{isId ? 'Pasangan' : 'Couple'}:</strong> {invitation.groom_name} &amp;{' '}
          {invitation.bride_name}
        </p>
        {invitation.template_name && (
          <p>
            <strong>{isId ? 'Template' : 'Template'}:</strong> {invitation.template_name}
          </p>
        )}
        <p>
          <strong>{isId ? 'Status' : 'Status'}:</strong> {isId ? st.id : st.en}
        </p>
        <p>
          <strong>{isId ? 'Paket' : 'Package'}:</strong> {invitation.package_format}
        </p>
        {invitation.venue && (
          <p>
            <strong>{isId ? 'Tempat' : 'Venue'}:</strong> {invitation.venue}, {invitation.city}
          </p>
        )}
        {invitation.public_slug &&
          (invitation.status === 'APPROVED' || invitation.status === 'COMPLETED') && (
            <p className="invitation-link">
              <a href={`/undangan/${invitation.public_slug}`}>
                {isId ? 'Buka halaman undangan online' : 'Open online invitation'}
              </a>
            </p>
          )}

        {(invitation.status === 'APPROVED' || invitation.status === 'IN_REVISION') && token && (
          <div className="private-form">
            {!formOpen ? (
              <button type="button" className="button button--small" onClick={openForm}>
                ✎ {isId ? 'Isi / perbarui data undangan' : 'Fill / update invitation details'}
              </button>
            ) : (
              <form className="info-form" onSubmit={saveForm}>
                <h4>{isId ? 'Form private' : 'Private form'}</h4>
                <label className="info-form__field">
                  <span>{isId ? 'Nama mempelai pria' : 'Groom name'}</span>
                  <input value={editGroom} onChange={(e) => setEditGroom(e.target.value)} />
                </label>
                <label className="info-form__field">
                  <span>{isId ? 'Nama mempelai wanita' : 'Bride name'}</span>
                  <input value={editBride} onChange={(e) => setEditBride(e.target.value)} />
                </label>
                <label className="info-form__field">
                  <span>{isId ? 'Tanggal acara' : 'Event date'}</span>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                </label>
                <label className="info-form__field">
                  <span>{isId ? 'Tempat' : 'Venue'}</span>
                  <input value={editVenue} onChange={(e) => setEditVenue(e.target.value)} />
                </label>
                <label className="info-form__field">
                  <span>{isId ? 'Kota' : 'City'}</span>
                  <input value={editCity} onChange={(e) => setEditCity(e.target.value)} />
                </label>
                <label className="info-form__field">
                  <span>{isId ? 'Catatan' : 'Note'}</span>
                  <textarea
                    rows={3}
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                  />
                </label>
                <div className="pdf-panel__actions">
                  <button type="submit" className="button button--small" disabled={saving}>
                    {saving ? (isId ? 'Menyimpan…' : 'Saving…') : isId ? 'Simpan' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="button button--small button--secondary"
                    onClick={() => setFormOpen(false)}
                  >
                    {isId ? 'Batal' : 'Cancel'}
                  </button>
                </div>
                {formError && (
                  <p className="r5-software-detail__msg--error" role="alert">
                    {formError}
                  </p>
                )}
                {formOk && <p className="r5-software-detail__msg">{formOk}</p>}
              </form>
            )}
          </div>
        )}
      </article>
    );
  }

  const logoOrder = logo as LogoOrder;
  const st = STATUS_LABEL[logoOrder.status] ?? { id: logoOrder.status, en: logoOrder.status };
  return (
    <article className="rumus-result">
      <h2>{isId ? 'Status pesanan logo/banner' : 'Logo/banner order status'}</h2>
      <p>
        <strong>{isId ? 'Judul' : 'Title'}:</strong> {logoOrder.title}
      </p>
      <p>
        <strong>{isId ? 'Jenis' : 'Kind'}:</strong> {logoOrder.kind}
      </p>
      <p>
        <strong>{isId ? 'Status' : 'Status'}:</strong> {isId ? st.id : st.en}
      </p>
      {(logoOrder.width_px || logoOrder.height_px) && (
        <p>
          <strong>{isId ? 'Ukuran' : 'Size'}:</strong> {logoOrder.width_px ?? '?'} ×{' '}
          {logoOrder.height_px ?? '?'} px
        </p>
      )}
      {logoOrder.primary_color && (
        <p>
          <strong>{isId ? 'Warna' : 'Color'}:</strong> {logoOrder.primary_color}
        </p>
      )}
      {logoOrder.style_note && (
        <p>
          <strong>{isId ? 'Gaya' : 'Style'}:</strong> {logoOrder.style_note}
        </p>
      )}
    </article>
  );
}
