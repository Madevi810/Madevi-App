import { UtilitiesPage } from '@/components/utilities-page';
import { PublicShell } from '@/components/public-shell';

export const dynamic = 'force-dynamic';

export default function AlatBantuIndexPage() {
  return (
    <PublicShell>
      <UtilitiesPage />
    </PublicShell>
  );
}
