'use client';

import { useRouter } from 'next/navigation';
import { readCookie } from '@/lib/cookies';
import { FormEvent, useEffect, useState } from 'react';

type AccessState = {
  status: 'NOT_STARTED' | 'TRIAL' | 'RESTRICTED' | 'LIFETIME' | 'EDUCATION';
  label: string;
  expiresAt?: string;
  remainingSeconds?: number;
};

type Profile = {
  display_name: string | null;
  username: string | null;
  entitlement_status: string | null;
  approval_status: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  education_status: string | null;
  profile_description: string | null;
  access?: AccessState;
  toolsTrial?: {
    total: number;
    remaining: number | null;
  };
};

export function ProfileDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>();
  const [message, setMessage] = useState('Memuat profil…');
  const [contactKind, setContactKind] = useState<'EMAIL' | 'PHONE'>('EMAIL');
  const [deleteRequestOpen, setDeleteRequestOpen] = useState(false);
  const [dataRequestPending, setDataRequestPending] = useState<'EXPORT' | 'DELETE' | null>(null);
  const [verification, setVerification] = useState<{
    kind: 'MFA' | 'CONTACT';
    challengeId: string;
  }>();
  const access = profile?.access;

  useEffect(() => {
    fetch('/api/v1/profile', { cache: 'no-store' })
      .then(async (response) => ({ response, body: await response.json() }))
      .then(({ response, body }) => {
        if (!response.ok) throw new Error(body.error?.message ?? 'Sesi diperlukan');
        setProfile(body.data);
        setMessage('');
      })
      .catch((error: Error) => {
        setMessage(error.message);
      });
  }, []);

  async function requestData(kind: 'EXPORT' | 'DELETE') {
    if (dataRequestPending) return;
    setDataRequestPending(kind);
    try {
      const response = await fetch('/api/v1/account/data-request', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csrf-token': readCookie('madevi_csrf') },
        body: JSON.stringify({ kind }),
      });
      const body = await response.json().catch(() => null);
      if (response.ok) {
        setMessage(kind === 'EXPORT' ? 'Ekspor data: menunggu persetujuan Admin.' : 'Hapus akun: menunggu persetujuan Admin.');
        if (kind === 'DELETE') setDeleteRequestOpen(false);
      } else {
        setMessage(body?.error?.message ?? 'Permintaan data tidak dapat diproses.');
      }
    } catch {
      setMessage('Layanan lokal tidak dapat dijangkau. Permintaan belum dikirim.');
    } finally {
      setDataRequestPending(null);
    }
  }

  async function logout() {
    try {
      const response = await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { 'x-csrf-token': readCookie('madevi_csrf') },
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setMessage(body?.error?.message ?? 'Logout tidak dapat diproses.');
        return;
      }
      router.push('/auth');
      router.refresh();
    } catch {
      setMessage('Layanan lokal tidak dapat dihubungi. Sesi belum diubah.');
    }
  }

  async function updateDescription(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const educationStatus = form.get('educationStatus');
    const result = await accountRequest('/api/v1/profile', {
      method: 'PATCH',
      body: {
        description: form.get('description'),
        // L03: kirim hanya bila pengguna memilih nilai valid; service memvalidasi.
        ...(typeof educationStatus === 'string' && educationStatus ? { educationStatus } : {}),
      },
    });
    if (result.ok) {
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              profile_description:
                typeof form.get('description') === 'string'
                  ? String(form.get('description'))
                  : prev.profile_description,
              education_status:
                typeof educationStatus === 'string' && educationStatus
                  ? educationStatus
                  : prev.education_status,
            }
          : prev,
      );
      setMessage('Profil diperbarui. Status pendidikan tidak mengubah paket.');
    } else {
      setMessage(result.message);
    }
  }

  async function startMfa() {
    const result = await accountRequest('/api/v1/auth/2fa/email', {
      method: 'POST',
      body: { action: 'start' },
    });
    if (!result.ok || !result.data) return setMessage(result.message);
    setVerification({ kind: 'MFA', challengeId: String(result.data.challengeId) });
    setMessage('Kode 2FA dikirim ke mailbox Owner lokal. Minta Owner membacakan kode.');
  }

  async function startContactChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await accountRequest('/api/v1/account/contact', {
      method: 'POST',
      body: { kind: form.get('kind'), value: form.get('value'), password: form.get('password') },
    });
    if (!result.ok || !result.data) return setMessage(result.message);
    setVerification({ kind: 'CONTACT', challengeId: String(result.data.challengeId) });
    setMessage('Kode verifikasi dikirim ke mailbox Owner lokal. Minta Owner membacakan kode untuk Anda.');
  }

  async function confirmVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!verification) return;
    const form = new FormData(event.currentTarget);
    const url =
      verification.kind === 'MFA' ? '/api/v1/auth/2fa/email' : '/api/v1/auth/verify-contact';
    const body =
      verification.kind === 'MFA'
        ? { action: 'confirm', challengeId: verification.challengeId, code: form.get('code') }
        : { challengeId: verification.challengeId, code: form.get('code') };
    const result = await accountRequest(url, { method: 'POST', body });
    if (!result.ok) return setMessage(result.message);
    if (verification.kind === 'CONTACT') {
      router.push('/auth');
      router.refresh();
      return;
    }
    setVerification(undefined);
    setMessage('2FA email aktif.');
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await accountRequest('/api/v1/account/password', {
      method: 'POST',
      body: {
        currentPassword: form.get('currentPassword'),
        newPassword: form.get('newPassword'),
      },
    });
    if (result.ok) {
      router.push('/auth');
      router.refresh();
      return;
    }
    setMessage(result.message);
  }

  async function submitAppeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await accountRequest('/api/v1/account/appeal', {
      method: 'POST',
      body: { kind: 'REGISTRATION', reason: form.get('reason') },
    });
    setMessage(result.ok ? 'Banding masuk inbox Admin.' : result.message);
  }

  return (
    <section className="profile-card" aria-labelledby="profile-title">
      <div className="profile-card__heading">
        <div className="profile-card__avatar" aria-hidden="true">
          {profile?.display_name?.slice(0, 1) ?? '?'}
        </div>
        <div>
          <p className="eyebrow">PROFIL PRIVAT</p>
          <h1 id="profile-title">{profile?.display_name ?? 'Akun Madevi'}</h1>
          <p
            className={
              access?.status === 'RESTRICTED'
                ? 'profile-access profile-access--restricted'
                : 'profile-access'
            }
          >
            @{profile?.username ?? '—'} ·{' '}
            {access?.label ?? accessLabel(profile?.entitlement_status)}
            {access?.status === 'TRIAL' && typeof access.remainingSeconds === 'number'
              ? ` · ${formatRemaining(access.remainingSeconds)}`
              : ''}
            {profile?.toolsTrial && profile.toolsTrial.remaining !== null
              ? ` · Trial Tools: ${profile.toolsTrial.remaining}/${profile.toolsTrial.total}`
              : profile?.toolsTrial
                ? ' · Tools tanpa batas'
                : ''}
          </p>
        </div>
      </div>
      <div className="profile-card__panel">
        <div className="profile-card__section-heading">
          <div>
            <p className="eyebrow">INFORMASI & KEAMANAN</p>
            <h2>Kelola akun Anda</h2>
          </div>
          <p>Perubahan sensitif akan meminta verifikasi sebelum diterapkan.</p>
        </div>
        <div className="account-settings">
          <dl className="profile-details">
            <div>
              <dt>Status</dt>
              <dd>{profile?.approval_status ?? '—'}</dd>
            </div>
            <div>
              <dt>Email privat</dt>
              <dd>{profile?.email ?? '—'}</dd>
            </div>
            <div>
              <dt>Nomor privat</dt>
              <dd>{profile?.phone ?? '—'}</dd>
            </div>
            <div>
              <dt>Kota privat</dt>
              <dd>{profile?.city ?? '—'}</dd>
            </div>
            <div>
              <dt>Status pendidikan</dt>
              <dd>{profile?.education_status ?? '—'}</dd>
            </div>
          </dl>
          <form className="info-form" onSubmit={updateDescription}>
            <label className="info-form__field">
              <span>Deskripsi publik</span>
              <textarea
                name="description"
                maxLength={500}
                defaultValue={profile?.profile_description ?? ''}
              />
            </label>
            <label className="info-form__field">
              <span>Status pendidikan (tidak mengubah paket)</span>
              <select
                name="educationStatus"
                key={profile?.education_status ?? 'loading'}
                defaultValue={profile?.education_status ?? ''}
              >
                <option value="" disabled>
                  Pilih status…
                </option>
                {(
                  [
                    ['TIDAK_BERSEKOLAH', 'Tidak Bersekolah'],
                    ['ALUMNI', 'Alumni'],
                    ['SD', 'SD'],
                    ['SMP', 'SMP'],
                    ['SMA_SMK', 'SMA / SMK'],
                    ['PERGURUAN_TINGGI', 'Perguruan Tinggi'],
                  ] as const
                ).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <button className="button button--secondary" type="submit">
              Simpan profil
            </button>
          </form>
          {verification ? (
            <form className="info-form" onSubmit={confirmVerification}>
              <p className="info-form__note">
                Kode ada di <strong>mailbox Owner lokal</strong> (konsol Admin → Inbox).
                Minta Owner membacakan kode enam digit untuk Anda.
              </p>
              <label className="info-form__field">
                <span>Kode verifikasi</span>
                <input name="code" required />
              </label>
              <button className="button" type="submit">
                Konfirmasi
              </button>
            </form>
          ) : (
            <div className="account-forms-grid">
              <form className="info-form" onSubmit={startContactChange}>
                <h3>Ganti kontak</h3>
                <input type="hidden" name="kind" value={contactKind} />
                <div className="capsule-group" role="group" aria-label="Jenis kontak">
                  {(['EMAIL', 'PHONE'] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      className={`capsule-btn${contactKind === k ? ' capsule-btn--active' : ''}`}
                      onClick={() => setContactKind(k)}
                      aria-pressed={contactKind === k}
                    >
                      {k === 'EMAIL' ? 'Email' : 'Nomor telepon'}
                    </button>
                  ))}
                </div>
                <label className="info-form__field">
                  <span>Kontak baru</span>
                  <input name="value" required />
                </label>
                <label className="info-form__field">
                  <span>Password saat ini</span>
                  <input name="password" type="password" required />
                </label>
                <button className="button button--secondary" type="submit">
                  Verifikasi kontak baru
                </button>
              </form>
              <form className="info-form" onSubmit={changePassword}>
                <h3>Ganti password</h3>
                <label className="info-form__field">
                  <span>Password saat ini</span>
                  <input name="currentPassword" type="password" required />
                </label>
                <label className="info-form__field">
                  <span>Password baru</span>
                  <input name="newPassword" type="password" required />
                </label>
                <button className="button button--secondary" type="submit">
                  Ganti dan cabut sesi
                </button>
              </form>
              <form className="info-form" onSubmit={submitAppeal}>
                <h3>Banding pendaftaran</h3>
                <label className="info-form__field">
                  <span>Alasan</span>
                  <textarea name="reason" minLength={20} maxLength={2000} required />
                </label>
                <button className="button button--secondary" type="submit">
                  Kirim banding
                </button>
              </form>
            </div>
          )}
          <button className="button button--secondary" type="button" onClick={startMfa}>
            Aktifkan 2FA email
          </button>
        </div>
      </div>
      <div className="profile-card__actions">
        <button
          className="button button--secondary"
          type="button"
          onClick={() => requestData('EXPORT')}
          disabled={dataRequestPending !== null}
        >
          {dataRequestPending === 'EXPORT' ? 'Mengirim permintaan…' : 'Minta ekspor data'}
        </button>
        <button
          className="button button--secondary profile-card__delete-action"
          type="button"
          onClick={() => setDeleteRequestOpen(true)}
          disabled={dataRequestPending !== null}
        >
          Minta hapus akun
        </button>
        <button className="button" type="button" onClick={logout}>
          Logout
        </button>
      </div>
      {deleteRequestOpen ? (
        <section className="profile-card__delete-confirm" aria-labelledby="delete-account-title">
          <div>
            <p className="eyebrow">KONFIRMASI PERMINTAAN</p>
            <h2 id="delete-account-title">Minta penghapusan akun?</h2>
            <p>
              Permintaan ini dikirim ke Admin untuk ditinjau; akun tidak langsung dihapus dari
              perangkat ini. Anda dapat membatalkan sebelum mengirim permintaan.
            </p>
          </div>
          <div className="profile-card__delete-confirm-actions">
            <button
              className="button button--secondary"
              type="button"
              onClick={() => setDeleteRequestOpen(false)}
              disabled={dataRequestPending === 'DELETE'}
            >
              Batal
            </button>
            <button
              className="button profile-card__delete-confirm-submit"
              type="button"
              onClick={() => void requestData('DELETE')}
              disabled={dataRequestPending === 'DELETE'}
            >
              {dataRequestPending === 'DELETE' ? 'Mengirim permintaan…' : 'Ya, kirim permintaan'}
            </button>
          </div>
        </section>
      ) : null}
      <p className="info-form__status" aria-live="polite">
        {message}
      </p>
    </section>
  );
}

function accessLabel(status?: string | null) {
  if (status === 'PAID') return 'Akses paket seumur hidup';
  if (status === 'EDUCATION') return 'Profil pendidikan — akses ditentukan paket';
  if (status === 'TRIAL') return 'Free — 5 eksekusi Tools';
  return 'Free — trial Tools belum digunakan';
}

function formatRemaining(seconds: number) {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);
  return `sisa ${days}h ${hours}j ${minutes}m`;
}

async function accountRequest(
  url: string,
  input: { method: string; body?: Record<string, unknown> },
) {
  try {
    const response = await fetch(url, {
      method: input.method,
      headers: { 'content-type': 'application/json', 'x-csrf-token': readCookie('madevi_csrf') },
      body: input.body ? JSON.stringify(input.body) : undefined,
    });
    const body = await response.json();
    return {
      ok: response.ok,
      data: body.data as Record<string, unknown> | undefined,
      message: body.error?.message ?? 'Permintaan gagal.',
    };
  } catch {
    return { ok: false, data: undefined, message: 'Layanan lokal tidak dapat dijangkau.' };
  }
}
