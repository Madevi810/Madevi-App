import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PublicShell } from '@/components/public-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JENJANG_LABEL, KELAS_PER_JENJANG, type Jenjang } from '@/services/school';

export const dynamic = 'force-dynamic';

const JENJANG_VALID = Object.keys(JENJANG_LABEL) as Jenjang[];

/**
 * Halaman jenjang: daftar kelas/semester dalam satu jenjang.
 */
export default async function JenjangPage({ params }: { params: Promise<{ jenjang: string }> }) {
  const { jenjang } = await params;
  if (!JENJANG_VALID.includes(jenjang as Jenjang)) notFound();
  const j = jenjang as Jenjang;
  const daftarKelas = KELAS_PER_JENJANG[j];

  return (
    <PublicShell>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px 48px' }}>
        <Link href="/school" style={{ fontSize: 13, color: '#0284c7' }}>← Semua jenjang</Link>
        <h1 style={{ fontSize: '1.5rem', margin: '12px 0 8px' }}>{JENJANG_LABEL[j]}</h1>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>
          Pilih kelas untuk melihat bab, materi, dan ujian.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {daftarKelas.map((kelas, i) => (
            <Link
              key={kelas}
              href={`/school/${j}/${i + 1}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Card variant="interactive">
                <CardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{kelas}</strong>
                    <Badge size="sm" variant="neutral">Masuk →</Badge>
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
