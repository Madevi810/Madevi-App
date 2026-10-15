'use client';

import { useCallback, useEffect, useState } from 'react';

interface AttemptRow {
  id: string;
  principalName: string;
  status: string;
  score: number;
  createdAt: string;
}

export default function OwnerUjianPage() {
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    setLoadState('loading');
    setLoadError('');
    try {
      const r = await fetch('/api/v1/owner/exams/queue');
      const j = await r.json();
      if (!r.ok) throw new Error(j.error?.message ?? `HTTP ${r.status}`);
      setAttempts(j.data ?? []);
      setLoadState('ready');
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err));
      setLoadState('error');
    }
  }, []);

  // The loader updates state from an asynchronous API response.
  useEffect(() => {
    load();
  }, [load]);

  return (
    <main id="main-content" className="owner-panel">
      <h1>Ujian — Admin</h1>

      {loadState === 'loading' && (
        <p className="status-line" aria-live="polite">Memuat antrean ujian…</p>
      )}

      {loadState === 'error' && (
        <div role="alert" className="owner-panel__error">
          <p className="info-form__status">Gagal memuat: {loadError}</p>
          <button type="button" className="button button--small" onClick={() => void load()}>
            Coba lagi
          </button>
        </div>
      )}

      {loadState === 'ready' && !attempts.length && (
        <p>Tidak ada ujian dalam antrean yang perlu ditinjau.</p>
      )}

      {loadState === 'ready' && attempts.length > 0 && (
        <div className="owner-table-wrap">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Peserta</th>
                <th>Status</th>
                <th>Nilai</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id}>
                  <td>{a.principalName}</td>
                  <td>{a.status}</td>
                  <td>{a.score ?? '-'}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
