'use client';

import { useLanguage } from '@/components/theme-provider';
import { OwnerJasaPanel } from '@/components/owner-jasa-panel';

export default function OwnerJasaPage() {
  const { language } = useLanguage();
  return (
    <div className="owner-panel">
      <h1>Jasa &amp; Undangan — Admin</h1>
      <OwnerJasaPanel isId={language === 'id'} />
    </div>
  );
}
