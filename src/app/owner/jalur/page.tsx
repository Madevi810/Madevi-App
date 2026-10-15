'use client';

import { useCallback, useEffect, useState } from 'react';

import { LearningPathEditor } from '@/components/learning-path-editor';

interface PathRow {
  id: string;
  name: string;
  difficulty: string;
  status: string;
  articleCount: number;
}

export default function OwnerJalurPage() {
  const [paths, setPaths] = useState<PathRow[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    setLoadState('loading');
    setLoadError('');
    try {
      const r = await fetch('/api/v1/owner/learning-paths?limit=50');
      const j = await r.json();
      if (!r.ok) throw new Error(j.error?.message ?? `HTTP ${r.status}`);
      setPaths(j.data ?? []);
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
      <h1>Jalur Belajar — Admin</h1>
      <LearningPathEditor />

      {loadState === 'loading' && (
        <p className="status-line" aria-live="polite">Memuat daftar jalur belajar…</p>
      )}

      {loadState === 'error' && (
        <div role="alert" className="owner-panel__error">
          <p className="info-form__status">Gagal memuat: {loadError}</p>
          <button type="button" className="button button--small" onClick={() => void load()}>
            Coba lagi
          </button>
        </div>
      )}

      {loadState === 'ready' && !paths.length && (
        <p>Belum ada jalur belajar yang terdaftar.</p>
      )}

      {loadState === 'ready' && paths.length > 0 && (
        <div className="owner-table-wrap">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kesulitan</th>
                <th>Status</th>
                <th>Artikel</th>
              </tr>
            </thead>
            <tbody>
              {paths.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.difficulty}</td>
                  <td>{p.status}</td>
                  <td>{p.articleCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
