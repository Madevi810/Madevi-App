'use client';

/**
 * ChecklistInteraktif — mengubah LIST block artikel tutorial menjadi
 * daftar langkah yang bisa dicentang, dengan progres tersimpan lokal.
 *
 * Dipakai untuk artikel Tutorial & Problem Solve yang formatnya
 * langkah-demi-langkah: masalah → persiapan → cara → penyelesaian.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

interface ChecklistInteraktifProps {
  articleId: string;
  items: string[];
  isId: boolean;
}

function storageKey(articleId: string): string {
  return `madevi:checklist:${articleId}`;
}

export function ChecklistInteraktif({ articleId, items, isId }: ChecklistInteraktifProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [enabled, setEnabled] = useState(false);

  // Muat progres tersimpan.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(articleId));
      if (raw) {
        const arr = JSON.parse(raw) as number[];
        setChecked(new Set(arr.filter((n) => n >= 0 && n < items.length)));
      }
    } catch {
      // Abaikan; mulai dari kosong.
    }
  }, [articleId, items.length]);

  // Simpan progres.
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(articleId), JSON.stringify([...checked]));
    } catch {
      // Storage penuh/dinonaktifkan; abaikan.
    }
  }, [articleId, checked]);

  const toggle = useCallback((index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setChecked(new Set());
  }, []);

  const progress = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round((checked.size / items.length) * 100);
  }, [checked.size, items.length]);

  const complete = checked.size === items.length && items.length > 0;

  return (
    <div className="checklist-interaktif">
      <div className="checklist-interaktif__toolbar">
        <button
          type="button"
          className="button button--small button--secondary"
          onClick={() => setEnabled((v) => !v)}
          aria-pressed={enabled}
        >
          {enabled
            ? isId ? '✓ Mode checklist aktif' : '✓ Checklist mode on'
            : isId ? '☐ Jadikan checklist' : '☐ Make checklist'}
        </button>
        {enabled && checked.size > 0 && (
          <button
            type="button"
            className="button button--small button--ghost"
            onClick={reset}
          >
            {isId ? 'Ulangi' : 'Reset'}
          </button>
        )}
      </div>

      {enabled && (
        <div className="checklist-interaktif__progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="checklist-interaktif__bar" style={{ width: `${progress}%` }} />
          <span className="checklist-interaktif__label">
            {checked.size}/{items.length} ({progress}%)
          </span>
        </div>
      )}

      {enabled ? (
        <ul className="checklist-interaktif__list">
          {items.map((item, i) => {
            const done = checked.has(i);
            return (
              <li key={i} className={done ? 'checklist-interaktif__item checklist-interaktif__item--done' : 'checklist-interaktif__item'}>
                <label>
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggle(i)}
                    aria-label={`${isId ? 'Langkah' : 'Step'} ${i + 1}`}
                  />
                  <span className="checklist-interaktif__number">{i + 1}</span>
                  <span className="checklist-interaktif__text">{item}</span>
                </label>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="article-list-block">
          {items.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}

      {enabled && complete && (
        <p className="checklist-interaktif__complete" role="status">
          {isId
            ? '🎉 Semua langkah selesai! Kerja bagus.'
            : '🎉 All steps complete! Great job.'}
        </p>
      )}
    </div>
  );
}
