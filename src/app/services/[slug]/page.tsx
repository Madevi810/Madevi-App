import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PublicShell } from '@/components/public-shell';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DAFTAR_LAYANAN, layananBySlug, formatRupiah } from '@/content/services-data';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return DAFTAR_LAYANAN.map((l) => ({ slug: l.slug }));
}

/**
 * Halaman detail layanan (F-SV1): deskripsi, 2 tier harga, alur pesan, contoh hasil.
 * Semua simulasi — pembayaran nyata diganti simulasi jujur.
 */
export default async function LayananDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const layanan = layananBySlug(slug);
  if (!layanan) notFound();

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <nav className="mb-4 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/services" className="hover:underline">Services</Link>
          {' / '}
          <span className="text-foreground">{layanan.nama}</span>
        </nav>

        <Badge>{layanan.kategori}</Badge>
        <h1 className="mt-2 text-3xl font-bold">{layanan.nama}</h1>
        <p className="mt-2 text-muted-foreground">{layanan.deskripsi}</p>

        <section className="mt-8" aria-label="Pilihan paket">
          <h2 className="text-xl font-semibold">Pilih Paket</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {layanan.tier.map((t) => (
              <Card key={t.nama} className={t.nama === 'PRO' ? 'border-primary' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{t.nama}</h3>
                    {t.nama === 'PRO' && <Badge>Populer</Badge>}
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {formatRupiah(t.hargaMin)}
                    {t.hargaMax > t.hargaMin && ` – ${formatRupiah(t.hargaMax)}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Estimasi {t.estimasiHari} hari
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {t.fitur.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span aria-hidden>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${slug}/pesan?tier=${t.nama}`}
                    className="mt-4 block rounded bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:opacity-90"
                  >
                    Pesan {t.nama}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Simulasi: pembayaran dan proses order disimulasikan di dalam aplikasi, tanpa transaksi nyata.
          </p>
        </section>

        <section className="mt-8" aria-label="Alur pemesanan">
          <h2 className="text-xl font-semibold">Alur Pemesanan</h2>
          <ol className="mt-4 space-y-3">
            {layanan.alurPesan.map((a, i) => (
              <li key={a} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-1">{a}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8" aria-label="Contoh hasil">
          <h2 className="text-xl font-semibold">Contoh Hasil</h2>
          <Card className="mt-4">
            <CardContent className="pt-6">
              <p>{layanan.contohHasil}</p>
            </CardContent>
          </Card>
        </section>

        <div className="mt-8">
          <Link href="/services" className="text-sm text-primary hover:underline">
            ← Kembali ke semua layanan
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
