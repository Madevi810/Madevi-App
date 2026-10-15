import { describe, expect, it } from 'vitest';

import {
  BATAS_KATA_MIN,
  DISCLAIMER_SLOP,
  FRASA_GENERIK,
  POLA_SLOP,
  formatSlopTeks,
  pindaiSlop,
  skorKeGrade,
} from '@/services/detektor-ai-slop';

const TEKS_BERSIH = [
  'Saya pergi ke pasar pagi ini untuk membeli cabai dan bawang.',
  'Harganya naik sedikit dibanding minggu lalu, kata penjualnya karena pasokan dari petani berkurang.',
  'Saya memutuskan membeli setengah kilo saja, lalu mampir ke warung kopi untuk sarapan.',
  'Di sana saya bertemu Pak RT yang sedang membahas jadwal ronda malam minggu.',
  'Kami sepakat ronda dimulai pukul sembilan malam dari pos kamling depan gang.',
].join(' ');

const TEKS_SLOP =
  'Dalam era digital yang serba cepat ini, penting untuk dicatat bahwa ' +
  'teknologi bukan sekadar alat, melainkan juga game changer bagi bisnis. — ' +
  'Mari kita selami lebih dalam lanskap digital yang terus berubah ini… ' +
  'Sebagai kesimpulan, di era modern ini kita harus beradaptasi. 😀 ' +
  'Dalam era digital yang serba cepat, perusahaan harus bergerak cepat. — ' +
  'Penting untuk dicatat bahwa perubahan tidak bisa dihindari…';

describe('daftar pola & konstanta', () => {
  it('7 pola slop terdaftar dengan saran', () => {
    expect(POLA_SLOP.map((p) => p.id)).toEqual([
      'em-dash',
      'elipsis',
      'emoji',
      'frasa-generik',
      'awalan-berulang',
      'burstiness-rendah',
      'paragraf-tunggal',
    ]);
    for (const p of POLA_SLOP) {
      expect(p.saran.length).toBeGreaterThan(10);
      expect(p.penaltiMaks).toBeGreaterThan(0);
    }
  });

  it('frasa generik berisi pola khas AI Indonesia', () => {
    expect(FRASA_GENERIK).toContain('dalam era digital');
    expect(FRASA_GENERIK).toContain('game changer');
  });
});

describe('pindaiSlop — teks bersih', () => {
  it('skor tinggi dan tanpa temuan', () => {
    const h = pindaiSlop(TEKS_BERSIH);
    expect(h.skor).toBeGreaterThanOrEqual(80);
    expect(h.temuan).toEqual([]);
    expect(h.grade).toBe('A');
    expect(h.statistik.jumlahKata).toBeGreaterThan(20);
  });

  it('deterministik: dua kali pindai hasil identik', () => {
    const a = pindaiSlop(TEKS_SLOP);
    const b = pindaiSlop(TEKS_SLOP);
    expect(a).toEqual(b);
  });
});

describe('pindaiSlop — deteksi pola', () => {
  it('em-dash berlebih terdeteksi', () => {
    const h = pindaiSlop(TEKS_SLOP);
    const t = h.temuan.find((x) => x.polaId === 'em-dash');
    expect(t).toBeDefined();
    expect(t!.jumlah).toBeGreaterThan(0);
    expect(t!.saran.length).toBeGreaterThan(0);
  });

  it('frasa generik terdeteksi dengan contoh', () => {
    const h = pindaiSlop(TEKS_SLOP);
    const t = h.temuan.find((x) => x.polaId === 'frasa-generik');
    expect(t).toBeDefined();
    expect(t!.contoh).toContain('dalam era digital');
    expect(t!.jumlah).toBeGreaterThanOrEqual(2);
  });

  it('emoji terdeteksi', () => {
    const h = pindaiSlop(TEKS_SLOP);
    expect(h.temuan.some((x) => x.polaId === 'emoji')).toBe(true);
  });

  it('elipsis terdeteksi', () => {
    const h = pindaiSlop(TEKS_SLOP);
    expect(h.temuan.some((x) => x.polaId === 'elipsis')).toBe(true);
  });

  it('teks penuh slop mendapat grade C atau D', () => {
    const h = pindaiSlop(TEKS_SLOP);
    expect(['C', 'D']).toContain(h.grade);
    expect(h.skor).toBeLessThan(70);
  });

  it('awalan kalimat berulang terdeteksi', () => {
    const teks =
      'Saya suka makan nasi. Saya suka makan mie. Saya suka makan roti. ' +
      'Mereka pergi ke pasar setiap pagi untuk belanja sayur dan buah segar.';
    const h = pindaiSlop(teks);
    expect(h.temuan.some((x) => x.polaId === 'awalan-berulang')).toBe(true);
  });
});

describe('pindaiSlop — validasi', () => {
  it('teks kosong ditolak', () => {
    expect(() => pindaiSlop('   ')).toThrow('wajib diisi');
  });

  it('teks <20 kata memberi peringatan tapi tetap dipindai', () => {
    const h = pindaiSlop('Halo dunia, apa kabar hari ini?');
    expect(h.peringatan.length).toBeGreaterThan(0);
    expect(h.peringatan[0]).toContain(`${BATAS_KATA_MIN}`);
  });

  it('skorKeGrade: batas grade benar', () => {
    expect(skorKeGrade(100)).toBe('A');
    expect(skorKeGrade(85)).toBe('A');
    expect(skorKeGrade(84)).toBe('B');
    expect(skorKeGrade(70)).toBe('B');
    expect(skorKeGrade(69)).toBe('C');
    expect(skorKeGrade(50)).toBe('C');
    expect(skorKeGrade(49)).toBe('D');
    expect(skorKeGrade(0)).toBe('D');
  });
});

describe('formatSlopTeks', () => {
  it('laporan memuat skor, temuan, dan disclaimer jujur', () => {
    const teks = formatSlopTeks(pindaiSlop(TEKS_SLOP));
    expect(teks).toContain('Skor:');
    expect(teks).toContain('DITEMUKAN');
    expect(teks).toContain('BUKAN bukti');
    expect(teks).toContain(DISCLAIMER_SLOP.slice(0, 40));
  });

  it('teks bersih → laporan "Bersih"', () => {
    const teks = formatSlopTeks(pindaiSlop(TEKS_BERSIH));
    expect(teks).toContain('Bersih');
  });
});
