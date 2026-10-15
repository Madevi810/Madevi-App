import { PublicShell } from '@/components/public-shell';
import { PrivateServiceOrderViewer } from '@/components/jasa/private-service-order-viewer';

export const dynamic = 'force-dynamic';

export const metadata = {
  robots: { index: false, follow: false },
  title: 'Akses Private — Madevi',
};

/** Halaman status order custom/PCB melalui token privat yang tidak diindeks. */
export default async function PrivateServiceOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <PublicShell>
      <div className="page-shell">
        <PrivateServiceOrderViewer token={token} />
      </div>
    </PublicShell>
  );
}
