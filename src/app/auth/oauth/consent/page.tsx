'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SIMULATED_OAUTH_PROVIDER_LABELS } from '@/contracts/simulation';

type FakeAccount = { subject: string; name: string; email: string };

function fakeAccounts(provider: string): FakeAccount[] {
  const domain = provider === 'github' ? 'users.noreply.github.com' : 'gmail.com';
  return [
    { subject: `sim-${provider}-1001`, name: 'Ade Pratama', email: `ade.pratama@${domain}` },
    { subject: `sim-${provider}-1002`, name: 'Siti Rahayu', email: `siti.rahayu@${domain}` },
    { subject: `sim-${provider}-1003`, name: 'Budi Santoso', email: `budi.santoso@${domain}` },
  ];
}

function ConsentInner() {
  const params = useSearchParams();
  const provider = params.get('provider') ?? 'google';
  const state = params.get('state') ?? '';
  const providerLabel =
    provider === 'github'
      ? SIMULATED_OAUTH_PROVIDER_LABELS.github
      : SIMULATED_OAUTH_PROVIDER_LABELS.google;

  const accounts = useMemo(() => fakeAccounts(provider), [provider]);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  async function choose(account: FakeAccount) {
    if (!state || pending) return;
    setPending(true);
    setMessage('');
    try {
      const res = await fetch(`/api/v1/auth/oauth/${encodeURIComponent(provider)}/consent`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ state, ...account }),
      });
      const json = (await res.json()) as {
        data?: { data?: { callbackUrl?: string } };
        error?: { message?: string };
      };
      const callbackUrl = json.data?.data?.callbackUrl;
      if (!callbackUrl) {
        setMessage(json.error?.message ?? 'Persetujuan gagal.');
        setPending(false);
        return;
      }
      // Meniru redirect provider asli kembali ke aplikasi.
      window.location.href = callbackUrl;
    } catch {
      setMessage('Layanan lokal tidak dapat dijangkau.');
      setPending(false);
    }
  }

  function submitCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) {
      setMessage('Nama dan email wajib diisi.');
      return;
    }
    void choose({
      subject: `sim-${provider}-custom-${Date.now()}`,
      name: customName.trim(),
      email: customEmail.trim(),
    });
  }

  return (
    <Card asChild variant="floating">
      <section aria-labelledby="consent-title" style={{ maxWidth: 480, margin: '4rem auto' }}>
        <p className="eyebrow">MODE SIMULASI — BUKAN {provider.toUpperCase()} ASLI</p>
        <h1 id="consent-title">Pilih akun {providerLabel}</h1>
        <p>
          Ini adalah <strong>layar persetujuan tiruan</strong> yang meniru {providerLabel}.
          Tidak ada provider asli yang dihubungi; identitas yang Anda pilih hanya
          dipakai untuk membuat/menautkan akun Madevi lokal.
        </p>

        {!state && <p role="alert">State OAuth hilang. Ulangi dari halaman login.</p>}

        <ul>
          {accounts.map((a) => (
            <li key={a.subject}>
              <button
                type="button"
                className="button button--secondary"
                disabled={pending || !state}
                onClick={() => void choose(a)}
              >
                {a.name} — {a.email}
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={submitCustom}>
          <h2>atau gunakan identitas lain (tiruan)</h2>
          <label>
            Nama
            <input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              autoComplete="name"
              maxLength={120}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              autoComplete="email"
              maxLength={254}
            />
          </label>
          <Button className="button" type="submit" disabled={pending || !state}>
            {pending ? 'Memproses…' : 'Lanjutkan sebagai identitas ini'}
          </Button>
        </form>

        {message && <p role="status">{message}</p>}
      </section>
    </Card>
  );
}

export default function OAuthConsentPage() {
  return (
    <Suspense fallback={<p>Memuat…</p>}>
      <ConsentInner />
    </Suspense>
  );
}
