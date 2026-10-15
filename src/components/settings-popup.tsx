'use client';

import { useRef } from 'react';
import type { RefObject } from 'react';

import { useDialogBehavior } from './dialog-behavior';
import { useLanguage, useTheme } from './theme-provider';

/**
 * Popup Pengaturan — terpusat di layar, bukan halaman baru.
 * Submenu Bahasa: Indonesia / English
 * Submenu Tema: Terang / Gelap / Madevi On Style
 */
interface Props {
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}

const LANGUAGES = [
  { code: 'id', label: 'Indonesia' },
  { code: 'en', label: 'English' },
];

const THEMES = [
  {
    value: 'light' as const,
    labelId: 'Terang',
    labelEn: 'Light',
    descriptionId: 'Tampilan terang untuk lingkungan dengan banyak cahaya.',
    descriptionEn: 'A bright surface for well-lit surroundings.',
  },
  {
    value: 'dark' as const,
    labelId: 'Gelap',
    labelEn: 'Dark',
    descriptionId: 'Kontras tenang untuk fokus membaca.',
    descriptionEn: 'Calm contrast for focused reading.',
  },
  {
    value: 'madevi-on' as const,
    labelId: 'Madevi On Style',
    labelEn: 'Madevi On Style',
    descriptionId: 'Identitas Madevi: kaca navy halus di atas latar gelap.',
    descriptionEn: 'Madevi’s identity: quiet navy glass on a dark ground.',
  },
] as const;

export function SettingsPopup({ onClose, returnFocusRef }: Props) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { dialogRef, onKeyDown } = useDialogBehavior<HTMLDialogElement>({
    open: true,
    onClose,
    initialFocusRef: closeRef,
    returnFocusRef,
  });

  return (
    <div className="popup-backdrop" onClick={onClose}>
      <dialog
        ref={dialogRef}
        className="popup settings-popup"
        open
        aria-label="Pengaturan"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="popup__header">
          <h2 className="popup__title">{language === 'id' ? 'Pengaturan' : 'Settings'}</h2>
          <button
            ref={closeRef}
            type="button"
            className="popup__close"
            aria-label={language === 'id' ? 'Tutup pengaturan' : 'Close settings'}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Bahasa */}
        <section className="settings__section" aria-labelledby="settings-lang-label">
          <h3 id="settings-lang-label" className="settings__section-label">
            {language === 'id' ? 'Bahasa' : 'Language'}
          </h3>
          <div
            className="settings__options"
            role="radiogroup"
            aria-labelledby="settings-lang-label"
          >
            {LANGUAGES.map((lang) => (
              <label key={lang.code} className="settings__option">
                <input
                  type="radio"
                  name="language"
                  value={lang.code}
                  checked={language === lang.code}
                  onChange={() => setLanguage(lang.code as 'id' | 'en')}
                  className="settings__radio"
                />
                <span>{lang.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Tema */}
        <section className="settings__section" aria-labelledby="settings-theme-label">
          <h3 id="settings-theme-label" className="settings__section-label">
            {language === 'id' ? 'Tema' : 'Theme'}
          </h3>
          <div
            className="settings__options"
            role="radiogroup"
            aria-labelledby="settings-theme-label"
          >
            {THEMES.map((option) => {
              const active = theme === option.value;
              return (
                <label
                  key={option.value}
                  className={`settings__option settings__option--theme${active ? ' settings__option--selected' : ''}`}
                  data-theme-option={option.value}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={active}
                    onChange={() => setTheme(option.value)}
                    className="settings__radio"
                  />
                  <span className="settings__theme-preview" aria-hidden="true">
                    <span />
                  </span>
                  <span className="settings__option-copy">
                    <span className="settings__option-title">
                      {language === 'id' ? option.labelId : option.labelEn}
                    </span>
                    <span className="settings__option-description">
                      {language === 'id' ? option.descriptionId : option.descriptionEn}
                    </span>
                  </span>
                  {active && (
                    <span className="settings__selected-mark" aria-hidden="true">
                      <CheckIcon />
                    </span>
                  )}
                </label>
              );
            })}
          </div>
          <p className="settings__theme-status" role="status">
            {language === 'id'
              ? `Tema aktif: ${THEMES.find((option) => option.value === theme)?.labelId ?? 'Madevi On Style'}`
              : `Active theme: ${THEMES.find((option) => option.value === theme)?.labelEn ?? 'Madevi On Style'}`}
          </p>
        </section>
      </dialog>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12 4.2 4.2L19 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
