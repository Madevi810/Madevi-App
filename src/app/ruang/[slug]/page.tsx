import { R1PendidikanNavigator } from '@/components/r1-navigator';
import { ExploreFoundation } from '@/components/explore-foundation';
import { TutorialProblemFoundation } from '@/components/tutorial-problem-foundation';
import { RuangNavigator } from '@/components/ruang-navigator';
import { PublicShell } from '@/components/public-shell';
import { resolveSpaceSlug } from '@/contracts/navigation';
import { notFound, redirect } from 'next/navigation';
import { STARTER_ARTICLES } from '@/content/starter-articles';

export const dynamic = 'force-dynamic';

/** Nama legacy yang masih dirender demi kompatibilitas; bukan label ruang resmi baru. */
const LEGACY_RUANG_NAMES: Record<string, string> = {
  'agama-dan-kepercayaan': 'Agama & Kepercayaan',
  'negara-sejarah-hukum-dan-masyarakat': 'Negara, Sejarah, Hukum, dan Masyarakat',
  'alat-perangkat-dan-software': 'Alat, Perangkat, dan Software',
};

/**
 * L06: halaman ruang memakai DTO/read-model konsisten.
 * - Explore root memiliki browser khusus yang memuat taxonomy runtime dan
 *   hanya memperlihatkan satu fixture DRAFT sebagai contoh struktur judul.
 * - Tutorial & Problem Solve root memiliki browser praktik sendiri; taxonomy
 *   dan panduan terbit selalu dibaca dari data lokal, bukan dibuat sebagai demo.
 * - Ruang lain dan deep route tetap memakai navigator sesuai kontrak masing-masing.
 */
export default async function RuangPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rootBase = slug.split('/')[0];
  const resolvedSpace = resolveSpaceSlug(rootBase);
  if (resolvedSpace && resolvedSpace.slug !== rootBase) {
    const remainder = slug.split('/').slice(1).join('/');
    redirect(`${resolvedSpace.href}${remainder ? `/${remainder}` : ''}`);
  }
  if (!resolvedSpace && !(rootBase in LEGACY_RUANG_NAMES)) notFound();
  const rootName = resolvedSpace?.name ?? LEGACY_RUANG_NAMES[rootBase] ?? rootBase;
  const isExploreRoot = rootBase === 'jelajahi-pengetahuan' && !slug.includes('/');
  const isTutorialRoot = rootBase === 'tutorial-problem-solve' && !slug.includes('/');
  const exploreSample = STARTER_ARTICLES.find((article) => article.space === 'Explore & Learn') ?? null;

  return (
    <PublicShell>
      {isExploreRoot ? (
        <ExploreFoundation sampleArticle={exploreSample} />
      ) : isTutorialRoot ? (
        <TutorialProblemFoundation />
      ) : rootBase === 'pendidikan-sekolah' ? (
        <R1PendidikanNavigator fullSlug={slug} />
      ) : (
        <RuangNavigator fullSlug={slug} rootName={rootName} />
      )}
    </PublicShell>
  );
}
