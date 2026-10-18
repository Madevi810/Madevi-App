import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PublicShell } from '@/components/public-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import {
  KATEGORI_TUTORIAL_LABEL,
  type KategoriTutorial,
  type Tutorial,
} from '@/services/tutorial';

export const dynamic = 'force-dynamic';

const KATEGORI_VALID = Object.keys(KATEGORI_TUTORIAL_LABEL) as KategoriTutorial[];

// Contoh tutorial per kategori — isi bermakna, bukan placeholder (aturan #11).
const CONTOH_TUTORIAL: Record<KategoriTutorial, Tutorial[]> = {
  perbaikan: [
    {
      id: 'tut-perbaikan-1',
      slug: 'cara-ganti-bohlam-lampu',
      judul: 'Cara Mengganti Bohlam Lampu dengan Aman',
      kategori: 'perbaikan',
      tingkat: 'pemula',
      estimasiMenit: 15,
      masalah: 'Lampu di rumah mati dan ruangan menjadi gelap.',
      penjelasan:
        'Bohlam pijar atau LED punya masa pakai terbatas. Filamen putus atau driver LED rusak adalah penyebab umum.',
      persiapanAlat: ['Tangga yang stabil', 'Bohlam baru (cek watt & tipe soket)', 'Sarung tangan kain'],
      langkah: [
        {
          judul: 'Matikan saklar dan pastikan aman',
          detail: 'Matikan saklar lampu. Untuk keamanan ekstra, matikan MCB untuk jalur lampu tersebut.',
          peringatan: 'Jangan menyentuh fitting saat saklar masih menyala.',
        },
        {
          judul: 'Lepas bohlam lama',
          detail: 'Tunggu bohlam dingin, lalu putar berlawanan arah jarum jam sampai lepas.',
          tips: 'Jika susah, gunakan sarung tangan karet untuk cengkeraman lebih baik.',
        },
        {
          judul: 'Pasang bohlam baru',
          detail: 'Putar searah jarum jam sampai kencang tapi jangan terlalu kuat.',
        },
        {
          judul: 'Nyalakan dan uji',
          detail: 'Nyalakan MCB lalu saklar. Pastikan lampu menyala normal tanpa kedip.',
        },
      ],
      risiko: [
        { risiko: 'Kesetrum', pencegahan: 'Matikan saklar dan MCB sebelum menyentuh fitting.' },
        { risiko: 'Bohlam pecah', pencegahan: 'Jangan memutar terlalu kuat; gunakan sarung tangan.' },
      ],
      penyelesaian:
        'Lampu menyala kembali dengan normal. Buang bohlam lama ke tempat sampah khusus elektronik jika LED.',
      tags: ['listrik', 'rumah', 'lampu'],
      dibuatPada: '2026-10-18',
      diperbaruiPada: '2026-10-18',
    },
  ],
  kehidupan: [],
  kerja: [],
  alat: [],
  belajar: [],
  mental: [],
  keuangan: [],
  kesehatan: [],
  teknologi: [],
  umkm: [],
};

/**
 * Halaman kategori tutorial: daftar tutorial dalam satu kategori.
 */
export default async function KategoriTutorialPage({
  params,
}: {
  params: Promise<{ kategori: string }>;
}) {
  const { kategori } = await params;
  if (!KATEGORI_VALID.includes(kategori as KategoriTutorial)) notFound();
  const k = kategori as KategoriTutorial;
  const daftar = CONTOH_TUTORIAL[k] ?? [];

  return (
    <PublicShell>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px 48px' }}>
        <Link href="/tutorial" style={{ fontSize: 13, color: '#0284c7' }}>
          ← Semua kategori
        </Link>
        <h1 style={{ fontSize: '1.5rem', margin: '12px 0 8px' }}>
          Tutorial: {KATEGORI_TUTORIAL_LABEL[k]}
        </h1>

        {daftar.length === 0 ? (
          <EmptyState
            icon="📝"
            title="Tutorial segera hadir"
            description={`Tim kami sedang menulis panduan ${KATEGORI_TUTORIAL_LABEL[k]}. Sementara itu, jelajahi kategori lain.`}
            action={
              <Link href="/tutorial">
                <Badge>Lihat kategori lain</Badge>
              </Link>
            }
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {daftar.map((t) => (
              <Link
                key={t.id}
                href={`/tutorial/${k}/${t.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card variant="interactive">
                  <CardContent>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <Badge size="sm">{t.tingkat}</Badge>
                      <Badge size="sm" variant="neutral">⏱ {t.estimasiMenit} mnt</Badge>
                      <Badge size="sm" variant="neutral">{t.langkah.length} langkah</Badge>
                    </div>
                    <strong style={{ display: 'block', marginBottom: 4 }}>{t.judul}</strong>
                    <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{t.masalah}</p>
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
