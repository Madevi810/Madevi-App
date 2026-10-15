import type { Metadata } from 'next';
import { InformationPage } from '@/components/information-page';

export const metadata: Metadata = { title: 'Tentang & FAQ' };
export default function TentangPage() {
  return <InformationPage kind="about" />;
}
