import type { Metadata } from 'next';
import { InformationPage } from '@/components/information-page';

export const metadata: Metadata = { title: 'Laporkan Masalah' };
export default function ReportPage() {
  return <InformationPage kind="report" />;
}
