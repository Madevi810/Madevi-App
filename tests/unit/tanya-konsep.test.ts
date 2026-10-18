import { describe, it, expect } from 'vitest';
import { tanyaKonsep } from '@/services/tanya-konsep';

describe('tanya konsep (C3)', () => {
  it('mode normal: penjelasan + soal mirip', () => {
    const h = tanyaKonsep('bagaimana pecahan senilai?', 'normal');
    expect(h.konsep).toBe('Pecahan Senilai');
    expect(h.soalMirip.length).toBeGreaterThan(0);
    expect(h.mode).toBe('normal');
  });

  it('mode bimbingan: tanpa jawaban langsung', () => {
    const h = tanyaKonsep('bagaimana pecahan senilai?', 'bimbingan');
    expect(h.mode).toBe('bimbingan');
    expect(h.soalMirip).toEqual([]);
    expect(h.peringatan).toContain('anti-nyontek');
    expect(h.langkahPetunjuk.length).toBeGreaterThan(0);
  });

  it('konsep tidak dikenal: pesan jelas', () => {
    const h = tanyaKonsep('apa itu xyz123?', 'normal');
    expect(h.konsep).toBe('Belum dikenali');
  });
});
