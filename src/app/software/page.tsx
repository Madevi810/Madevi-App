import { SoftwarePageClient } from '@/components/software-page-client';
import { PublicShell } from '@/components/public-shell';

export const dynamic = 'force-dynamic';

export default function SoftwarePage() {
  return (
    <PublicShell>
      <SoftwarePageClient />
    </PublicShell>
  );
}
