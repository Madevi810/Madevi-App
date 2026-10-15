import { NextResponse } from 'next/server';
import { getPool } from '@/db/pool';
import { OperasiService } from '@/services/operasi';

export async function GET() {
  try {
    const pool = await getPool();
    const service = new OperasiService(pool);
    const health = await service.getSystemHealth();
    return NextResponse.json({ data: health });
  } catch {
    return NextResponse.json({
      data: { status: 'DEGRADED', components: { database: 'DOWN', storage: 'UNKNOWN' } },
    });
  }
}
