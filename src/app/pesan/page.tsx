import { MessagesPage } from '@/components/messages-page';
import { PublicShell } from '@/components/public-shell';

export const dynamic = 'force-dynamic';

export default function PesanPage() {
  return (
    <PublicShell>
      <MessagesPage />
    </PublicShell>
  );
}
