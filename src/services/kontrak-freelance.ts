/**
 * KontrakKu — pemeriksa red-flag kontrak freelance (engine Tools gratis).
 *
 * Freelancer Indonesia sering menandatangani kontrak kerja tanpa memahami
 * klausul berisiko: bayaran 100% di akhir, revisi tak terbatas, ownership
 * pindah sejak awal, denda sepihak. Yang ada di internet hanya artikel
 * checklist statis (dev.to, Medium, lemon8, karirlab) — tool interaktif
 * berbahasa Indonesia tidak ada.
 *
 * Cara pakai: user menjawab kuesioner 14 pertanyaan YA / TIDAK / TIDAK_TAHU
 * tentang isi kontraknya → engine deterministik menghitung skor risiko
 * 0–100 + daftar red-flag yang terdeteksi + saran negosiasi konkret.
 *
 * Kejujuran (aturan konten Madevi):
 *  - Ini ALAT BANTU baca klausul, BUKAN nasihat hukum — disclaimer tegas
 *    di setiap output; untuk nilai kontrak besar user diarahkan ke
 *    advokat/notaris.
 *  - Tidak menebak isi kontrak: hanya menilai jawaban yang diberikan user.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal dan deterministik.
 */

export type JawabanKontrak = 'YA' | 'TIDAK' | 'TIDAK_TAHU';

export type KategoriKontrak =
  | 'RUANG_LINGKUP'
  | 'PEMBAYARAN'
  | 'REVISI'
  | 'KEPEMILIKAN'
  | 'TANGGUNG_JAWAB'
  | 'PEMUTUSAN'
  | 'SENGKETA';

export const NAMA_KATEGORI_KONTRAK: Record<KategoriKontrak, string> = {
  RUANG_LINGKUP: 'Ruang Lingkup',
  PEMBAYARAN: 'Pembayaran',
  REVISI: 'Revisi & Perubahan',
  KEPEMILIKAN: 'Kepemilikan Karya',
  TANGGUNG_JAWAB: 'Tanggung Jawab & Denda',
  PEMUTUSAN: 'Pemutusan Kontrak',
  SENGKETA: 'Penyelesaian Sengketa',
};

export interface ItemChecklistKontrak {
  id: string;
  kategori: KategoriKontrak;
  pertanyaan: string;
  /** Jawaban yang dianggap aman untuk item ini. */
  jawabanAman: 'YA' | 'TIDAK';
  /** Bobot penalti bila jawaban tidak aman (TIDAK_TAHU = setengah bobot). */
  bobot: number;
  /** Red flag yang terdeteksi bila jawaban tidak aman. */
  redFlag: string;
  /** Saran negosiasi/perbaikan konkret. */
  saran: string;
}

