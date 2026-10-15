import { ExamAttemptPage } from '@/components/exam-attempt';
import { PublicShell } from '@/components/public-shell';

export const dynamic = 'force-dynamic';

export default async function UjianPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;

  return (
    <PublicShell>
      <ExamAttemptPage attemptId={attemptId} />
    </PublicShell>
  );
}
