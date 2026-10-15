import { LearningPathsIndex } from '@/components/learning-paths-index';
import { PublicShell } from '@/components/public-shell';
import { PrivateRoute } from '@/components/private-route';
import { LearningProgress } from '@/components/learning-progress';

export const dynamic = 'force-dynamic';

export default function BelajarIndexPage() {
  return (
    <PublicShell>
      <PrivateRoute>
        <LearningProgress />
        <LearningPathsIndex />
      </PrivateRoute>
    </PublicShell>
  );
}
