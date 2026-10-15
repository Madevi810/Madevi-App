import type { Metadata } from 'next';

import { UtilitiesPage } from '@/components/utilities-page';
import { PublicShell } from '@/components/public-shell';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Emulator Sirkuit DC',
  description: 'Simulator edukasi rangkaian DC linear pada kondisi tunak.',
  robots: { index: false, follow: false },
};

export default function CircuitEmulatorPage() {
  return (
    <PublicShell>
      <UtilitiesPage />
    </PublicShell>
  );
}
