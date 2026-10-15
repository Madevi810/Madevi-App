'use client';

import Link from 'next/link';
import { readCookie } from '@/lib/cookies';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from './theme-provider';

interface McOption {
  key: string;
  text: string;
}
interface McQuestion {
  id: string;
  position: number;
  stem: string;
  options: unknown;
  selectedKey: string | null;
  correctKey?: string;
  explanation?: string;
  correct?: boolean | null;
  points?: number | null;
}
interface EssayQuestion {
  id: string;
  position: number;
  stem: string;
  answerText: string;
  rubric?: string;
  score?: number | null;
  ownerNote?: string | null;
}
interface AttemptView {
  id: string;
  status: string;
  remainingSeconds: number;
  serverNow: string;
  resultFinal: boolean;
  scores: {
    pg: number | null;
    essay: number | null;
    total: number | null;
    passed: boolean | null;
  } | null;
  mcQuestions: McQuestion[];
  essayQuestions: EssayQuestion[];
}


function normalizeOptions(raw: unknown): McOption[] {
  if (!Array.isArray(raw)) return [];
  const out: McOption[] = [];
  for (const item of raw) {
    if (typeof item === 'string') out.push({ key: item.slice(0, 1), text: item });
    else if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>;
      const key = typeof o.key === 'string' ? o.key : '?';
      const text =
        typeof o.text === 'string'
          ? o.text
          : typeof o.label === 'string'
            ? o.label
            : JSON.stringify(o);
      out.push({ key, text });
    }
  }
  return out;
}

const STATUS_ID: Record<string, string> = {
  ACTIVE: 'Berlangsung',
  SUBMITTED: 'Terkirim',
  GRADING: 'Dinilai',
  REVIEW: 'Tinjau ulang',
  GRADED: 'Selesai',
};
const STATUS_EN: Record<string, string> = {
  ACTIVE: 'In progress',
  SUBMITTED: 'Submitted',
  GRADING: 'Grading',
  REVIEW: 'Review',
  GRADED: 'Graded',
};

