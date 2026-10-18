import { PublicShell } from '@/components/public-shell';

// Fase A1: status loading sesuai lingkungan — jelas dan tenang.
// Di Vercel (demo online) tampil "Memuat…", di lokal tampil "Menyiapkan…".
const isOnlineDemo = process.env.VERCEL === '1' || process.env.NEXT_PUBLIC_DEMO_MODE === '1';

export default function Loading() {
  return (
    <PublicShell>
      <div className="foundation-shell" aria-busy="true">
        <p className="status-line">{isOnlineDemo ? 'Memuat…' : 'Menyiapkan…'}</p>
      </div>
    </PublicShell>
  );
}
