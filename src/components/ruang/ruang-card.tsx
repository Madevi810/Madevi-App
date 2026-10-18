import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type RuangInfo = {
  slug: string;
  nama: string;
  deskripsi: string;
  href: string;
  ikon: string;
  warna: string;
  jumlahKonten?: number;
  labelKonten?: string;
};

export type RuangCardProps = {
  ruang: RuangInfo;
  ukuran?: 'sm' | 'md' | 'lg';
};

/**
 * RuangCard — kartu konsisten untuk 7 ruang Madevi.
 * Ukuran proporsional: sm untuk grid rapat, md default, lg untuk sorotan.
 */
export function RuangCard({ ruang, ukuran = 'md' }: RuangCardProps) {
  return (
    <Link href={ruang.href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card
        variant="interactive"
        className={ukuran === 'lg' ? 'mdv-ruang-card--lg' : ukuran === 'sm' ? 'mdv-ruang-card--sm' : ''}
      >
        <CardContent>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span
              style={{
                fontSize: ukuran === 'lg' ? '2.5rem' : ukuran === 'sm' ? '1.5rem' : '2rem',
                lineHeight: 1,
              }}
              aria-hidden
            >
              {ruang.ikon}
            </span>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px', fontSize: ukuran === 'lg' ? '1.25rem' : '1rem' }}>
                {ruang.nama}
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                {ruang.deskripsi}
              </p>
              {ruang.jumlahKonten !== undefined && (
                <div style={{ marginTop: 8 }}>
                  <Badge size="sm" variant="neutral">
                    {ruang.jumlahKonten} {ruang.labelKonten ?? 'konten'}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export type RuangGridProps = {
  daftar: RuangInfo[];
  ukuran?: 'sm' | 'md' | 'lg';
};

/**
 * RuangGrid — grid konsisten untuk daftar ruang.
 */
export function RuangGrid({ daftar, ukuran = 'md' }: RuangGridProps) {
  const kolom = ukuran === 'sm' ? 'repeat(auto-fill, minmax(220px, 1fr))' : 'repeat(auto-fill, minmax(280px, 1fr))';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: kolom, gap: 16 }}>
      {daftar.map((r) => (
        <RuangCard key={r.slug} ruang={r} ukuran={ukuran} />
      ))}
    </div>
  );
}
