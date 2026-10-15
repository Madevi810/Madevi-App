'use client';

import Link from 'next/link';
import { performLogout } from '@/lib/logout';
import { readCookie } from '@/lib/cookies';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useLanguage } from './theme-provider';

interface DashboardData {
  stats: { users: number; newMessages: number };
  alerts: unknown[];
  queue?: {
    id: string;
    kind: string;
    risk: 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    reasonId: string;
    reasonEn: string;
    href: string;
  }[];
}

type DashboardState = 'loading' | 'ready' | 'unauthenticated' | 'forbidden' | 'error';

type MenuGroup = {
  titleId: string;
  titleEn: string;
  items: { labelId: string; labelEn: string; href: string }[];
};

const OWNER_MENU: MenuGroup[] = [
  {
    titleId: 'Tinjauan',
    titleEn: 'Overview',
    items: [{ labelId: 'Antrean prioritas', labelEn: 'Priority queue', href: '/owner#pending' }],
  },
  {
    titleId: 'Pengguna',
    titleEn: 'Users',
    items: [{ labelId: 'Permintaan pengguna', labelEn: 'User requests', href: '/owner/pengguna' }],
  },
  {
    titleId: 'Konten & belajar',
    titleEn: 'Content & learning',
    items: [
      { labelId: 'Struktur menu', labelEn: 'Taxonomy', href: '/owner/taxonomy' },
      { labelId: 'Artikel', labelEn: 'Articles', href: '/owner/artikel/baru' },
      { labelId: 'Halaman situs', labelEn: 'Site pages', href: '/owner/halaman-situs' },
      { labelId: 'Jalur belajar', labelEn: 'Learning paths', href: '/owner/jalur' },
      { labelId: 'Ujian', labelEn: 'Exams', href: '/owner/ujian' },
    ],
  },
  {
    titleId: 'Sosial & layanan',
    titleEn: 'Social & services',
    items: [
      { labelId: 'Moderasi', labelEn: 'Moderation', href: '/owner/moderasi' },
      { labelId: 'Ruang sosial', labelEn: 'Social space', href: '/owner/sosial' },
      { labelId: 'Grup', labelEn: 'Groups', href: '/owner/grup' },
      { labelId: 'Pesanan jasa', labelEn: 'Service orders', href: '/owner/jasa' },
      { labelId: 'Produk', labelEn: 'Products', href: '/owner/produk' },
    ],
  },
  {
    titleId: 'Akses & sistem',
    titleEn: 'Access & system',
    items: [
      { labelId: 'Order & akses', labelEn: 'Orders & access', href: '/owner/order' },
      { labelId: 'Kotak masuk Admin', labelEn: 'Admin inbox', href: '/owner/inbox' },
      { labelId: 'Operasi', labelEn: 'Operations', href: '/owner/operasi' },
      { labelId: 'Keamanan', labelEn: 'Security', href: '/owner/keamanan' },
    ],
  },
];

