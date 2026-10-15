import { NextResponse } from 'next/server';

import { getServerEnv } from '@/server/env';
import { readShopImage } from '@/services/shop-image-storage';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const image = await readShopImage(getServerEnv().MADEVI_RUNTIME_ROOT, name);
  if (!image) return new NextResponse(null, { status: 404 });
  return new NextResponse(image.bytes, {
    headers: {
      'content-type': image.mediaType,
      'cache-control': 'public, max-age=86400',
      'x-content-type-options': 'nosniff',
    },
  });
}
