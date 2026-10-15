import type { Metadata } from 'next';

import { OwnerTaxonomyPanel } from '@/components/owner-taxonomy-panel';

export const metadata: Metadata = {
  title: 'Taxonomy Admin',
  robots: { index: false, follow: false },
};

export default function OwnerTaxonomyPage() {
  return (
    <main id="main-content" className="page-shell">
      <OwnerTaxonomyPanel />
    </main>
  );
}
