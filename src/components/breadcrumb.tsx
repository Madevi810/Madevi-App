'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/theme-provider';
import { resolveSpaceFromPath, MADEVI_SPACES } from '@/contracts/navigation';

const ROUTE_LABELS: Record<string, { id: string; en: string }> = {
  '/': { id: 'Beranda', en: 'Home' },
  '/belajar': { id: 'Belajar', en: 'Learn' },
  '/jelajahi': { id: 'Jelajahi', en: 'Explore' },
  '/software': { id: 'Software', en: 'Software' },
  '/sosial': { id: 'Sosial', en: 'Social' },
  '/profile': { id: 'Profil', en: 'Profile' },
  '/owner': { id: 'Owner', en: 'Owner' },
  '/admin': { id: 'Admin', en: 'Admin' },
  '/auth': { id: 'Masuk', en: 'Sign In' },
  '/undangan': { id: 'Undangan', en: 'Invitation' },
  '/artikel': { id: 'Artikel', en: 'Articles' },
  '/ruang': { id: 'Ruang', en: 'Spaces' },
  '/ruang/jelajahi-pengetahuan': { id: 'Jelajahi Pengetahuan', en: 'Explore Knowledge' },
  '/ruang/tutorial-problem-solve': { id: 'Tutorial & Problem Solve', en: 'Tutorial & Problem Solve' },
  '/ruang/pendidikan-sekolah': { id: 'Pendidikan Sekolah', en: 'School Education' },
  '/jasa': { id: 'Jasa', en: 'Services' },
  '/belanja': { id: 'Belanja', en: 'Shop' },
  '/alat-bantu': { id: 'Alat Bantu', en: 'Tools' },
};

function getSegmentLabel(pathname: string, language: 'id' | 'en'): string | null {
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname][language];

  // Check for article detail routes
  if (pathname.startsWith('/artikel/') && pathname !== '/artikel') {
    return pathname.split('/').pop() ?? null;
  }

  // Check for space routes
  if (pathname.startsWith('/ruang/')) {
    const space = MADEVI_SPACES.find((s) => s.href === pathname);
    if (space) return space[language === 'id' ? 'nameId' : 'nameEn'];
  }

  return null;
}

export function Breadcrumb() {
  const { language } = useLanguage();
  const pathname = usePathname() ?? '/';
  const space = resolveSpaceFromPath(pathname);

  // Build breadcrumb segments
  const segments: Array<{ label: string; href?: string; current?: boolean }> = [];

  // Always start with home
  segments.push({ label: ROUTE_LABELS['/'][language], href: '/' });

  if (pathname === '/') {
    segments[0].current = true;
    return renderBreadcrumb(segments, language);
  }

  const pathParts = pathname.split('/').filter(Boolean);

  if (space) {
    // Space route: Home > Space
    segments.push({
      label: space[language === 'id' ? 'nameId' : 'nameEn'],
      current: true,
    });
  } else if (pathParts.length === 1) {
    // Single segment route
    const label = getSegmentLabel(`/${pathParts[0]}`, language);
    if (label) {
      segments.push({ label, current: true });
    }
  } else if (pathParts.length === 2) {
    // Two segments: could be /artikel/slug or /ruang/slug
    const parentPath = `/${pathParts[0]}`;
    const parentLabel = getSegmentLabel(parentPath, language);

    if (parentLabel) {
      segments.push({ label: parentLabel, href: parentPath });
    }

    const currentLabel = getSegmentLabel(pathname, language);
    if (currentLabel) {
      segments.push({ label: currentLabel, current: true });
    } else {
      // Fallback: capitalize the last segment
      segments.push({
        label: pathParts[1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        current: true,
      });
    }
  } else {
    // More than 2 segments
    for (let i = 0; i < pathParts.length - 1; i++) {
      const partialPath = '/' + pathParts.slice(0, i + 1).join('/');
      const label = getSegmentLabel(partialPath, language);
      if (label) {
        segments.push({ label, href: partialPath });
      }
    }
    const currentLabel = getSegmentLabel(pathname, language);
    segments.push({
      label: currentLabel ?? pathParts[pathParts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      current: true,
    });
  }

  return renderBreadcrumb(segments, language);
}

function renderBreadcrumb(
  segments: Array<{ label: string; href?: string; current?: boolean }>,
  language: 'id' | 'en',
) {
  if (segments.length <= 1) return null;

  return (
    <nav className="breadcrumb" aria-label={language === 'id' ? 'Navigasi' : 'Breadcrumb'} data-slot="breadcrumb">
      <ol className="breadcrumb__list">
        {segments.map((segment, index) => (
          <li key={segment.href ?? segment.label} className="breadcrumb__item">
            {index > 0 && (
              <span className="breadcrumb__separator" aria-hidden="true">
                <ChevronRightIcon />
              </span>
            )}
            {segment.href && !segment.current ? (
              <Link href={segment.href} className="breadcrumb__link">
                {segment.label}
              </Link>
            ) : (
              <span className="breadcrumb__current" aria-current="page">
                {segment.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="breadcrumb__chevron"
    >
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}