export const KONTRAK_CHECKLIST: ItemChecklistKontrak[] = [
  {
    id: 'ruang-lingkup-jelas',
    kategori: 'RUANG_LINGKUP',
    pertanyaan:
      'Apakah kontrak menjelaskan ruang lingkup pekerjaan secara spesifik ' +
      '(daftar deliverable), bukan sekadar "sesuai kebutuhan klien"?',
    jawabanAman: 'YA',
    bobot: 10,
    redFlag:
      'Ruang lingkup kabur ("sesuai kebutuhan klien") — rawan scope creep: ' +
      'kerjaan bertambah tanpa bayaran tambahan.',
    saran:
      'Minta daftar deliverable tertulis + klausul: pekerjaan di luar daftar ' +
      'dihitung sebagai addendum berbayar.',
  },
  {
    id: 'batasan-tidak-termasuk',
    kategori: 'RUANG_LINGKUP',
    pertanyaan:
      'Apakah kontrak mencantumkan apa yang TIDAK termasuk dalam pekerjaan?',
    jawabanAman: 'YA',
    bobot: 6,
    redFlag:
      'Tidak ada batasan "tidak termasuk" — klien bisa menuntut apa pun ' +
      'dengan dalih "kan sudah dikontrak".',
    saran:
      'Tambahkan daftar pengecualian eksplisit (mis. "tidak termasuk maintenance ' +
      'setelah serah terima").',
  },
  {
    id: 'termin-pembayaran',
    kategori: 'PEMBAYARAN',
    pertanyaan:
      'Apakah ada termin pembayaran bertahap (mis. DP 30-50% + milestone), ' +
      'bukan 100% dibayar di akhir?',
    jawabanAman: 'YA',
    bobot: 10,
    redFlag:
      'Bayaran 100% setelah selesai — Anda menanggung seluruh risiko gagal ' +
      'bayar / klien menghilang.',
    saran:
      'Negosiasi DP di muka (umumnya 30-50%) + pelunasan per milestone dengan ' +
      'jatuh tempo jelas (mis. 7 hari setelah invoice).',
  },
  {
    id: 'sanksi-telat-bayar',
    kategori: 'PEMBAYARAN',
    pertanyaan:
      'Apakah ada sanksi bila klien telat membayar (denda keterlambatan / ' +
      'hak menahan deliverable)?',
    jawabanAman: 'YA',
    bobot: 6,
    redFlag:
      'Tidak ada konsekuensi telat bayar — klien bisa menunda pembayaran ' +
      'tanpa risiko.',
    saran:
      'Minta klausul denda keterlambatan (mis. 2% per bulan) atau hak menahan ' +
      'penyerahan final sampai lunas.',
  },
  {
    id: 'batas-revisi',
    kategori: 'REVISI',
    pertanyaan:
      'Apakah jumlah revisi dibatasi (mis. maks 2-3x) dengan tarif untuk ' +
      'revisi tambahan?',
    jawabanAman: 'YA',
    bobot: 8,
    redFlag:
      'Revisi tidak dibatasi — klien bisa meminta revisi tanpa akhir ' +
      '("sampai saya puas").',
    saran:
      'Tetapkan batas revisi gratis (mis. 2x) + tarif per revisi tambahan ' +
      'tertulis di kontrak.',
  },
  {
    id: 'perubahan-scope',
    kategori: 'REVISI',
    pertanyaan:
      'Apakah perubahan di tengah jalan diatur (estimasi ulang + addendum ' +
      'tertulis)?',
    jawabanAman: 'YA',
    bobot: 8,
    redFlag:
      'Perubahan scope bebas tanpa konsekuensi — setiap "ide baru" klien ' +
      'jadi beban gratis Anda.',
    saran:
      'Klausul change-request: setiap perubahan → estimasi ulang biaya/waktu ' +
      '+ persetujuan tertulis kedua pihak.',
  },
  {
    id: 'ip-setelah-lunas',
    kategori: 'KEPEMILIKAN',
    pertanyaan:
      'Apakah kepemilikan karya (source code/desain/file) pindah ke klien ' +
      'SETELAH pembayaran lunas, bukan sejak awal?',
    jawabanAman: 'YA',
    bobot: 9,
    redFlag:
      'Ownership pindah sejak awal / tanpa syarat lunas — klien bisa ' +
      'mengambil karya lalu tidak membayar.',
    saran:
      'Klausul umum yang aman: hak cipta beralih setelah pembayaran lunas; ' +
      'sebelum itu Anda pemegang hak.',
  },
  {
    id: 'hak-portofolio',
    kategori: 'KEPEMILIKAN',
    pertanyaan:
      'Apakah Anda boleh menampilkan karya ini di portofolio (setelah rilis)?',
    jawabanAman: 'YA',
    bobot: 4,
    redFlag:
      'Larangan portofolio total — Anda kehilangan bukti kerja untuk klien ' +
      'berikutnya.',
    saran:
      'Negosiasi izin tampil portofolio setelah proyek rilis, atau versi ' +
      'yang disamarkan bila klien sensitif.',
  },
  {
    id: 'batas-liabilitas',
    kategori: 'TANGGUNG_JAWAB',
    pertanyaan:
      'Apakah tanggung jawab finansial Anda dibatasi (mis. maksimal sebesar ' +
      'fee yang dibayar)?',
    jawabanAman: 'YA',
    bobot: 9,
    redFlag:
      'Liabilitas tanpa batas ("bertanggung jawab atas semua kerugian") — ' +
      'satu masalah bisa menuntut ganti rugi berkali lipat fee Anda.',
    saran:
      'Minta cap liability: maksimal sebesar total fee kontrak, kecuali ' +
      'kesengajaan/kelalaian berat.',
  },
  {
    id: 'denda-dua-arah',
    kategori: 'TANGGUNG_JAWAB',
    pertanyaan:
      'Apakah denda/sanksi di kontrak berlaku dua arah (bukan hanya ' +
      'menghukum Anda)?',
    jawabanAman: 'YA',
    bobot: 8,
    redFlag:
      'Denda sepihak — klien bisa menghukum keterlambatan Anda, tapi tidak ' +
      'ada sanksi bila klien yang telat/wanprestasi.',
    saran:
      'Setiap denda untuk Anda harus punya pasangan untuk klien (mis. denda ' +
      'keterlambatan bayar).',
  },
  {
    id: 'terminasi-bayar-jalan',
    kategori: 'PEMUTUSAN',
    pertanyaan:
      'Bila kontrak diputus di tengah jalan, apakah pekerjaan yang sudah ' +
      'berjalan tetap dibayar?',
    jawabanAman: 'YA',
    bobot: 8,
    redFlag:
      'Pemutusan tanpa kewajiban bayar kerja berjalan — klien bisa memutus ' +
      'sepihak setelah 90% pekerjaan selesai.',
    saran:
      'Klausul: pemutusan kapan pun → klien membayar proporsi pekerjaan ' +
      'yang sudah diserahterimakan.',
  },
  {
    id: 'pemberitahuan-terminasi',
    kategori: 'PEMUTUSAN',
    pertanyaan:
      'Apakah pemutusan kontrak mensyaratkan pemberitahuan tertulis ' +
      '(mis. 7-14 hari sebelumnya)?',
    jawabanAman: 'YA',
    bobot: 5,
    redFlag:
      'Pemutusan bisa kapan saja tanpa pemberitahuan — tidak ada waktu ' +
      'untuk menyelesaikan serah terima.',
    saran:
      'Minta masa pemberitahuan tertulis (umumnya 14 hari) sebelum ' +
      'pemutusan berlaku.',
  },
  {
    id: 'jalur-sengketa-jelas',
    kategori: 'SENGKETA',
    pertanyaan:
      'Apakah ada jalur penyelesaian sengketa yang jelas (musyawarah → ' +
      'mediasi), bukan "keputusan klien bersifat final"?',
    jawabanAman: 'YA',
    bobot: 7,
    redFlag:
      '"Keputusan klien final" — Anda tidak punya jalur banding bila ' +
      'berselisih.',
    saran:
      'Ganti dengan tahapan: musyawarah 14 hari → mediasi → domisili hukum ' +
      'yang disepakati kedua pihak.',
  },
  {
    id: 'nda-dua-arah',
    kategori: 'SENGKETA',
    pertanyaan:
      'Apakah klausul kerahasiaan (NDA) berlaku dua arah, bukan hanya ' +
      'mengikat Anda?',
    jawabanAman: 'YA',
    bobot: 6,
    redFlag:
      'NDA sepihak — hanya Anda yang terikat rahasia, data/ide Anda tidak ' +
      'dilindungi.',
    saran:
      'Buat kewajiban kerahasiaan mutual: kedua pihak menjaga informasi ' +
      'rahasia masing-masing.',
  },
];

