import type { Metadata } from 'next';

import { PublicProfile } from '@/components/public-profile';
import { PublicShell } from '@/components/public-shell';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProfilPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  return (
    <PublicShell>
      <PublicProfile username={username} />
    </PublicShell>
  );
}
