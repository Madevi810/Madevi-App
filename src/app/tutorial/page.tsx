import Link from 'next/link';

import { PublicShell } from '@/components/public-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KATEGORI_TUTORIAL_LABEL, type KategoriTutorial } from '@/services/tutorial';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tutorial & Problem Solve — Madevi',
  description: 'Panduan praktis: masalah → cara → penyelesaian. Semua masalah ada solusinya.',
};

const IKON_KATEGORI: Record<KategoriTutorial, string> = {
  kehidupan: '🏠',
  kerja: '💼',
  alat: '🔧',
  belajar: '📚',
  perbaikan: '🛠️',
  mental: '🧠',
  keuangan: '💰',
  kesehatan: '🏥',
  teknologi: '💻',
  umkm: '🏪',
};

const KATEGORI_URUT = Object.keys(KATEGORI_TUTORIAL_LABEL) as KategoriTutorial[];

/**
 * Landing Tutorial: jelajahi per kategori masalah.
 */
export default function TutorialLandingPage() {
  return (
    <PublicShell>
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 16px 48px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>🛠️ Tutorial &amp; Problem Solve</h1>
        <p style={{ color: '#6b7280', marginBottom: 24, maxWidth: '70ch' }}>
          Punya masalah? Cari solusinya di sini. Setiap panduan mengikuti format baku:
          masalah → penjelasan → persiapan → langkah → risiko → penyelesaian.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {KATEGORI_URUT.map((k) => (
            <Link key={k} href={`/tutorial/${k}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card variant="interactive">
                <CardContent>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: '2rem' }} aria-hidden>{IKON_KATEGORI[k]}</span>
                    <div>
                      <strong style={{ display: 'block' }}>{KATEGORI_TUTORIAL_LABEL[k]}</strong>
                      <Badge size="sm" variant="neutral" style={{ marginTop: 4 }}>Jelajahi →</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </PublicShell>
  );
}