export function itemKontrakDariId(id: string): ItemChecklistKontrak | null {
  return KONTRAK_CHECKLIST.find((i) => i.id === id) ?? null;
}

export const MIN_JAWABAN_KONTRAK = 5;

export const DISCLAIMER_KONTRAK =
  'KontrakKu adalah alat bantu membaca klausul, BUKAN nasihat hukum. ' +
  'Hasil ini tidak menggantikan pendapat advokat/notaris. Untuk kontrak ' +
  'bernilai besar atau berisiko tinggi, konsultasikan ke profesional hukum ' +
  'sebelum menandatangani.';

export type JawabanMapKontrak = Record<string, JawabanKontrak>;

export interface TemuanKontrak {
  itemId: string;
  kategori: string;
  pertanyaan: string;
  redFlag: string;
  saran: string;
  bobot: number;
  /** Penalti aktual (penuh bila jawaban tidak aman, setengah bila TIDAK_TAHU). */
  penalti: number;
}

export interface HasilAnalisisKontrak {
  /** Skor risiko 0–100 — makin tinggi makin berisiko. */
  skorRisiko: number;
  grade: 'A' | 'B' | 'C' | 'D';
  temuan: TemuanKontrak[];
  peringatan: string[];
  dijawab: number;
  totalItem: number;
  langkah: string[];
}

