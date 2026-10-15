import { ContributionPage } from '@/components/contribution-page';
import { PublicShell } from '@/components/public-shell';
import { PrivateRoute } from '@/components/private-route';

export const dynamic = 'force-dynamic';

export default function KontribusiIndexPage() {
  return (
    <PublicShell>
      <PrivateRoute>
        <ContributionPage />
      </PrivateRoute>
    </PublicShell>
  );
}
