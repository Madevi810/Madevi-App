'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { MADEVI_SPACES, type SpacePresentationKey } from '@/contracts/navigation';
import { useDialogBehavior } from './dialog-behavior';
import { SettingsPopup } from './settings-popup';
import { useLanguage } from './theme-provider';

/**
 * Sidebar — DESAIN TERKUNCI 20261015 (spek Ade, ~00:50 WIB; revisi 15 Okt 2026:
 * full-height dari atas sesuai kontrak v15, ditutup via backdrop/Escape).
 * Slide dari kanan. Isi dari atas:
 *  1. Baris info: jam + tanggal, icon pengaturan di paling kanan (bahasa & tema)
 *  2. Developer card ber-border: "Madevi developer" + logo web
 *  3. 3 icon sosmed follow kecil (Gmail, IG, TikTok)
 *  4. Kolom "Laporkan masalah"
 *  5. Divider
 *  6. 7 kolom ruang ber-border; yang terpilih punya garis warna tipis di dalamnya
 */
export function Sidebar() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setSettingsOpen(false);
    setOpen(false);
  }, []);

  // Beri tahu header tentang status buka/tutup agar icon berganti hamburger <-> X.
  useEffect(() => {
    document.dispatchEvent(
      new CustomEvent('madevi:sidebar-state', { detail: { open } }),
    );
  }, [open]);

  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    function onClose() {
      setOpen(false);
    }
    document.addEventListener('madevi:open-sidebar', onOpen);
    document.addEventListener('madevi:close-sidebar', onClose);
    return () => {
      document.removeEventListener('madevi:open-sidebar', onOpen);
      document.removeEventListener('madevi:close-sidebar', onClose);
    };
  }, []);

  const { dialogRef, onKeyDown } = useDialogBehavior<HTMLElement>({
    open,
    onClose: close,
  });

  if (!open) return null;

  return (
    <>
      {/* Backdrop blur — klik menutup sidebar */}
      <div className="sidebar-backdrop" aria-hidden="true" onClick={close} />

      {/* Panel sidebar */}
      <aside
        ref={dialogRef}
        className="sidebar"
        role="dialog"
        aria-modal={settingsOpen ? undefined : true}
        aria-hidden={settingsOpen ? true : undefined}
        aria-label={language === 'id' ? 'Menu' : 'Menu'}
        inert={settingsOpen ? true : undefined}
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        {/* 1. Baris info: jam + tanggal, pengaturan di kanan */}
        <div className="sidebar__topbar">
          <SidebarClock language={language} />
          <button
            ref={settingsButtonRef}
            type="button"
            className="sidebar__settings-btn"
            onClick={() => setSettingsOpen(true)}
            aria-label={language === 'id' ? 'Pengaturan' : 'Settings'}
          >
            <SettingsIcon />
          </button>
        </div>

        <hr className="sidebar__divider" />

        <div className="sidebar__body">
          {/* 2. Developer card */}
          <div className="sidebar-dev">
            <img
              src="/madevi-emblem.svg"
              width={36}
              height={36}
              alt=""
              className="sidebar-dev__logo"
            />
            <p className="sidebar-dev__title">Madevi developer</p>
          </div>

          {/* 3. Icon sosmed follow */}
          <nav
            className="sidebar-socials"
            aria-label={language === 'id' ? 'Ikuti Madevi' : 'Follow Madevi'}
          >
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gmail"
              className="sidebar-socials__link"
            >
              <GmailIcon />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="sidebar-socials__link"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="sidebar-socials__link"
            >
              <TikTokIcon />
            </a>
          </nav>

          {/* 4. Kolom laporkan masalah */}
          <Link
            href="/laporkan-masalah"
            className="sidebar-report"
            onClick={close}
          >
            {language === 'id' ? 'Laporkan masalah' : 'Report issue'}
          </Link>

          {/* 5. Divider */}
          <hr className="sidebar__divider" />

          {/* 6. 7 kolom ruang */}
          <nav
            className="sidebar-rooms"
            aria-label={language === 'id' ? 'Tujuh ruang Madevi' : 'Seven Madevi spaces'}
          >
            <RoomLinks language={language} onClose={close} />
          </nav>
        </div>
      </aside>

      {/* Popup pengaturan — terpusat, bukan halaman baru */}
      {settingsOpen && (
        <SettingsPopup onClose={() => setSettingsOpen(false)} returnFocusRef={settingsButtonRef} />
      )}
    </>
  );
}

