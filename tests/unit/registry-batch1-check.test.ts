import { describe, it, expect } from 'vitest';
import { ALL_TOOLS } from '@/services/tools-registry-data';

describe('registry batch1', () => {
  it('5 tools baru terdaftar', () => {
    const ids = new Set(ALL_TOOLS.map(t => t.id));
    for (const id of ['kalkulator-cicilan','generator-qr','generator-password','kalkulator-bmi','konverter-waktu-dunia']) {
      expect(ids.has(id), id).toBe(true);
    }
  });
  it('handler cicilan bisa dipanggil', () => {
    const tool = ALL_TOOLS.find(t => t.id === 'kalkulator-cicilan')!;
    const res: any = tool.handler({ values: { pokokRp: 12000000, bungaTahunanPersen: 12, tenorBulan: 12, metode: 'flat' } } as any);
    expect(res.output.teks).toContain('1.120.000');
  });
  it('handler BMI bisa dipanggil', () => {
    const tool = ALL_TOOLS.find(t => t.id === 'kalkulator-bmi')!;
    const res: any = tool.handler({ values: { beratKg: 65, tinggiCm: 170 } } as any);
    expect(res.output.hasil.kategori).toBe('Normal');
  });
  it('handler waktu dunia bisa dipanggil', () => {
    const tool = ALL_TOOLS.find(t => t.id === 'konverter-waktu-dunia')!;
    const res: any = tool.handler({ values: { jamMenit: '14:30', zonaAsal: 'WIB', zonaTujuan: 'WITA' } } as any);
    expect(res.output.hasil.waktuTujuan).toBe('15:30 WITA');
  });
});
