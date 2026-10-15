import { PublicShell } from '@/components/public-shell';

export default function Loading() {
  return (
    <PublicShell>
      <div className="foundation-shell" aria-busy="true">
        <p className="status-line">Memeriksa layanan lokal…</p>
      </div>
    </PublicShell>
  );
}
