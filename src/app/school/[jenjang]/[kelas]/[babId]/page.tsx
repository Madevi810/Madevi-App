import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PublicShell } from '@/components/public-shell';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ALL_SCHOOL_BAB, babById } from '@/content/school-data';
import { JENJANG_LABEL, KELAS_PER_JENJANG, type Jenjang } from '@/services/school';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return ALL_SCHOOL_BAB.map((b) => ({ babId: b.id }));
}

/**
 * Halaman materi bab (F-S2): materi + latihan soal + pelacakan progres.
 */
export default async function BabPage({
  params,
}: {
  params: Promise<{ jenjang: string; kelas: string; babId: string }>;
}) {
  const { jenjang, kelas, babId } = await params;
  const bab = babById(babId);
  if (!bab) notFound();

  const j = jenjang as Jenjang;
  const jenjangLabel = JENJANG_LABEL[j] ?? jenjang;
  const daftarKelas = KELAS_PER_JENJANG[j] ?? [];
  const idx = parseInt(kelas, 10) - 1;
  const namaKelas = daftarKelas[idx] ?? `Kelas ${kelas}`;

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <nav className="mb-4 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/school" className="hover:underline">School</Link>
          {' / '}
          <Link href={`/school/${jenjang}`} className="hover:underline">{jenjangLabel}</Link>
          {' / '}
          <Link href={`/school/${jenjang}/${kelas}`} className="hover:underline">{namaKelas}</Link>
          {' / '}
          <span className="text-foreground">{bab.judul}</span>
        </nav>

        <h1 className="text-3xl font-bold">{bab.judul}</h1>
        <p className="mt-2 text-muted-foreground">{bab.deskripsi}</p>
        <div className="mt-3 flex gap-2">
          <Badge>{jenjangLabel}</Badge>
          <Badge variant="neutral">{namaKelas}</Badge>
          <Badge variant="info">Bab {bab.urutan}</Badge>
        </div>

        <section className="mt-8" aria-label="Materi">
          <h2 className="text-xl font-semibold">Materi</h2>
          <div className="mt-4 space-y-4">
            {bab.materi.map((m) => (
              <Card key={m.id}>
                <CardHeader>
                  <h3 className="text-lg font-semibold">{m.judul}</h3>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line leading-relaxed">{m.konten}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Estimasi: {m.estimasiMenit} menit
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-8" aria-label="Latihan">
          <h2 className="text-xl font-semibold">Latihan Soal</h2>
          <div className="mt-4 space-y-4">
            {bab.latihan.map((s, i) => (
              <Card key={s.id}>
                <CardContent className="pt-6">
                  <p className="font-medium">
                    {i + 1}. {s.pertanyaan}
                  </p>
                  {s.opsi && (
                    <ul className="mt-3 space-y-2">
                      {s.opsi.map((o) => (
                        <li key={o} className="rounded border px-3 py-2 text-sm">
                          {o}
                        </li>
                      ))}
                    </ul>
                  )}
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer text-primary">
                      Lihat kunci & pembahasan
                    </summary>
                    <p className="mt-2">
                      <strong>Jawaban:</strong> {s.kunciJawaban}
                    </p>
                    <p className="mt-1 text-muted-foreground">{s.pembahasan}</p>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-8 flex justify-between">
          <Link
            href={`/school/${jenjang}/${kelas}`}
            className="text-sm text-primary hover:underline"
          >
            ← Kembali ke daftar bab
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
