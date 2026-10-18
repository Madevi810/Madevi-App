/**
 * generator-password.ts — Generator Password Aman
 * Membuat password kuat secara kriptografis aman (Web Crypto API di handler).
 */

const HURUF_KECIL = 'abcdefghijklmnopqrstuvwxyz';
const HURUF_BESAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ANGKA = '0123456789';
const SIMBOL = '!@#$%^&*()-_=+[]{};:,.<>?';

export interface InputPassword {
  panjang: number;
  pakaiHurufBesar: boolean;
  pakaiAngka: boolean;
  pakaiSimbol: boolean;
}

export function validasiInputPassword(input: InputPassword): string[] {
  const masalah: string[] = [];
  if (input.panjang < 8 || input.panjang > 64) {
    masalah.push('Panjang password harus 8–64 karakter');
  }
  return masalah;
}

export function bangunKarakterSet(input: InputPassword): string {
  let set = HURUF_KECIL;
  if (input.pakaiHurufBesar) set += HURUF_BESAR;
  if (input.pakaiAngka) set += ANGKA;
  if (input.pakaiSimbol) set += SIMBOL;
  return set;
}

/**
 * Estimasi entropi dalam bit: panjang * log2(jumlah karakter unik).
 */
export function estimasiEntropiBit(panjang: number, ukuranSet: number): number {
  return Math.round(panjang * Math.log2(ukuranSet));
}

export function nilaiKekuatan(entropiBit: number): string {
  if (entropiBit < 40) return 'LEMAH';
  if (entropiBit < 60) return 'SEDANG';
  if (entropiBit < 80) return 'KUAT';
  return 'SANGAT KUAT';
}
