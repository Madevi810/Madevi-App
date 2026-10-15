'use client';

/**
 * Lanjutkan Membaca — riwayat artikel yang dibuka, tersimpan lokal.
 * Tampil di beranda sebagai jalan pintas kembali ke bacaan terakhir.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';

export interface ReadHistoryItem {
  id: string;
  title: string;
  slug?: string;
  at: number;
}

const KEY = 'madevi:read-history';
const MAX = 10;

/** Catat artikel yang dibuka. Dipanggil dari halaman artikel. */
export function recordArticleRead(item: Omit<ReadHistoryItem, 'at'>): void {
  try {
    const raw = localStorage.getItem(KEY);
    const list: ReadHistoryItem[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((x) => x.id !== item.id);
    filtered.unshift({ ...item, at: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, MAX)));
  } catch {
    // Abaikan.
  }
}

/** Baca riwayat. */
export function getReadHistory(): ReadHistoryItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as ReadHistoryItem[];
    return Array.isArray(list) ? list.slice(0, MAX) : [];
  } catch {
    return [];
  }
}

/** Hapus riwayat. */
export function clearReadHistory(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Abaikan.
  }
}

export function LanjutkanMembaca({ isId }: { isId: boolean }) {
  const [items, setItems] = useState<ReadHistoryItem[]>([]);

  useEffect(() => {
    setItems(getReadHistory());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="lanjutkan-membaca" aria-label={isId ? 'Lanjutkan membaca' : 'Continue reading'}>
      <div className="lanjutkan-membaca__header">
        <h2 className="lanjutkan-membaca__title">
          {isId ? '📖 Lanjutkan Membaca' : '📖 Continue Reading'}
        </h2>
        <button
          type="button"
          className="button button--small button--ghost"
          onClick={() => {
            clearReadHistory();
            setItems([]);
          }}
        >
          {isId ? 'Hapus' : 'Clear'}
        </button>
      </div>
      <ul className="lanjutkan-membaca__list">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.slug ? `/artikel/${item.slug}` : `/artikel/${item.id}`}
              className="lanjutkan-membaca__card"
            >
              <span className="lanjutkan-membaca__card-title">{item.title}</span>
              <span className="lanjutkan-membaca__card-time">
                {new Date(item.at).toLocaleDateString(isId ? 'id-ID' : 'en-US', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
