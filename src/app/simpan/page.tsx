import { PublicShell } from '@/components/public-shell';
import { PrivateRoute } from '@/components/private-route';
import { SavedItemsDashboard } from '@/components/saved-items-dashboard';

export const dynamic = 'force-dynamic';

export default function SimpanIndexPage() {
  return (
    <PublicShell>
      <div className="page-shell">
        <PrivateRoute>
          <SavedItemsDashboard />
        </PrivateRoute>
      </div>
    </PublicShell>
  );
}
