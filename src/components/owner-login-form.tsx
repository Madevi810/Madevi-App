'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from './theme-provider';

type JsonResult = {
  data?: Record<string, unknown>;
  error?: { message?: string };
};

async function postJson(path: string, body: Record<string, unknown>): Promise<JsonResult> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return (await res.json()) as JsonResult;
}

function UserGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 20c.9-3.45 3.1-5.2 6.5-5.2s5.6 1.75 6.5 5.2" strokeLinecap="round" />
    </svg>
  );
}

function KeyGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <circle cx="8.5" cy="15.5" r="3.25" />
      <path d="m10.8 13.2 7.7-7.7M15.5 5.5l3 3M13 8l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Form login Admin lokal offline sederhana: Username/Email + Password.
 * Perangkat diperiksa otomatis oleh server, mengabaikan device signature untuk lokal.
 */
export function OwnerLoginForm() {
  const router = useRouter();
  const { language } = useLanguage();
  const isId = language === 'id';
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('');
    const result = await postJson('/api/v1/owner/login', {
      identifier,
      password,
    });
    setPending(false);
    if (!result.data) {
      setMessage(result.error?.message ?? (isId ? 'Login gagal.' : 'Login failed.'));
      return;
    }
    router.push('/owner');
    router.refresh();
  }

  return (
    <Card asChild variant="floating" className="owner-login">
      <div>
        <h1>{isId ? 'Login Admin' : 'Admin Login'}</h1>
        <p className="owner-login__hint">
          {isId
            ? 'Konsol administratif lokal offline. Sesi idle 60 menit.'
            : 'Local offline administrative console. 60-minute idle session.'}
        </p>
        <form className="info-form" onSubmit={submitLogin}>
          <label className="info-form__field">
            <span className="form-label-with-icon">
              <UserGlyph />
              {isId ? 'Username / Email' : 'Username / Email'}
            </span>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              maxLength={254}
              autoComplete="username"
            />
          </label>
          <label className="info-form__field">
            <span className="form-label-with-icon">
              <KeyGlyph />
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              maxLength={128}
              autoComplete="current-password"
            />
          </label>
          <Button type="submit" className="button" disabled={pending}>
            {pending ? '…' : isId ? 'Masuk Konsol' : 'Enter Console'}
          </Button>
        </form>
        {message && <p className="info-form__status">{message}</p>}
      </div>
    </Card>
  );
}
