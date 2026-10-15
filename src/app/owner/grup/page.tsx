import { OwnerDataPanel } from '@/components/owner-data-panel';

export default function OwnerGrupPage() {
  return (
    <OwnerDataPanel
      title="Antrean Grup Admin"
      endpoint="/api/v1/owner/groups"
      empty="Tidak ada antrean grup."
    />
  );
}
