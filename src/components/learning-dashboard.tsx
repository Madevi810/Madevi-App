'use client';

import Link from 'next/link';
import { readCookie } from '@/lib/cookies';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';

interface PathItem {
  articleId: string;
  title: string;
  position: number;
  examRequired: boolean;
  prerequisiteArticleId: string | null;
  read: boolean;
  attemptsUsed: number;
  bestScore: number | null;
  passed: boolean;
}

interface ProgressData {
  path: { id: string; name: string; description: string; status: string; minimum_score: number };
  cycle: number;
  cycleStatus: string;
  percent: number;
  completedArticles: number;
  totalArticles: number;
  items: PathItem[];
}


export function LearningDashboard({ pathId }: { pathId: string }) {
  const { language } = useLanguage();
  const router = useRouter();
  const isId = language === 'id';
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setDenied(false);
    setLoadError('');
    try {
      const r = await fetch(`/api/v1/learning-paths/${pathId}/progress`);
      if (r.status === 401 || r.status === 403) {
        setDenied(true);
        return;
      }
      if (r.status === 404) {
        setData(null);
        return;
      }
      if (!r.ok) throw new Error('learning path unavailable');
      const j = await r.json();
      if (!j.data) throw new Error('learning path unavailable');
      setData(j.data as ProgressData);
    } catch {
      setData(null);
      setLoadError(
        isId
          ? 'Jalur belajar tidak dapat dimuat karena layanan atau koneksi bermasalah.'
          : 'The learning path could not be loaded because the service or connection failed.',
      );
    } finally {
      setLoading(false);
    }
  }, [pathId, isId]);

  // The loader updates state from an asynchronous API response.
  useEffect(() => {
    load();
  }, [load]);

  async function markRead(articleId: string) {
    setBusy(articleId);
    setMessage('');
    try {
      const r = await fetch(`/api/v1/learning-paths/${pathId}/articles/${articleId}/read`, {
        method: 'POST',
        headers: { 'x-csrf-token': readCookie('madevi_csrf') },
      });
      const j = await r.json();
      if (j.data) await load();
      else setMessage(j.error?.message ?? (isId ? 'Gagal menandai' : 'Failed to mark'));
    } catch {
      setMessage(isId ? 'Gagal menandai (jaringan)' : 'Failed to mark (network)');
    } finally {
      setBusy(null);
    }
  }

  async function startExam(articleId: string) {
    setBusy(articleId);
    setMessage('');
    try {
      const r = await fetch('/api/v1/exams/attempts', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csrf-token': readCookie('madevi_csrf') },
        body: JSON.stringify({ pathId, articleId }),
      });
      const j = await r.json();
      if (j.data?.id) {
        router.push(`/ujian/${j.data.id}`);
        return;
      }
      setMessage(j.error?.message ?? (isId ? 'Gagal memulai ujian' : 'Failed to start exam'));
    } catch {
      setMessage(isId ? 'Gagal memulai (jaringan)' : 'Failed to start (network)');
    } finally {
      setBusy(null);
    }
  }

  if (loading)
    return (
      <div className="page-shell learning-dash page-container">
        <div className="learning-dash__state-card card" role="status" style={{ padding: '1.5rem', display: 'grid', gap: '0.6rem' }}>
          <p className="eyebrow">MADEVI SCHOOL</p>
          <span className="skeleton" style={{ width: '55%', minHeight: '2rem' }} />
          <span className="skeleton" style={{ width: '85%' }} />
          <span className="skeleton" style={{ width: '70%' }} />
          <span className="skeleton" style={{ width: '90%', minHeight: '3rem' }} />
        </div>
      </div>
    );
  if (denied)
    return (
      <div className="page-shell learning-dash page-container">
        <div className="learning-dash__state-card">
          <p className="eyebrow">MADEVI SCHOOL</p>
          <h1>{isId ? 'Masuk untuk melanjutkan belajar' : 'Sign in to continue learning'}</h1>
          <p>
            {isId
              ? 'Jalur, kemajuan, dan hasil asesmen tersimpan untuk akun Member Anda.'
              : 'Your paths, progress, and assessment results are stored with your Member account.'}
          </p>
          <Link href="/auth" className="button button--small">
            {isId ? 'Daftar / Login' : 'Sign up / Log in'}
          </Link>
        </div>
      </div>
    );
  if (loadError)
    return (
      <div className="page-shell learning-dash page-container">
        <div className="learning-dash__state-card" role="alert">
          <p className="eyebrow">MADEVI SCHOOL</p>
          <h1>{isId ? 'Jalur belum dapat dimuat' : 'The path could not be loaded'}</h1>
          <p>{loadError}</p>
          <button type="button" className="button button--small button--secondary" onClick={() => void load()}>
            {isId ? 'Coba lagi' : 'Try again'}
          </button>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="page-shell learning-dash page-container">
        <div className="learning-dash__state-card" role="alert">
          <p className="eyebrow">MADEVI SCHOOL</p>
          <h1>{isId ? 'Jalur tidak ditemukan' : 'Path not found'}</h1>
          <p>{isId ? 'Pilih jalur belajar lain dari katalog School.' : 'Choose another learning path from the School catalogue.'}</p>
          <Link href="/belajar" className="button button--small button--secondary">
            {isId ? 'Kembali ke School' : 'Back to School'}
          </Link>
        </div>
      </div>
    );

  const next = data.items.find((it) => !it.read || (it.examRequired && !it.passed)) ?? null;
  const resetRequired = data.cycleStatus === 'RESET_REQUIRED';

  return (
    <div className="page-shell learning-dash page-container">
      <header className="learning-dash__header">
        <p className="eyebrow">MADEVI SCHOOL · {isId ? 'Jalur belajar' : 'Learning path'}</p>
        <h1 className="article-title">{data.path.name}</h1>
        <p className="learning-dash__desc">{data.path.description}</p>
      </header>

      <section className="learning-dash__progress-card" aria-label={isId ? 'Kemajuan jalur' : 'Path progress'}>
        <div className="learning-dash__progress-meta">
          <span>{isId ? `Siklus ${data.cycle}` : `Cycle ${data.cycle}`}</span>
          <span>{data.completedArticles}/{data.totalArticles} {isId ? 'materi selesai' : 'materials complete'}</span>
          <span>{isId ? 'Nilai lulus' : 'Passing score'} ≥{data.path.minimum_score}</span>
        </div>
        <div className="learning-dash__progress">
          <div className="progress-bar" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${data.percent}%` }} />
          </div>
          <span>{data.percent}%</span>
        </div>
      </section>

      {next && (
        <section className="learning-dash__next" aria-labelledby="learning-next-title">
          <div>
            <p className="eyebrow">{isId ? 'Langkah berikutnya' : 'Next step'}</p>
            <h2 id="learning-next-title">{next.title}</h2>
            <p>
              {next.examRequired
                ? isId
                  ? 'Selesaikan materi ini lalu lanjutkan asesmen ketika tersedia.'
                  : 'Complete this material, then continue with its assessment when available.'
                : isId
                  ? 'Buka materi lalu tandai selesai setelah Anda benar-benar membacanya.'
                  : 'Open the material, then mark it complete once you have genuinely read it.'}
            </p>
          </div>
          <div className="learning-dash__next-actions">
            <Link href={`/artikel/${next.articleId}`} className="button button--small">
              {isId ? 'Buka materi' : 'Open material'}
            </Link>
            {!next.read && (
              <button
                type="button"
                className="button button--small button--secondary"
                disabled={busy === next.articleId}
                onClick={() => void markRead(next.articleId)}
              >
                {isId ? 'Tandai selesai' : 'Mark complete'}
              </button>
            )}
            {next.examRequired && (
              <button
                type="button"
                className="button button--small button--secondary"
                disabled={busy === next.articleId || resetRequired || !next.read}
                onClick={() => void startExam(next.articleId)}
                title={
                  resetRequired
                    ? isId
                      ? 'Selesaikan siklus ulang terlebih dahulu.'
                      : 'Complete the repeat cycle first.'
                    : !next.read
                      ? isId
                        ? 'Tandai materi selesai terlebih dahulu.'
                        : 'Mark the material complete first.'
                      : undefined
                }
              >
                {resetRequired ? (isId ? 'Ulangi siklus dahulu' : 'Repeat cycle first') : isId ? 'Mulai asesmen' : 'Start assessment'}
              </button>
            )}
          </div>
        </section>
      )}
      <section className="learning-dash__curriculum" aria-labelledby="learning-curriculum-title">
        <div className="learning-dash__curriculum-heading">
          <div>
            <p className="eyebrow">{isId ? 'Kurikulum' : 'Curriculum'}</p>
            <h2 id="learning-curriculum-title">{isId ? 'Urutan materi Anda' : 'Your material sequence'}</h2>
          </div>
          <p>{isId ? 'Status diperbarui dari catatan belajar dan asesmen Anda.' : 'Status updates from your learning and assessment records.'}</p>
        </div>
        <ol className="learning-dash__items">
          {data.items.map((it) => (
            <li key={it.articleId} className="learning-dash__item">
              <span className="learning-dash__pos" aria-hidden="true">{it.position}</span>
              <div className="learning-dash__item-main">
                <Link href={`/artikel/${it.articleId}`}>{it.title}</Link>
                <p className="learning-dash__state">
                  {it.read ? (isId ? 'Materi selesai dibaca' : 'Material marked complete') : isId ? 'Belum selesai dibaca' : 'Not yet completed'}
                  {it.examRequired && (
                    <>
                      {' · '}
                      {isId ? 'Asesmen' : 'Assessment'}: {it.passed ? (isId ? 'lulus' : 'passed') : isId ? 'belum lulus' : 'not passed'}
                      {it.attemptsUsed > 0 && ` · ${it.attemptsUsed} ${isId ? 'percobaan tercatat' : 'attempts recorded'}`}
                      {it.bestScore !== null && ` · ${isId ? 'nilai terbaik' : 'best score'} ${it.bestScore}`}
                    </>
                  )}
                </p>
              </div>
              <div className="learning-dash__item-actions">
                {!it.read && (
                  <button
                    type="button"
                    className="button button--small button--secondary"
                    disabled={busy === it.articleId}
                    onClick={() => void markRead(it.articleId)}
                  >
                    {isId ? 'Tandai selesai' : 'Mark complete'}
                  </button>
                )}
                {it.examRequired && (
                  <button
                    type="button"
                    className="button button--small"
                    disabled={busy === it.articleId || resetRequired || !it.read}
                    onClick={() => void startExam(it.articleId)}
                    title={
                      resetRequired
                        ? isId
                          ? 'Selesaikan siklus ulang terlebih dahulu.'
                          : 'Complete the repeat cycle first.'
                        : !it.read
                          ? isId
                            ? 'Tandai materi selesai terlebih dahulu.'
                            : 'Mark the material complete first.'
                          : undefined
                    }
                  >
                    {resetRequired ? (isId ? 'Siklus ulang' : 'Repeat cycle') : isId ? 'Asesmen' : 'Assessment'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
      {message && <p className="info-form__status">{message}</p>}
      {data.cycleStatus === 'RESET_REQUIRED' && (
        <p className="exam-notice">
          {isId
            ? 'Siklus ini perlu diulang sebelum asesmen baru dapat dibuka. Persyaratannya mengikuti konfigurasi jalur di server.'
            : 'This cycle must be repeated before a new assessment can open. The exact requirement follows the path configuration on the server.'}
        </p>
      )}
    </div>
  );
}