export function skorKeGradeKontrak(skor: number): 'A' | 'B' | 'C' | 'D' {
  if (skor <= 20) return 'A';
  if (skor <= 40) return 'B';
  if (skor <= 60) return 'C';
  return 'D';
}

const NILAI_JAWABAN_VALID: JawabanKontrak[] = ['YA', 'TIDAK', 'TIDAK_TAHU'];

/**
 * Analisis jawaban kuesioner → skor risiko + temuan red-flag.
 * Deterministik: input sama → hasil sama.
 */
export function analisisKontrak(jawaban: JawabanMapKontrak): HasilAnalisisKontrak {
  const langkah: string[] = [];
  const temuan: TemuanKontrak[] = [];
  const peringatan: string[] = [];

  const ids = Object.keys(jawaban);
  for (const id of ids) {
    const item = itemKontrakDariId(id);
    if (!item) {
      throw new Error(`Item kuesioner tidak dikenal: "${id}".`);
    }
    const nilai = jawaban[id];
    if (!NILAI_JAWABAN_VALID.includes(nilai)) {
      throw new Error(
        `Jawaban item "${id}" harus YA, TIDAK, atau TIDAK_TAHU (diterima: "${nilai}").`,
      );
    }
  }

  if (ids.length < MIN_JAWABAN_KONTRAK) {
    throw new Error(
      `Jawab minimal ${MIN_JAWABAN_KONTRAK} dari ${KONTRAK_CHECKLIST.length} ` +
        `pertanyaan agar analisis bermakna (baru ${ids.length} dijawab).`,
    );
  }

  let totalBobot = 0;
  let totalPenalti = 0;

  for (const item of KONTRAK_CHECKLIST) {
    const nilai = jawaban[item.id];
    if (nilai === undefined) continue;
    totalBobot += item.bobot;
    if (nilai === 'TIDAK_TAHU') {
      const penalti = item.bobot / 2;
      totalPenalti += penalti;
      peringatan.push(
        `"${item.pertanyaan}" — Anda menjawab TIDAK TAHU. ` +
          `Cek kembali kontrak Anda pada bagian ini.`,
      );
      temuan.push({
        itemId: item.id,
        kategori: NAMA_KATEGORI_KONTRAK[item.kategori],
        pertanyaan: item.pertanyaan,
        redFlag: `Belum jelas: ${item.redFlag}`,
        saran: item.saran,
        bobot: item.bobot,
        penalti,
      });
      continue;
    }
    if (nilai !== item.jawabanAman) {
      totalPenalti += item.bobot;
      temuan.push({
        itemId: item.id,
        kategori: NAMA_KATEGORI_KONTRAK[item.kategori],
        pertanyaan: item.pertanyaan,
        redFlag: item.redFlag,
        saran: item.saran,
        bobot: item.bobot,
        penalti: item.bobot,
      });
    }
  }

  const skorRisiko =
    totalBobot === 0 ? 0 : Math.round((totalPenalti / totalBobot) * 100);
  const grade = skorKeGradeKontrak(skorRisiko);

  langkah.push(
    `Dijawab ${ids.length} dari ${KONTRAK_CHECKLIST.length} pertanyaan.`,
  );
  langkah.push(
    `Total penalti ${totalPenalti} dari total bobot ${totalBobot} item yang dijawab.`,
  );
  langkah.push(
    `Skor risiko = ${totalPenalti}/${totalBobot} × 100 = ${skorRisiko} → grade ${grade}.`,
  );
  langkah.push(
    `Ditemukan ${temuan.length} red-flag / hal yang perlu dicek ulang.`,
  );

  return {
    skorRisiko,
    grade,
    temuan,
    peringatan,
    dijawab: ids.length,
    totalItem: KONTRAK_CHECKLIST.length,
    langkah,
  };
}

