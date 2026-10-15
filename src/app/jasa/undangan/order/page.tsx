import { PublicShell } from '@/components/public-shell';
import { redirect } from 'next/navigation';
import { StandaloneInvitationOrder } from '@/components/jasa/standalone-invitation-order';

export const metadata = {
  title: 'Pesan Undangan Baru — Madevi',
};

export default async function UndanganOrderFormPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  // Backward compatibility for private links emitted before tracking moved to
  // its neutral route. Normal visits remain on the order form.
  if (token) {
    redirect(`/jasa/tracking?token=${encodeURIComponent(token)}`);
  }

  return (
    <PublicShell>
      <StandaloneInvitationOrder />
    </PublicShell>
  );
}
