import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { OwnerConsole } from '@/components/owner-console';
import { SessionService } from '@/auth/session';
import { getDatabaseClients } from '@/db/client';

export const metadata: Metadata = {
  title: 'Konsol Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function OwnerPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('madevi_owner_access')?.value;
  if (!accessToken) redirect('/owner/login');
  try {
    await new SessionService(getDatabaseClients().pool).authenticateAccess(accessToken, 'OWNER', {
      humanActivity: true,
    });
  } catch {
    redirect('/owner/login');
  }

  return (
    <main id="main-content" className="page-shell">
      <OwnerConsole />
    </main>
  );
}
