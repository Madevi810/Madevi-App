import { OwnerDataPanel } from '@/components/owner-data-panel';

export default function OwnerPenggunaPage() {
  return (
    <OwnerDataPanel
      title="Pengguna dan permintaan Admin"
      endpoint="/api/v1/owner/inbox"
      empty="Belum ada permintaan pengguna. Approval detail memakai endpoint Admin yang berizin."
    />
  );
}
