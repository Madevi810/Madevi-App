/**
 * SlopKu — detektor AI-slop Bahasa Indonesia (engine Tools gratis).
 *
 * BEDA dengan "AI checker" (GPTZero/Turnitin/ZeroGPT) yang menebak apakah
 * tulisan dibuat AI: engine ini memeriksa POLA GAYA khas tulisan AI yang
 * membuat teks terasa "robotik" — em-dash berlebihan, elipsis, emoji di teks
 * formal, frasa generik ("dalam era digital yang serba cepat", "sebagai
 * kesimpulan"), awalan kalimat berulang, dan kalimat berpanjang seragam
 * (burstiness rendah).
 *
 * Kejujuran data (aturan konten Madevi):
 *  - Engine DETERMINISTIK lokal (regex + statistik) — BUKAN model ML dan
 *    BUKAN bukti tulisan dibuat AI. Setiap output memuat disclaimer ini.
 *  - Daftar pola terbuka & bisa diperluas; skor transparan (langkah
 *    menunjukkan tiap penalti).
 *  - Tidak menebak apa pun dari luar teks yang diberikan user.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal.
 */

export interface PolaSlop {
  id: string;
  nama: string;
  /** Penalti maksimum pola ini terhadap skor (0–100). */
  penaltiMaks: number;
  saran: string;
}

export const POLA_SLOP: PolaSlop[] = [
  {
    id: 'em-dash',
    nama: 'Em-dash / en-dash berlebihan',
    penaltiMaks: 25,
    saran:
      'Ganti sebagian besar —/– dengan koma, titik, titik dua, atau tulis ' +
      'ulang kalimatnya. Satu-dua pemisah per artikel cukup.',
  },
  {
    id: 'elipsis',
    nama: 'Elipsis (…) berlebihan',
    penaltiMaks: 15,
    saran:
      'Elipsis untuk jeda dramatis adalah ciri khas tulisan AI. Selesaikan ' +
      'kalimatnya dengan titik biasa.',
  },
  {
    id: 'emoji',
    nama: 'Emoji di teks',
    penaltiMaks: 20,
    saran:
      'Hapus emoji dari teks formal/artikel. Emoji wajar di chat santai, ' +
      'tapi di tulisan formal langsung terbaca sebagai AI slop.',
  },
  {
    id: 'frasa-generik',
    nama: 'Frasa generik khas AI',
    penaltiMaks: 30,
    saran:
      'Ganti frasa generik dengan kalimat spesifik: sebutkan fakta, angka, ' +
      'nama, atau pengalaman konkret alih-alih "dalam era digital yang ' +
      'serba cepat".',
  },
  {
    id: 'awalan-berulang',
    nama: 'Awalan kalimat berulang',
    penaltiMaks: 15,
    saran:
      'Variasikan pembuka kalimat: gabung kalimat pendek, balik struktur ' +
      '(keterangan di depan), atau mulai dari sudut berbeda.',
  },
  {
    id: 'burstiness-rendah',
    nama: 'Panjang kalimat terlalu seragam',
    penaltiMaks: 10,
    saran:
      'Campur kalimat pendek (3–6 kata) dengan kalimat panjang. Manusia ' +
      'menulis berirama; AI cenderung seragam 12–20 kata.',
  },
  {
    id: 'paragraf-tunggal',
    nama: 'Paragraf satu kalimat beruntun',
    penaltiMaks: 10,
    saran:
      'Gabungkan beberapa paragraf satu kalimat menjadi paragraf utuh 3–5 ' +
      'kalimat, atau kembangkan idenya.',
  },
];

/** Frasa generik khas tulisan AI dalam Bahasa Indonesia. */
export const FRASA_GENERIK: string[] = [
  'dalam era digital',
  'di dunia yang serba cepat',
  'dunia yang serba cepat',
  'sebagai kesimpulan',
  'kesimpulannya,',
  'penting untuk dicatat',
  'perlu dicatat bahwa',
  'perlu diingat bahwa',
  'tak dapat dipungkiri',
  'bukan sekadar',
  'melainkan juga',
  'game changer',
  'menyelami lebih dalam',
  'mari kita selami',
  'lanskap digital',
  'di era modern ini',
  'pada akhirnya,',
  'dengan demikian,',
];

export const BATAS_KATA_MIN = 20;
export const BATAS_KATA_MAKS = 20000;

export const DISCLAIMER_SLOP =
  'SlopKu memeriksa POLA GAYA khas tulisan AI (tanda baca, frasa, ritme ' +
  'kalimat) — BUKAN bukti bahwa teks ini dibuat AI. Manusia pun bisa ' +
  'menulis dengan pola di atas, dan AI yang disunting baik bisa lolos. ' +
  'Pakai hasilnya sebagai bahan poles gaya tulisan, bukan vonis.';

export interface TemuanSlop {
  polaId: string;
  polaNama: string;
  /** Kutipan contoh dari teks (dipotong bila panjang). */
  contoh: string;
  jumlah: number;
  penalti: number;
  saran: string;
}