/** Format jawaban teks "id: JAWABAN" per baris → map jawaban. */
export function uraiJawabanTeks(teks: string): JawabanMapKontrak {
  const hasil: JawabanMapKontrak = {};
  const baris = teks.split('\n');
  for (const b of baris) {
    const t = b.trim();
    if (t === '' || t.startsWith('#')) continue;
    const m = t.match(/^([a-z0-9-]+)\s*[:=]\s*([A-Za-z_]+)\s*$/);
    if (!m) {
      throw new Error(
        `Baris tidak dikenali: "${t}". Format: "id-pertanyaan: YA" (satu per baris).`,
      );
    }
    const id = m[1];
    const nilai = m[2].toUpperCase().replace(/\s+/g, '_') as JawabanKontrak;
    if (!NILAI_JAWABAN_VALID.includes(nilai)) {
      throw new Error(
        `Jawaban "${m[2]}" pada "${id}" tidak valid — pakai YA, TIDAK, atau TIDAK_TAHU.`,
      );
    }
    if (!itemKontrakDariId(id)) {
      throw new Error(`Item kuesioner tidak dikenal: "${id}".`);
    }
    hasil[id] = nilai;
  }
  return hasil;
}

/** Contoh format jawaban — semua 14 id dengan jawaban kosong untuk diisi. */
export function contohFormatJawaban(): string {
  return KONTRAK_CHECKLIST.map((i) => `${i.id}: `).join('\n');
}

/** Laporan analisis siap salin + disclaimer bukan-nasihat-hukum. */
export function formatKontrakTeks(h: HasilAnalisisKontrak): string {
  const garis = '='.repeat(52);
  const out: string[] = [];
  out.push('KONTRAKKU — HASIL PEMERIKSAAN KONTRAK FREELANCE');
  out.push(garis);
  out.push(`Skor risiko : ${h.skorRisiko}/100 (grade ${h.grade})`);
  out.push(
    `Arti grade : A = relatif aman | B = waspada ringan | C = berisiko | D = sangat berisiko`,
  );
  out.push(`Dijawab     : ${h.dijawab} dari ${h.totalItem} pertanyaan`);
  out.push('');
  if (h.temuan.length === 0) {
    out.push('Tidak ada red-flag terdeteksi dari jawaban Anda. Bagus!');
    out.push('Tetap baca ulang kontrak sekali lagi sebelum tanda tangan.');
  } else {
    out.push(`TEMUAN (${h.temuan.length}):`);
    h.temuan.forEach((t, i) => {
      out.push('');
      out.push(`${i + 1}. [${t.kategori}] ${t.redFlag}`);
      out.push(`   Saran: ${t.saran}`);
    });
  }
  if (h.peringatan.length > 0) {
    out.push('');
    out.push('PERLU DICEK ULANG:');
    h.peringatan.forEach((p) => out.push(`- ${p}`));
  }
  out.push('');
  out.push('CARA HITUNG:');
  h.langkah.forEach((l) => out.push(`- ${l}`));
  out.push('');
  out.push('DISCLAIMER: ' + DISCLAIMER_KONTRAK);
  return out.join('\n');
}
