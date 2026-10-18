import { describe, it, expect } from 'vitest';
import { WORKSHEET_SIMULASI, worksheetBySimId } from '@/services/sim-worksheet';

describe('worksheet simulasi (C2)', () => {
  it('6 simulasi punya worksheet', () => {
    expect(Object.keys(WORKSHEET_SIMULASI)).toHaveLength(6);
  });

  it('setiap worksheet punya tujuan dan soal', () => {
    for (const w of Object.values(WORKSHEET_SIMULASI)) {
      expect(w.tujuanBelajar.length).toBeGreaterThan(0);
      expect(w.pertanyaan.length).toBeGreaterThan(0);
      for (const s of w.pertanyaan) {
        expect(s.kunciJawaban.trim()).not.toBe('');
        expect(s.pembahasan.trim()).not.toBe('');
      }
    }
  });

  it('lookup by simId', () => {
    expect(worksheetBySimId('hukum-ohm')?.judul).toContain('Hukum Ohm');
    expect(worksheetBySimId('tidak-ada')).toBeUndefined();
  });
});
