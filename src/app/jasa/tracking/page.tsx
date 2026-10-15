import { PublicShell } from '@/components/public-shell';
import {
  PrivateOrderViewer,
  type InvitationOrder,
  type LogoOrder,
} from '@/components/jasa/private-order-viewer';
import { getDatabaseClients } from '@/db/client';
import { JasaService } from '@/services/jasa';

export const dynamic = 'force-dynamic';

/** Halaman ini tidak boleh diindeks (tautan rahasia). */
export const metadata = {
  robots: { index: false, follow: false },
  title: 'Akses Private — Madevi',
};

/**
 * Halaman private order via secret token (query ?token=...).
 * Tidak diindeks: robots memblokir, tidak ada tautan publik.
 */
export default async function PrivateOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let order: InvitationOrder | null = null;
  let logoOrder: LogoOrder | null = null;

  if (token) {
    const service = new JasaService(getDatabaseClients().pool);
    try {
      const invitation = await service.getInvitationOrderByToken(token);
      if (invitation) {
        order = invitation as unknown as InvitationOrder;
      } else {
        const logo = await service.getLogoOrderByToken(token);
        logoOrder = (logo as LogoOrder | null) ?? null;
      }
    } catch {
      // Halaman privat tetap menampilkan state "tidak ditemukan" tanpa
      // membocorkan detail penyimpanan atau token yang mungkin salah.
    }
  }

  return (
    <PublicShell>
      <div className="page-shell">
        <PrivateOrderViewer
          invitation={order}
          logo={logoOrder}
          hasToken={Boolean(token)}
          token={token}
        />
      </div>
    </PublicShell>
  );
}
