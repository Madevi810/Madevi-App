import type { Metadata } from 'next';
import { InformationPage } from '@/components/information-page';

export const metadata: Metadata = { title: 'Fitur Review' };
export default function ReviewPage() {
  return <InformationPage kind="review" />;
}
