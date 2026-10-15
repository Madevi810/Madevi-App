import { OwnerDataPanel } from '@/components/owner-data-panel';

export default function OwnerKeamananPage() {
  return (
    <OwnerDataPanel
      title="Keamanan"
      endpoint="/api/v1/security/threats"
      empty="Tidak ada catatan ancaman."
    />
  );
}
