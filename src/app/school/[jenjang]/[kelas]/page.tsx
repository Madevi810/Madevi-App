import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PublicShell } from '@/components/public-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { TanyaKonsep } from '@/components/school/tanya-konsep';
import {
  JENJANG_LABEL,
  KELAS_PER_JENJANG,
  type Jenjang,
} from '@/services/school';
import { babByJenjangKelas } from '@/content/school-data';

export const dynamic = 'force-dynamic';

const JENJANG_VALID = Object.keys(JENJANG_LABEL) as Jenjang[];


/**
 * Halaman kelas: daftar bab dalam satu kelas.
 */
export default async function KelasPage({
  params,
}: {
  params: Promise<{ jenjang: string; kelas: string }>;
}) {
  const { jenjang, kelas } = await params;
  if (!JENJANG_VALID.includes(jenjang as Jenjang)) notFound();
  const j = jenjang as Jenjang;
  const daftarKelas = KELAS_PER_JENJANG[j];
  const idx = parseInt(kelas, 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= daftarKelas.length) notFound();
  const namaKelas = daftarKelas[idx];

  // Data bab nyata dari school-data (Fase 4).
  const daftarBab = babByJenjangKelas(j, namaKelas);

  return (
    <PublicShell>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px 48px' }}>
        <Link href={`/school/${j}`} style={{ fontSize: 13, color: '#0284c7' }}>
          ← {JENJANG_LABEL[j]}
        </Link>
        <h1 style={{ fontSize: '1.5rem', margin: '12px 0 8px' }}>{namaKelas}</h1>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>
          Pilih bab untuk mulai belajar. Setiap bab diakhiri kuis — tuntas jika nilai ≥ KKM.
        </p>

        {daftarBab.length === 0 ? (
          <EmptyState
            icon="📚"
            title="Belum ada bab"
            description={`Materi ${namaKelas} sedang disusun mengikuti kurikulum terbaru.`}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {daftarBab.map((b) => (
              <Link
                key={b.id}
                href={`/school/${j}/${kelas}/${b.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card variant="interactive">
                  <CardContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Badge size="sm" variant="neutral" style={{ marginBottom: 4 }}>
                          Bab {b.urutan}
                        </Badge>
                        <strong style={{ display: 'block' }}>{b.judul}</strong>
                        <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>
                          {b.deskripsi}
                        </p>
                      </div>
                      <span style={{ fontSize: 20 }}>→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <TanyaKonsep />
        </div>
      </main>
    </PublicShell>
  );
}
