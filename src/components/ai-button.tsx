'use client';

import Link from 'next/link';
import { readCookie } from '@/lib/cookies';
import { useCallback, useEffect, useRef, useState } from 'react';
import { answerLocally } from '@/services/ai-lokal';

import { useDialogBehavior } from './dialog-behavior';
import { useLanguage } from './theme-provider';

interface Message {
  role: string;
  content: string;
}

interface HistoryItem {
  id: string;
  title: string;
  updatedAt: string;
}

export function AiButton() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Ikon bergerak halus hanya saat retrieval lokal tersedia dan bukan saat ujian. */
  const [available, setAvailable] = useState(false);
  /** Kemampuan sumber lokal + status ujian untuk bubble. */
  const [capabilityInfo, setCapabilityInfo] = useState<string>('');
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
  }, []);
  const { dialogRef, onKeyDown } = useDialogBehavior<HTMLElement>({
    open,
    onClose: close,
    initialFocusRef: closeRef,
  });

  useEffect(() => {
    function onOpenAi() {
      setOpen(true);
      setShowHistory(false);
      setError(null);
    }

    document.addEventListener('madevi:open-ai', onOpenAi);
    return () => document.removeEventListener('madevi:open-ai', onOpenAi);
  }, []);

  useEffect(() => {
    if (!open || !showHistory) return;
    let cancelled = false;
    fetch('/api/v1/ai/conversations?limit=3', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (cancelled || !json?.data) return;
        setHistory(json.data);
      })
      .catch(() => {
        if (!cancelled) setHistory([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open, showHistory]);

  /** Cek kesiapan sumber lokal sekali saat mount; gagal berarti tidak siap. */
  useEffect(() => {
    let cancelled = false;
    fetch('/api/v1/ai/availability', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled) return;
        // Availability terpisah dari exam lock: server menolak POST saat ujian;
        // ikon hanya memberi sinyal bahwa sumber lokal siap dipakai.
        const data = json?.data as
          | {
              allowed?: boolean;
              reason?: string | null;
              mode?: string;
              note?: string;
            }
          | undefined;
        setAvailable(Boolean(data?.allowed) && data?.reason !== 'EXAM_ACTIVE');
        if (data?.reason === 'EXAM_ACTIVE') {
          setCapabilityInfo(isId ? 'Nonaktif selama ujian' : 'Disabled during exam');
        } else {
          setCapabilityInfo(isId ? 'Sumber lokal · gratis' : 'Local sources · free');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailable(false);
          setCapabilityInfo(isId ? 'Sumber lokal belum tersedia' : 'Local sources unavailable');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isId]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setError(null);

    // Coba API dulu; jika gagal, pakai asisten lokal (offline, jujur).
    const useLocal = (reason: string) => {
      const local = answerLocally(text, isId);
      setMessages((prev) => [
        ...prev,
        { role: 'USER', content: text },
        { role: 'ASSISTANT', content: `🏠 *Mode Lokal* — ${local.answer}` },
      ]);
      setInput('');
      if (reason) setError(reason);
    };

    try {
      const ownerSession = readCookie('madevi_owner_access');
      const csrfCookie = ownerSession ? 'madevi_owner_csrf' : 'madevi_csrf';
      const res = await fetch('/api/v1/ai/conversations', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(readCookie(csrfCookie) ? { 'x-csrf-token': readCookie(csrfCookie) } : {}),
        },
        body: JSON.stringify({ message: text }),
      });
      const json: unknown = await res.json().catch(() => null);
      if (!res.ok || !isAiResponse(json)) {
        // API tidak menjawab — fallback ke lokal, bukan error mati.
        useLocal('');
        return;
      }
      setMessages((prev) => [
        ...prev,
        { role: 'USER', content: text },
        { role: 'ASSISTANT', content: json.data.answer },
      ]);
      setInput('');
    } catch {
      // Offline/gagal jaringan — asisten lokal tetap menjawab.
      useLocal('');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`ai-fab${available ? ' ai-fab--available' : ''}`}
        onClick={() => setOpen(true)}
        aria-label={isId ? `Buka Asisten Madevi${capabilityInfo ? `, ${capabilityInfo}` : ''}` : `Open Madevi Assistant${capabilityInfo ? `, ${capabilityInfo}` : ''}`}
      >
        <span className="ai-fab__icon" aria-hidden="true">
          <MadeviGuideIcon />
        </span>
        <span className="sr-only">{isId ? 'Asisten Madevi' : 'Madevi Assistant'}</span>
      </button>
      {open && (
        <>
          <div className="ai-popup-backdrop" aria-hidden="true" onClick={close} />
          <aside
            ref={dialogRef}
            className="ai-popup"
            role="dialog"
            aria-modal="true"
            aria-label={isId ? 'Asisten Madevi' : 'Madevi Assistant'}
            tabIndex={-1}
            onKeyDown={onKeyDown}
          >
            <div className="ai-popup__header">
              <h2 className="ai-popup__title">{isId ? 'Asisten Madevi' : 'Madevi Assistant'}</h2>
              <p className="ai-popup__capability" aria-label={isId ? 'Kemampuan asisten sumber lokal' : 'Local-source assistant capability'}>
                {capabilityInfo || (isId ? 'Sumber lokal belum tersedia' : 'Local sources unavailable')}
              </p>
              <button
                ref={closeRef}
                type="button"
                className="ai-popup__close"
                onClick={close}
                aria-label={isId ? 'Tutup Asisten Madevi' : 'Close Madevi Assistant'}
              >
                ✕
              </button>
              <button
                type="button"
                className="ai-popup__history-toggle"
                onClick={() => setShowHistory((current) => !current)}
                aria-label={isId ? 'Riwayat percakapan' : 'Conversation history'}
                aria-pressed={showHistory}
              >
                <HistoryIcon />
              </button>
            </div>
            <div className="ai-popup__body">
              {showHistory ? (
                <ul className="ai-popup__history">
                  {history.length === 0 ? (
                    <li>{isId ? 'Belum ada percakapan' : 'No conversation yet'}</li>
                  ) : (
                    history.map((item) => <li key={item.id}>{item.title}</li>)
                  )}
                </ul>
              ) : messages.length === 0 ? (
                <p className="ai-popup__placeholder">
                  {isId
                    ? 'Tanyakan isi Madevi. Jawaban hanya memakai sumber lokal yang diizinkan dan akan mengakui bila bukti belum tersedia.'
                    : 'Ask about Madevi. Answers use permitted local sources and will say when evidence is unavailable.'}
                </p>
              ) : (
                messages.map((m, i) => (
                  <p key={i} className={`ai-popup__msg ai-popup__msg--${m.role.toLowerCase()}`}>
                    {m.content}
                  </p>
                ))
              )}
              {error && (
                <p className="ai-popup__error" role="alert">
                  {error}
                </p>
              )}
            </div>
            <div className="ai-popup__form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={isId ? 'Tulis…' : 'Type…'}
                aria-label={isId ? 'Tulis pertanyaan' : 'Type a question'}
              />
              <button
                type="button"
                className="button button--small"
                onClick={send}
                disabled={sending}
              >
                {sending ? (isId ? 'Mengirim…' : 'Sending…') : isId ? 'Kirim' : 'Send'}
              </button>
            </div>
            <div className="ai-popup__footer">
              <Link href="/ai-asisten" className="ai-popup__full-btn" onClick={close}>
                {isId ? 'Riwayat lengkap →' : 'Full history →'}
              </Link>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

function isAiResponse(value: unknown): value is { data: { answer: string } } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    typeof value.data === 'object' &&
    value.data !== null &&
    'answer' in value.data &&
    typeof value.data.answer === 'string'
  );
}

function HistoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16M4 12h12M4 18h9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MadeviGuideIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="9" width="14" height="10" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 9V5.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="4" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9.2" cy="13.2" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="13.2" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9.5 16.2c.7.6 1.6.9 2.5.9s1.8-.3 2.5-.9" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