export interface StatistikTeks {
  jumlahKata: number;
  jumlahKalimat: number;
  jumlahParagraf: number;
  emDashPer1000Kata: number;
}

export interface HasilPindaiSlop {
  /** 0–100; makin tinggi makin bersih dari pola slop. */
  skor: number;
  grade: 'A' | 'B' | 'C' | 'D';
  temuan: TemuanSlop[];
  statistik: StatistikTeks;
  peringatan: string[];
  langkah: string[];
}

function potong(s: string, n = 90): string {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : t.slice(0, n - 1) + '…';
}

function kataDari(teks: string): string[] {
  return teks.split(/\s+/).filter((w) => w.length > 0);
}

function kalimatDari(teks: string): string[] {
  return teks
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function paragrafDari(teks: string): string[] {
  return teks
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

const POLA_EMOJI =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}]/u;

export function skorKeGrade(skor: number): 'A' | 'B' | 'C' | 'D' {
  if (skor >= 85) return 'A';
  if (skor >= 70) return 'B';
  if (skor >= 50) return 'C';
  return 'D';
}

function saranDari(id: string): string {
  return POLA_SLOP.find((p) => p.id === id)?.saran ?? '';
}

function namaPolaDari(id: string): string {
  return POLA_SLOP.find((p) => p.id === id)?.nama ?? id;
}

/**
 * Memindai teks dan mengembalikan skor + temuan pola AI-slop.
 * Deterministik: input sama → hasil sama. Melempar Error bila validasi gagal.
 */
