/**
 * SawahKu - kalkulator benih & pupuk padi (engine Tools gratis).
 *
 * Petani padi selalu menghitung manual: berapa kg benih untuk luas sekian
 * dengan jarak tanam sekian, dan berapa kg pupuk (Urea, SP-36, KCl, NPK) dari
 * dosis per hektar. Yang ada di internet hanya artikel/PDF penjelasan rumus -
 * kalkulator interaktif berbahasa Indonesia belum ada.
 *
 * Rumus yang dipakai adalah rumus agronomi standar (bukan karangan):
 *  - populasi rumpun = luas lahan / (jarak tanam x jarak tanam)
 *  - kebutuhan benih = populasi x bibit per rumpun / 1000 x berat 1000 butir
 *    / daya tumbuh
 *  - kebutuhan pupuk = dosis per hektar x luas (ha)
 *
 * Kejujuran data (aturan konten Madevi):
 *  - Dosis pupuk default adalah ACUAN UMUM anjuran penyuluh (Urea 250,
 *    SP-36 100, KCl 100 kg/ha) - dilabeli demikian, SEMUA bisa diubah user
 *    sesuai hasil uji tanah / anjuran PPL setempat. Engine tidak mengklaim
 *    dosis pasti untuk semua lahan.
 *  - Berat 1000 butir (default 25 g) dan daya tumbuh (default 90%) adalah
 *    contoh umum - sesuaikan dengan benih yang dipakai.
 *  - Engine TIDAK menebak harga saprotan (aturan #31) - hanya KG.
 *  - Tidak ada koneksi eksternal. Semua pemrosesan lokal dan deterministik.
 */

export interface BenihInput {
  /** Luas lahan (m2), wajib > 0. */
  luasM2: number;
  /** Jarak tanam persegi (cm). Default 25. */
  jarakTanamCm?: number;
  /** Jumlah bibit per rumpun/tancap. Default 3. */
  bibitPerRumpun?: number;
  /** Berat 1000 butir gabah (gram). Default 25 (acuan umum). */
  berat1000ButirGr?: number;
  /** Daya tumbuh benih (fraksi 0-1). Default 0.9. */
  dayaTumbuh?: number;
}

export interface HasilBenih {
  luasHa: number;
  populasiRumpun: number;
  totalButir: number;
  /** Kebutuhan benih (kg), dibulatkan ke atas per 0,5 kg. */
  benihKg: number;
  langkah: string[];
}

export interface PupukInput {
  /** Luas lahan (m2), wajib > 0. */
  luasM2: number;
  /** Dosis Urea per ha (kg). Default 250 (acuan umum). */
  dosisUreaKgHa?: number;
  /** Dosis SP-36 per ha (kg). Default 100 (acuan umum). */
  dosisSp36KgHa?: number;
  /** Dosis KCl per ha (kg). Default 100 (acuan umum). */
  dosisKclKgHa?: number;
  /** Dosis NPK per ha (kg). Default 0 (tidak dipakai). */
  dosisNpkKgHa?: number;
}

export interface HasilPupuk {
  luasHa: number;
  ureaKg: number;
  sp36Kg: number;
  kclKg: number;
  npkKg: number;
  langkah: string[];
}

export interface HasilSawah {
  benih: HasilBenih;
  pupuk: HasilPupuk;
  langkah: string[];
}

export const CATATAN_SAWAH =
  'Dosis pupuk default adalah acuan umum anjuran penyuluh; sesuaikan dengan ' +
  'hasil uji tanah / anjuran PPL setempat. Angka ini bukan pengganti rekomendasi resmi.';

function wajibPositif(nama: string, nilai: number, maks?: number): void {
  if (!Number.isFinite(nilai) || nilai <= 0 || (maks !== undefined && nilai > maks)) {
    throw new Error(`${nama} harus lebih dari 0${maks !== undefined ? ` dan maksimal ${maks}` : ''}.`);
  }
}

function dalamRentang(nama: string, nilai: number, min: number, maks: number): void {
  if (!Number.isFinite(nilai) || nilai < min || nilai > maks) {
    throw new Error(`${nama} harus antara ${min} dan ${maks}.`);
  }
}

/** Bulatkan ke atas ke kelipatan 0,5. */
function bulatKeAtasSetengah(nilai: number): number {
  return Math.ceil(nilai * 2 - 1e-9) / 2;
}

