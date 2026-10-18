import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PublicShell } from '@/components/public-shell';
import { TutorialView } from '@/components/tutorial/tutorial-view';
import {
  KATEGORI_TUTORIAL_LABEL,
  type KategoriTutorial,
  type Tutorial,
} from '@/services/tutorial';

export const dynamic = 'force-dynamic';

const KATEGORI_VALID = Object.keys(KATEGORI_TUTORIAL_LABEL) as KategoriTutorial[];

// Data sama dengan halaman kategori — satu sumber (di produksi: dari database).
const CONTOH_TUTORIAL: Record<string, Tutorial> = {
  'cara-ganti-bohlam-lampu': {
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
};

/**
 * Halaman baca tutorial: format baku dengan checklist progres.
 */
export default async function BacaTutorialPage({
  params,
}: {
  params: Promise<{ kategori: string; slug: string }>;
}) {
  const { kategori, slug } = await params;
  if (!KATEGORI_VALID.includes(kategori as KategoriTutorial)) notFound();
  const tutorial = CONTOH_TUTORIAL[slug];
  if (!tutorial) notFound();

  return (
    <PublicShell>
      <main style={{ padding: '16px 0' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px' }}>
          <Link href={`/tutorial/${kategori}`} style={{ fontSize: 13, color: '#0284c7' }}>
            ← {KATEGORI_TUTORIAL_LABEL[kategori as KategoriTutorial]}
          </Link>
        </div>
        <TutorialView tutorial={tutorial} />
      </main>
    </PublicShell>
  );
}
