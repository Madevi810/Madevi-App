import { NextRequest, NextResponse } from 'next/server';
import { errorMessage, isDependencyUnavailable } from '@/api/error-message';
import { getPool } from '@/db/pool';
import { EBelanjaService } from '@/services/ebelanja';

type ProductSort = 'RELEVANT' | 'NEWEST' | 'PRICE' | 'PRICE_ASC' | 'PRICE_DESC' | 'VIEWS' | 'A-Z';
const SORT_VALUES = new Set<ProductSort>([
  'RELEVANT',
  'NEWEST',
  'PRICE',
  'PRICE_ASC',
  'PRICE_DESC',
  'VIEWS',
  'A-Z',
]);

function parseSort(value: string | null): ProductSort | undefined {
  return value && SORT_VALUES.has(value as ProductSort) ? (value as ProductSort) : undefined;
}

function parsePrice(value: string | null): number | undefined {
  if (value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function parseStock(value: string | null): 'IN_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN' | undefined {
  return value === 'IN_STOCK' || value === 'OUT_OF_STOCK' || value === 'UNKNOWN'
    ? value
    : undefined;
}

export async function GET(req: NextRequest) {
  try {
    const pool = await getPool();
    const service = new EBelanjaService(pool);
    const { searchParams } = new URL(req.url);
    const [result, categories] = await Promise.all([
      service.searchProducts({
        category: searchParams.get('category') || undefined,
        subcategory: searchParams.get('subcategory') || undefined,
        brand: searchParams.get('brand') || undefined,
        condition: searchParams.get('condition') || undefined,
        stockStatus: parseStock(searchParams.get('stockStatus')),
        minPrice: parsePrice(searchParams.get('minPrice')),
        maxPrice: parsePrice(searchParams.get('maxPrice')),
        query: searchParams.get('query') || undefined,
        sortBy: parseSort(searchParams.get('sortBy')),
        limit: parseInt(searchParams.get('limit') || '20'),
        offset: parseInt(searchParams.get('offset') || '0'),
      }),
      service.listPublishedCategories(),
    ]);
    return NextResponse.json({ data: result.data, total: result.total, facets: { categories } });
  } catch (e: unknown) {
    const unavailable = isDependencyUnavailable(e);
    return NextResponse.json(
      {
        error: {
          code: unavailable ? 'DEPENDENCY_UNAVAILABLE' : 'INTERNAL_ERROR',
          message: errorMessage(e),
        },
      },
      { status: unavailable ? 503 : 500 },
    );
  }
}
