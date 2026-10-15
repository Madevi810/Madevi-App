'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { resolveSpaceFromPath } from '@/contracts/navigation';
import { useDialogBehavior } from './dialog-behavior';
import { SearchOverlay } from './search-overlay';
import { SettingsPopup } from './settings-popup';
import { useLanguage } from './theme-provider';

/**
 * Header — DESAIN TERKUNCI 20261015 (spek Ade, ~00:50 WIB) + v15 (FIX 2026-10-15).
 * Kiri: teks "Madevi" animasi per-huruf. Tengah: search bar kolom kapsul.
 * Kanan: icon profil (dropdown) + icon sidebar (3 garis saat tertutup, X saat terbuka).
 */
const COPY = {
  id: {
    home: 'Madevi — Beranda',
    open: 'Buka pencarian',
    search: 'Cari…',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
    profile: 'Profil',
    menuProfile: 'Profil Saya',
    menuMessages: 'Pesan',
    menuNotifications: 'Notifikasi',
    menuSettings: 'Pengaturan Akun',
    menuHistory: 'Riwayat',
    menuSaved: 'Simpan',
    menuHelp: 'Bantuan',
    menuLogin: 'Masuk',
    menuRegister: 'Daftar',
  },
  en: {
    home: 'Madevi — Home',
    open: 'Open search',
    search: 'Search…',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    profile: 'Profile',
    menuProfile: 'My Profile',
    menuMessages: 'Messages',
    menuNotifications: 'Notifications',
    menuSettings: 'Account Settings',
    menuHistory: 'History',
    menuSaved: 'Saved',
    menuHelp: 'Help',
    menuLogin: 'Sign in',
    menuRegister: 'Register',
  },
} as const;

/** Huruf-huruf logo dengan arah animasi acak per huruf (kontrak visual v15). */
const LOGO_LETTERS = ['M', 'a', 'd', 'e', 'v', 'i'] as const;
const LOGO_ANIM = ['mv-a', 'mv-b', 'mv-c', 'mv-d', 'mv-e', 'mv-f'] as const;

