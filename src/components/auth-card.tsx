'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { csrfHeaders } from './csrf-token';

type JsonResult = {
  data?: Record<string, unknown>;
  error?: { message?: string };
};

export function AuthCard() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [gender, setGender] = useState('');
  const [educationStatus, setEducationStatus] = useState('');
  const [verification, setVerification] = useState<{
    challengeId: string;
  }>();
  const [birthDate, setBirthDate] = useState('');

  /**
   * O-01: anak di bawah 13 tahun tidak boleh mendaftar sendiri. Pendaftaran
   * diblokir di UI (fail-closed) dan akun anak nyata juga ditolak pada
   * approval Admin; hanya fixture SIMULASI yang boleh lewat alur uji.
   */
  function ageOn(dateValue: string): number | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);
    if (!match) return null;
    const birth = new Date(`${dateValue}T00:00:00.000Z`);
    if (Number.isNaN(birth.getTime())) return null;
    const now = new Date();
    let age = now.getUTCFullYear() - birth.getUTCFullYear();
    const beforeBirthday =
      now.getUTCMonth() < birth.getUTCMonth() ||
      (now.getUTCMonth() === birth.getUTCMonth() && now.getUTCDate() < birth.getUTCDate());
    if (beforeBirthday) age -= 1;
    return age;
  }
  const registrantAge = ageOn(birthDate);
  const isChild = registrantAge !== null && registrantAge < 13;
  const [mfa, setMfa] = useState<{ challengeId: string }>();
  const [requestedPackage, setRequestedPackage] = useState<'PLUS' | 'PRO' | 'UPGRADE'>();

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('package');
    if (value === 'PLUS' || value === 'PRO' || value === 'UPGRADE') setRequestedPackage(value);
  }, []);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    const result = await postJson('/api/v1/auth/login', {
      identifier: form.get('identifier'),
      password: form.get('password'),
    });
    setPending(false);
    if (!result.data) return setMessage(result.error?.message ?? 'Login gagal.');
    if (result.data.status === 'MFA_REQUIRED') {
      setMfa({ challengeId: String(result.data.challengeId) });
      setMessage('Masukkan kode 2FA email. Kode ada di mailbox Owner lokal.');
      return;
    }
    if (requestedPackage) {
      const order = await postJson('/api/v1/payment/orders', { packageKind: requestedPackage });
      if (!order.data) {
        setMessage(order.error?.message ?? 'Login berhasil, tetapi order paket belum dibuat.');
        router.push('/profile');
        router.refresh();
        return;
      }
      const finalPrice = order.data.finalPrice;
      setMessage(
        `Order ${requestedPackage} dibuat${typeof finalPrice === 'number' ? ` — total Rp${finalPrice.toLocaleString('id-ID')}` : ''}. Pembayaran masih menunggu konfirmasi; tidak ada akses yang dibuka sebelum redeem berhasil.`,
      );
      setRequestedPackage(undefined);
      window.history.replaceState({}, '', '/profile');
    }
    router.push('/profile');
    router.refresh();
  }

  async function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    // Kapsul pengganti <select> tidak memicu validasi native form,
    // jadi wajib dicek manual (setara dengan required sebelumnya).
    if (!gender) {
      setPending(false);
      return setMessage('Jenis kelamin wajib dipilih.');
    }
    if (!educationStatus) {
      setPending(false);
      return setMessage('Status pendidikan wajib dipilih.');
    }
    const birthDateValue = String(form.get('birthDate') ?? '');
    const birthAge = ageOn(birthDateValue);
    if (birthAge !== null && birthAge < 13) {
      setPending(false);
      return setMessage('Pendaftaran anak di bawah 13 tahun diblokir (O-01). Jangan kirim data/foto anak nyata.');
    }
    const result = await postJson('/api/v1/auth/register', {
      fullName: form.get('fullName'),
      username: form.get('username'),
      email: form.get('email') || undefined,
      phone: form.get('phone') || undefined,
      password: form.get('password'),
      gender: form.get('gender'),
      birthDate: form.get('birthDate'),
      city: form.get('city'),
      educationStatus: form.get('educationStatus'),
    });
    setPending(false);
    if (!result.data) return setMessage(result.error?.message ?? 'Pendaftaran gagal.');
    setVerification({ challengeId: String(result.data.verificationChallengeId) });
    setMessage('Kode verifikasi dikirim ke mailbox Owner lokal. Minta Owner membacakan kode untuk Anda.');
  }

  async function submitVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!verification) return;
    setPending(true);
    const form = new FormData(event.currentTarget);
    const result = await postJson('/api/v1/auth/verify-contact', {
      challengeId: verification.challengeId,
      code: form.get('code'),
    });
    setPending(false);
    if (!result.data) return setMessage(result.error?.message ?? 'Verifikasi gagal.');
    setVerification(undefined);
    setMessage('Kontak terverifikasi. Status: Menunggu Persetujuan Admin.');
    setTab('login');
  }

  async function submitMfa(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mfa) return;
    setPending(true);
    const form = new FormData(event.currentTarget);
    const result = await postJson('/api/v1/auth/mfa/verify', {
      challengeId: mfa.challengeId,
      code: form.get('code'),
    });
    setPending(false);
    if (!result.data) return setMessage(result.error?.message ?? 'Verifikasi 2FA gagal.');
    // L03: lanjutkan intent pembelian setelah MFA seperti jalur login biasa.
    // Sesi sudah terpasang via cookie oleh verify endpoint; order memakai CSRF.
    if (requestedPackage) {
      const order = await postJson('/api/v1/payment/orders', { packageKind: requestedPackage });
      if (!order.data) {
        setMessage(order.error?.message ?? 'Login berhasil, tetapi order paket belum dibuat.');
        router.push('/profile');
        router.refresh();
        return;
      }
      const finalPrice = order.data.finalPrice;
      setMessage(
        `Order ${requestedPackage} dibuat${typeof finalPrice === 'number' ? ` — total Rp${finalPrice.toLocaleString('id-ID')}` : ''}. Pembayaran masih menunggu konfirmasi; tidak ada akses yang dibuka sebelum redeem berhasil.`,
      );
      setRequestedPackage(undefined);
      window.history.replaceState({}, '', '/profile');
    }
    router.push('/profile');
    router.refresh();
  }

  return (
    <Card asChild variant="floating" className="auth-card">
      <section aria-labelledby="auth-title" data-motion-scope="auth">
      <div className="auth-card__heading">
        <p className="eyebrow" data-motion-hero-item>AKUN MADEVI</p>
        <h1 id="auth-title" data-motion-hero-item>Daftar / Login</h1>
        <p data-motion-hero-item>Autentikasi lokal. Akun baru tetap menunggu persetujuan Admin.</p>
      </div>

      {verification ? (
        <CodeForm
          title="Verifikasi kontak"
          pending={pending}
          onSubmit={submitVerification}
        />
      ) : mfa ? (
        <CodeForm
          title="Verifikasi 2FA email"
          pending={pending}
          onSubmit={submitMfa}
        />
      ) : (
        <>
          <div className="auth-tabs" role="tablist" aria-label="Pilihan autentikasi">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'login'}
              className={tab === 'login' ? 'auth-tabs__active' : ''}
              onClick={() => setTab('login')}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'register'}
              className={tab === 'register' ? 'auth-tabs__active' : ''}
              onClick={() => setTab('register')}
            >
              Daftar
            </button>
          </div>

          {tab === 'login' ? (
            <form className="info-form" onSubmit={submitLogin} data-motion-reveal>
              <Field
                label="Username, email, atau nomor"
                name="identifier"
                autoComplete="username"
              />
              <PasswordField
                label="Password"
                name="password"
                autoComplete="current-password"
              />
              <Button className="button" disabled={pending} type="submit">
                {pending ? 'Memeriksa…' : 'Login'}
              </Button>
              <a href="/recovery" className="auth-card__link">
                Lupa password?
              </a>
              <button className="button button--secondary" type="button" disabled>
                Google OAuth — belum aktif sampai Online
              </button>
            </form>
          ) : (
            <form className="info-form" onSubmit={submitRegistration} data-motion-reveal>
              <Field label="Nama lengkap" name="fullName" autoComplete="name" />
              <Field label="Username publik" name="username" autoComplete="username" />
              <Field
                label="Email (minimal email atau nomor)"
                name="email"
                type="email"
                autoComplete="email"
                required={false}
              />
              <Field label="Nomor telepon format +62…"
                name="phone"
                type="tel"
                autoComplete="tel"
                required={false}
              />
              <PasswordField label="Password" name="password" autoComplete="new-password" />
              <div className="info-form__field">
                <span>Jenis kelamin</span>
                <input type="hidden" name="gender" value={gender} />
                <div className="capsule-group" role="group" aria-label="Jenis kelamin">
                  {(
                    [
                      ['PEREMPUAN', 'Perempuan'],
                      ['LAKI_LAKI', 'Laki-laki'],
                      ['LAINNYA', 'Lainnya / tidak menyebutkan'],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`capsule-btn${gender === value ? ' capsule-btn--active' : ''}`}
                      onClick={() => setGender(value)}
                      aria-pressed={gender === value}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="info-form__field">
                <span>Tanggal lahir</span>
                <input
                  name="birthDate"
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </label>
              {isChild && (
                <div className="info-form__alert" role="alert">
                  <p>
                    Jangan kirim data/foto anak nyata. Pendaftaran anak di bawah 13 tahun
                    diblokir demi keselamatan (O-01); verifikasi wali tatap muka belum
                    tersedia sehingga akun anak tidak dapat disetujui.
                  </p>
                  <label className="info-form__field">
                    <span>Foto bersama wali</span>
                    <input type="file" accept="image/*" disabled aria-disabled="true" />
                  </label>
                </div>
              )}
              <Field label="Kota / asal" name="city" autoComplete="address-level2" />
              <div className="info-form__field">
                <span>Status pendidikan</span>
                <input type="hidden" name="educationStatus" value={educationStatus} />
                <div className="capsule-group" role="group" aria-label="Status pendidikan">
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
                    <button
                      key={value}
                      type="button"
                      className={`capsule-btn${educationStatus === value ? ' capsule-btn--active' : ''}`}
                      onClick={() => setEducationStatus(value)}
                      aria-pressed={educationStatus === value}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <Button className="button" disabled={pending || isChild} type="submit">
                {pending ? 'Mengirim…' : 'Daftar dan verifikasi kontak'}
              </Button>
            </form>
          )}
        </>
      )}

      <p className="info-form__status" aria-live="polite">
        {message}
      </p>
      </section>
    </Card>
  );
}

