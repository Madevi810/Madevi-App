import type { Metadata } from 'next';

import { PublicShell } from '@/components/public-shell';
import { SchoolBrochure } from '@/components/school-brochure';
import Link from 'next/link';
import { STARTER_ARTICLES } from '@/content/starter-articles';

export const metadata: Metadata = { title: 'Brosur Madevi School' };
export const dynamic = 'force-dynamic';

/**
 * Halaman brosur Madevi School untuk pengguna FREE (P08).
 *
 * Brosur memperkenalkan produk (jenjang, cara belajar, contoh materi, format
 * ujian, harga Pro, jalur Love) TANPA memberi akses materi penuh. Semua contoh
 * diberi label "CONTOH" jelas — tidak boleh terlihat seperti hasil pengguna.
 *
 * Halaman ini TIDAK memerlukan paket taxonomy Menu karena hanya memakai nama
 * jenjang struktural + contoh statis (lihat `09`).
 */
export default function BrosurSekolahPage() {
  return (
    <PublicShell>
      <SchoolBrochure />
      <section className="starter-content-grid" aria-labelledby="starter-school-heading">
        <h2 id="starter-school-heading">Materi contoh Madevi School (CONTOH)</h2>
        <p>Artikel pengantar ini gratis dan bersifat contoh; bukan kurikulum, nilai, atau sertifikat resmi. Learning path/progres/ujian/sertifikat penuh tetap terkunci dan hanya untuk paket yang berhak via server.</p>
        <div className="article-card-grid">
          {STARTER_ARTICLES.filter((article) => article.space === 'Madevi School').map((article) => (
            <article className="article-card article-card--sample" key={article.id}><p className="article-card__badge">CONTOH</p><h3>{article.title}</h3><p>{article.summary}</p><Link href={`/artikel/${article.id}`}>Baca contoh</Link></article>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
