/**
 * pcb-safety.ts — "Cek Aman Tidak?" untuk rangkaian elektronika.
 * Diadopsi dari fase validasi Eagle (ERC → simulasi → cek keamanan),
 * disederhanakan untuk web dan dijelaskan dalam Bahasa Indonesia.
 * Nilai jual utama jasa elektronika Madevi.
 */

export interface KomponenRangkaian {
  jenis: 'resistor' | 'led' | 'kapasitor' | 'dioda' | 'transistor' | 'ic' | 'baterai' | 'kabel';
  nilai?: string; // "220Ω", "5V", dst.
  arusMA?: number; // arus yang mengalir (dari simulasi)
  teganganV?: number; // tegangan pada komponen
}

export interface HasilCekAman {
  aman: boolean;
  peringatan: Array<{ tingkat: 'bahaya' | 'waspada' | 'info'; pesan: string; saran: string }>;
  ringkasan: string;
}

const BATAS = {
  arusLedMaksMA: 20,
  arusLedWaspadaMA: 15,
};

export function cekKeamananRangkaian(komponen: KomponenRangkaian[]): HasilCekAman {
  const peringatan: HasilCekAman['peringatan'] = [];

  const ledTanpaResistor = komponen.some((k) => k.jenis === 'led');
  const adaResistorSeri = komponen.some((k) => k.jenis === 'resistor');

  // 1. LED tanpa resistor pembatas
  if (ledTanpaResistor && !adaResistorSeri) {
    peringatan.push({
      tingkat: 'bahaya',
      pesan: 'LED terhubung langsung ke sumber tanpa resistor pembatas.',
      saran: 'Tambahkan resistor 220Ω–1kΩ seri dengan LED untuk membatasi arus ke ~10–20mA.',
    });
  }

  // 2. Arus LED berlebih (dari simulasi)
  for (const k of komponen) {
    if (k.jenis === 'led' && k.arusMA !== undefined) {
      if (k.arusMA > BATAS.arusLedMaksMA) {
        peringatan.push({
          tingkat: 'bahaya',
          pesan: `Arus LED ${k.arusMA}mA melebihi batas aman 20mA — LED bisa terbakar.`,
          saran: 'Naikkan nilai resistor pembatas atau turunkan tegangan sumber.',
        });
      } else if (k.arusMA > BATAS.arusLedWaspadaMA) {
        peringatan.push({
          tingkat: 'waspada',
          pesan: `Arus LED ${k.arusMA}mA mendekati batas — umur LED berkurang.`,
          saran: 'Pertimbangkan resistor sedikit lebih besar untuk umur pakai lebih lama.',
        });
      }
    }
  }

  // 3. Cek short VCC-GND (kabel langsung)
  const kabelLangsung = komponen.filter((k) => k.jenis === 'kabel').length;
  const adaBaterai = komponen.some((k) => k.jenis === 'baterai');
  if (adaBaterai && kabelLangsung > 0 && !adaResistorSeri && !ledTanpaResistor) {
    peringatan.push({
      tingkat: 'waspada',
      pesan: 'Terdeteksi kemungkinan hubungan singkat (kabel langsung antar kutub baterai).',
      saran: 'Pastikan ada beban (resistor/LED/lampu) di antara kutub positif dan negatif.',
    });
  }

  // 4. Info positif bila aman
  if (peringatan.length === 0) {
    peringatan.push({
      tingkat: 'info',
      pesan: 'Tidak ditemukan masalah keamanan pada rangkaian ini.',
      saran: 'Tetap periksa ulang sambungan fisik sebelum menyalakan.',
    });
  }

  const bahaya = peringatan.filter((p) => p.tingkat === 'bahaya').length;
  const aman = bahaya === 0;
  const ringkasan = aman
    ? `Rangkaian terlihat aman (${peringatan.length} catatan).`
    : `Ditemukan ${bahaya} masalah BERBAHAYA yang harus diperbaiki dulu.`;

  return { aman, peringatan, ringkasan };
}

export function formatCekAmanTeks(hasil: HasilCekAman): string {
  const lines = ['=== CEK KEAMANAN RANGKAIAN ===', hasil.ringkasan, ''];
  for (const p of hasil.peringatan) {
    const ikon = p.tingkat === 'bahaya' ? '🔴' : p.tingkat === 'waspada' ? '🟡' : '🟢';
    lines.push(`${ikon} [${p.tingkat.toUpperCase()}] ${p.pesan}`);
    lines.push(`   Saran: ${p.saran}`);
  }
  return lines.join('\n');
}
