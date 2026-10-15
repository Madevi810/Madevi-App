'use client';

import Link from 'next/link';
import { performLogout } from '@/lib/logout';
import { readCookie } from '@/lib/cookies';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { Breadcrumb } from '@/components/breadcrumb';

/**
 * L07: OwnerShell adalah alias kompatibel ke AdminShell canonical (/admin).
 * Menu hanya route nyata; tidak ada label Wali; tidak ada item placeholder
 * sebagai capability. Vocabulary UI: Admin (bukan Owner sebagai role).
 * Untuk surface baru gunakan AdminShell; shell ini dipertahankan agar
 * /owner, cookie, dan deep link lama tetap berfungsi.
 */
const OWNER_MENU = [
  {
    label: 'Ringkasan',
    items: [
      ['Dashboard', '/owner'],
      ['Operasi', '/owner/operasi'],
      ['Kotak Masuk Admin', '/owner/inbox'],
    ],
  },
  {
    label: 'Pengguna',
    items: [['Permintaan pengguna', '/owner/pengguna']],
  },
  {
    label: 'Konten & Belajar',
    items: [
      ['Menu', '/owner/taxonomy'],
      ['Artikel', '/owner/artikel/baru'],
      ['Ujian', '/owner/ujian'],
    ],
  },
  {
    label: 'Sosial & Moderasi',
    items: [
      ['Post / Komentar / Grup', '/owner/sosial'],
      ['Laporan / Pelanggaran', '/owner/moderasi'],
    ],
  },
  {
    label: 'Sistem',
    items: [
      ['Keamanan / API / Log', '/owner/keamanan'],
    ],
  },
] as const;

/** Shell khusus Admin; tidak memakai navigasi publik atau sidebar Website. */
export function OwnerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/owner/login';
  const [openGroup, setOpenGroup] = useState('Ringkasan');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (isLogin) {
    return <div className="owner-shell owner-shell--login">{children}</div>;
  }
  return (
    <div className="owner-shell">
      <header className="owner-shell__topbar">
        <Link className="owner-shell__brand" href="/owner" aria-label="Madevi Admin">
          Madevi Admin
        </Link>
        <div className="owner-shell__controls">
          <span className="owner-shell__environment" aria-label="Environment">
            OFFLINE
          </span>
          <span className="owner-shell__notification" aria-label="Notifikasi">
            Notifikasi
          </span>
          <span className="owner-shell__timer" aria-label="Timer sesi">
            {now.toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
          <OwnerLogout />
        </div>
      </header>
      <nav className="owner-shell__nav" aria-label="Navigasi Admin">
        {OWNER_MENU.map((group) => {
          const expanded = openGroup === group.label;
          return (
            <div key={group.label} className="owner-shell__nav-group">
              <button
                type="button"
                className="owner-shell__nav-label"
                aria-expanded={expanded}
                onClick={() => setOpenGroup(expanded ? '' : group.label)}
              >
                <span className="owner-shell__nav-label-content">
                  <AdminSectionIcon section={group.label} />
                  <span>{group.label}</span>
                </span>
              </button>
              {expanded && (
                <div className="owner-shell__nav-items">
                  {group.items.map(([label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      aria-current={pathname === href.split('#')[0] ? 'page' : undefined}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      {/* Breadcrumbs for admin orientation */}
      <Breadcrumb />
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
  if (section === 'Sosial & Moderasi') {
    return <svg {...common}><path d="M20 11.5a7.2 7.2 0 0 1-7.5 7.5 8.7 8.7 0 0 1-3.3-.66L4 20l1.66-4.44A7.26 7.26 0 0 1 4.8 12 7.2 7.2 0 0 1 12.3 4.5 7.2 7.2 0 0 1 20 11.5Z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="2.5" /></svg>;
  }
  if (section === 'Sistem') {
    return <svg {...common}><path d="M12 2.8v3M12 18.2v3M4.1 5.3l2.1 2.1M17.8 17.6l2.1 2.1M2.8 12h3M18.2 12h3M4.1 18.7l2.1-2.1M17.8 6.4l2.1-2.1" /><circle cx="12" cy="12" r="3.4" /></svg>;
  }
  return <svg {...common}><rect x="4" y="4" width="6" height="6" rx="1.2" /><rect x="14" y="4" width="6" height="6" rx="1.2" /><rect x="4" y="14" width="6" height="6" rx="1.2" /><path d="M14 17h6M17 14v6" /></svg>;
}

function OwnerLogout() {
  const [pending, setPending] = useState(false);

  async function logout() {
    if (pending) return;
    setPending(true);
    try {
      await performLogout('owner');
    } finally {
      window.location.assign('/owner/login');
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

