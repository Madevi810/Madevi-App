'use client';

export default function GlobalError() {
  return (
    <html lang="id">
      <body>
        <main className="foundation-shell">
          <section className="foundation-hero" role="alert">
            <h1>Aplikasi lokal berhenti memuat</h1>
            <p>Minta Admin menjalankan pemeriksaan status sebelum mencoba kembali.</p>
          </section>
        </main>
      </body>
    </html>
  );
}
