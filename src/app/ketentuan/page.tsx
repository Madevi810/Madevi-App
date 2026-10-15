import type { Metadata } from 'next';
import { InformationPage } from '@/components/information-page';

export const metadata: Metadata = { title: 'Ketentuan & Layanan' };
export default function TermsPage() {
  return <InformationPage kind="terms" />;
}
