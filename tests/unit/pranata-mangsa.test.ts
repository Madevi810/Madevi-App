import { describe, expect, it } from 'vitest';
import {
  DAFTAR_MANGSA,
  CATATAN_BATAS,
  daftarMangsa,
  formatMangsaTeks,
  mangsaDariNama,
  mangsaDariTanggal,
  mangsaTanamBerikutnya,
} from '@/services/pranata-mangsa';

describe('pranata-mangsa: tabel 12 mangsa', () => {
  it('tepat 12 mangsa dengan total hari tabel 365', () => {
    expect(DAFTAR_MANGSA).toHaveLength(12);
    const total = DAFTAR_MANGSA.reduce((a, m) => a + m.jumlahHariTabel, 0);
    expect(total).toBe(365);
  });

  it('nomor urut 1-12 tanpa duplikat nama', () => {
    const nama = DAFTAR_MANGSA.map((m) => m.nama);
    expect(new Set(nama).size).toBe(12);
    expect(DAFTAR_MANGSA.map((m) => m.no)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('daftarMangsa mengembalikan salinan 12 entri', () => {
    expect(daftarMangsa()).toHaveLength(12);
  });
});

describe('pranata-mangsa: konversi tanggal', () => {
  it('22 Jun 2026 -> Kasa hari ke-1', () => {
    const h = mangsaDariTanggal(2026, 6, 22);
    expect(h.mangsa.nama).toBe('Kasa');
    expect(h.hariKe).toBe(1);
  });

  it('1 Agu 2026 -> Kasa hari ke-41, sisa 0 hari', () => {
    const h = mangsaDariTanggal(2026, 8, 1);
    expect(h.mangsa.nama).toBe('Kasa');
    expect(h.hariKe).toBe(41);
    expect(h.sisaHari).toBe(0);
  });

  it('2 Agu 2026 -> Karo hari ke-1', () => {
    const h = mangsaDariTanggal(2026, 8, 2);
    expect(h.mangsa.nama).toBe('Karo');
    expect(h.hariKe).toBe(1);
  });

  it('15 Okt 2026 -> Kalima hari ke-3, sisa 24 hari', () => {
    const h = mangsaDariTanggal(2026, 10, 15);
    expect(h.mangsa.nama).toBe('Kalima');
    expect(h.hariKe).toBe(3);
    expect(h.sisaHari).toBe(24);
  });

  it('23 Des 2026 -> Kapitu hari ke-1', () => {
    const h = mangsaDariTanggal(2026, 12, 23);
    expect(h.mangsa.nama).toBe('Kapitu');
    expect(h.hariKe).toBe(1);
  });

  it('29 Feb 2024 (kabisat) -> Kawolu', () => {
    const h = mangsaDariTanggal(2024, 2, 29);
    expect(h.mangsa.nama).toBe('Kawolu');
  });

  it('1 Mar 2024 -> Kasanga', () => {
    const h = mangsaDariTanggal(2024, 3, 1);
    expect(h.mangsa.nama).toBe('Kasanga');
  });

  it('21 Jun 2026 -> Sada (akhir tahun mangsa)', () => {
    const h = mangsaDariTanggal(2026, 6, 21);
    expect(h.mangsa.nama).toBe('Sada');
  });

  it('tanggal tidak valid ditolak', () => {
    expect(() => mangsaDariTanggal(2026, 2, 30)).toThrow();
    expect(() => mangsaDariTanggal(2026, 13, 1)).toThrow();
    expect(() => mangsaDariTanggal(2026, 0, 10)).toThrow();
  });
});

describe('pranata-mangsa: nama dan rencana tanam', () => {
  it('mangsaDariNama case-insensitive; tidak dikenal -> null', () => {
    expect(mangsaDariNama('kanem')?.nama).toBe('Kanem');
    expect(mangsaDariNama(' KAPITU ')?.no).toBe(7);
    expect(mangsaDariNama('tidakada')).toBeNull();
  });

  it('15 Okt 2026 (Kalima) -> mangsa tanam berikutnya Kanem, 25 hari lagi', () => {
    const r = mangsaTanamBerikutnya(2026, 10, 15);
    expect(r.mangsa.nama).toBe('Kanem');
    expect(r.status).toBe('mendatang');
    expect(r.hariMenuju).toBe(25);
  });

  it('10 Nov 2026 (Kanem) -> status berlangsung, 0 hari', () => {
    const r = mangsaTanamBerikutnya(2026, 11, 10);
    expect(r.mangsa.nama).toBe('Kanem');
    expect(r.status).toBe('berlangsung');
    expect(r.hariMenuju).toBe(0);
  });
});

describe('pranata-mangsa: format teks', () => {
  it('memuat nama mangsa, candra, dan catatan batas', () => {
    const h = mangsaDariTanggal(2026, 10, 15);
    const teks = formatMangsaTeks(h, 2026, 10, 15);
    expect(teks).toContain('Kalima');
    expect(teks).toContain('Candra:');
    expect(teks).toContain(CATATAN_BATAS.slice(0, 20));
  });

  it('mangsa tanpa tuntunan tidak dikarang', () => {
    const h = mangsaDariTanggal(2026, 8, 5); // Karo
    const teks = formatMangsaTeks(h, 2026, 8, 5);
    expect(teks).toContain('tidak ada tuntunan khusus pada sumber');
  });
});
