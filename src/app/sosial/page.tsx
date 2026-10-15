import { SocialDashboard } from '@/components/social-dashboard';
import { PublicShell } from '@/components/public-shell';
import { PrivateRoute } from '@/components/private-route';
import { LineGuestView } from '@/components/line-guest-view';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function SosialPage() {
  return (
    <PublicShell>
      <PrivateRoute guestContent={<LineGuestView />}>
        <Suspense fallback={<p>Memuat sosial...</p>}>
          <SocialDashboard />
        </Suspense>
      </PrivateRoute>
    </PublicShell>
  );
}