export function pindaiSlop(teks: string): HasilPindaiSlop {
  if (typeof teks !== 'string' || teks.trim().length === 0) {
    throw new Error('Teks wajib diisi — tempel tulisan yang ingin dipindai.');
  }
  const kata = kataDari(teks);
  if (kata.length > BATAS_KATA_MAKS) {
    throw new Error(
      `Teks terlalu panjang (${kata.length} kata) — maksimal ${BATAS_KATA_MAKS} kata per pindai.`,
    );
  }
  const kalimat = kalimatDari(teks);
  const paragraf = paragrafDari(teks);

  const peringatan: string[] = [];
  if (kata.length < BATAS_KATA_MIN) {
    peringatan.push(
      `Teks hanya ${kata.length} kata (< ${BATAS_KATA_MIN}) — analisis pola ` +
        'kurang bermakna untuk teks sependek ini.',
    );
  }

  const temuan: TemuanSlop[] = [];
  const langkah: string[] = [];
  const per1000 = (n: number): number =>
    kata.length === 0 ? 0 : (n / kata.length) * 1000;

  const tambahTemuan = (
    polaId: string,
    contoh: string,
    jumlah: number,
    penalti: number,
  ): void => {
    const p = Math.round(penalti);
    if (p <= 0) return;
    temuan.push({
      polaId,
      polaNama: namaPolaDari(polaId),
      contoh: potong(contoh),
      jumlah,
      penalti: p,
      saran: saranDari(polaId),
    });
    langkah.push(
      `Pola "${namaPolaDari(polaId)}": ${jumlah} kemunculan → penalti ${p}.`,
    );
  };

  // 1. Em-dash / en-dash.
  const emDash = (teks.match(/[—–]/g) ?? []).length;
  const emDashP1000 = per1000(emDash);
  if (emDashP1000 > 3) {
    const contohKalimat =
      kalimat.find((k) => /[—–]/.test(k)) ?? '—';
    tambahTemuan(
      'em-dash',
      contohKalimat,
      emDash,
      Math.min(25, (emDashP1000 - 3) * 4),
    );
  } else {
    langkah.push(
      `Em-dash/–: ${emDashP1000.toFixed(1)} per 1000 kata (ambang 3) → aman.`,
    );
  }

  // 2. Elipsis.
  const elipsis = (teks.match(/…/g) ?? []).length;
  const elipsisP1000 = per1000(elipsis);
  if (elipsisP1000 > 1) {
    tambahTemuan(
      'elipsis',
      kalimat.find((k) => /…/.test(k)) ?? '…',
      elipsis,
      Math.min(15, (elipsisP1000 - 1) * 5),
    );
  }

  // 3. Emoji.
  const emoji = (teks.match(new RegExp(POLA_EMOJI.source, 'gu')) ?? []).length;
  if (emoji > 0) {
    tambahTemuan(
      'emoji',
      kalimat.find((k) => POLA_EMOJI.test(k)) ?? teks.slice(0, 60),
      emoji,
      Math.min(20, emoji * 4),
    );
  }

  // 4. Frasa generik.
  const teksRendah = teks.toLowerCase();
  const frasaKena: { frasa: string; contoh: string }[] = [];
  for (const frasa of FRASA_GENERIK) {
    const idx = teksRendah.indexOf(frasa);
    if (idx >= 0) {
      frasaKena.push({
        frasa,
        contoh: kalimat.find((k) =>
          k.toLowerCase().includes(frasa),
        ) ?? frasa,
      });
    }
  }
  if (frasaKena.length > 0) {
    const totalKemunculan = frasaKena.reduce((acc, f) => {
      const re = new RegExp(
        f.frasa.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'gi',
      );
      return acc + (teks.match(re) ?? []).length;
    }, 0);
    tambahTemuan(
      'frasa-generik',
      `Frasa: ${frasaKena.map((f) => `"${f.frasa}"`).join(', ')} — cth: ${frasaKena[0].contoh}`,
      totalKemunculan,
      Math.min(30, totalKemunculan * 5),
    );
  }

  // 5. Awalan kalimat berulang (≥3 berurutan, kata pertama sama).
  let deretBerulang = 0;
  const kataPertama = kalimat.map(
    (k) => (k.match(/[\p{L}']+/u) ?? [''])[0].toLowerCase(),
  );
  for (let i = 0; i + 2 < kataPertama.length; i++) {
    if (
      kataPertama[i] &&
      kataPertama[i] === kataPertama[i + 1] &&
      kataPertama[i] === kataPertama[i + 2]
    ) {
      deretBerulang++;
      i += 2; // jangan hitung tumpang tindih
    }
  }
  if (deretBerulang > 0) {
    tambahTemuan(
      'awalan-berulang',
      kalimat.find((_, i) =>
        kataPertama[i] &&
        kataPertama[i] === kataPertama[i + 1] &&
        kataPertama[i] === kataPertama[i + 2],
      ) ?? '',
      deretBerulang,
      Math.min(15, deretBerulang * 5),
    );
  }

  // 6. Burstiness rendah: std dev panjang kalimat < 4 kata (min 8 kalimat).
  if (kalimat.length >= 8) {
    const panjang = kalimat.map((k) => kataDari(k).length);
    const rata = panjang.reduce((a, b) => a + b, 0) / panjang.length;
    const varians =
      panjang.reduce((a, b) => a + (b - rata) * (b - rata), 0) /
      panjang.length;
    const stdDev = Math.sqrt(varians);
    if (stdDev < 4) {
      tambahTemuan(
        'burstiness-rendah',
        `Rata-rata ${rata.toFixed(1)} kata/kalimat, simpangan baku hanya ${stdDev.toFixed(1)}.`,
        kalimat.length,
        10,
      );
    } else {
      langkah.push(
        `Ritme kalimat bervariasi (simpangan baku ${stdDev.toFixed(1)}) → aman.`,
      );
    }
  }

  // 7. Paragraf satu kalimat beruntun (≥3).
  const paragrafTunggal = paragraf.filter(
    (p) => kalimatDari(p).length === 1,
  ).length;
  if (paragrafTunggal >= 3) {
    tambahTemuan(
      'paragraf-tunggal',
      potong(paragraf.find((p) => kalimatDari(p).length === 1) ?? ''),
      paragrafTunggal,
      Math.min(10, paragrafTunggal * 2),
    );
  }

  const totalPenalti = temuan.reduce((a, t) => a + t.penalti, 0);
  const skor = Math.max(0, Math.min(100, 100 - totalPenalti));
  langkah.push(
    `Total penalti ${totalPenalti} → skor ${skor}/100 (${skorKeGrade(skor)}).`,
  );

  return {
    skor,
    grade: skorKeGrade(skor),
    temuan,
    statistik: {
      jumlahKata: kata.length,
      jumlahKalimat: kalimat.length,
      jumlahParagraf: paragraf.length,
      emDashPer1000Kata: Math.round(emDashP1000 * 10) / 10,
    },
    peringatan,
    langkah,
  };
}

/** Laporan hasil pindai siap salin. */
export function formatSlopTeks(h: HasilPindaiSlop): string {
  const baris: string[] = [];
  baris.push('HASIL PINDAI AI-SLOP (SlopKu)');
  baris.push(
    `Skor: ${h.skor}/100 — Grade ${h.grade} ` +
      `(${h.statistik.jumlahKata} kata, ${h.statistik.jumlahKalimat} kalimat, ${h.statistik.jumlahParagraf} paragraf)`,
  );
  baris.push('');
  if (h.temuan.length === 0) {
    baris.push('Bersih: tidak ada pola AI-slop yang terdeteksi. Tulisanmu aman.');
  } else {
    baris.push(`DITEMUKAN ${h.temuan.length} POLA:`);
    h.temuan.forEach((t, i) => {
      baris.push('');
      baris.push(`${i + 1}. ${t.polaNama} (${t.jumlah}×, −${t.penalti} poin)`);
      baris.push(`   Contoh: "${t.contoh}"`);
      baris.push(`   Saran: ${t.saran}`);
    });
  }
  if (h.peringatan.length > 0) {
    baris.push('');
    baris.push('PERINGATAN:');
    for (const p of h.peringatan) baris.push(`- ${p}`);
  }
  baris.push('');
  baris.push('Catatan: ' + DISCLAIMER_SLOP);
  return baris.join('\n');
}
