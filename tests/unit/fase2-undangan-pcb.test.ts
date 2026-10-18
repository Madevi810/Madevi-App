import { describe, it, expect } from 'vitest';
import {
  buatLinkPersonal, buatLinkWA, templatePesanUndangan,
} from '@/services/undangan';
import { cekKeamananRangkaian, formatCekAmanTeks } from '@/services/pcb-safety';

describe('undangan', () => {
  it('link personal meng-encode nama tamu', () => {
    expect(buatLinkPersonal('budi-ani', 'Budi Santoso')).toBe('/undangan/budi-ani?to=Budi%20Santoso');
  });

  it('link WA memformat nomor 08 → 62', () => {
    const link = buatLinkWA('08123456789', 'Halo');
    expect(link.startsWith('https://wa.me/628123456789?text=')).toBe(true);
  });

  it('template pesan memuat nama dan link', () => {
    const pesan = templatePesanUndangan('Budi', 'Andi & Sari', 'https://x.id/u');
    expect(pesan).toContain('Budi');
    expect(pesan).toContain('Andi & Sari');
    expect(pesan).toContain('https://x.id/u');
  });
});

describe('cek keamanan rangkaian', () => {
  it('LED tanpa resistor = bahaya', () => {
    const h = cekKeamananRangkaian([
      { jenis: 'baterai', nilai: '9V' },
      { jenis: 'led' },
    ]);
    expect(h.aman).toBe(false);
    expect(h.peringatan.some((p) => p.tingkat === 'bahaya')).toBe(true);
  });

  it('LED + resistor = aman', () => {
    const h = cekKeamananRangkaian([
      { jenis: 'baterai', nilai: '9V' },
      { jenis: 'resistor', nilai: '470Ω' },
      { jenis: 'led', arusMA: 12 },
    ]);
    expect(h.aman).toBe(true);
  });

  it('arus LED berlebih = bahaya', () => {
    const h = cekKeamananRangkaian([
      { jenis: 'baterai' },
      { jenis: 'resistor', nilai: '10Ω' },
      { jenis: 'led', arusMA: 35 },
    ]);
    expect(h.aman).toBe(false);
    expect(h.peringatan.some((p) => p.pesan.includes('35mA'))).toBe(true);
  });

  it('arus mendekati batas = waspada', () => {
    const h = cekKeamananRangkaian([
      { jenis: 'baterai' },
      { jenis: 'resistor' },
      { jenis: 'led', arusMA: 18 },
    ]);
    expect(h.aman).toBe(true); // waspada bukan bahaya
    expect(h.peringatan.some((p) => p.tingkat === 'waspada')).toBe(true);
  });

  it('format teks memuat ringkasan', () => {
    const h = cekKeamananRangkaian([{ jenis: 'baterai' }, { jenis: 'resistor' }, { jenis: 'led', arusMA: 10 }]);
    expect(formatCekAmanTeks(h)).toContain('aman');
  });
});
