'use client';

/**
 * ProfileShell — Halaman Profil sesuai kontrak Prompt 05.
 *
 * Kontrak:
 * - Halaman Profil tidak memakai tab.
 * - Sidebar memiliki menu langsung: Informasi Profil | Progres Pembelajaran |
 *   Nilai & Ujian | Daftar Simpan | Riwayat Aktivitas | Kontribusi Saya.
 * - Guest hanya melihat card Daftar/Masuk; tidak melihat menu privat.
 * - Setiap panel punya empty state netral jika data belum ada.
 * - Tidak ada halaman putih kosong.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfileDashboard } from './profile-dashboard';
import { LearningProgress } from './learning-progress';
import { ExamsDashboard } from './exams-dashboard';
import { SavedItemsDashboard } from './saved-items-dashboard';
import { ActivityHistoryDashboard } from './activity-history-dashboard';
import { ContributionPage } from './contribution-page';

type MenuKey = 'profil' | 'progres' | 'nilai' | 'simpan' | 'riwayat' | 'kontribusi';

const MENU_ITEMS: { key: MenuKey; label: string }[] = [
  { key: 'profil', label: 'Informasi Profil' },
  { key: 'progres', label: 'Progres Pembelajaran' },
  { key: 'nilai', label: 'Nilai & Ujian' },
  { key: 'simpan', label: 'Daftar Simpan' },
  { key: 'riwayat', label: 'Riwayat Aktivitas' },
  { key: 'kontribusi', label: 'Kontribusi Saya' },
];

/* ===== Guest Card ===== */
function GuestCard() {
  return (
    <div className="profile-guest-card">
      <span className="profile-guest-card__icon" aria-hidden="true">
        <ProfileGlyph />
      </span>
      <p className="profile-guest-card__title">Anda belum masuk</p>
      <p className="profile-guest-card__hint">
        Masuk atau daftar untuk mengakses profil, progres belajar, dan fitur lengkap.
      </p>
      <div className="profile-guest-card__actions">
        <Link href="/auth" className="button">
          Masuk / Daftar
        </Link>
      </div>
    </div>
  );
}

/* ===== Panel tiap menu ===== */
function PanelContent({ activeMenu }: { activeMenu: MenuKey }) {
  switch (activeMenu) {
    case 'profil':
      return <ProfileDashboard />;
    case 'progres':
      return (
        <div className="profile-panel">
          <h2 className="profile-panel__title">Progres Pembelajaran</h2>
          <LearningProgress />
        </div>
      );
    case 'nilai':
      return (
        <div className="profile-panel">
          <h2 className="profile-panel__title">Nilai &amp; Ujian</h2>
          <ExamsDashboard />
        </div>
      );
    case 'simpan':
      return (
        <div className="profile-panel">
          <h2 className="profile-panel__title">Daftar Simpan</h2>
          <SavedItemsDashboard />
        </div>
      );
    case 'riwayat':
      return (
        <div className="profile-panel">
          <h2 className="profile-panel__title">Riwayat Aktivitas</h2>
          <ActivityHistoryDashboard />
        </div>
      );
    case 'kontribusi':
      return (
        <div className="profile-panel">
          <h2 className="profile-panel__title">Kontribusi Saya</h2>
          <ContributionPage />
        </div>
      );
    default:
      return null;
  }
}

/* ===== Komponen Utama ===== */
export function ProfileShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const requestedSection = searchParams?.get('section');
  const activeMenu: MenuKey = MENU_ITEMS.some((item) => item.key === requestedSection)
    ? (requestedSection as MenuKey)
    : 'profil';

  function setActiveMenu(menu: MenuKey) {
    if (menu === activeMenu) return;
    router.push(`/profile?section=${menu}`, { scroll: false });
  }

  useEffect(() => {
    fetch('/api/v1/profile', { cache: 'no-store' })
      .then((r) => setIsLoggedIn(r.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  /* Loading state netral */
  if (isLoggedIn === null) {
    return (
      <div className="profile-shell">
        <div className="rnav__empty">
          <span className="rnav__empty-icon" aria-hidden="true">
            <LoadingGlyph />
          </span>
          <p className="rnav__empty-title">Memeriksa sesi…</p>
        </div>
      </div>
    );
  }

  /* Guest: hanya tampil card masuk/daftar */
  if (!isLoggedIn) {
    return (
      <div className="profile-shell">
        <GuestCard />
      </div>
    );
  }

  return (
    <div className="profile-shell profile-shell--logged">
      {/* Sidebar navigasi langsung — tanpa tab */}
      <nav className="profile-sidebar" aria-label="Navigasi profil">
        <div className="profile-sidebar__heading">
          <p className="eyebrow">AREA AKUN</p>
          <h2>Profil Saya</h2>
        </div>
        <ul className="profile-sidebar__list" role="list">
          {MENU_ITEMS.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className={`profile-sidebar__item${activeMenu === item.key ? ' profile-sidebar__item--active' : ''}`}
                aria-current={activeMenu === item.key ? 'page' : undefined}
                onClick={() => setActiveMenu(item.key)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Panel konten */}
      <div className="profile-main">
        <PanelContent activeMenu={activeMenu} />
      </div>
    </div>
  );
}

function ProfileGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5 20c.8-3.5 3.12-5.25 7-5.25S18.2 16.5 19 20" strokeLinecap="round" />
    </svg>
  );
}

function LoadingGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M7 3h10M7 21h10M8 3v5.2c0 1.3.64 2.52 1.7 3.26L12 13l2.3-1.54A3.92 3.92 0 0 0 16 8.2V3M16 21v-5.2c0-1.3-.64-2.52-1.7-3.26L12 11l-2.3 1.54A3.92 3.92 0 0 0 8 15.8V21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
