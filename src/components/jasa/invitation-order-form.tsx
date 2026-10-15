'use client';

/**
 * InvitationOrderForm — form private undangan
 * Dipercantik dengan UI modern form
 */

import { useId, useState } from 'react';
import { useCurrentUser } from './use-current-user';
import { csrfHeaders } from '../csrf-token';

export function InvitationOrderForm({
  isId,
  templateId,
  templateName,
  templateLabel,
}: {
  isId: boolean;
  templateId?: string;
  templateName?: string;
  templateLabel?: string;
}) {
  const { loggedIn } = useCurrentUser();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const fid = (name: string) => `${uid}-${name}`;
  const [groom, setGroom] = useState('');
  const [bride, setBride] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [note, setNote] = useState('');
  const [format, setFormat] = useState<'ONLINE' | 'PRINT' | 'BOTH'>('ONLINE');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ secretToken: string; publicSlug: string | null } | null>(
    null,
  );
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResult(null);
    if (!groom.trim() || !bride.trim()) {
      setError(isId ? 'Nama pasangan wajib diisi.' : 'Both names are required.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/v1/jasa/undangan/order', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({
          templateId,
          groomName: groom,
          brideName: bride,
          eventDate: date || undefined,
          venue,
          city,
          note,
          packageFormat: format,
        }),
      });
      const json = (await res.json()) as {
        data?: { secretToken: string; publicSlug: string | null };
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
    const orderUrl = `${window.location.origin}/undangan/${result.publicSlug ?? ''}`;
    const privateUrl = `${window.location.origin}/jasa/undangan/order?token=${result.secretToken}`;
    return (
      <div className="invitation-order__result" role="status">
        <div className="invitation-order__result-heading">
          <SuccessIcon />
          {isId ? 'Permintaan Terkirim!' : 'Request Submitted!'}
        </div>
        <p className="invitation-order__result-description">
          {isId
            ? 'Status: Menunggu pemeriksaan Admin. Tim kami akan meninjau pesanan Anda.'
            : 'Status: Pending Admin review. Our team will review your order.'}
        </p>
        
        <div className="invitation-order__link-card">
          <h4>
            {isId ? 'Tautan Private Anda (Rahasia)' : 'Your Private Link (Secret)'}
          </h4>
          <p className="invitation-link">
            <a href={privateUrl}>{privateUrl}</a>
          </p>
        </div>
        
        {result.publicSlug && (
          <div className="invitation-order__link-card">
            <h4>
              {isId ? 'Halaman Final (setelah disetujui)' : 'Final Page (after approval)'}
            </h4>
            <p className="invitation-link">
              <a href={orderUrl}>{orderUrl}</a>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form className="info-form invitation-order" onSubmit={submit}>
      {templateName && (
        <div className="invitation-order__template-note">
          <p className="invitation-order__template">
            {templateLabel ?? (isId ? 'Template Terpilih' : 'Selected Template')}: <strong>{templateName}</strong>
          </p>
        </div>
      )}
      
      {!loggedIn && (
        <div className="invitation-order__hint">
          <InfoIcon />
          <p>
            {isId ? 'Login untuk menyimpan pesanan ke akun Anda.' : 'Log in to save this order to your account.'}
          </p>
        </div>
      )}

      <div className="invitation-order__grid">
        <div className="info-form__field">
          <label htmlFor={fid("groom")}>{isId ? 'Mempelai pria' : 'Groom'} <span aria-hidden="true">*</span></label>
          <input id={fid("groom")} value={groom} onChange={(e) => setGroom(e.target.value)} required autoComplete="name" placeholder={isId ? 'Nama mempelai pria' : 'Groom’s name'} />
        </div>
        <div className="info-form__field">
          <label htmlFor={fid("bride")}>{isId ? 'Mempelai wanita' : 'Bride'} <span aria-hidden="true">*</span></label>
          <input id={fid("bride")} value={bride} onChange={(e) => setBride(e.target.value)} required autoComplete="name" placeholder={isId ? 'Nama mempelai wanita' : 'Bride’s name'} />
        </div>
      </div>

      <div className="invitation-order__grid">
        <div className="info-form__field">
          <label htmlFor={fid("date")}>{isId ? 'Tanggal acara' : 'Event date'}</label>
          <input id={fid("date")} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="info-form__field">
          <label htmlFor={fid("city")}>{isId ? 'Kota' : 'City'}</label>
          <input id={fid("city")} value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" placeholder={isId ? 'Contoh: Jakarta' : 'For example: Jakarta'} />
        </div>
      </div>

      <div className="info-form__field">
        <label htmlFor={fid("venue")}>{isId ? 'Tempat acara' : 'Venue'}</label>
        <input id={fid("venue")} value={venue} onChange={(e) => setVenue(e.target.value)} autoComplete="street-address" placeholder={isId ? 'Nama gedung atau lokasi' : 'Building or venue name'} />
      </div>

      <div className="info-form__field">
        <label htmlFor={fid("note")}>{isId ? 'Catatan khusus' : 'Special note'}</label>
        <textarea id={fid("note")} rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={isId ? 'Detail warna, tema, atau pesan khusus…' : 'Colour details, theme, or a special message…'} />
      </div>

      <fieldset className="invitation-order__format">
        <legend>{isId ? 'Paket' : 'Package'}</legend>
        <div role="group" aria-label={isId ? 'Paket undangan' : 'Invitation package'}>
          {(
            [
              ['ONLINE', isId ? 'Online' : 'Online'],
              ['PRINT', isId ? 'Print Fisik' : 'Physical Print'],
              ['BOTH', isId ? 'Keduanya' : 'Both'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`invitation-order__format-option${format === value ? ' invitation-order__format-option--active' : ''}`}
              onClick={() => setFormat(value)}
              aria-pressed={format === value}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <button type="submit" className="button button--primary invitation-order__submit" disabled={busy} aria-busy={busy}>
        {busy ? (isId ? 'Memproses…' : 'Processing…') : isId ? 'Kirim Pesanan' : 'Submit Order'}
      </button>

      {error && (
        <p className="info-form__status invitation-order__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function InfoIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 11.1V12A8 8 0 1 1 15.3 4.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m20 5-8.2 8.2L9 10.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
