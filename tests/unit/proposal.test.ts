import { describe, expect, it } from 'vitest';

import {
  DISCLAIMER_PROPOSAL,
  PROPOSAL_TIERS,
  formatProposalTeks,
  susunProposal,
  terbilangRupiah,
  tierProposalDariId,
  type ProposalInput,
} from '@/services/proposal';

function inputDasar(): ProposalInput {
  return {
    judul: 'Proposal Kegiatan Bakti Sosial 2026',
    latarBelakang:
      'Banyak warga kurang mampu di lingkungan RW 05 membutuhkan bantuan sembako menjelang hari raya.',
    dasarKegiatan: ['Program kerja Karang Taruna RW 05 tahun 2026'],
    namaKegiatan: 'Bakti Sosial Sembako 2026',
    tema: 'Berbagi Kebahagiaan',
    tujuan: ['Membantu 100 keluarga kurang mampu', 'Mempererat gotong royong'],
    manfaat: ['Meringankan beban warga', 'Melatih kepedulian pemuda'],
    tanggalMulai: '2026-03-20',
    tanggalSelesai: '2026-03-21',
    tempat: 'Balai Warga RW 05',
    panitia: [
      { jabatan: 'Ketua', nama: 'Budi' },
      { jabatan: 'Sekretaris', nama: 'Siti' },
      { jabatan: 'Bendahara', nama: 'Andi' },
    ],
    rab: [
      { uraian: 'Paket sembako', volume: 100, satuan: 'paket', hargaSatuanRp: 150000 },
      { uraian: 'Spanduk', volume: 2, satuan: 'lembar', hargaSatuanRp: 75000 },
    ],
    penandaTangan: [
      { jabatan: 'Ketua Panitia', nama: 'Budi' },
      { jabatan: 'Sekretaris', nama: 'Siti' },
    ],
  };
}

describe('tier jasa ProposalKu', () => {
  it('HEMAT & PRO dalam band aturan inovasi', () => {
    expect(PROPOSAL_TIERS.map((t) => t.id)).toEqual(['HEMAT', 'PRO']);
    const hemat = tierProposalDariId('HEMAT')!;
    const pro = tierProposalDariId('PRO')!;
    expect(hemat.hargaRp).toBeGreaterThanOrEqual(10000);
    expect(hemat.hargaRp).toBeLessThanOrEqual(50000);
    expect(pro.hargaRp).toBeGreaterThanOrEqual(50000);
    expect(pro.hargaRp).toBeLessThanOrEqual(150000);
    expect(tierProposalDariId('XX')).toBeNull();
  });
});

describe('terbilangRupiah', () => {
  it('angka umum → kata Indonesia', () => {
    expect(terbilangRupiah(0)).toBe('nol rupiah');
    expect(terbilangRupiah(15000000)).toBe('lima belas juta rupiah');
    expect(terbilangRupiah(15150000)).toBe(
      'lima belas juta seratus lima puluh ribu rupiah',
    );
    expect(terbilangRupiah(1000)).toBe('seribu rupiah');
    expect(terbilangRupiah(100000)).toBe('seratus ribu rupiah');
  });

  it('angka negatif ditolak', () => {
    expect(() => terbilangRupiah(-1)).toThrow('≥ 0');
  });
});

describe('susunProposal — RAB & validasi', () => {
  it('total RAB = Σ(volume × harga satuan)', () => {
    const d = susunProposal(inputDasar());
    // 100 × 150.000 + 2 × 75.000 = 15.150.000
    expect(d.totalRabRp).toBe(15150000);
    expect(d.terbilang).toBe('lima belas juta seratus lima puluh ribu rupiah');
    expect(d.rabHitung[0].jumlahRp).toBe(15000000);
    expect(d.peringatan).toHaveLength(0);
  });

  it('RAB kosong → peringatan, total 0', () => {
    const d = susunProposal({ ...inputDasar(), rab: [] });
    expect(d.totalRabRp).toBe(0);
    expect(d.terbilang).toBe('nol rupiah');
    expect(d.peringatan.some((p) => p.includes('RAB masih kosong'))).toBe(true);
  });

  it('panitia < 3 → peringatan', () => {
    const d = susunProposal({
      ...inputDasar(),
      panitia: [{ jabatan: 'Ketua', nama: 'Budi' }],
    });
    expect(d.peringatan.some((p) => p.includes('panitia'))).toBe(true);
  });

  it('tanggal selesai sebelum mulai ditolak', () => {
    expect(() =>
      susunProposal({
        ...inputDasar(),
        tanggalMulai: '2026-03-21',
        tanggalSelesai: '2026-03-20',
      }),
    ).toThrow('sebelum tanggal mulai');
  });

  it('judul kosong & volume negatif ditolak', () => {
    expect(() => susunProposal({ ...inputDasar(), judul: '  ' })).toThrow(
      'Judul proposal',
    );
    expect(() =>
      susunProposal({
        ...inputDasar(),
        rab: [{ uraian: 'X', volume: -1, satuan: 'pcs', hargaSatuanRp: 1000 }],
      }),
    ).toThrow('Volume RAB');
  });
});

describe('formatProposalTeks', () => {
  it('memuat semua bab, RAB, terbilang, dan disclaimer', () => {
    const teks = formatProposalTeks(susunProposal(inputDasar()));
    for (const bab of [
      'I. LATAR BELAKANG',
      'II. NAMA DAN TEMA KEGIATAN',
      'III. TUJUAN DAN MANFAAT',
      'IV. WAKTU DAN TEMPAT',
      'V. SUSUNAN PANITIA',
      'VI. RENCANA ANGGARAN BIAYA (RAB)',
      'VII. PENUTUP',
    ]) {
      expect(teks).toContain(bab);
    }
    expect(teks).toContain('Rp15.150.000');
    expect(teks).toContain('lima belas juta seratus lima puluh ribu rupiah');
    expect(teks).toContain('Bakti Sosial Sembako 2026');
    expect(teks).toContain(DISCLAIMER_PROPOSAL);
  });
});
