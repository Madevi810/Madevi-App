import Link from 'next/link';

import { PublicShell } from '@/components/public-shell';

export default function NotFound() {
  return (
    <PublicShell>
      <div className="foundation-shell">
        <section className="foundation-hero">
          <p className="eyebrow">404</p>
          <h1>Halaman tidak ditemukan</h1>
          <Link className="button" href="/">
            Kembali ke Beranda
          </Link>
        </section>
      </div>
    </PublicShell>
  );
}
