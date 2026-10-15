import type { Metadata } from 'next';
import { InformationPage } from '@/components/information-page';

export const metadata: Metadata = { title: 'Privasi' };
export default function PrivacyPage() {
  return <InformationPage kind="privacy" />;
}