export function ExamAttemptPage({ attemptId }: { attemptId: string }) {
  const { language } = useLanguage();
  const isId = language === 'id';
  const statusMap = isId ? STATUS_ID : STATUS_EN;
  const [attempt, setAttempt] = useState<AttemptView | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [mc, setMc] = useState<Record<string, string>>({});
  const [essays, setEssays] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const hydrated = useRef(false);
  const autoSubmitted = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setDenied(false);
    try {
      const r = await fetch(`/api/v1/exams/attempts/${attemptId}`);
      if (r.status === 401 || r.status === 403) {
        setDenied(true);
        return;
      }
      if (!r.ok)
        throw new Error(isId ? 'Attempt gagal dimuat.' : 'The attempt could not be loaded.');
      const j = await r.json();
      const data = j.data as AttemptView | undefined;
      if (data) {
        setAttempt(data);
        setSecondsLeft(data.remainingSeconds ?? 0);
        const mcInit: Record<string, string> = {};
        for (const q of data.mcQuestions ?? []) if (q.selectedKey) mcInit[q.id] = q.selectedKey;
        const esInit: Record<string, string> = {};
        for (const q of data.essayQuestions ?? []) esInit[q.id] = q.answerText ?? '';
        setMc(mcInit);
        setEssays(esInit);
        hydrated.current = true;
      }
    } catch {
      /* jaringan: tampilkan pesan di bawah */
    } finally {
      setLoading(false);
    }
  }, [attemptId, isId]);

  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [load]);

  // Hitung mundur server; waktu habis → auto-submit sekali.
  useEffect(() => {
    if (!attempt || attempt.status !== 'ACTIVE') return;
    if (secondsLeft <= 0) {
      if (!autoSubmitted.current) {
        autoSubmitted.current = true;
        submit(true);
      }
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, attempt?.status]);

  async function persist(silent: boolean) {
    if (!attempt || attempt.status !== 'ACTIVE' || !hydrated.current) return;
    setSaving(true);
    if (!silent) setSaveMsg('');
    try {
      const mcAnswers = Object.entries(mc).map(([questionId, selectedKey]) => ({
        questionId,
        selectedKey,
      }));
      const essayAnswers = Object.entries(essays).map(([questionId, answerText]) => ({
        questionId,
        answerText,
      }));
      const r = await fetch(`/api/v1/exams/attempts/${attemptId}/answers`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json', 'x-csrf-token': readCookie('madevi_csrf') },
        body: JSON.stringify({ mcAnswers, essayAnswers }),
      });
      const j = await r.json();
      if (j.data) {
        setSaveMsg(isId ? 'Tersimpan otomatis' : 'Autosaved');
        if (typeof j.data.remainingSeconds === 'number') setSecondsLeft(j.data.remainingSeconds);
      } else {
        setSaveMsg(j.error?.message ?? (isId ? 'Gagal menyimpan' : 'Save failed'));
      }
    } catch {
      setSaveMsg(isId ? 'Gagal menyimpan (jaringan)' : 'Save failed (network)');
    } finally {
      setSaving(false);
    }
  }

  // Autosave debounce 2,5 detik setelah jawaban berubah.
  useEffect(() => {
    if (!hydrated.current || !attempt || attempt.status !== 'ACTIVE') return;
    const t = setTimeout(() => {
      void persist(true);
    }, 2500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mc, essays]);

  async function submit(auto = false) {
    if (!attempt || submitting) return;
    if (!auto) {
      const mcCount = Object.keys(mc).length;
      const esCount = Object.values(essays).filter((t) => t.trim()).length;
      const total = attempt.mcQuestions.length + attempt.essayQuestions.length;
      const ok = window.confirm(
        isId
          ? `Kirim jawaban? PG ${mcCount}/${attempt.mcQuestions.length}, esai ${esCount}/${attempt.essayQuestions.length}. Seluruh ${total} wajib diisi.`
          : `Submit answers? MC ${mcCount}/${attempt.mcQuestions.length}, essays ${esCount}/${attempt.essayQuestions.length}. All ${total} required.`,
      );
      if (!ok) return;
    }
    setSubmitting(true);
    try {
      // Jawaban terakhir harus sampai ke server sebelum submit manual maupun timeout.
      // Tanpa ini, perubahan dalam jendela debounce terakhir dapat tertinggal.
      await persist(true);
      const r = await fetch(`/api/v1/exams/attempts/${attemptId}/submit`, {
        method: 'POST',
        headers: { 'x-csrf-token': readCookie('madevi_csrf') },
      });
      const j = await r.json();
      if (j.data) await load();
      else setSaveMsg(j.error?.message ?? (isId ? 'Gagal mengirim' : 'Submit failed'));
    } catch {
      setSaveMsg(isId ? 'Gagal mengirim (jaringan)' : 'Submit failed (network)');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <div className="page-shell">
        <p>{isId ? 'Memuat…' : 'Loading…'}</p>
      </div>
    );
  if (denied)
    return (
      <div className="page-shell">
        <h1>{isId ? 'Ujian' : 'Exam'}</h1>
        <p>
          {isId
            ? 'Login sebagai Member untuk mengerjakan ujian.'
            : 'Log in as a Member to take the exam.'}{' '}
          <Link href="/auth">{isId ? 'Daftar / Login' : 'Sign up / Log in'}</Link>
        </p>
      </div>
    );
  if (!attempt)
    return (
      <div className="page-shell">
        <p>{isId ? 'Attempt tidak ditemukan.' : 'Attempt not found.'}</p>
      </div>
    );

  const mm = Math.floor(secondsLeft / 60);
  const ss = (secondsLeft % 60).toString().padStart(2, '0');
  const mcAnswered = Object.keys(mc).length;
  const esAnswered = Object.values(essays).filter((t) => t.trim()).length;
  const editable = attempt.status === 'ACTIVE';

  return (
    <div className="page-shell exam-page">
      <h1>{isId ? 'Ujian' : 'Exam'}</h1>
      <div className="exam-info">
        <p>
          {isId ? 'Status:' : 'Status:'} {statusMap[attempt.status] ?? attempt.status}
        </p>
        {editable && (
          <p>
            {isId ? 'Waktu tersisa (server):' : 'Time left (server):'} {mm}:{ss}
          </p>
        )}
        <p>
          {mcAnswered}/{attempt.mcQuestions.length} {isId ? 'PG' : 'MC'} · {esAnswered}/
          {attempt.essayQuestions.length} {isId ? 'esai' : 'essays'}
        </p>
        {attempt.resultFinal && attempt.scores && (
          <p>
            PG {attempt.scores.pg} + {isId ? 'Esai' : 'Essay'} {attempt.scores.essay} ={' '}
            <strong>{attempt.scores.total}</strong>
            {' · '}
            {attempt.scores.passed
              ? isId
                ? 'LULUS'
                : 'PASS'
              : isId
                ? 'BELUM LULUS'
                : 'NOT YET PASS'}
          </p>
        )}
        {!attempt.resultFinal && attempt.status !== 'ACTIVE' && (
          <p className="exam-notice">
            {isId
              ? 'Menunggu Admin menilai esai. Nilai, kunci, dan pembahasan tampil setelah selesai.'
              : 'Waiting for Admin essay grading. Scores, keys, and explanations appear when done.'}
          </p>
        )}
      </div>

      <section aria-labelledby="pg-title">
        <h2 id="pg-title">
          {isId ? 'Pilihan ganda' : 'Multiple choice'}
        </h2>
        <ol className="exam-questions">
          {attempt.mcQuestions.map((q) => (
            <li key={q.id} className="exam-q">
              <p className="exam-q__stem">
                {q.position}. {q.stem}
              </p>
              <div
                className="exam-q__options"
                role="radiogroup"
                aria-label={`${isId ? 'Soal' : 'Question'} ${q.position}`}
              >
                {normalizeOptions(q.options).map((o) => (
                  <label key={o.key} className="exam-q__option">
                    <input
                      type="radio"
                      name={`mc-${q.id}`}
                      value={o.key}
                      checked={mc[q.id] === o.key}
                      disabled={!editable}
                      onChange={() => setMc((prev) => ({ ...prev, [q.id]: o.key }))}
                    />
                    <strong>{o.key}.</strong> {o.text}
                  </label>
                ))}
              </div>
              {q.correctKey && (
                <p className="exam-q__key">
                  {isId ? 'Kunci:' : 'Key:'} {q.correctKey}
                  {typeof q.points === 'number' && (
                    <>
                      {' '}
                      · {q.points} {isId ? 'poin' : 'pts'}
                    </>
                  )}
                  {q.explanation && <> — {q.explanation}</>}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="esai-title">
        <h2 id="esai-title">{isId ? 'Esai' : 'Essays'}</h2>
        <ol className="exam-questions">
          {attempt.essayQuestions.map((q) => (
            <li key={q.id} className="exam-q">
              <p className="exam-q__stem">
                {q.position}. {q.stem}
              </p>
              <textarea
                value={essays[q.id] ?? ''}
                onChange={(e) => setEssays((prev) => ({ ...prev, [q.id]: e.target.value }))}
                disabled={!editable}
                rows={5}
                maxLength={10000}
                placeholder={isId ? 'Tulis jawaban…' : 'Write your answer…'}
                aria-label={`${isId ? 'Jawaban esai' : 'Essay answer'} ${q.position}`}
              />
              {typeof q.score === 'number' && (
                <p className="exam-q__key">
                  {isId ? 'Nilai:' : 'Score:'} {q.score}
                  {q.ownerNote && <> — {q.ownerNote}</>}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      {editable && (
        <div className="exam-actions">
          <button
            type="button"
            className="button button--secondary"
            onClick={() => void persist(false)}
            disabled={saving}
          >
            {saving ? '…' : isId ? 'Simpan sekarang' : 'Save now'}
          </button>
          <button
            type="button"
            className="button"
            onClick={() => void submit(false)}
            disabled={submitting}
          >
            {submitting ? '…' : isId ? 'Kirim jawaban' : 'Submit answers'}
          </button>
          {saveMsg && <p className="info-form__status">{saveMsg}</p>}
        </div>
      )}
    </div>
  );
}
