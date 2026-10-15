'use client';

/**
 * SidangWarga — "Sidang Warga" (INOVASI-20261014-1145 IDE 1, grup Line).
 *
 * Protokol musyawarah formal 3 fase: TANYA → SANGGAH → VOTING anonim
 * berkuorum. Hasil voting hanya ditampilkan setelah ditutup
 * (anti-bandwagon).
 *
 * Semua aksi inline — DILARANG popup/modal (Prinsip UI Madevi).
 */

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';
import { allowedArgumentKinds } from '@/contracts/social';

interface SidangSession {
  id: string;
  title: string;
  description: string;
  status: string;
  quorumPct: number;
  phaseEndsAt: string | null;
  createdByName: string | null;
  argumentCount: number;
}

interface SidangArgument {
  id: string;
  kind: string;
  body: string;
  authorName: string | null;
  createdAt: string;
}

interface SidangDetail {
  session: SidangSession & { closedAt: string | null };
  arguments: SidangArgument[];
  result: { SETUJU: number; TOLAK: number; ABSTAIN: number } | null;
}

const KIND_LABEL_ID: Record<string, string> = {
  TANYA: 'Pertanyaan',
  JAWAB: 'Jawaban',
  SANGGAH: 'Sanggahan',
  DUKUNG: 'Dukungan',
};