export function Header() {
  const { language } = useLanguage();
  const copy = COPY[language];
  const pathname = usePathname();
  const spaceKey = resolveSpaceFromPath(pathname ?? '/')?.presentationKey ?? null;
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifUnread, setNotifUnread] = useState(0);
  const [msgPending, setMsgPending] = useState(0);
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  /** L06: filter ruang kanonis untuk SearchOverlay. */
  const [spaces, setSpaces] = useState<string[]>([]);
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const profileDropRef = useRef<HTMLDivElement>(null);
  const restoreSearchFocusRef = useRef(false);

  // Sidebar memberi tahu status buka/tutup agar icon header berganti hamburger <-> X.
  useEffect(() => {
    function onSidebarState(event: Event) {
      const detail = (event as CustomEvent<{ open: boolean }>).detail;
      if (detail && typeof detail.open === 'boolean') setSidebarOpen(detail.open);
    }
    document.addEventListener('madevi:sidebar-state', onSidebarState);
    return () => document.removeEventListener('madevi:sidebar-state', onSidebarState);
  }, []);

  const toggleSidebar = useCallback(() => {
    document.dispatchEvent(
      new CustomEvent(sidebarOpen ? 'madevi:close-sidebar' : 'madevi:open-sidebar'),
    );
  }, [sidebarOpen]);

  // Tutup dropdown profil saat klik di luar.
  useEffect(() => {
    if (!profileOpen) return;
    function onDocClick(event: MouseEvent) {
      const t = event.target as Node | null;
      if (
        t &&
        profileDropRef.current &&
        !profileDropRef.current.contains(t) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(t)
      ) {
        setProfileOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setProfileOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [profileOpen]);

  // Badge: jumlah jujur dari API asli. Gagal/tidak login = badge disembunyikan.
  useEffect(() => {
    if (!profileOpen) return;
    let cancelled = false;
    async function loadBadges() {
      try {
        const nRes = await fetch('/api/v1/social/notifications?limit=1', {
          credentials: 'same-origin',
        });
        if (!cancelled && nRes.ok) {
          const nJson = (await nRes.json()) as { data?: { unread?: number } };
          const u = nJson.data?.unread;
          if (typeof u === 'number' && u > 0) setNotifUnread(u);
        }
      } catch {
        /* abaikan: badge disembunyikan */
      }
      try {
        const mRes = await fetch('/api/v1/social/message-requests', {
          credentials: 'same-origin',
        });
        if (!cancelled && mRes.ok) {
          const mJson = (await mRes.json()) as { data?: unknown };
          const items = (mJson.data as { items?: unknown[] } | unknown[]) ?? [];
          const arr = Array.isArray(items) ? items : items.items ?? [];
          if (Array.isArray(arr) && arr.length > 0) setMsgPending(arr.length);
        }
      } catch {
        /* abaikan: badge disembunyikan */
      }
    }
    void loadBadges();
    return () => {
      cancelled = true;
    };
  }, [profileOpen]);

  // L02 G-02-03: Header satu-satunya pemilik SearchOverlay.
  // Tombol breadcrumb hanya meminta lewat event ini agar tidak ada overlay ganda/kosong.
  useEffect(() => {
    function onExternalOpen() {
      setSearchOpen(true);
    }
    document.addEventListener('madevi:open-search', onExternalOpen);
    return () => document.removeEventListener('madevi:open-search', onExternalOpen);
  }, []);

  const closeSearch = useCallback(() => {
    restoreSearchFocusRef.current = true;
    setSearchOpen(false);
    setQuery('');
    setCategories([]);
    setSpaces([]);
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    url.searchParams.delete('category');
    url.searchParams.delete('space');
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }, []);

  useEffect(() => {
    if (searchOpen || !restoreSearchFocusRef.current || !searchBtnRef.current) return;
    restoreSearchFocusRef.current = false;
    requestAnimationFrame(() => searchBtnRef.current?.focus());
  }, [searchOpen]);

  // Filter dan kueri search dapat dibagikan tanpa membuat halaman/shell kedua.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') ?? '';
    const initialCategories = (params.get('category') ?? '')
      .split(',')
      .filter((value) =>
        [
          'MENU',
          'ARTICLE',
          'PROFILE',
          'SOFTWARE',
          'PAGE',
          'SERVICE',
          'PRODUCT',
          'POST',
        ].includes(value),
      );
    const initialSpaces = (params.get('space') ?? '')
      .split(',')
      .filter((value) =>
        ['explore', 'tutorial', 'school', 'line', 'services', 'shop', 'tools'].includes(value),
      );
    if (initialQuery) {
      setQuery(initialQuery);
      setCategories(initialCategories);
      setSpaces(initialSpaces);
      setSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const url = new URL(window.location.href);
    if (query.trim().length >= 2) url.searchParams.set('q', query.trim());
    else url.searchParams.delete('q');
    if (categories.length) url.searchParams.set('category', categories.join(','));
    else url.searchParams.delete('category');
    if (spaces.length) url.searchParams.set('space', spaces.join(','));
    else url.searchParams.delete('space');
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }, [categories, query, searchOpen, spaces]);
  const { dialogRef, onKeyDown } = useDialogBehavior<HTMLDivElement>({
    open: searchOpen,
    onClose: closeSearch,
    initialFocusRef: searchInputRef,
    returnFocusRef: searchBtnRef,
  });

  if (searchOpen) {
    return (
      <div
        ref={dialogRef}
        className="search-mode"
        role="dialog"
        aria-modal="true"
        aria-label={language === 'id' ? 'Pencarian' : 'Search'}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        data-space={spaceKey ?? undefined}
      >
        <header className="site-header site-header--search" role="banner" data-space={spaceKey ?? undefined}>
          <div className="site-header__inner site-header__inner--search">
            <label htmlFor="madevi-search" className="sr-only">
              {language === 'id' ? 'Cari di Madevi' : 'Search Madevi'}
            </label>
            <input
              id="madevi-search"
              ref={searchInputRef}
              type="search"
              className="site-header__search-input"
              placeholder={
                language === 'id'
                  ? 'Cari artikel, topik, software…'
                  : 'Search articles, topics, software…'
              }
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
            <button
              type="button"
              className="site-header__menu-btn"
              aria-label={copy.openMenu}
              onClick={() => {
                closeSearch();
                requestAnimationFrame(() =>
                  document.dispatchEvent(new CustomEvent('madevi:open-sidebar')),
                );
              }}
            >
              <HamburgerIcon />
            </button>
          </div>
        </header>
        <SearchOverlay
          query={query}
          categories={categories}
          spaces={spaces}
          onCategoriesChange={setCategories}
          onSpacesChange={setSpaces}
          onClose={closeSearch}
          language={language}
          onSelectSearch={setQuery}
        />
      </div>
    );
  }

  return (
    <header className="site-header" role="banner" data-space={spaceKey ?? undefined}>
      <div className="site-header__inner site-header__inner--locked">
        <Link href="/" className="site-header__brand" aria-label={copy.home}>
          <span className="site-header__brand-name" aria-hidden="true">
            {LOGO_LETTERS.map((ch, i) => (
              <span key={i} className={`mv-ch ${LOGO_ANIM[i]}`}>
                {ch}
              </span>
            ))}
          </span>
          <span className="sr-only">Madevi</span>
        </Link>
        <button
          ref={searchBtnRef}
          type="button"
          className="site-header__search-pill"
          aria-label={copy.open}
          aria-expanded={searchOpen}
          onClick={() => setSearchOpen(true)}
        >
          <SearchIcon />
          <span className="site-header__search-placeholder" aria-hidden="true">
            {copy.search}
          </span>
        </button>
        <button
          ref={profileBtnRef}
          type="button"
          className="site-header__icon-btn"
          aria-label={copy.profile}
          aria-expanded={profileOpen}
          aria-haspopup="menu"
          onClick={() => setProfileOpen((v) => !v)}
        >
          <ProfileIcon />
          {(notifUnread > 0 || msgPending > 0) && (
            <span className="site-header__dot" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          className="site-header__menu-btn"
          aria-label={sidebarOpen ? copy.closeMenu : copy.openMenu}
          aria-expanded={sidebarOpen}
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <XIcon /> : <HamburgerIcon />}
        </button>
      </div>
      {profileOpen && (
        <div
          ref={profileDropRef}
          className="pf-drop pf-drop--header"
          role="menu"
          aria-label={copy.profile}
        >
          <Link href="/profile" role="menuitem" className="pf-item" onClick={() => setProfileOpen(false)}>
            {copy.menuProfile}
          </Link>
          <Link href="/pesan" role="menuitem" className="pf-item" onClick={() => setProfileOpen(false)}>
            <span>{copy.menuMessages}</span>
            {msgPending > 0 && <span className="nbadge">{msgPending > 99 ? '99+' : msgPending}</span>}
          </Link>
          <Link href="/notifikasi" role="menuitem" className="pf-item" onClick={() => setProfileOpen(false)}>
            <span>{copy.menuNotifications}</span>
            {notifUnread > 0 && <span className="nbadge">{notifUnread > 99 ? '99+' : notifUnread}</span>}
          </Link>
          <button
            type="button"
            role="menuitem"
            className="pf-item"
            onClick={() => {
              setProfileOpen(false);
              setSettingsOpen(true);
            }}
          >
            {copy.menuSettings}
          </button>
          <Link href="/riwayat" role="menuitem" className="pf-item" onClick={() => setProfileOpen(false)}>
            {copy.menuHistory}
          </Link>
          <Link href="/simpan" role="menuitem" className="pf-item" onClick={() => setProfileOpen(false)}>
            {copy.menuSaved}
          </Link>
          <Link href="/bantuan" role="menuitem" className="pf-item" onClick={() => setProfileOpen(false)}>
            {copy.menuHelp}
          </Link>
        </div>
      )}
      {settingsOpen && (
        <SettingsPopup onClose={() => setSettingsOpen(false)} returnFocusRef={profileBtnRef} />
      )}
    </header>
  );
}

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4.5 20c1.4-3.4 4.2-5 7.5-5s6.1 1.6 7.5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
