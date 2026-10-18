import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PublicShell } from '@/components/public-shell';
import { ToolRunner } from '@/components/tools/tool-runner';
import { ALL_TOOLS } from '@/services/tools-registry-data';

export const dynamic = 'force-dynamic';

/**
 * Halaman individual tool: /tools/[id].
 * Satu route generik untuk semua tools di registry.
 */
export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = ALL_TOOLS.find((t) => t.id === id);
  if (!tool) notFound();

  return (
    <PublicShell>
      <main style={{ padding: '24px 0' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px 8px' }}>
          <Link href="/tools" style={{ fontSize: 13, color: '#0284c7' }}>
            ← Semua tools
          </Link>
        </div>
        <ToolRunner tool={tool} />
      </main>
    </PublicShell>
  );
}