export function SidangWarga({ groupId }: { groupId?: string }) {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [sessions, setSessions] = useState<SidangSession[]>([]);
  const [detail, setDetail] = useState<SidangDetail | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [argKind, setArgKind] = useState<string>('TANYA');
  const [argBody, setArgBody] = useState('');
  const [voteChoice, setVoteChoice] = useState<'SETUJU' | 'TOLAK' | 'ABSTAIN'>('SETUJU');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    if (!groupId) return;
    try {
      const res = await fetch(`/api/v1/line/sidang?groupId=${encodeURIComponent(groupId)}&limit=20`);
      if (!res.ok) throw new Error('Gagal memuat sidang');
      const json = await res.json();
      setSessions(Array.isArray(json.data) ? json.data : []);
    } catch {
      setError(isId ? 'Gagal memuat sidang' : 'Failed to load sessions');
    }
  }, [groupId, isId]);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const loadDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/v1/line/sidang/${id}`);
      if (!res.ok) throw new Error('Gagal memuat detail');
      const json = await res.json();
      setDetail(json.data ?? null);
    } catch {
      setError(isId ? 'Gagal memuat detail sidang' : 'Failed to load detail');
    }
  }, [isId]);

  const createSession = useCallback(async () => {
    if (!groupId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/line/sidang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, title, description }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal membuat sidang');
      }
      setTitle('');
      setDescription('');
      await loadSessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal membuat sidang');
    } finally {
      setBusy(false);
    }
  }, [groupId, title, description, loadSessions]);

  const advance = useCallback(async () => {
    if (!detail) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/line/sidang/${detail.session.id}/advance`, {
        method: 'POST',
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal memajukan fase');
      }
      await loadDetail(detail.session.id);
      await loadSessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memajukan fase');
    } finally {
      setBusy(false);
    }
  }, [detail, loadDetail, loadSessions]);

  const submitArgument = useCallback(async () => {
    if (!detail) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/line/sidang/${detail.session.id}/arguments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: argKind, body: argBody }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal menambah argumen');
      }
      setArgBody('');
      await loadDetail(detail.session.id);
      await loadSessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menambah argumen');
    } finally {
      setBusy(false);
    }
  }, [detail, argKind, argBody, loadDetail, loadSessions]);

  const castVote = useCallback(async () => {
    if (!detail) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/line/sidang/${detail.session.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice: voteChoice }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal vote');
      }
      await loadDetail(detail.session.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal vote');
    } finally {
      setBusy(false);
    }
  }, [detail, voteChoice, loadDetail]);

  const currentPhase = detail?.session.status ?? null;
  const allowedKinds = currentPhase
    ? allowedArgumentKinds(currentPhase as 'TANYA' | 'SANGGAH' | 'VOTING')
    : [];

  return (
    <section className="sidang-warga" aria-labelledby="sidang-warga-title">
      <h3 id="sidang-warga-title">
        {isId ? 'Sidang Warga' : 'Town Assembly'}
      </h3>
      <p className="sidang-warga__hint">
        {isId
          ? 'Musyawarah formal: TANYA → SANGGAH → VOTING anonim berkuorum. Hasil terlihat setelah voting ditutup.'
          : 'Formal deliberation: ASK → REBUTTAL → anonymous quorum VOTE. Results shown after close.'}
      </p>

      {error && (
        <p className="sidang-warga__error" role="alert">
          {error}
        </p>
      )}

      {groupId ? (
        <>
          <div className="sidang-warga__compose">
            <label htmlFor="sidang-title" className="sr-only">
              {isId ? 'Judul' : 'Title'}
            </label>
            <input
              id="sidang-title"
              type="text"
              maxLength={120}
              placeholder={isId ? 'Judul usulan' : 'Proposal title'}
              value={title}
              onChange={(e) => { setTitle(e.target.value); }}
            />
            <label htmlFor="sidang-desc" className="sr-only">
              {isId ? 'Deskripsi' : 'Description'}
            </label>
            <textarea
              id="sidang-desc"
              maxLength={1000}
              placeholder={isId ? 'Deskripsi usulan (minimal 10 karakter)' : 'Proposal description'}
              value={description}
              onChange={(e) => { setDescription(e.target.value); }}
            />
            <button
              type="button"
              disabled={busy || title.trim().length < 5 || description.trim().length < 10}
              onClick={() => { void createSession(); }}
            >
              {isId ? 'Ajukan sidang' : 'Submit proposal'}
            </button>
          </div>

          <ul className="sidang-warga__list">
            {sessions.map((s) => (
              <li key={s.id} className="sidang-warga__item">
                <button
                  type="button"
                  onClick={() => { void loadDetail(s.id); }}
                  aria-expanded={detail?.session.id === s.id}
                >
                  <span className="sidang-warga__title">{s.title}</span>
                  <span className="sidang-warga__meta">
                    {s.status} · {isId ? 'kuorum' : 'quorum'} {s.quorumPct}%
                    {' · '}
                    {s.argumentCount} {isId ? 'argumen' : 'arguments'}
                  </span>
                </button>
              </li>
            ))}
            {sessions.length === 0 && (
              <li className="sidang-warga__empty">
                {isId ? 'Belum ada sidang di grup ini.' : 'No assemblies yet.'}
              </li>
            )}
          </ul>

          {detail && (
            <div className="sidang-warga__detail">
              <h4>{detail.session.title}</h4>
              <p>{detail.session.description}</p>
              <p className="sidang-warga__meta">
                {detail.session.status}
                {detail.session.phaseEndsAt
                  ? ` · ${new Date(detail.session.phaseEndsAt).toLocaleString(isId ? 'id-ID' : 'en-US')}`
                  : ''}
              </p>

              {['TANYA', 'SANGGAH'].includes(detail.session.status) && (
                <button
                  type="button"
                  className="sidang-warga__advance"
                  disabled={busy}
                  onClick={() => { void advance(); }}
                >
                  {detail.session.status === 'TANYA'
                    ? isId ? 'Buka fase sanggah' : 'Open rebuttal phase'
                    : isId ? 'Buka voting' : 'Open voting'}
                </button>
              )}

              <ul className="sidang-warga__arguments">
                {detail.arguments.map((a) => (
                  <li key={a.id} className="sidang-warga__argument">
                    <span className="sidang-warga__kind">
                      {KIND_LABEL_ID[a.kind] ?? a.kind}
                    </span>
                    <span>{a.body}</span>
                    <span className="sidang-warga__author">
                      {a.authorName ?? (isId ? 'Anonim' : 'Anonymous')}
                    </span>
                  </li>
                ))}
              </ul>

              {allowedKinds.length > 0 && (
                <div className="sidang-warga__compose">
                  <label htmlFor="sidang-arg-kind" className="sr-only">
                    {isId ? 'Jenis argumen' : 'Argument kind'}
                  </label>
                  <select
                    id="sidang-arg-kind"
                    value={argKind}
                    onChange={(e) => { setArgKind(e.target.value); }}
                  >
                    {allowedKinds.map((k) => (
                      <option key={k} value={k}>
                        {KIND_LABEL_ID[k] ?? k}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="sidang-arg-body" className="sr-only">
                    {isId ? 'Isi argumen' : 'Argument body'}
                  </label>
                  <input
                    id="sidang-arg-body"
                    type="text"
                    maxLength={500}
                    placeholder={isId ? 'Tulis argumen…' : 'Write argument…'}
                    value={argBody}
                    onChange={(e) => { setArgBody(e.target.value); }}
                  />
                  <button
                    type="button"
                    disabled={busy || argBody.trim().length < 5}
                    onClick={() => { void submitArgument(); }}
                  >
                    {isId ? 'Kirim' : 'Send'}
                  </button>
                </div>
              )}

              {detail.session.status === 'VOTING' && (
                <div className="sidang-warga__vote">
                  <label htmlFor="sidang-vote-choice" className="sr-only">
                    {isId ? 'Pilihan' : 'Choice'}
                  </label>
                  <select
                    id="sidang-vote-choice"
                    value={voteChoice}
                    onChange={(e) => {
                      setVoteChoice(e.target.value as 'SETUJU' | 'TOLAK' | 'ABSTAIN');
                    }}
                  >
                    <option value="SETUJU">{isId ? 'Setuju' : 'Agree'}</option>
                    <option value="TOLAK">{isId ? 'Tolak' : 'Reject'}</option>
                    <option value="ABSTAIN">{isId ? 'Abstain' : 'Abstain'}</option>
                  </select>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => { void castVote(); }}
                  >
                    {isId ? 'Kirim suara (anonim)' : 'Cast anonymous vote'}
                  </button>
                </div>
              )}

              {detail.result && (
                <p className="sidang-warga__result">
                  {isId ? 'Hasil (setelah voting ditutup):' : 'Result (after close):'}{' '}
                  {isId ? 'Setuju' : 'Agree'} {detail.result.SETUJU} ·{' '}
                  {isId ? 'Tolak' : 'Reject'} {detail.result.TOLAK} ·{' '}
                  {isId ? 'Abstain' : 'Abstain'} {detail.result.ABSTAIN}
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="sidang-warga__empty">
          {isId
            ? 'Buka grup untuk mengikuti sidang.'
            : 'Open a group to participate in assemblies.'}
        </p>
      )}
    </section>
  );
}
