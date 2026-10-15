import type { Metadata } from 'next';
import { InformationPage } from '@/components/information-page';

export const metadata: Metadata = { title: 'Bantuan' };
export default function BantuanPage() {
  return <InformationPage kind="help" />;
}
