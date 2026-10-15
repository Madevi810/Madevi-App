'use client';

/**
 * SilsilahKarya — "Silsilah Karya" (INOVASI-20261014-1245 IDE 1).
 *
 * Pohon remix karya: karya yang meremix karya lain divisualisasikan
 * sebagai pohon (nested list), lengkap dengan badge PERTAMA/REMIXED/
 * POPULER/LEGENDA/MENTOR.
 *
 * Semua aksi inline — DILARANG popup/modal (Prinsip UI Madevi).
 */

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from './theme-provider';
import { LINEAGE_BADGE_META } from '@/services/lineage';

interface KaryaItem {
  id: string;
  body: string;
  authorName: string | null;
  createdAt: string;
  badges: string[];
  remixCount: number;
}

interface LineageNode {
  postId: string;
  parentKaryaId: string | null;
  authorName: string | null;
  depth: number;
  children: LineageNode[];
}

interface LineageDetail {
  tree: LineageNode[];
  ancestors: { postId: string; depth: number }[];
  descendantCount: number;
}

function renderTree(nodes: LineageNode[]): React.ReactNode {
  return (
    <ul className="silsilah__tree-list">
      {nodes.map((node) => (
        <li key={node.postId} className="silsilah__tree-node">
          <span className="silsilah__node-author">
            {node.authorName ?? 'Anonim'}
          </span>
          <span className="silsilah__node-depth">
            {'—'.repeat(Math.min(node.depth, 3))}
          </span>
          {node.children.length > 0 && renderTree(node.children)}
        </li>
      ))}
    </ul>
  );
}

export function SilsilahKarya() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [karya, setKarya] = useState<KaryaItem[]>([]);
  const [lineage, setLineage] = useState<LineageDetail | null>(null);
  const [parentKaryaId, setParentKaryaId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadKarya = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/line/karya?limit=50');
      if (!res.ok) throw new Error('Gagal memuat karya');
      const json = await res.json();
      setKarya(Array.isArray(json.data) ? json.data : []);
    } catch {
      setError(isId ? 'Gagal memuat karya' : 'Failed to load works');
    }
  }, [isId]);

  useEffect(() => {
    void loadKarya();
  }, [loadKarya]);

  const loadLineage = useCallback(async (postId: string) => {
    try {
      const res = await fetch(`/api/v1/line/karya/${postId}/lineage`);
      if (!res.ok) throw new Error('Gagal memuat silsilah');
      const json = await res.json();
      setLineage(json.data ?? null);
    } catch {
      setError(isId ? 'Gagal memuat silsilah' : 'Failed to load lineage');
    }
  }, [isId]);

  const setParent = useCallback(async (postId: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/line/karya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, parentKaryaId }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal menetapkan remix');
      }
      setParentKaryaId('');
      await loadKarya();
      await loadLineage(postId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menetapkan remix');
    } finally {
      setBusy(false);
    }
  }, [parentKaryaId, loadKarya, loadLineage]);

  const clearParent = useCallback(async (postId: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/line/karya/${postId}/parent`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error?.message ?? 'Gagal menghapus remix');
      }
      await loadKarya();
      await loadLineage(postId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menghapus remix');
    } finally {
      setBusy(false);
    }
  }, [loadKarya, loadLineage]);

  return (
    <section className="silsilah" aria-labelledby="silsilah-title">
      <h3 id="silsilah-title">
        {isId ? 'Silsilah Karya' : 'Work Lineage'}
      </h3>
      <p className="silsilah__hint">
        {isId
          ? 'Lihat karya mana yang meremix karya lain. Badge diberikan otomatis: PERTAMA, REMIXED, POPULER, LEGENDA, MENTOR.'
          : 'See which works remix which. Badges are awarded automatically.'}
      </p>

      {error && (
        <p className="silsilah__error" role="alert">
          {error}
        </p>
      )}

      {/* Daftar badge + keterangan */}
      <ul className="silsilah__badges">
        {Object.entries(LINEAGE_BADGE_META).map(([badge, desc]) => (
          <li key={badge} className="silsilah__badge-item">
            <strong>{badge}</strong> — {desc}
          </li>
        ))}
      </ul>

      <ul className="silsilah__list">
        {karya.map((k) => (
          <li key={k.id} className="silsilah__item">
            <button
              type="button"
              onClick={() => { void loadLineage(k.id); }}
              aria-expanded={lineage !== null}
            >
              <span className="silsilah__title">
                {k.body.slice(0, 60)}
                {k.body.length > 60 ? '…' : ''}
              </span>
              <span className="silsilah__meta">
                {k.authorName ?? (isId ? 'Anonim' : 'Anonymous')}
                {' · '}
                {isId ? 'remix' : 'remix'}: {k.remixCount}
                {k.badges.length > 0 ? ` · ${k.badges.join(', ')}` : ''}
              </span>
            </button>
            {/* Form remix — inline */}
            <div className="silsilah__remix-form">
              <label htmlFor={`remix-${k.id}`} className="sr-only">
                {isId ? 'ID karya parent' : 'Parent work ID'}
              </label>
              <input
                id={`remix-${k.id}`}
                type="text"
                placeholder={isId ? 'ID karya parent…' : 'Parent work ID…'}
                value={parentKaryaId}
                onChange={(e) => { setParentKaryaId(e.target.value); }}
              />
              <button
                type="button"
                disabled={busy || parentKaryaId.trim().length === 0}
                onClick={() => { void setParent(k.id); }}
              >
                {isId ? 'Tandai remix' : 'Mark as remix'}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => { void clearParent(k.id); }}
              >
                {isId ? 'Hapus remix' : 'Clear remix'}
              </button>
            </div>
          </li>
        ))}
        {karya.length === 0 && (
          <li className="silsilah__empty">
            {isId ? 'Belum ada karya.' : 'No works yet.'}
          </li>
        )}
      </ul>

      {lineage && (
        <div className="silsilah__detail">
          <h4>
            {isId ? 'Pohon silsilah' : 'Lineage tree'} ({lineage.descendantCount}{' '}
            {isId ? 'remix' : 'remix'})
          </h4>
          {lineage.tree.length > 0 ? (
            renderTree(lineage.tree)
          ) : (
            <p className="silsilah__empty">
              {isId ? 'Tidak ada remix.' : 'No remixes.'}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
