import { LearningDashboard } from '@/components/learning-dashboard';
import { PublicShell } from '@/components/public-shell';

export const dynamic = 'force-dynamic';

export default async function BelajarPage({ params }: { params: Promise<{ pathId: string }> }) {
  const { pathId } = await params;

  return (
    <PublicShell>
      <div className="page-shell">
        <LearningDashboard pathId={pathId} />
      </div>
    </PublicShell>
  );
}