/** Hitung kebutuhan benih padi dari luas dan jarak tanam. */
export function hitungBenih(input: BenihInput): HasilBenih {
  const {
    luasM2,
    jarakTanamCm = 25,
    bibitPerRumpun = 3,
    berat1000ButirGr = 25,
    dayaTumbuh = 0.9,
  } = input;
  wajibPositif('Luas lahan (m2)', luasM2, 10_000_000);
  dalamRentang('Jarak tanam (cm)', jarakTanamCm, 10, 100);
  dalamRentang('Bibit per rumpun', bibitPerRumpun, 1, 10);
  dalamRentang('Berat 1000 butir (gram)', berat1000ButirGr, 1, 100);
  dalamRentang('Daya tumbuh', dayaTumbuh, 0.01, 1);

  const luasHa = luasM2 / 10000;
  const jarakM = jarakTanamCm / 100;
  // Epsilon 1e-9: 0.2*0.2 floating-point menghasilkan 0.04000000000000001
  // sehingga 10000/0.04... = 249999.99... tanpa epsilon.
  const populasiRumpun = Math.floor(luasM2 / (jarakM * jarakM) + 1e-9);
  const totalButir = populasiRumpun * bibitPerRumpun;
  const benihGr = ((totalButir / 1000) * berat1000ButirGr) / dayaTumbuh;
  const benihKg = bulatKeAtasSetengah(benihGr / 1000);

  return {
    luasHa,
    populasiRumpun,
    totalButir,
    benihKg,
    langkah: [
      `Luas ${luasM2} m2 = ${luasHa} ha.`,
      `Populasi = ${luasM2} / (${jarakM} x ${jarakM}) = ${populasiRumpun.toLocaleString('id-ID')} rumpun.`,
      `Total butir = ${populasiRumpun.toLocaleString('id-ID')} x ${bibitPerRumpun} = ${totalButir.toLocaleString('id-ID')} butir.`,
      `Benih = ${totalButir.toLocaleString('id-ID')} / 1000 x ${berat1000ButirGr} g / ${dayaTumbuh} = ${(benihGr / 1000).toFixed(2)} kg, dibulatkan ke atas menjadi ${benihKg} kg.`,
    ],
  };
}

/** Hitung kebutuhan pupuk dari dosis per hektar. */
export function hitungPupuk(input: PupukInput): HasilPupuk {
  const {
    luasM2,
    dosisUreaKgHa = 250,
    dosisSp36KgHa = 100,
    dosisKclKgHa = 100,
    dosisNpkKgHa = 0,
  } = input;
  wajibPositif('Luas lahan (m2)', luasM2, 10_000_000);
  dalamRentang('Dosis Urea (kg/ha)', dosisUreaKgHa, 0, 2000);
  dalamRentang('Dosis SP-36 (kg/ha)', dosisSp36KgHa, 0, 2000);
  dalamRentang('Dosis KCl (kg/ha)', dosisKclKgHa, 0, 2000);
  dalamRentang('Dosis NPK (kg/ha)', dosisNpkKgHa, 0, 2000);

  const luasHa = luasM2 / 10000;
  const bulat1 = (n: number) => Math.round(n * 10) / 10;
  const ureaKg = bulat1(dosisUreaKgHa * luasHa);
  const sp36Kg = bulat1(dosisSp36KgHa * luasHa);
  const kclKg = bulat1(dosisKclKgHa * luasHa);
  const npkKg = bulat1(dosisNpkKgHa * luasHa);

  return {
    luasHa,
    ureaKg,
    sp36Kg,
    kclKg,
    npkKg,
    langkah: [
      `Luas ${luasM2} m2 = ${luasHa} ha.`,
      `Urea = ${dosisUreaKgHa} x ${luasHa} = ${ureaKg} kg.`,
      `SP-36 = ${dosisSp36KgHa} x ${luasHa} = ${sp36Kg} kg.`,
      `KCl = ${dosisKclKgHa} x ${luasHa} = ${kclKg} kg.`,
      ...(dosisNpkKgHa > 0 ? [`NPK = ${dosisNpkKgHa} x ${luasHa} = ${npkKg} kg.`] : []),
    ],
  };
}

/** Hitung gabungan benih + pupuk untuk satu lahan. */
export function hitungSawah(benih: BenihInput, pupuk: Omit<PupukInput, 'luasM2'> = {}): HasilSawah {
  const hBenih = hitungBenih(benih);
  const hPupuk = hitungPupuk({ ...pupuk, luasM2: benih.luasM2 });
  return {
    benih: hBenih,
    pupuk: hPupuk,
    langkah: [...hBenih.langkah, ...hPupuk.langkah],
  };
}

/** Ringkasan siap salin untuk dibawa ke toko saprotan / grup tani. */
export function formatSawahTeks(h: HasilSawah): string {
  const b = h.benih;
  const p = h.pupuk;
  const baris = [
    'KEBUTUHAN BENIH & PUPUK PADI',
    `Luas lahan: ${b.luasHa} ha`,
    `Populasi: ${b.populasiRumpun.toLocaleString('id-ID')} rumpun`,
    `Benih: ${b.benihKg} kg`,
    `Pupuk Urea: ${p.ureaKg} kg`,
    `Pupuk SP-36: ${p.sp36Kg} kg`,
    `Pupuk KCl: ${p.kclKg} kg`,
  ];
  if (p.npkKg > 0) baris.push(`Pupuk NPK: ${p.npkKg} kg`);
  baris.push(`Catatan: ${CATATAN_SAWAH}`);
  return baris.join('\n');
}