function CodeForm({
  title,
  pending,
  onSubmit,
}: {
  title: string;
  pending: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="info-form" onSubmit={onSubmit} data-motion-reveal>
      <h2>{title}</h2>
      <p className="info-form__note">
        Kode dikirim ke <strong>mailbox Owner lokal</strong>. Minta Owner membuka konsol Admin
        → Inbox dan membacakan kode enam digit untuk Anda.
      </p>
      <Field label="Kode enam digit" name="code" inputMode="numeric" autoComplete="one-time-code" />
      <Button className="button" disabled={pending} type="submit">
        Verifikasi
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = true,
  ...props
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: 'numeric';
}) {
  return (
    <label className="info-form__field">
      <span>{label}</span>
      <input name={name} type={type} required={required} {...props} />
    </label>
  );
}

function PasswordField({
  label,
  name,
  autoComplete,
}: {
  label: string;
  name: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="info-form__field">
      <span id={`${name}-label`}>{label}</span>
      <div className="password-field">
        <input
          id={name}
          name={name}
          type={visible ? 'text' : 'password'}
          required
          autoComplete={autoComplete}
          aria-label={label}
          aria-labelledby={`${name}-label`}
        />
        <button
          type="button"
          className="button button--small button--secondary"
          aria-pressed={visible}
          aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? 'Sembunyikan' : 'Tampilkan'}
        </button>
      </div>
    </div>
  );
}

async function postJson(url: string, body: Record<string, unknown>): Promise<JsonResult> {
  try {
    // L03: kirim CSRF double-submit bila cookie sesi tersedia.
    // Endpoint pra-login (login/register) mengabaikannya; payment/orders mewajibkannya.
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...csrfHeaders() },
      body: JSON.stringify(body),
    });
    return (await response.json()) as JsonResult;
  } catch {
    return { error: { message: 'Layanan lokal tidak dapat dijangkau.' } };
  }
}