function OwnerLogoutButton({ isId }: { isId: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function logout() {
    if (pending) return;
    setPending(true);
    setError('');
    try {
      const ok = await performLogout('owner');
      if (!ok) throw new Error();
      router.replace('/owner/login');
    } catch {
      setError(isId ? 'Sesi belum dapat diakhiri. Coba lagi.' : 'The session could not be ended. Try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="owner-console__session-actions">
      <button type="button" className="owner-console__logout" onClick={() => void logout()} disabled={pending} aria-busy={pending}>
        {pending ? (isId ? 'Mengakhiri sesi…' : 'Ending session…') : isId ? 'Keluar dari Admin' : 'Sign out'}
      </button>
      {error ? <p className="owner-console__action-error" role="alert">{error}</p> : null}
    </div>
  );
}

function StatCard({ value, label, attention = false }: { value: string | number; label: string; attention?: boolean }) {
  return (
    <article className={`owner-console__stat${attention ? ' owner-console__stat--attention' : ''}`}>
      <strong className="owner-console__stat-value">{value}</strong>
      <span className="owner-console__stat-label">{label}</span>
    </article>
  );
}

function NavGroup({ group, isId }: { group: MenuGroup; isId: boolean }) {
  return (
    <section className="owner-console__nav-group">
      <h3>{isId ? group.titleId : group.titleEn}</h3>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '2px' }}>
        {group.items.map((item) => (
          <li key={item.href}>
            <Link className="owner-console__nav-link" href={item.href}>
              <span>{isId ? item.labelId : item.labelEn}</span>
              <span aria-hidden="true" style={{ marginInlineStart: 'auto', opacity: 0.4 }}>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PriorityQueue({ queue, isId }: { queue: NonNullable<DashboardData['queue']>; isId: boolean }) {
  if (!queue.length) return null;
  const riskLabel = isId
    ? { HIGH: 'Tinggi', MEDIUM: 'Sedang', LOW: 'Rendah' }
    : { HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' };

  return (
    <section id="pending" className="owner-queue" aria-labelledby="owner-queue-title">
      <div className="owner-console__section-heading">
        <div>
          <p className="eyebrow">{isId ? 'PERLU TINDAKAN' : 'NEEDS ACTION'}</p>
          <h2 id="owner-queue-title">{isId ? 'Antrean prioritas' : 'Priority queue'}</h2>
        </div>
        <span className="owner-console__count">{queue.length}</span>
      </div>
      <ul className="owner-queue__list">
        {queue.map((item) => (
          <li key={item.id} className={`owner-queue__item owner-queue__item--${item.risk.toLowerCase()}`}>
            <Link className="owner-queue__link" href={item.href}>
              <span className="owner-queue__risk">{riskLabel[item.risk]}</span>
              <span className="owner-queue__text">
                <strong>{item.title}</strong>
                <span className="owner-queue__reason">{isId ? item.reasonId : item.reasonEn}</span>
              </span>
              <span className="owner-queue__arrow" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function isQueueItem(value: unknown): value is NonNullable<DashboardData['queue']>[number] {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.kind === 'string' &&
    (value.risk === 'HIGH' || value.risk === 'MEDIUM' || value.risk === 'LOW') &&
    typeof value.title === 'string' &&
    typeof value.reasonId === 'string' &&
    typeof value.reasonEn === 'string' &&
    typeof value.href === 'string'
  );
}

function isDashboardData(value: unknown): value is DashboardData {
  if (!isRecord(value) || !isRecord(value.stats)) return false;
  if (
    typeof value.stats.users !== 'number' ||
    typeof value.stats.newMessages !== 'number' ||
    !Array.isArray(value.alerts)
  ) {
    return false;
  }
  return value.queue === undefined || (Array.isArray(value.queue) && value.queue.every(isQueueItem));
}

function getResponseErrorMessage(value: unknown) {
  if (!isRecord(value) || !isRecord(value.error) || typeof value.error.message !== 'string') return null;
  return value.error.message;
}

export function OwnerConsole() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [state, setState] = useState<DashboardState>('loading');
  const [error, setError] = useState('');
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      setDashboard(null);
      setError('');
      setState('loading');
      try {
        const response = await fetch('/api/v1/owner/operasi', { cache: 'no-store' });
        if (!active) return;
        if (response.status === 401) {
          setState('unauthenticated');
          return;
        }
        if (response.status === 403) {
          setState('forbidden');
          return;
        }

        let body: unknown;
        try {
          body = await response.json();
        } catch {
          throw new Error('Respons layanan tidak dapat dibaca. Coba lagi.');
        }

        if (!active) return;
        if (!response.ok) {
          throw new Error(getResponseErrorMessage(body) ?? `Operasi belum dapat dimuat (HTTP ${response.status}). Coba lagi.`);
        }
        if (!isRecord(body) || !isDashboardData(body.data)) {
          throw new Error('Respons ringkasan operasi tidak lengkap. Coba lagi.');
        }

        setDashboard(body.data);
        setState('ready');
      } catch (reason) {
        if (!active) return;
        setError(
          reason instanceof Error && reason.message
            ? reason.message
            : 'Layanan lokal tidak dapat dihubungi. Coba lagi.',
        );
        setState('error');
      }
    }
    void loadDashboard();
    return () => { active = false; };
  }, [reloadVersion]);

  const title = isId ? 'Ringkasan operasi' : 'Operations overview';
  const subtitle = state === 'loading'
    ? (isId ? 'Menyiapkan ringkasan operasi…' : 'Preparing the operational overview…')
    : state === 'unauthenticated'
      ? (isId ? 'Sesi Admin perlu diperbarui.' : 'The Admin session needs to be renewed.')
      : state === 'forbidden'
        ? (isId ? 'Akun ini tidak memiliki akses Admin.' : 'This account does not have Admin access.')
        : state === 'error'
          ? (isId ? 'Ringkasan operasi belum dapat dimuat.' : 'The operational overview could not be loaded.')
      : (isId ? 'Ringkasan yang membantu Anda menentukan tindakan berikutnya.' : 'An overview to help you decide the next action.');

  return (
    <section className="owner-console" aria-labelledby="owner-console-title">
      <header className="owner-console__header">
        <div>
          <h1 id="owner-console-title">{title}</h1>
          {state !== 'ready' ? <p className="owner-console__intro" aria-live="polite">{subtitle}</p> : null}
        </div>
        {state === 'ready' ? <OwnerLogoutButton isId={isId} /> : null}
      </header>

      {state === 'unauthenticated' || state === 'forbidden' ? (
        <section className="owner-console__gate" aria-labelledby="owner-console-gate-title">
          <h2 id="owner-console-gate-title">
            {state === 'unauthenticated'
              ? (isId ? 'Sesi Admin tidak dapat diverifikasi' : 'The Admin session could not be verified')
              : (isId ? 'Akses Admin tidak diizinkan' : 'Admin access is not allowed')}
          </h2>
          <p>
            {state === 'unauthenticated'
              ? (isId ? 'Masuk kembali untuk melanjutkan pengelolaan sistem.' : 'Sign in again to continue managing the system.')
              : (isId ? 'Gunakan akun yang memiliki peran Admin untuk melanjutkan.' : 'Use an account with the Admin role to continue.')}
          </p>
          <Link href="/owner/login" className="button button--primary">{isId ? 'Masuk ke Admin' : 'Sign in to Admin'}</Link>
        </section>
      ) : (
        <div className="owner-console__workspace">
          {state === 'loading' ? (
            <section className="owner-console__loading" aria-live="polite">
              <span className="owner-console__loading-mark" aria-hidden="true" />
              <p>{isId ? 'Memuat data operasional…' : 'Loading operational data…'}</p>
            </section>
          ) : null}
          {state === 'error' ? (
            <section className="owner-console__gate" role="alert" aria-labelledby="owner-console-error-title">
              <h2 id="owner-console-error-title">{isId ? 'Ringkasan operasi belum dapat dimuat' : 'The operational overview could not be loaded'}</h2>
              <p>{error}</p>
              <button type="button" className="button button--primary" onClick={() => setReloadVersion((value) => value + 1)}>
                {isId ? 'Coba lagi' : 'Try again'}
              </button>
            </section>
          ) : null}
          {state === 'ready' && dashboard ? (
            <>
              <section className="owner-console__stats" aria-label={isId ? 'Ringkasan status' : 'Status overview'}>
                <StatCard value={dashboard.stats.users} label={isId ? 'Pengguna tercatat' : 'Registered users'} />
                <StatCard value={dashboard.stats.newMessages} label={isId ? 'Pesan baru' : 'New messages'} attention={dashboard.stats.newMessages > 0} />
                <StatCard value={dashboard.alerts.length} label={isId ? 'Perlu perhatian' : 'Needs attention'} attention={dashboard.alerts.length > 0} />
              </section>
              <PriorityQueue queue={dashboard.queue ?? []} isId={isId} />
            </>
          ) : null}

          <section className="owner-console__navigation" aria-labelledby="owner-navigation-title">
            <div className="owner-console__section-heading">
              <div>
                <h2 id="owner-navigation-title">{isId ? 'Kelola berdasarkan area kerja' : 'Manage by work area'}</h2>
              </div>
            </div>
            <nav className="owner-console__nav" aria-label={isId ? 'Area kerja Admin' : 'Admin work areas'}>
              {OWNER_MENU.map((group) => <NavGroup key={group.titleEn} group={group} isId={isId} />)}
            </nav>
          </section>
        </div>
      )}
    </section>
  );
}

