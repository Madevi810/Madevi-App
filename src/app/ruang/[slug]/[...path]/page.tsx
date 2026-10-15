import { R1PendidikanNavigator } from '@/components/r1-navigator';
import { RuangNavigator } from '@/components/ruang-navigator';
import { PublicShell } from '@/components/public-shell';
import { resolveSpaceSlug } from '@/contracts/navigation';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/** Nama legacy yang masih dirender demi kompatibilitas; bukan label ruang resmi baru. */
const LEGACY_RUANG_NAMES: Record<string, string> = {
  'agama-dan-kepercayaan': 'Agama & Kepercayaan',
  'negara-sejarah-hukum-dan-masyarakat': 'Negara, Sejarah, Hukum, dan Masyarakat',
  'alat-perangkat-dan-software': 'Alat, Perangkat, dan Software',
};

export default async function RuangPathPage({
  params,
}: {
  params: Promise<{ slug: string; path: string[] }>;
}) {
  const { slug, path } = await params;
  const fullPath = [slug, ...path].join('/');
  const rootBase = slug.split('/')[0];
  const resolvedSpace = resolveSpaceSlug(rootBase);
  if (resolvedSpace && resolvedSpace.slug !== rootBase) {
    const remainder = [slug.split('/').slice(1).join('/'), ...path].filter(Boolean).join('/');
    redirect(`${resolvedSpace.href}${remainder ? `/${remainder}` : ''}`);
  }
  if (!resolvedSpace && !(rootBase in LEGACY_RUANG_NAMES)) notFound();
  // Tutorial memakai satu browser action-first pada root. Deep link dari search
  // atau taxonomy tetap valid, tetapi dipulihkan ke URL kanonis browser itu.
  if (rootBase === 'tutorial-problem-solve') {
    redirect(`/ruang/tutorial-problem-solve?path=${encodeURIComponent(fullPath)}`);
  }
  const rootName = resolvedSpace?.name ?? LEGACY_RUANG_NAMES[rootBase] ?? rootBase;

  return (
    <PublicShell>
      {rootBase === 'pendidikan-sekolah' ? (
        <R1PendidikanNavigator fullSlug={fullPath} />
      ) : (
        <RuangNavigator fullSlug={fullPath} rootName={rootName} />
      )}
    </PublicShell>
  );
}
