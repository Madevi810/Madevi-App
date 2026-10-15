'use client';

import { useState } from 'react';
import { readCookie } from '@/lib/cookies';
import { useLanguage } from './theme-provider';

export function ModerationAppealForm() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [caseId, setCaseId] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch('/api/v1/moderation/appeals', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-csrf-token': readCookie('madevi_csrf') },
      body: JSON.stringify({ caseId, reason, idempotencyKey: crypto.randomUUID() }),
    });
    const j = await r.json();
    setMessage(
      j.data ? (isId ? 'Banding terkirim' : 'Appeal submitted') : (j.error?.message ?? 'Gagal'),
    );
  }

  return (
    <div className="page-shell">
      <h1>{isId ? 'Banding Moderasi' : 'Moderation Appeal'}</h1>
      <form className="info-form" onSubmit={submit}>
        <label className="info-form__field">
          <span>{isId ? 'ID Kasus' : 'Case ID'}</span>
          <input value={caseId} onChange={(e) => setCaseId(e.target.value)} required />
        </label>
        <label className="info-form__field">
          <span>{isId ? 'Alasan' : 'Reason'}</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            minLength={20}
            rows={4}
          />
        </label>
        <button type="submit" className="button">
          {isId ? 'Kirim Banding' : 'Submit Appeal'}
        </button>
      </form>
      {message && <p className="info-form__status">{message}</p>}
    </div>
  );
}

