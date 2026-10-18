/**
 * C3: "Tanya Konsep" — siswa ketik soal, dapat penjelasan konsep.
 * Mode normal: penjelasan + soal mirip.
 * Mode bimbingan (saat ujian aktif): hanya petunjuk langkah, ANTI-NYONTEK.
 */

export type ModeTanya = 'normal' | 'bimbingan';

export interface HasilTanyaKonsep {
  konsep: string;
  penjelasan: string;
  langkahPetunjuk: string[];
  soalMirip: string[];
  mode: ModeTanya;
  peringatan?: string;
}

// Bank konsep sederhana — di produksi diganti AI (LLM7/Zhipu gratis).
const BANK_KONSEP: Array<{
  kataKunci: string[];
  konsep: string;
  penjelasan: string;
  langkah: string[];
  soalMirip: string[];
}> = [
  {
    kataKunci: ['pecahan', 'senilai', 'menyederhanakan'],
    konsep: 'Pecahan Senilai',
    penjelasan:
      'Pecahan senilai adalah pecahan yang nilainya sama meski pembilang dan penyebutnya berbeda. ' +
      'Caranya: kalikan atau bagi pembilang dan penyebut dengan bilangan yang sama.',
    langkah: [
      'Tentukan FPB dari pembilang dan penyebut.',
      'Bagi keduanya dengan FPB untuk bentuk paling sederhana.',
      'Untuk mencari senilai: kalikan keduanya dengan bilangan yang sama.',
    ],
    soalMirip: [
      'Sederhanakan 6/8!',
      'Tentukan 2 pecahan yang senilai dengan 3/5!',
      'Urutkan dari terkecil: 1/2, 2/3, 3/4!',
    ],
  },
  {
    kataKunci: ['hukum ohm', 'arus', 'tegangan', 'resistansi', 'ohm'],
    konsep: 'Hukum Ohm',
    penjelasan:
      'Hukum Ohm menyatakan V = I × R. Tegangan (V) sama dengan arus (I) dikali resistansi (R). ' +
      'Arus berbanding lurus dengan tegangan dan berbanding terbalik dengan resistansi.',
    langkah: [
      'Identifikasi yang diketahui: V, I, atau R.',
      'Pilih rumus yang sesuai: I = V/R, V = I×R, R = V/I.',
      'Hitung dengan satuan yang konsisten (V, A, Ω).',
    ],
    soalMirip: [
      'Tegangan 9V, resistansi 3Ω. Berapa arusnya?',
      'Arus 2A melalui resistor 10Ω. Berapa tegangannya?',
    ],
  },
  {
    kataKunci: ['fotosintesis', 'tumbuhan'],
    konsep: 'Fotosintesis',
    penjelasan:
      'Fotosintesis adalah proses tumbuhan membuat makanan (glukosa) dari air dan karbon dioksida ' +
      'dengan bantuan cahaya matahari. Hasilnya: glukosa + oksigen.',
    langkah: [
      'Ingat bahan: air (H₂O) + karbon dioksida (CO₂) + cahaya.',
      'Ingat hasil: glukosa (C₆H₁₂O₆) + oksigen (O₂).',
      'Tempat: kloroplas (klorofil).',
    ],
    soalMirip: [
      'Tuliskan persamaan reaksi fotosintesis!',
      'Mengapa daun berwarna hijau?',
      'Apa yang terjadi jika tumbuhan tidak mendapat cahaya?',
    ],
  },
];

export function tanyaKonsep(pertanyaan: string, mode: ModeTanya = 'normal'): HasilTanyaKonsep {
  const q = pertanyaan.toLowerCase();
  const cocok = BANK_KONSEP.find((b) => b.kataKunci.some((k) => q.includes(k)));

  if (mode === 'bimbingan') {
    return {
      konsep: cocok?.konsep ?? 'Konsep umum',
      penjelasan:
        'Mode bimbingan aktif (ujian sedang berjalan). Saya tidak bisa memberi jawaban langsung, ' +
        'tapi saya bantu dengan petunjuk langkah.',
      langkahPetunjuk: cocok?.langkah ?? [
        'Baca soal dengan teliti, garis bawahi yang diketahui.',
        'Tentukan konsep yang relevan.',
        'Selesaikan langkah demi langkah.',
      ],
      soalMirip: [],
      mode: 'bimbingan',
      peringatan: '🛡️ Mode anti-nyontek: jawaban langsung disembunyikan selama ujian.',
    };
  }

  if (!cocok) {
    return {
      konsep: 'Belum dikenali',
      penjelasan:
        'Maaf, konsep ini belum ada di bank soal. Coba tanyakan dengan kata kunci lain, ' +
        'misalnya "pecahan", "hukum ohm", atau "fotosintesis".',
      langkahPetunjuk: [],
      soalMirip: [],
      mode: 'normal',
    };
  }

  return {
    konsep: cocok.konsep,
    penjelasan: cocok.penjelasan,
    langkahPetunjuk: cocok.langkah,
    soalMirip: cocok.soalMirip,
    mode: 'normal',
  };
}
