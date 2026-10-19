'use client';

import Link from 'next/link';
import { performLogout } from '@/lib/logout';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * D03: /admin kini diredirect ke /owner kanonis (lihat next.config.ts dan
 * src/app/admin/page.tsx). Surface Admin nyata adalah src/app/owner/* dengan
 * OwnerShell; shell ini tidak lagi dirender dan dipertahankan hanya sebagai
 * jejak migrasi. Jangan tambah menu/route baru di sini — gunakan OwnerShell.
 *
 * Riwayat (L07): AdminShell canonical (/admin). Menu hanya memuat data/route
 * nyata; capability berasal dari endpoint server. Tidak ada label Owner/Wali;
 * vocabulary aplikasi ADMIN/USER. Setiap state loading/empty/error/
 * unavailable/retry menjelaskan batas tanpa CTA destruktif satu klik.
 */

type Capability = {
  key: string;
  label: string;
  href: string;
  available: boolean;
  reason?: string;
};

const FALLBACK_MENU = [
  {
    label: 'Ringkasan',
    items: [
      ['Dashboard', '/admin'],
      ['Operasi', '/admin/operasi'],
    ],
  },
  {
    label: 'Pengguna',
    items: [
      ['Pendaftaran', '/admin/pengguna'],
      ['Pemulihan / Penghapusan', '/admin/pengguna#recovery'],
    ],
  },
  {
    label: 'Konten & Belajar',
    items: [
      ['Menu', '/admin/taxonomy'],
      ['Artikel', '/admin/artikel/baru'],
      ['Ujian', '/admin/ujian'],
    ],
  },
  {
    label: 'Sistem',
    items: [
      ['Operasi / Backup', '/admin/operasi'],
      ['Keamanan / API / Log', '/admin/keamanan'],
    ],
  },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login' || pathname === '/owner/login';
  const [openGroup, setOpenGroup] = useState('Ringkasan');
  const [caps, setCaps] = useState<Capability[] | null>(null);
  const [capsError, setCapsError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/v1/admin/capabilities', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => {
        if (!active) return;
        if (Array.isArray(body?.data)) setCaps(body.data);
        else setCapsError(true);
      })
      .catch(() => {
        if (active) setCapsError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (isLogin) {
    return <div className="owner-shell owner-shell--login">{children}</div>;
  }
  return (
    <div className="owner-shell">
      <header className="owner-shell__topbar">
        <Link className="owner-shell__brand" href="/admin" aria-label="Madevi Admin">
          Madevi Admin
        </Link>
        <div className="owner-shell__controls">
          <span className="owner-shell__environment" aria-label="Environment">
            OFFLINE
          </span>
          <AdminLogout />
        </div>
      </header>
      <nav className="owner-shell__nav" aria-label="Navigasi Admin">
        {capsError && (
          <p role="status">Capability Admin tidak dapat dimuat. Menu kontrak ditampilkan; data nyata dimuat per halaman.</p>
        )}
        {(caps
          ? [{ label: 'Layanan nyata', items: caps.filter((c) => c.available).map((c) => [c.label, c.href] as const) }]
          : [...FALLBACK_MENU]
        ).map((group) => {
          const expanded = openGroup === group.label;
          return (
            <div key={group.label} className="owner-shell__nav-group">
              <button
                type="button"
                className="owner-shell__nav-label"
                aria-expanded={expanded}
                onClick={() => setOpenGroup(group.label)}
              >
                <span className="owner-shell__nav-label-content">
                  <AdminSectionIcon section={group.label} />
                  <span>{group.label}</span>
                </span>
              </button>
              {expanded && (
                <div className="owner-shell__nav-items">
                  {group.items.map(([label, href]) => (
                    <Link key={label} href={href}>
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {caps && caps.some((c) => !c.available) && (
          <p role="status">
            {caps.filter((c) => !c.available).length} layanan tidak tersedia dan disembunyikan dari menu.
          </p>
        )}
      </nav>
      <div className="owner-shell__body">{children}</div>
    </div>
  );
}

function AdminSectionIcon({ section }: { section: string }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (section === 'Pengguna') {
    return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3.8 19c.8-3 2.7-4.7 5.2-4.7s4.4 1.7 5.2 4.7M17 8h4M19 6v4" /></svg>;
  }
  if (section === 'Konten & Belajar') {
    return <svg {...common}><path d="M4 4.8A2.8 2.8 0 0 1 6.8 2H20v17.5H6.8A2.8 2.8 0 0 0 4 22V4.8Z" /><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M8 6h7M8 9.5h5" /></svg>;
  }
  if (section === 'Sistem') {
    return <svg {...common}><path d="M12 2.8v3M12 18.2v3M4.1 5.3l2.1 2.1M17.8 17.6l2.1 2.1M2.8 12h3M18.2 12h3M4.1 18.7l2.1-2.1M17.8 6.4l2.1-2.1" /><circle cx="12" cy="12" r="3.4" /></svg>;
  }
  return <svg {...common}><rect x="4" y="4" width="6" height="6" rx="1.2" /><rect x="14" y="4" width="6" height="6" rx="1.2" /><rect x="4" y="14" width="6" height="6" rx="1.2" /><path d="M14 17h6M17 14v6" /></svg>;
}

function AdminLogout() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    if (pending) return;
    setPending(true);
    try {
      await performLogout('admin');
    } finally {
      setPending(false);
      router.replace('/admin/login');
    }
  }

  return (
    <button
      type="button"
      className="owner-shell__logout"
      onClick={() => void logout()}
      disabled={pending}
    >
      {pending ? 'Keluar…' : 'Logout'}
    </button>
  );
}

