import { NextRequest, NextResponse } from 'next/server';
import { errorMessage } from '@/api/error-message';
import { getPool } from '@/db/pool';
import { EBelanjaService } from '@/services/ebelanja';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pool = await getPool();
    const service = new EBelanjaService(pool);
    await service.trackClick(id);
    return NextResponse.json({ data: { tracked: true } });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: errorMessage(e) } },
      { status: 500 },
    );
  }
}
