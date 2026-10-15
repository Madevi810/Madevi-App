'use client';

/**
 * KlinikIde — "Klinik Ide" (INOVASI-20261014-1145 IDE 2).
 *
 * Protokol kritik karya 3 fase: BERTANYA (hanya pertanyaan) →
 * MEMBEDAH (hanya saran konstruktif) → APRESIASI (vote Pilihan Klinik).
 *
 * Semua aksi inline — DILARANG popup/modal (Prinsip UI Madevi).
 */

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';
import { allowedFeedbackKind, CLINIC_TEMPLATES } from '@/services/clinic';

interface ClinicSession {
  id: string;
  postId: string;
  status: string;
  phaseEndsAt: string | null;
  postBody: string;
  postAuthorName: string | null;
}

interface ClinicFeedbackItem {
  id: string;
  kind: string;
  body: string;
  authorName: string | null;
  createdAt: string;
}

interface ClinicDetail {
  session: ClinicSession;
  feedback: ClinicFeedbackItem[];
  voteCount: number;
}

const KIND_LABEL_ID: Record<string, string> = {
  PERTANYAAN: 'Pertanyaan',
  SARAN: 'Saran',
  APRESIASI: 'Apresiasi',
};

export function KlinikIde() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [clinics, setClinics] = useState<ClinicSession[]>([]);
  const [detail, setDetail] = useState<ClinicDetail | null>(null);
  const [feedbackBody, setFeedbackBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClinics = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/line/clinic?limit=20');
      if (!res.ok) throw new Error('Gagal memuat klinik');
      const json = await res.json();
      setClinics(Array.isArray(json.data) ? json.data : []);
    } catch {
      setError(isId ? 'Gagal memuat klinik' : 'Failed to load clinics');
    }
  }, [isId]);

  useEffect(() => {
    void loadClinics();
  }, [loadClinics]);

  const loadDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/v1/line/clinic/${id}`);
      if (!res.ok) throw new Error('Gagal memuat detail');
      const json = await res.json();
      setDetail(json.data ?? null);
    } catch {
      setError(isId ? 'Gagal memuat detail klinik' : 'Failed to load clinic detail');
    }
  }, [isId]);

  const submitFeedback = useCallback(async () => {
    if (!detail) return;
    setBusy(true);
    setError(null);
    try {
      const kind = allowedFeedbackKind(detail.session.status as 'BERTANYA' | 'MEMBEDAH' | 'APRESIASI')[0];
      const res = await fetch(`/api/v1/line/clinic/${detail.session.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, body: feedbackBody }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal mengirim feedback');
      }
      setFeedbackBody('');
      await loadDetail(detail.session.id);
      await loadClinics();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal mengirim feedback');
    } finally {
      setBusy(false);
    }
  }, [detail, feedbackBody, loadDetail, loadClinics]);

  const advance = useCallback(async () => {
    if (!detail) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/line/clinic/${detail.session.id}/advance`, {
        method: 'POST',
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal memajukan fase');
      }
      await loadDetail(detail.session.id);
      await loadClinics();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memajukan fase');
    } finally {
      setBusy(false);
    }
  }, [detail, loadDetail, loadClinics]);

  const vote = useCallback(async () => {
    if (!detail) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/line/clinic/${detail.session.id}/vote`, {
        method: 'POST',
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
  }, [detail, loadDetail]);

  const templates = detail
    ? CLINIC_TEMPLATES[detail.session.status] ?? []
    : [];

  return (
    <section className="klinik-ide" aria-labelledby="klinik-ide-title">
      <h3 id="klinik-ide-title">
        {isId ? 'Klinik Ide' : 'Idea Clinic'}
      </h3>
      <p className="klinik-ide__hint">
        {isId
          ? 'Kritik karya dengan protokol: BERTANYA → MEMBEDAH → APRESIASI. Setiap fase membatasi jenis feedback.'
          : 'Work critique protocol: ASK → DISSECT → APPRECIATE. Each phase restricts feedback type.'}
      </p>

      {error && (
        <p className="klinik-ide__error" role="alert">
          {error}
        </p>
      )}

      <ul className="klinik-ide__list">
        {clinics.map((c) => (
          <li key={c.id} className="klinik-ide__item">
            <button
              type="button"
              onClick={() => { void loadDetail(c.id); }}
              aria-expanded={detail?.session.id === c.id}
            >
              <span className="klinik-ide__title">
                {c.postBody.slice(0, 60)}
                {c.postBody.length > 60 ? '…' : ''}
              </span>
              <span className="klinik-ide__meta">
                {c.status}
                {c.postAuthorName ? ` · ${c.postAuthorName}` : ''}
              </span>
            </button>
          </li>
        ))}
        {clinics.length === 0 && (
          <li className="klinik-ide__empty">
            {isId ? 'Belum ada klinik aktif.' : 'No active clinics.'}
          </li>
        )}
      </ul>

      {detail && (
        <div className="klinik-ide__detail">
          <h4>
            {isId ? 'Karya' : 'Work'}: {detail.session.postBody.slice(0, 80)}
            {detail.session.postBody.length > 80 ? '…' : ''}
          </h4>
          <p className="klinik-ide__meta">
            {isId ? 'Fase' : 'Phase'}: {detail.session.status}
            {detail.session.phaseEndsAt
              ? ` · ${new Date(detail.session.phaseEndsAt).toLocaleString(isId ? 'id-ID' : 'en-US')}`
              : ''}
          </p>

          {/* Tombol advance fase (pemilik karya) */}
          {detail.session.status !== 'SELESAI' && (
            <button
              type="button"
              className="klinik-ide__advance"
              disabled={busy}
              onClick={() => { void advance(); }}
            >
              {isId ? 'Maju fase' : 'Advance phase'}
            </button>
          )}

          <ul className="klinik-ide__feedback">
            {detail.feedback.map((f) => (
              <li key={f.id} className="klinik-ide__feedback-item">
                <span className="klinik-ide__kind">
                  {KIND_LABEL_ID[f.kind] ?? f.kind}
                </span>
                <span>{f.body}</span>
                <span className="klinik-ide__author">
                  {f.authorName ?? (isId ? 'Anonim' : 'Anonymous')}
                </span>
              </li>
            ))}
            {detail.feedback.length === 0 && (
              <li className="klinik-ide__empty">
                {isId ? 'Belum ada feedback.' : 'No feedback yet.'}
              </li>
            )}
          </ul>

          {/* Template komentar sekali-klik (opsional) */}
          {templates.length > 0 && detail.session.status !== 'SELESAI' && (
            <div className="klinik-ide__templates">
              {templates.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="klinik-ide__template"
                  onClick={() => { setFeedbackBody(t); }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Form feedback — inline */}
          {detail.session.status !== 'SELESAI' && (
            <div className="klinik-ide__compose">
              <label htmlFor="klinik-feedback" className="sr-only">
                {isId ? 'Feedback' : 'Feedback'}
              </label>
              <input
                id="klinik-feedback"
                type="text"
                maxLength={500}
                placeholder={
                  detail.session.status === 'BERTANYA'
                    ? isId ? 'Tulis pertanyaan…' : 'Write a question…'
                    : detail.session.status === 'MEMBEDAH'
                      ? isId ? 'Tulis saran konstruktif…' : 'Write constructive advice…'
                      : isId ? 'Tulis apresiasi…' : 'Write appreciation…'
                }
                value={feedbackBody}
                onChange={(e) => { setFeedbackBody(e.target.value); }}
              />
              <button
                type="button"
                disabled={busy || feedbackBody.trim().length < 5}
                onClick={() => { void submitFeedback(); }}
              >
                {isId ? 'Kirim' : 'Send'}
              </button>
            </div>
          )}

          {/* Vote Pilihan Klinik — hanya fase APRESIASI */}
          {detail.session.status === 'APRESIASI' && (
            <button
              type="button"
              className="klinik-ide__vote"
              disabled={busy}
              onClick={() => { void vote(); }}
            >
              {isId ? `Vote Pilihan Klinik (${detail.voteCount})` : `Clinic Pick vote (${detail.voteCount})`}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
