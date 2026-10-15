import { unstable_cache } from 'next/cache';

/**
 * Smart caching algorithm wrapper for Database / API Queries
 * O(1) memory lookup for frequent reads using Next.js Data Cache.
 * 
 * Usage:
 * const getStats = withCache(
 *   async (id: string) => db.query(...),
 *   ['stats-cache'],
 *   { revalidate: 60, tags: ['stats'] }
 * );
 */
export function withCache<T extends (...args: unknown[]) => Promise<unknown>>(
  fetcher: T,
  keyParts: string[],
  options?: {
    revalidate?: number | false;
    tags?: string[];
  }
): T {
  return unstable_cache(fetcher as (...args: unknown[]) => Promise<unknown>, keyParts, {
    revalidate: options?.revalidate ?? 3600,
    tags: options?.tags ?? keyParts,
  }) as unknown as T;
}
