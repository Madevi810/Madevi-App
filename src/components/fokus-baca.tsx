'use client';

/**
 * Mode Fokus Baca — pengalaman baca bebas distraksi untuk artikel.
 * Sembunyikan sidebar/header, atur ukuran font, lacak progres baca.
 */

import { useCallback, useEffect, useState } from 'react';

interface FokusBacaProps {
  isId: boolean;
}

const FONT_KEY = 'madevi:fokus-font-size';

export function FokusBacaToggle({ isId }: FokusBacaProps) {
  const [active, setActive] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FONT_KEY);
      if (saved) setFontSize(Number(saved) || 100);
    } catch {
      // Abaikan.
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('fokus-baca-aktif', active);
    return () => {
      document.body.classList.remove('fokus-baca-aktif');
    };
  }, [active ]);

  useEffect(() => {
    document.documentElement.style.setProperty('--fokus-font-scale', `${fontSize / 100}`);
    try {
      localStorage.setItem(FONT_KEY, String(fontSize));
    } catch {
      // Abaikan.
    }
  }, [fontSize]);

  // Escape untuk keluar.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  const adjustFont = useCallback((delta: number) => {
    setFontSize((v) => Math.min(150, Math.max(80, v + delta)));
  }, []);

  return (
    <>
      <button
        type="button"
        className="button button--small button--secondary"
        onClick={() => setActive(true)}
        aria-label={isId ? 'Mode fokus baca' : 'Focus reading mode'}
      >
        {isId ? '📖 Fokus Baca' : '📖 Focus Read'}
      </button>

      {active && (
        <div className="fokus-baca__toolbar" role="toolbar" aria-label={isId ? 'Kontrol mode fokus' : 'Focus mode controls'}>
          <button
            type="button"
            className="button button--small"
            onClick={() => adjustFont(-10)}
            aria-label={isId ? 'Kecilkan font' : 'Decrease font size'}
          >
            A−
          </button>
          <span className="fokus-baca__fontsize">{fontSize}%</span>
          <button
            type="button"
            className="button button--small"
            onClick={() => adjustFont(10)}
            aria-label={isId ? 'Besarkan font' : 'Increase font size'}
          >
            A+
          </button>
          <button
            type="button"
            className="button button--small button--secondary"
            onClick={() => setActive(false)}
          >
            {isId ? '✕ Keluar (Esc)' : '✕ Exit (Esc)'}
          </button>
        </div>
      )}
    </>
  );
}
