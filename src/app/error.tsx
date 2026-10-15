'use client';

import { useEffect } from 'react';

import { PublicShell } from '@/components/public-shell';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(
      JSON.stringify({
        level: 'error',
        event: 'ui_error_boundary',
        digest: error.digest ?? null,
      }),
    );
  }, [error]);

  return (
    <PublicShell>
      <div className="foundation-shell">
        <section className="foundation-hero" role="alert">
          <p className="eyebrow">Kesalahan lokal</p>
          <h1>Halaman belum dapat dimuat</h1>
          <p className="intro">Periksa status layanan, lalu coba lagi.</p>
          <button className="button" type="button" onClick={reset}>
            Coba lagi
          </button>
        </section>
      </div>
    </PublicShell>
  );
}
