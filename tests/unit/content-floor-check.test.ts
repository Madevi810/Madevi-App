import { describe, it, expect } from 'vitest';
import { contentFloorCheck } from '@/services/content-floor-check';

describe('content floor check (aturan #11)', () => {
  it('semua ruang dan konten lulus ambang minimum', () => {
    const hasil = contentFloorCheck();
    expect(hasil.temuan).toEqual([]);
    expect(hasil.lulus).toBe(true);
  });
});
