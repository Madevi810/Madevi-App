'use client';

/**
 * CalmModeToggle — Zona Tenang (INOVASI-0841 IDE 1).
 * Toggle inline di header Line (bukan popup): mengaktifkan/menonaktifkan
 * mode baca anti-engagement untuk sesi itu. Preferensi disimpan
 * (login: ui_preferences server; tamu: localStorage + label jujur).
 */

import { useCalmMode } from './use-calm-mode';

function LeafIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ width: '1em', height: '1em', verticalAlign: '-0.15em' }}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export function CalmModeToggle() {
  const ctx = useCalmMode();
  if (!ctx) return null;
  const { calmMode, toggleCalmMode, isDeviceLocal, ready } = ctx;
  const isId = true; // Dashboard Line berbahasa Indonesia default.

  return (
    <div className="line-calm-toggle">
      <button
        type="button"
        className={`button button--small${calmMode ? ' button--active' : ''}`}
        onClick={toggleCalmMode}
        aria-pressed={calmMode}
        disabled={!ready}
        title={
          isDeviceLocal
            ? isId
              ? 'Preferensi Zona Tenang hanya disimpan di perangkat ini'
              : 'Calm mode preference is stored on this device only'
            : undefined
        }
      >
        <LeafIcon />
        {isId ? 'Zona Tenang' : 'Calm mode'}
      </button>
      {isDeviceLocal && ready && (
        <span className="line-calm-toggle__note">
          {isId ? 'preferensi hanya di perangkat ini' : 'device-local preference'}
        </span>
      )}
    </div>
  );
}
