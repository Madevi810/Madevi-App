'use client';

/**
 * ListenTurn — "Giliran Dengar" (INOVASI-20261014-1045 IDE 1).
 *
 * Sesi curhat terstruktur: pembicara bicara 20 menit, pendengar hanya
 * merespons dengan REFLEKSI/SEMANGAT. SARAN dibuka hanya setelah
 * pembicara mengaktifkan "Saya butuh saran".
 *
 * Semua aksi inline — DILARANG popup/modal (Prinsip UI Madevi).
 */

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';
import { LISTEN_MAX_LISTENERS } from '@/contracts/social';

interface ListenSession {
  id: string;
  speakerName: string | null;
  topic: string;
  isAnonymous: boolean;
  needsAdvice: boolean;
  status: string;
  listenerCount: number;
  endsAt: string | null;
  mine: boolean;
}

interface ListenResponseItem {
  id: string;
  listenerName: string | null;
  kind: string;
  body: string;
  createdAt: string;
}

type ResponseKind = 'REFLEKSI' | 'SEMANGAT' | 'SARAN';

const KIND_LABEL_ID: Record<string, string> = {
  REFLEKSI: 'Refleksi',
  SEMANGAT: 'Semangat',
  SARAN: 'Saran',
};

export function ListenTurn() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [sessions, setSessions] = useState<ListenSession[]>([]);
  const [selected, setSelected] = useState<ListenSession | null>(null);
  const [responses, setResponses] = useState<ListenResponseItem[]>([]);
  const [topic, setTopic] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseKind, setResponseKind] = useState<ResponseKind>('REFLEKSI');
  const [responseBody, setResponseBody] = useState('');

  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/line/listen?limit=20');
      if (!res.ok) throw new Error('Gagal memuat sesi');
      const json = await res.json();
      setSessions(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setError(isId ? 'Gagal memuat sesi' : 'Failed to load sessions');
    }
  }, [isId]);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const loadDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/v1/line/listen/${id}/responses`);
      if (!res.ok) throw new Error('Gagal memuat detail');
      const json = await res.json();
      setSelected(json.data?.session ?? null);
      setResponses(json.data?.responses ?? []);
    } catch (e) {
      setError(isId ? 'Gagal memuat detail sesi' : 'Failed to load session detail');
    }
  }, [isId]);

  const createSession = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/line/listen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, isAnonymous }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal membuat sesi');
      }
      setTopic('');
      await loadSessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal membuat sesi');
    } finally {
      setBusy(false);
    }
  }, [topic, isAnonymous, loadSessions]);

  const joinSession = useCallback(async (id: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/line/listen/${id}/join`, { method: 'POST' });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal bergabung');
      }
      await loadSessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal bergabung');
    } finally {
      setBusy(false);
    }
  }, [loadSessions]);

  const toggleAdvice = useCallback(async (id: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/line/listen/${id}/needs-advice`, { method: 'POST' });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal mengubah pengaturan');
      }
      await loadDetail(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal mengubah pengaturan');
    } finally {
      setBusy(false);
    }
  }, [loadDetail]);

  const sendResponse = useCallback(async () => {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/line/listen/${selected.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: responseKind, body: responseBody }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal mengirim respons');
      }
      setResponseBody('');
      await loadDetail(selected.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal mengirim respons');
    } finally {
      setBusy(false);
    }
  }, [selected, responseKind, responseBody, loadDetail]);

  const formatTime = (iso: string | null) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleTimeString(isId ? 'id-ID' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <section className="listen-turn" aria-labelledby="listen-turn-title">
      <h3 id="listen-turn-title">
        {isId ? 'Giliran Dengar' : 'Listen Turn'}
      </h3>
      <p className="listen-turn__hint">
        {isId
          ? 'Pembicara bicara, pendengar hanya mendengarkan dan merespons dengan refleksi empati. Saran baru dibuka jika pembicara memintanya.'
          : 'The speaker talks, listeners only listen and respond with empathic reflection. Advice only when the speaker asks for it.'}
      </p>

      {error && (
        <p className="listen-turn__error" role="alert">
          {error}
        </p>
      )}

      {/* Form buat sesi — inline, bukan popup */}
      <div className="listen-turn__compose">
        <label htmlFor="listen-topic" className="sr-only">
          {isId ? 'Topik curhat' : 'Topic'}
        </label>
        <input
          id="listen-topic"
          type="text"
          maxLength={200}
          placeholder={isId ? 'Apa yang ingin kamu sampaikan?' : 'What do you want to share?'}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <label className="listen-turn__check">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          {isId ? 'Anonim' : 'Anonymous'}
        </label>
        <button
          type="button"
          disabled={busy || topic.trim().length < 5}
          onClick={() => void createSession()}
        >
          {isId ? 'Mulai sesi' : 'Start session'}
        </button>
      </div>

      {/* Daftar sesi */}
      <ul className="listen-turn__list">
        {sessions.map((s) => (
          <li key={s.id} className="listen-turn__item">
            <button
              type="button"
              className="listen-turn__item-btn"
              onClick={() => void loadDetail(s.id)}
              aria-expanded={selected?.id === s.id}
            >
              <span className="listen-turn__topic">{s.topic}</span>
              <span className="listen-turn__meta">
                {s.isAnonymous
                  ? isId ? 'Anonim' : 'Anonymous'
                  : s.speakerName ?? (isId ? 'Seseorang' : 'Someone')}
                {' · '}
                {isId ? 'pendengar' : 'listeners'} {s.listenerCount}/{LISTEN_MAX_LISTENERS}
                {s.endsAt ? ` · ${formatTime(s.endsAt)}` : ''}
              </span>
              {s.needsAdvice && (
                <span className="listen-turn__badge">
                  {isId ? 'Butuh saran' : 'Needs advice'}
                </span>
              )}
            </button>
            {!s.mine && s.status !== 'SELESAI' && (
              <button
                type="button"
                className="listen-turn__join"
                disabled={busy || s.listenerCount >= LISTEN_MAX_LISTENERS}
                onClick={() => void joinSession(s.id)}
              >
                {isId ? 'Dengarkan' : 'Listen'}
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Detail sesi terpilih — inline di bawah daftar */}
      {selected && (
        <div className="listen-turn__detail">
          <h4>{selected.topic}</h4>
          <p className="listen-turn__meta">
            {selected.isAnonymous
              ? isId ? 'Anonim' : 'Anonymous'
              : selected.speakerName ?? ''}
            {' · '}
            {selected.status}
            {selected.endsAt ? ` · ${formatTime(selected.endsAt)}` : ''}
          </p>

          {selected.mine && (
            <button
              type="button"
              className="listen-turn__advice-toggle"
              disabled={busy}
              onClick={() => void toggleAdvice(selected.id)}
              aria-pressed={selected.needsAdvice}
            >
              {selected.needsAdvice
                ? isId ? 'Saya butuh saran (aktif)' : 'I need advice (on)'
                : isId ? 'Saya butuh saran' : 'I need advice'}
            </button>
          )}

          <ul className="listen-turn__responses">
            {responses.map((r) => (
              <li key={r.id} className="listen-turn__response">
                <span className="listen-turn__kind">
                  {KIND_LABEL_ID[r.kind] ?? r.kind}
                </span>
                <span className="listen-turn__body">{r.body}</span>
                <span className="listen-turn__author">
                  {r.listenerName ?? (isId ? 'Anonim' : 'Anonymous')}
                </span>
              </li>
            ))}
            {responses.length === 0 && (
              <li className="listen-turn__empty">
                {isId ? 'Belum ada respons.' : 'No responses yet.'}
              </li>
            )}
          </ul>

          {selected.status !== 'SELESAI' && !selected.mine && (
            <div className="listen-turn__compose">
              <label htmlFor="listen-kind" className="sr-only">
                {isId ? 'Jenis respons' : 'Response kind'}
              </label>
              <select
                id="listen-kind"
                value={responseKind}
                onChange={(e) => setResponseKind(e.target.value as ResponseKind)}
              >
                <option value="REFLEKSI">
                  {isId ? 'Refleksi' : 'Reflection'}
                </option>
                <option value="SEMANGAT">
                  {isId ? 'Semangat' : 'Encouragement'}
                </option>
                <option value="SARAN" disabled={!selected.needsAdvice}>
                  {isId ? 'Saran' : 'Advice'}
                  {!selected.needsAdvice
                    ? isId ? ' (pembicara belum membuka)' : ' (not open)'
                    : ''}
                </option>
              </select>
              <label htmlFor="listen-body" className="sr-only">
                {isId ? 'Isi respons' : 'Response body'}
              </label>
              <input
                id="listen-body"
                type="text"
                maxLength={500}
                placeholder={isId ? 'Tulis respons empati…' : 'Write an empathic response…'}
                value={responseBody}
                onChange={(e) => { setResponseBody(e.target.value); }}
              />
              <button
                type="button"
                disabled={busy || responseBody.trim().length < 2}
                onClick={() => void sendResponse()}
              >
                {isId ? 'Kirim' : 'Send'}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
