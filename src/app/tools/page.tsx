import Link from 'next/link';

import { PublicShell } from '@/components/public-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ALL_TOOLS } from '@/services/tools-registry-data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tools & Equipment — Madevi',
  description: 'Kalkulator, konverter, generator, dan simulasi interaktif. Gratis, tanpa daftar.',
};

const SIMULASI = [
  { href: '/simulasi', judul: 'Hukum Ohm', deskripsi: 'V = I × R interaktif', ikon: '⚡' },
  { href: '/simulasi', judul: 'Gerak Parabola', deskripsi: 'Lintasan proyektil', ikon: '🎯' },
  { href: '/simulasi', judul: 'Pegas & Osilasi', deskripsi: 'Animasi pegas real-time', ikon: '🌀' },
  { href: '/simulasi', judul: 'Grafik Fungsi', deskripsi: 'y = ax² + bx + c', ikon: '📈' },
  { href: '/simulasi', judul: 'Skala pH', deskripsi: 'Asam-basa visual', ikon: '🧪' },
  { href: '/simulasi', judul: 'Pecahan Visual', deskripsi: 'Belajar pecahan', ikon: '🍕' },
];

/**
 * Landing Tools & Equipment: semua tools dikelompokkan per kategori
 * + simulasi interaktif. Satu pintu, tanpa daftar.
 */
export default function ToolsLandingPage() {
  const perKategori = new Map<string, typeof ALL_TOOLS>();
  for (const t of ALL_TOOLS) {
    const list = perKategori.get(t.category) ?? [];
    list.push(t);
    perKategori.set(t.category, list);
  }
  const kategoriUrut = [...perKategori.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <PublicShell>
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 16px 48px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>🧰 Tools &amp; Equipment</h1>
        <p style={{ color: '#6b7280', marginBottom: 8, maxWidth: '70ch' }}>
          {ALL_TOOLS.length} tools gratis + 6 simulasi interaktif. Tanpa daftar, langsung pakai.
        </p>

        {/* Simulasi sorotan */}
        <section style={{ margin: '24px 0' }}>
          <h2>🔬 Simulasi Interaktif</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {SIMULASI.map((s) => (
              <Link key={s.judul} href={s.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card variant="interactive">
                  <CardContent>
                    <div style={{ fontSize: '1.8rem' }}>{s.ikon}</div>
                    <strong style={{ display: 'block', marginTop: 4 }}>{s.judul}</strong>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>{s.deskripsi}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Tools per kategori */}
        {kategoriUrut.map(([kategori, tools]) => (
          <section key={kategori} style={{ marginTop: 24 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {kategori}
              <Badge size="sm" variant="neutral">{tools.length}</Badge>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {tools.map((t) => (
                <Link
                  key={t.id}
                  href={`/tools/${t.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Card variant="interactive">
                    <CardContent>
                      <strong style={{ display: 'block' }}>{t.nameId}</strong>
                      <span style={{ fontSize: 13, color: '#6b7280', display: 'block', marginTop: 4, lineHeight: 1.5 }}>
                        {t.descriptionId.slice(0, 90)}{t.descriptionId.length > 90 ? '...' : ''}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </PublicShell>
  );
}