/** Jam (23:58:23) + tanggal (17 oktober 2026) — diperbarui tiap detik. */
function SidebarClock({ language }: { language: 'id' | 'en' }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (value: number) => String(value).padStart(2, '0');
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const date = now
    .toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .toLowerCase();

  return (
    <p className="sidebar__clock" aria-live="off" aria-label={`${time}, ${date}`}>
      <span className="sidebar__clock-time" aria-hidden="true">
        {time}
      </span>
      <span className="sidebar__clock-date" aria-hidden="true">
        {date}
      </span>
    </p>
  );
}

function RoomLinks({ language, onClose }: { language: 'id' | 'en'; onClose: () => void }) {
  const pathname = usePathname();
  const isId = language === 'id';

  return (
    <>
      {MADEVI_SPACES.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/' && typeof pathname === 'string' && pathname.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-room${isActive ? ' sidebar-room--active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={onClose}
            data-space={item.presentationKey}
          >
            <span className="sidebar-room__icon" aria-hidden="true">
              <SidebarSpaceIcon space={item.presentationKey} />
            </span>
            <span className="sidebar-room__title">
              {isId ? item.nameId : item.nameEn}
            </span>
          </Link>
        );
      })}
    </>
  );
}

function SidebarSpaceIcon({ space }: { space: SpacePresentationKey }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (space) {
    case 'tutorial':
      return <svg {...common}><path d="m14.6 5.2 4.2 4.2M4 20l3.4-.9L18.6 7.9a1.5 1.5 0 0 0-2.1-2.1L5.3 17 4 20Z" /><path d="m12.9 7.4 3.7 3.7M4.8 4.8l2.5 2.5M4.8 7.3l2.5-2.5" /></svg>;
    case 'school':
      return <svg {...common}><path d="m3 10 9-5 9 5-9 5-9-5Z" /><path d="M7 12.2V16c2.8 2.2 7.2 2.2 10 0v-3.8M21 10v5" /></svg>;
    case 'line':
      return <svg {...common}><path d="M20 11.5a7.2 7.2 0 0 1-7.5 7.5 8.7 8.7 0 0 1-3.3-.66L4 20l1.66-4.44A7.26 7.26 0 0 1 4.8 12 7.2 7.2 0 0 1 12.3 4.5 7.2 7.2 0 0 1 20 11.5Z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="2.4" /></svg>;
    case 'services':
      return <svg {...common}><path d="m14.8 4.4 4.8 4.8M4 20l3.1-.8L18.8 7.5a1.7 1.7 0 0 0-2.4-2.4L4.8 16.8 4 20Z" /><path d="m13.6 6.3 4.1 4.1" /></svg>;
    case 'shop':
      return <svg {...common}><path d="M5.5 9h13l-1 11h-11l-1-11ZM9 9V7a3 3 0 0 1 6 0v2" /></svg>;
    case 'tools':
      return <svg {...common}><path d="M4 7h16M4 17h16M8 4v6M16 14v6" /><circle cx="8" cy="7" r="2" /><circle cx="16" cy="17" r="2" /></svg>;
    case 'explore':
    default:
      return <svg {...common}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /><path d="M8 6h8M8 10h6" /></svg>;
  }
}

/** Icon sosmed custom kecil — bukan ikon standar generik. */
function GmailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 7.5 12 14l9-6.5M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.6" cy="7.4" r="1.1" fill="currentColor" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 13.2a3.6 3.6 0 1 0 3.6 3.6V4.5c.4 2.9 2.2 4.7 5.1 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
