'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import { useLanguage } from './theme-provider';

type FeedbackKind = 'REVIEW' | 'REPORT';
type FormState = { status: 'idle' | 'loading' | 'success' | 'error'; message: string };

export function FeedbackForm({ kind }: { kind: FeedbackKind }) {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [state, setState] = useState<FormState>({ status: 'idle', message: '' });
  const [topic, setTopic] = useState('');
  const idempotency = useRef<{ payload: string; key: string } | null>(null);

  useEffect(() => {
    if (kind !== 'REPORT') return;
    const requestedTopic = new URLSearchParams(window.location.search).get('topic');
    if (requestedTopic === 'ACCESS') setTopic('ACCESS');
  }, [kind]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const topicValue = String(data.get('topic') ?? '');
    if (!topicValue) {
      setState({
        status: 'error',
        message: isId ? 'Jenis laporan wajib dipilih.' : 'Report type is required.',
      });
      return;
    }
    const payload = {
      kind,
      topic: topicValue,
      message: String(data.get('message') ?? ''),
      website: String(data.get('website') ?? ''),
    };
    const serialized = JSON.stringify(payload);
    if (idempotency.current?.payload !== serialized) {
      idempotency.current = { payload: serialized, key: crypto.randomUUID() };
    }
    setState({ status: 'loading', message: isId ? 'Mengantrekan…' : 'Queueing…' });
    try {
      const response = await fetch('/api/v1/public-feedback', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'idempotency-key': idempotency.current.key,
        },
        body: serialized,
      });
      const result = (await response.json()) as {
        error?: { message?: string };
      };
      if (!response.ok) throw new Error(result.error?.message ?? 'Request failed');
      setState({
        status: 'success',
        message: isId
          ? 'Masukan berhasil dikirim ke inbox Owner. Admin akan meninjaunya.'
          : 'Feedback sent to Owner inbox. Admin will review it.',
      });
      form.reset();
      idempotency.current = null;
    } catch (error) {
      setState({
        status: 'error',
        message:
          error instanceof Error ? error.message : isId ? 'Gagal mengantrekan.' : 'Queue failed.',
      });
    }
  }

  const review = kind === 'REVIEW';
  return (
    <form
      className="info-form"
      aria-label={
        review
          ? isId
            ? 'Form ulasan fitur'
            : 'Feature review form'
          : isId
            ? 'Form laporan masalah'
            : 'Problem report form'
      }
      onSubmit={submit}
    >
      <fieldset disabled={state.status === 'loading'}>
        <legend>
          {review
            ? isId
              ? 'Ulasan Fitur'
              : 'Feature Review'
            : isId
              ? 'Detail Laporan'
              : 'Report Details'}
        </legend>
        <div className="info-form__field">
          <label htmlFor={`${kind}-topic`}>
            {review ? (isId ? 'Fitur' : 'Feature') : isId ? 'Jenis masalah' : 'Problem type'}
          </label>
          {review ? (
            <input
              id={`${kind}-topic`}
              name="topic"
              required
              minLength={2}
              maxLength={80}
              placeholder={isId ? 'Nama fitur…' : 'Feature name…'}
            />
          ) : (
            <div className="info-form__field">
              <input type="hidden" name="topic" value={topic} />
              <div
                className="capsule-group"
                role="group"
                aria-label={isId ? 'Jenis laporan' : 'Report type'}
              >
                {(
                  [
                    ['BUG', isId ? 'Bug / error teknis' : 'Bug / technical error'],
                    ['ACCESS', isId ? 'Bantuan akses' : 'Access assistance'],
                    ['CONTENT', isId ? 'Konten bermasalah' : 'Problematic content'],
                    ['PRIVACY', isId ? 'Privasi' : 'Privacy'],
                    ['OTHER', isId ? 'Lainnya' : 'Other'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`capsule-btn${topic === value ? ' capsule-btn--active' : ''}`}
                    onClick={() => setTopic(value)}
                    aria-pressed={topic === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="info-form__field">
          <label htmlFor={`${kind}-message`}>
            {review ? (isId ? 'Ulasan' : 'Review') : isId ? 'Deskripsi' : 'Description'}
          </label>
          <textarea
            id={`${kind}-message`}
            name="message"
            required
            minLength={10}
            maxLength={1000}
            rows={5}
            placeholder={isId ? 'Tuliskan masukan Anda…' : 'Write your feedback…'}
          />
        </div>
        <div className="info-form__honeypot" aria-hidden="true">
          <label htmlFor={`${kind}-website`}>Website</label>
          <input
            id={`${kind}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <button type="submit" className="button">
          {state.status === 'loading'
            ? isId
              ? 'Mengirim…'
              : 'Sending…'
            : review
              ? isId
                ? 'Kirim Ulasan'
                : 'Send Review'
              : isId
                ? 'Kirim Laporan'
                : 'Send Report'}
        </button>
      </fieldset>
      <p
        className={`info-form__status info-form__status--${state.status}`}
        role="status"
        aria-live="polite"
      >
        {state.message ||
          (isId
            ? 'Masukan dikirim ke inbox Owner lokal; tidak ada pesan eksternal yang dikirim.'
            : 'Feedback is sent to the local Owner inbox; no external message is sent.')}
      </p>
    </form>
  );
}
