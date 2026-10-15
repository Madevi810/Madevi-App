import { OwnerDataPanel } from '@/components/owner-data-panel';

export default function OwnerInboxPage() {
  return (
    <OwnerDataPanel
      title="Inbox Admin"
      endpoint="/api/v1/owner/inbox"
      empty="Inbox Admin kosong."
    />
  );
}
