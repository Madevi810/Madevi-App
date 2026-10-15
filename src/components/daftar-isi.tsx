'use client';

/**
 * Daftar Isi artikel — navigasi cepat ke setiap heading.
 * Muncul otomatis jika artikel punya 3+ heading.
 */

import { useState } from 'react';

export interface TocItem {
  position: number;
  text: string;
}

export function DaftarIsi({ items, isId }: { items: TocItem[]; isId: boolean }) {
  const [open, setOpen] = useState(false);

  if (items.length < 3) return null;

  const scrollTo = (position: number) => {
    const el = document.getElementById(`heading-${position}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setOpen(false);
  };

  return (
    <nav className="daftar-isi" aria-label={isId ? 'Daftar isi' : 'Table of contents'}>
      <button
        type="button"
        className="daftar-isi__toggle button button--small button--secondary"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? '▾' : '▸'} {isId ? `Daftar Isi (${items.length})` : `Contents (${items.length})`}
      </button>
      {open && (
        <ol className="daftar-isi__list">
          {items.map((item) => (
            <li key={item.position}>
              <button
                type="button"
                className="daftar-isi__link"
                onClick={() => scrollTo(item.position)}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
