import { PublicShell } from '@/components/public-shell';
import { PrivateRoute } from '@/components/private-route';
import { ActivityHistoryDashboard } from '@/components/activity-history-dashboard';

export const dynamic = 'force-dynamic';

export default function RiwayatIndexPage() {
  return (
    <PublicShell>
      <div className="page-shell">
        <PrivateRoute>
          <ActivityHistoryDashboard />
        </PrivateRoute>
      </div>
    </PublicShell>
  );
}
