import Link from 'next/link';

import { PublicShell } from '@/components/public-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JENJANG_LABEL, KELAS_PER_JENJANG, type Jenjang } from '@/services/school';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Madevi School — Madevi',
  description: 'Sekolah digital: pilih jenjang, naik kelas lewat ujian. Seperti sekolah nyata.',
};

const IKON_JENJANG: Record<Jenjang, string> = {
  paud: '🧒',
  sd: '📚',
  smp: '📖',
  sma: '🎒',
  smk: '🔧',
  diploma: '📜',
  sarjana: '🎓',
  pascasarjana: '🔬',
  khusus: '❤️',
  agama: '🕌',
};

const JENJANG_URUT: Jenjang[] = [
  'paud', 'sd', 'smp', 'sma', 'smk',
  'diploma', 'sarjana', 'pascasarjana',
  'khusus', 'agama',
];

/**
 * Landing Madevi School: pilih jenjang → lihat kelas → mulai belajar.
 */
export default function SchoolLandingPage() {
  return (
    <PublicShell>
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 16px 48px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>🎓 Madevi School</h1>
        <p style={{ color: '#6b7280', marginBottom: 24, maxWidth: '70ch' }}>
          Sekolah digital yang terasa nyata: pilih jenjang, ikuti bab dan materi,
          kerjakan latihan, lulus ujian untuk naik kelas.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {JENJANG_URUT.map((j) => (
            <Link key={j} href={`/school/${j}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card variant="interactive">
                <CardContent>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '2rem' }} aria-hidden>{IKON_JENJANG[j]}</span>
                    <div>
                      <strong style={{ display: 'block' }}>{JENJANG_LABEL[j]}</strong>
                      <span style={{ fontSize: 13, color: '#6b7280' }}>
                        {KELAS_PER_JENJANG[j].length} tingkat
                      </span>
                      <div style={{ marginTop: 8 }}>
                        <Badge size="sm" variant="neutral">
                          {KELAS_PER_JENJANG[j][0]} – {KELAS_PER_JENJANG[j][KELAS_PER_JENJANG[j].length - 1]}
                        </Badge>
                      </div>
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
