import { GroupsPage } from '@/components/groups-page';
import { PublicShell } from '@/components/public-shell';

export const dynamic = 'force-dynamic';

export default function GrupPage() {
  return (
    <PublicShell>
      <GroupsPage />
    </PublicShell>
  );
}
