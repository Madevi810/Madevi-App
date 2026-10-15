'use client';

import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'madevi-on';
export type Language = 'id' | 'en';
const STORAGE_KEY = 'madevi-theme';
const LANGUAGE_STORAGE_KEY = 'madevi-language';
const LANGUAGE_EVENT = 'madevi:language-change';
const THEME_EVENT = 'madevi:theme-change';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: 'madevi-on', setTheme: () => {} });

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
}>({ language: 'id', setLanguage: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function useLanguage() {
  return useContext(LanguageContext);
}

function subscribeLanguage(callback: () => void) {
  window.addEventListener(LANGUAGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(LANGUAGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function subscribeTheme(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getThemeSnapshot(): Theme {
  const value = document.documentElement.getAttribute('data-theme');
  if (value === 'light' || value === 'dark' || value === 'madevi-on') return value;
  return 'dark';
}

function getServerThemeSnapshot(): Theme {
  return 'dark';
}

function getLanguageSnapshot(): Language {
  return document.documentElement.getAttribute('data-language') === 'en' ? 'en' : 'id';
}

function getServerLanguageSnapshot(): Language {
  return 'id';
}

/**
 * Inline script yang dieksekusi sebelum React hydration untuk mencegah
 * flash tema yang salah. Preferensi localStorage dihormati; jika tidak ada,
 * Dark menjadi default; Madevi On adalah opt-in identitas brand. Tema tidak
 * pernah mengikuti preferensi OS secara diam-diam.
 */
const THEME_SCRIPT = `(function(){
  try {
    var t = localStorage.getItem('madevi-theme');
    document.documentElement.setAttribute(
      'data-theme',
      t === 'light' || t === 'dark' || t === 'madevi-on' ? t : 'dark'
    );
    var l = localStorage.getItem('madevi-language');
    if (l === 'en') {
      document.documentElement.lang = 'en';
      document.documentElement.setAttribute('data-language', 'en');
    } else {
      document.documentElement.lang = 'id';
      document.documentElement.setAttribute('data-language', 'id');
    }
  } catch(e) {}
})();`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
  const language = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );

  useEffect(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    void fetch('/api/v1/profile', { cache: 'no-store' })
      .then(async (response) => (response.ok ? response.json() : null))
      .then((response) => {
        const profile = response?.data;
        const accountTheme = profile?.ui_theme;
        const accountLanguage = profile?.ui_language;
        if (
          !storedTheme &&
          (accountTheme === 'light' || accountTheme === 'dark' || accountTheme === 'madevi-on')
        ) {
          localStorage.setItem(STORAGE_KEY, accountTheme);
          document.documentElement.setAttribute('data-theme', accountTheme);
          window.dispatchEvent(new Event(THEME_EVENT));
        }
        if (!storedLanguage && (accountLanguage === 'id' || accountLanguage === 'en')) {
          localStorage.setItem(LANGUAGE_STORAGE_KEY, accountLanguage);
          document.documentElement.lang = accountLanguage;
          document.documentElement.setAttribute('data-language', accountLanguage);
          window.dispatchEvent(new Event(LANGUAGE_EVENT));
        }
      })
      .catch(() => undefined);
  }, []);

  function setTheme(t: Theme) {
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // no-op
    }
    document.documentElement.setAttribute('data-theme', t);
    window.dispatchEvent(new Event(THEME_EVENT));
    void persistPreferences({ themePreference: t });
  }

  function setLanguage(nextLanguage: Language) {
    document.documentElement.lang = nextLanguage;
    document.documentElement.setAttribute('data-language', nextLanguage);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      // Penyimpanan perangkat tidak tersedia; bahasa tetap berlaku untuk sesi ini.
    }
    window.dispatchEvent(new Event(LANGUAGE_EVENT));
    void persistPreferences({ languagePreference: nextLanguage });
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        {children}
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}

async function persistPreferences(input: {
  themePreference?: Theme;
  languagePreference?: Language;
}) {
  const csrf = document.cookie
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith('madevi_csrf='))
    ?.slice('madevi_csrf='.length);
  await fetch('/api/v1/profile', {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      ...(csrf ? { 'x-csrf-token': decodeURIComponent(csrf) } : {}),
    },
    body: JSON.stringify(input),
  }).catch(() => undefined);
}

export { THEME_SCRIPT };
