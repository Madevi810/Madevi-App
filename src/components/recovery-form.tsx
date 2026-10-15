'use client';

import { FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function RecoveryForm() {
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/v1/recovery', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ identifier: form.get('identifier') }),
      });
      const body = await response.json();
      setMessage(body.data?.message ?? body.error?.message ?? 'Permintaan gagal.');
    } catch {
      setMessage('Layanan belum dapat dihubungi. Coba lagi saat koneksi tersedia.');
    } finally {
      setPending(false);
    }
  }
  return (
    <Card asChild variant="floating" className="auth-card">
      <section data-motion-scope="recovery">
        <h1 data-motion-hero-item>Pemulihan akun</h1>
        <p data-motion-hero-item>
          Data pendaftaran saja tidak cukup. Admin akan meminta bukti penguasaan kontak, perangkat,
          atau recovery code; 2FA tidak dilewati.
        </p>
        <form className="info-form" onSubmit={submit} data-motion-reveal>
          <label className="info-form__field">
            <span>Username, email, atau nomor</span>
            <input name="identifier" required />
          </label>
          <Button className="button" type="submit" disabled={pending}>
            {pending ? 'Mengirim permintaan…' : 'Ajukan pemulihan'}
          </Button>
        </form>
        <p className="info-form__status" aria-live="polite">
          {message}
        </p>
      </section>
    </Card>
  );
}
