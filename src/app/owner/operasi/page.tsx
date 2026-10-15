import { OwnerDataPanel } from '@/components/owner-data-panel';

export default function OwnerOperasiPage() {
  return (
    <OwnerDataPanel
      title="Operasi"
      endpoint="/api/v1/owner/operasi"
      empty="Ringkasan operasi belum tersedia."
    />
  );
}
