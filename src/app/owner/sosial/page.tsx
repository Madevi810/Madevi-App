'use client';

import { useCallback, useEffect, useState } from 'react';

interface PostRow {
  id: string;
  body: string;
  authorName: string;
  moderationStatus: string;
  createdAt: string;
}

export default function OwnerSosialPage() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    setLoadState('loading');
    setLoadError('');
    try {
      const r = await fetch('/api/v1/social/posts?limit=50');
      const j = await r.json();
      if (!r.ok) throw new Error(j.error?.message ?? `HTTP ${r.status}`);
      setPosts(j.data ?? []);
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
      <h1>Social — Admin</h1>

      {loadState === 'loading' && (
        <p className="status-line" aria-live="polite">Memuat data posting sosial…</p>
      )}

      {loadState === 'error' && (
        <div role="alert" className="owner-panel__error">
          <p className="info-form__status">Gagal memuat: {loadError}</p>
          <button type="button" className="button button--small" onClick={() => void load()}>
            Coba lagi
          </button>
        </div>
      )}

      {loadState === 'ready' && !posts.length && (
        <p>Tidak ada posting yang perlu ditinjau.</p>
      )}

      {loadState === 'ready' && posts.length > 0 && (
        <div className="owner-table-wrap">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Body</th>
                <th>Moderasi</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>{p.authorName}</td>
                  <td>{p.body?.substring(0, 100)}</td>
                  <td>{p.moderationStatus}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
