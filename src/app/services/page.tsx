import Link from 'next/link';

import { PublicShell } from '@/components/public-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Madevi Services — Madevi',
  description: 'Jasa digital: undangan, desain, dan layanan profesional. Simulasi penuh, tanpa pembayaran nyata.',
};

const LAYANAN = [
  {
    href: '/undangan/buat',
    ikon: '💌',
    nama: 'Undangan Digital',
    deskripsi: 'Undangan pernikahan digital: 12 template, RSVP, amplop digital, kelola tamu.',
    badge: 'Populer',
  },
  {
    href: '/undangan/template',
    ikon: '🎨',
    nama: 'Galeri Template',
    deskripsi: 'Lihat semua 12 template undangan sebelum memilih.',
    badge: null,
  },
  {
    href: '/tools/cek-aman-rangkaian',
    ikon: '⚡',
    nama: 'Cek Aman Rangkaian',
    deskripsi: 'Validasi keamanan rangkaian elektronika dalam Bahasa Indonesia.',
    badge: 'Baru',
  },
];

/**
 * Landing Madevi Services: daftar jasa digital.
 * Semua simulasi — pembayaran dan proses nyata diganti simulasi jujur.
 */
export default function ServicesLandingPage() {
  return (
    <PublicShell>
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 16px 48px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>💼 Madevi Services</h1>
        <p style={{ color: '#6b7280', marginBottom: 8, maxWidth: '70ch' }}>
          Jasa digital profesional. Saat ini semua dalam mode{' '}
          <Badge size="sm" variant="info">Simulasi</Badge> — alur pemesanan berjalan
          penuh tanpa pembayaran nyata.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 24 }}>
          {LAYANAN.map((l) => (
            <Link key={l.href} href={l.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card variant="interactive">
                <CardContent>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '2rem' }} aria-hidden>{l.ikon}</span>
                    <div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                        <strong>{l.nama}</strong>
                        {l.badge && <Badge size="sm" variant="success">{l.badge}</Badge>}
                      </div>
                      <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                        {l.deskripsi}
                      </p>
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
