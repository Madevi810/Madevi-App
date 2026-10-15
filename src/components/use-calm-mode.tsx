'use client';

/**
 * useCalmMode — Zona Tenang (INOVASI-20261014-0841 IDE 1).
 *
 * State: server (ui_preferences, user login) + localStorage (tamu).
 * Toggle inline di header dashboard; sinkron via context untuk feed.
 * Tanpa popup, tanpa animasi menyela.
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  CALM_MODE_PREFERENCE_KEY,
  CALM_MODE_STORAGE_KEY,
  resolveCalmMode,
  serializeCalmMode,
} from '@/services/calm-mode';

interface CalmModeContextValue {
  calmMode: boolean;
  toggleCalmMode: () => void;
  /** true bila preferensi hanya disimpan di perangkat ini (tamu). */
  isDeviceLocal: boolean;
  /** true saat masih memuat preferensi awal (mencegah hydration mismatch). */
  ready: boolean;
}

const CalmModeContext = createContext<CalmModeContextValue | null>(null);

export function CalmModeProvider({ children }: { children: React.ReactNode }) {
  const [calmMode, setCalmMode] = useState(false);
  const [ready, setReady] = useState(false);
  const [isDeviceLocal, setIsDeviceLocal] = useState(true);

  // Preferensi awal: tamu → localStorage; login → fetch /api/v1/profile.
  useEffect(() => {
    let cancelled = false;
    async function init() {
      let serverPref: boolean | null = null;
      let authenticated = false;
      try {
        const res = await fetch('/api/v1/profile', {
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          const payload = (await res.json()) as {
            data?: { uiPreferences?: unknown };
          };
          const prefs = payload.data?.uiPreferences;
          if (prefs && typeof prefs === 'object') {
            const value = (prefs as Record<string, unknown>)[CALM_MODE_PREFERENCE_KEY];
            if (typeof value === 'boolean') serverPref = value;
          }
          authenticated = true;
        }
      } catch {
        // Tamu atau sesi kadaluarsa → fallback localStorage.
      }
      if (cancelled) return;
      let localValue: string | null = null;
      try {
        localValue = window.localStorage.getItem(CALM_MODE_STORAGE_KEY);
      } catch {
        localValue = null;
      }
      setCalmMode(resolveCalmMode({ serverPreference: serverPref, localStorageValue: localValue, isAuthenticated: authenticated }));
      setIsDeviceLocal(!authenticated);
      setReady(true);
    }
    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleCalmMode = useCallback(() => {
    setCalmMode((prev) => {
      const next = !prev;
      // Tamu: simpan ke localStorage.
      if (isDeviceLocal) {
        try {
          window.localStorage.setItem(CALM_MODE_STORAGE_KEY, serializeCalmMode(next));
        } catch {
          /* penyimpanan tidak tersedia — preferensi hanya untuk sesi ini */
        }
        return next;
      }
      // Login: simpan ke ui_preferences server (fire-and-forget, label jujur).
      try {
        void fetch('/api/v1/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ uiPreferences: { [CALM_MODE_PREFERENCE_KEY]: next } }),
        });
      } catch {
        /* gagal simpan server — preferensi tetap untuk sesi ini */
      }
      return next;
    });
  }, [isDeviceLocal]);

  return (
    <CalmModeContext.Provider value={{ calmMode, toggleCalmMode, isDeviceLocal, ready }}>
      {children}
    </CalmModeContext.Provider>
  );
}

export function useCalmMode(): CalmModeContextValue | null {
  return useContext(CalmModeContext);
}
