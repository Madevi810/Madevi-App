import { ModerationAppealForm } from '@/components/moderation-appeal-form';
import { PublicShell } from '@/components/public-shell';

export const dynamic = 'force-dynamic';

export default function ModerasiBandingPage() {
  return (
    <PublicShell>
      <div>
        <ModerationAppealForm />
      </div>
    </PublicShell>
  );
}
