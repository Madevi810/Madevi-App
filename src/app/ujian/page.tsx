import { PublicShell } from '@/components/public-shell';
import { PrivateRoute } from '@/components/private-route';
import { ExamsDashboard } from '@/components/exams-dashboard';

export const dynamic = 'force-dynamic';

export default function UjianIndexPage() {
  return (
    <PublicShell>
      <div className="page-shell">
        <PrivateRoute>
          <ExamsDashboard />
        </PrivateRoute>
      </div>
    </PublicShell>
  );
}
