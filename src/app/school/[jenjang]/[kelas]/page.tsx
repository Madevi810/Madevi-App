import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PublicShell } from '@/components/public-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import {
  JENJANG_LABEL,
  KELAS_PER_JENJANG,
  type Jenjang,
  type Bab,
} from '@/services/school';

export const dynamic = 'force-dynamic';

const JENJANG_VALID = Object.keys(JENJANG_LABEL) as Jenjang[];

// Contoh bab untuk SD Kelas 4 — isi bermakna (aturan #11).
const CONTOH_BAB: Bab[] = [
  {
    id: 'sd4-matematika-pecahan',
    judul: 'Pecahan Sederhana',
    deskripsi: 'Mengenal pecahan, membaca dan menulis pecahan, serta membandingkan pecahan.',
    urutan: 1,
  },
  {
    id: 'sd4-matematika-perkalian',
    judul: 'Perkalian Bilangan Cacah',
    deskripsi: 'Perkalian sampai 100 dan penerapannya dalam soal cerita.',
    urutan: 2,
  },
  {
    id: 'sd4-bindo-karangan',
    judul: 'Menulis Karangan Narasi',
    deskripsi: 'Menyusun karangan narasi dengan urutan peristiwa yang jelas.',
    urutan: 3,
  },
];

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

  // Contoh bab hanya untuk SD kelas 4; lainnya empty state bermakna.
  const isContoh = j === 'sd' && idx === 3;
  const daftarBab = isContoh ? CONTOH_BAB : [];

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
            title="Bab segera hadir"
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
      </main>
    </PublicShell>
  );
}
