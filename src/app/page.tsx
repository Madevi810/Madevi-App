import { HomeContent } from '@/components/home-content';
import { PublicShell } from '@/components/public-shell';
import { MADEVI_SPACES } from '@/contracts/navigation';
import { STARTER_ARTICLES } from '@/content/starter-articles';
import { ALL_TOOLS } from '@/services/tools-registry-data';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <PublicShell>
      <HomeContent
        spaces={[...MADEVI_SPACES]}
        articles={[...STARTER_ARTICLES]}
        toolsCount={ALL_TOOLS.length}
      />
    </PublicShell>
  );
}
