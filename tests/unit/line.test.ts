import { describe, it, expect } from 'vitest';
import { praModerasi, validasiPostingan, PESAN_DARURAT_CURHAT } from '@/services/line';

describe('pra-moderasi', () => {
  it('postingan normal tidak perlu tinjau', () => {
    expect(praModerasi('Hari ini saya membuat kue yang enak!').perluTinjau).toBe(false);
  });

  it('indikasi krisis memicu darurat + pesan bantuan', () => {
    const h = praModerasi('Aku pengen mati rasanya');
    expect(h.perluTinjau).toBe(true);
    expect(h.darurat).toBe(true);
    expect(PESAN_DARURAT_CURHAT).toContain('119');
  });
});

describe('validasi postingan', () => {
  it('isi kosong ditolak', () => {
    expect(validasiPostingan({ isi: '', tipe: 'karya' })).toContain('Isi postingan belum diisi');
  });

  it('isi terlalu panjang ditolak', () => {
    expect(validasiPostingan({ isi: 'x'.repeat(5001), tipe: 'curhat' }).length).toBeGreaterThan(0);
  });

  it('postingan valid lolos', () => {
    expect(validasiPostingan({ isi: 'Halo dunia', tipe: 'karya' })).toEqual([]);
  });
});
