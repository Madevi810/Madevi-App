/**
 * Worksheet simulasi (Fase C2, pola PhET).
 * Setiap simulasi ditemani 1 worksheet: tujuan belajar eksplisit +
 * pertanyaan eksplorasi terpandu. Format baku Madevi.
 */

export interface SoalWorksheet {
  pertanyaan: string;
  petunjuk?: string;
  kunciJawaban: string;
  pembahasan: string;
}

export interface Worksheet {
  simId: string;
  judul: string;
  tujuanBelajar: string[];
  pertanyaan: SoalWorksheet[];
}

export const WORKSHEET_SIMULASI: Record<string, Worksheet> = {
  'hukum-ohm': {
    simId: 'hukum-ohm',
    judul: 'Worksheet: Hukum Ohm',
    tujuanBelajar: [
      'Menjelaskan hubungan tegangan, arus, dan resistansi (V = I × R).',
      'Memprediksi perubahan arus saat tegangan atau resistansi diubah.',
      'Menghitung daya listrik (P = V × I).',
    ],
    pertanyaan: [
      {
        pertanyaan: 'Jika tegangan 12V dan resistansi 4Ω, berapa arusnya?',
        petunjuk: 'Gunakan I = V / R.',
        kunciJawaban: '3A',
        pembahasan: 'I = 12V / 4Ω = 3A.',
      },
      {
        pertanyaan: 'Resistansi digandakan dari 4Ω menjadi 8Ω (tegangan tetap 12V). Apa yang terjadi pada arus?',
        petunjuk: 'Coba geser slider resistansi di simulasi.',
        kunciJawaban: 'Arus menjadi setengahnya (1,5A)',
        pembahasan: 'Arus berbanding terbalik dengan resistansi: I = 12/8 = 1,5A.',
      },
      {
        pertanyaan: 'Mengapa lampu redup saat tegangan turun?',
        kunciJawaban: 'Karena arus dan daya turun',
        pembahasan: 'Tegangan turun → arus turun (I=V/R) → daya turun (P=V×I) → lampu redup.',
      },
    ],
  },
  parabola: {
    simId: 'parabola',
    judul: 'Worksheet: Gerak Parabola',
    tujuanBelajar: [
      'Menjelaskan pengaruh sudut terhadap jarak tempuh proyektil.',
      'Menentukan sudut yang memberi jarak maksimum.',
    ],
    pertanyaan: [
      {
        pertanyaan: 'Sudut berapa yang memberi jarak terjauh (kecepatan sama)?',
        petunjuk: 'Coba sudut 30°, 45°, 60° di simulasi.',
        kunciJawaban: '45°',
        pembahasan: 'Jarak maksimum teoritis pada 45° (tanpa hambatan udara).',
      },
      {
        pertanyaan: 'Mengapa sudut 30° dan 60° menghasilkan jarak yang sama?',
        kunciJawaban: 'Karena sudut komplementer (jumlah 90°)',
        pembahasan: 'Jarak = v²·sin(2θ)/g; sin(2θ) sama untuk θ dan 90°−θ.',
      },
    ],
  },
  pegas: {
    simId: 'pegas',
    judul: 'Worksheet: Pegas & Osilasi',
    tujuanBelajar: [
      'Menjelaskan hubungan massa, konstanta pegas, dan periode (T = 2π√(m/k)).',
      'Memprediksi perubahan periode saat massa atau konstanta diubah.',
    ],
    pertanyaan: [
      {
        pertanyaan: 'Massa digandakan. Apa yang terjadi pada periode?',
        petunjuk: 'Geser slider massa di simulasi dan amati.',
        kunciJawaban: 'Periode bertambah (lebih lambat)',
        pembahasan: 'T = 2π√(m/k): massa naik → periode naik (akar kuadrat).',
      },
      {
        pertanyaan: 'Pegas diganti yang lebih kaku (k naik). Apa yang terjadi?',
        kunciJawaban: 'Periode berkurang (lebih cepat)',
        pembahasan: 'k naik → T turun karena k di penyebut.',
      },
    ],
  },
  'grafik-fungsi': {
    simId: 'grafik-fungsi',
    judul: 'Worksheet: Grafik Fungsi Kuadrat',
    tujuanBelajar: [
      'Menjelaskan pengaruh koefisien a, b, c terhadap bentuk parabola.',
      'Menentukan akar dan titik puncak dari grafik.',
    ],
    pertanyaan: [
      {
        pertanyaan: 'Apa pengaruh tanda a terhadap arah parabola?',
        petunjuk: 'Geser slider a dari positif ke negatif.',
        kunciJawaban: 'a positif: terbuka ke atas; a negatif: terbuka ke bawah',
        pembahasan: 'Tanda a menentukan arah bukaan parabola.',
      },
      {
        pertanyaan: 'Kapan grafik tidak memotong sumbu-x?',
        kunciJawaban: 'Saat diskriminan negatif (D < 0)',
        pembahasan: 'D = b²−4ac < 0 berarti tidak ada akar real.',
      },
    ],
  },
  ph: {
    simId: 'ph',
    judul: 'Worksheet: Skala pH',
    tujuanBelajar: [
      'Mengklasifikasikan larutan asam, netral, basa dari nilai pH.',
      'Menjelaskan mengapa pH memakai skala logaritma.',
    ],
    pertanyaan: [
      {
        pertanyaan: 'Berapa kali lebih asam larutan pH 3 dibanding pH 5?',
        petunjuk: 'Ingat skala logaritma basis 10.',
        kunciJawaban: '100 kali',
        pembahasan: 'Selisih 2 satuan pH = 10² = 100 kali konsentrasi H⁺.',
      },
      {
        pertanyaan: 'Larutan pH 7 dicampur asam menjadi pH 6. Apa kategorinya sekarang?',
        kunciJawaban: 'Asam lemah',
        pembahasan: 'pH < 7 = asam; pH 6 masih dekat netral = asam lemah.',
      },
    ],
  },
  pecahan: {
    simId: 'pecahan',
    judul: 'Worksheet: Pecahan Visual',
    tujuanBelajar: [
      'Mengubah pecahan ke desimal dan persen.',
      'Menentukan pecahan senilai dan membandingkan pecahan.',
    ],
    pertanyaan: [
      {
        pertanyaan: 'Pecahan apa yang senilai dengan 2/4?',
        petunjuk: 'Lihat kolom "senilai" di simulasi.',
        kunciJawaban: '1/2',
        pembahasan: '2/4 disederhanakan (bagi 2) = 1/2.',
      },
      {
        pertanyaan: 'Mana lebih besar: 2/3 atau 3/4?',
        petunjuk: 'Bandingkan desimalnya di simulasi.',
        kunciJawaban: '3/4',
        pembahasan: '2/3 ≈ 0,667; 3/4 = 0,75. Jadi 3/4 lebih besar.',
      },
    ],
  },
};

export function worksheetBySimId(simId: string): Worksheet | undefined {
  return WORKSHEET_SIMULASI[simId];
}
