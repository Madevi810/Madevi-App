import { OwnerDataPanel } from '@/components/owner-data-panel';

export default function OwnerOrderPage() {
  return (
    <OwnerDataPanel
      title="Order Jasa dan Grant"
      endpoint="/api/v1/owner/jasa/orders"
      empty="Belum ada antrean order jasa. Akses payment grants melalui menu Keamanan / API / Log."
    />
  );
}
