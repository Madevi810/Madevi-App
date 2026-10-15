/**
 * Verifikasi 7 formula hasil port dari zip (TOOLS-002 / ELECTRONICS + utilitas).
 *
 * Formula adalah fungsi murni dan deterministik, sehingga tidak memerlukan
 * sesi server, database, atau gate Tools untuk dibuktikan benar.
 */
import { describe, expect, it } from 'vitest';

import { FORMULAS } from '@/services/utilities';

function formula(id: string) {
  const found = FORMULAS.find((f) => f.id === id);
  if (!found) throw new Error(`formula ${id} tidak terdaftar`);
  return found;
}

describe('Port zip — formula elektronika & utilitas', () => {
  it('mendaftar 17 formula termasuk kategori ELECTRONICS', () => {
    expect(FORMULAS).toHaveLength(17);
    const electronics = FORMULAS.filter((f) => f.category === 'ELECTRONICS').map((f) => f.id);
    expect(electronics).toEqual(['hukum_ohm', 'pembagi_tegangan', 'kode_warna_resistor']);
  });

  it('hukum_ohm: V=12, I=0, R=4 → I=3 A + P=36 W', () => {
    const out = formula('hukum_ohm').compute({ V: 12, I: 0, R: 4 });
    expect(out.value).toBe(3);
    expect(out.unit).toBe('ampere');
    expect(out.steps.some((s) => s.includes('36') && s.includes('watt'))).toBe(true);
  });

  it('hukum_ohm: mencari V dari I=2, R=6 → V=12 volt', () => {
    const out = formula('hukum_ohm').compute({ V: 0, I: 2, R: 6 });
    expect(out.value).toBe(12);
    expect(out.unit).toBe('volt');
  });

  it('hukum_ohm: mencari R dari V=9, I=3 → R=3 ohm', () => {
    const out = formula('hukum_ohm').compute({ V: 9, I: 3, R: 0 });
    expect(out.value).toBe(3);
    expect(out.unit).toBe('ohm');
  });

  it('hukum_ohm: menolak input yang tidak persis dua terisi', () => {
    const out = formula('hukum_ohm').compute({ V: 0, I: 0, R: 4 });
    expect(Number.isNaN(out.value)).toBe(true);
    expect(out.steps[0]).toContain('Isi tepat dua dari tiga nilai');
  });

  it('konversi_suhu: 100°C → 212°F, 373.15 K, 80°R', () => {
    const out = formula('konversi_suhu').compute({ C: 100 });
    expect(out.value).toBe(212);
    expect(out.unit).toBe('°F');
    expect(out.steps.join(' ')).toContain('373.15');
    expect(out.steps.join(' ')).toContain('80');
  });

  it('pembagi_tegangan: 12V, R1=1000, R2=2000 → 8 volt', () => {
    const out = formula('pembagi_tegangan').compute({ Vin: 12, R1: 1000, R2: 2000 });
    expect(out.value).toBe(8);
    expect(out.unit).toBe('volt');
  });

  it('pembagi_tegangan: menolak resistor nol/negatif', () => {
    expect(Number.isNaN(formula('pembagi_tegangan').compute({ Vin: 5, R1: 0, R2: 10 }).value)).toBe(
      true,
    );
  });

  it('kode_warna_resistor: gelang 4,7,pengali 2 → 4700 Ω (4.7 kΩ)', () => {
    const out = formula('kode_warna_resistor').compute({ G1: 4, G2: 7, M: 2 });
    expect(out.value).toBe(4700);
    expect(out.steps.some((s) => s.includes('4.7 kΩ'))).toBe(true);
  });

  it('kode_warna_resistor: menolak angka gelang di luar 0-9', () => {
    expect(
      Number.isNaN(formula('kode_warna_resistor').compute({ G1: 9, G2: 9, M: 9 }).value),
    ).toBe(false); // 9,9,pengali 9 valid = 9900000000
    expect(
      Number.isNaN(formula('kode_warna_resistor').compute({ G1: 12, G2: 0, M: 0 }).value),
    ).toBe(true);
  });

  it('bmi: 60 kg / 170 cm → 20.76 Normal', () => {
    const out = formula('bmi').compute({ W: 60, H: 170 });
    expect(out.value).toBeCloseTo(20.7612, 3);
    expect(out.steps.join(' ')).toContain('Normal');
  });

  it('persen: 25% dari 80 → 20', () => {
    expect(formula('persen').compute({ X: 25, Y: 80 }).value).toBe(20);
  });

  it('konversi_panjang: 2 m → 2000 mm dengan km/cm/inci/kaki', () => {
    const out = formula('konversi_panjang').compute({ M: 2 });
    expect(out.value).toBe(2000);
    expect(out.unit).toBe('mm');
    const all = out.steps.join(' ');
    expect(all).toContain('0.002 km');
    expect(all).toContain('200 cm');
    expect(all).toContain('78.7402 inci');
    expect(all).toContain('6.5617 kaki');
  });

  it('setiap formula baru deterministik (input sama → output sama)', () => {
    const ids = ['hukum_ohm', 'konversi_suhu', 'pembagi_tegangan', 'kode_warna_resistor', 'bmi', 'persen', 'konversi_panjang'];
    for (const id of ids) {
      const f = formula(id);
      const a = f.compute({ V: 12, I: 0, R: 4, C: 25, Vin: 9, R1: 3, R2: 3, G1: 1, G2: 0, M: 0, W: 70, H: 175, X: 10, Y: 200, M2: 1 });
      const b = f.compute({ V: 12, I: 0, R: 4, C: 25, Vin: 9, R1: 3, R2: 3, G1: 1, G2: 0, M: 0, W: 70, H: 175, X: 10, Y: 200, M2: 1 });
      expect(a.value).toEqual(b.value);
      expect(a.steps).toEqual(b.steps);
    }
  });
});
