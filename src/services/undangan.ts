/**
 * Tipe data undangan digital Madevi.
 * Diadopsi dari riset katsudoto.id, dengan karakter berbeda dan fitur lebih baik.
 */

export type KategoriTemplate = 'adat' | 'floral' | 'minimalis' | 'nature' | 'vintage' | 'fairytale';

export interface Mempelai {
  namaLengkap: string;
  namaPanggilan: string;
  putraDari: string; // "Putra dari Bpk. X & Ibu Y"
  fotoUrl?: string;
}

export interface AcaraUndangan {
  nama: string; // "Akad Nikah", "Resepsi"
  tanggal: string; // YYYY-MM-DD
  jamMulai: string; // "08:00"
  jamSelesai: string;
  tempat: string;
  alamat: string;
  mapsUrl?: string;
}

export interface AmplopDigital {
  bank?: Array<{ bank: string; nomor: string; atasNama: string }>;
  ewallet?: Array<{ provider: string; nomor: string; atasNama: string }>;
  alamatKado?: string;
}

export interface RSVPConfig {
  aktif: boolean;
  deadline?: string; // YYYY-MM-DD
  pertanyaanCustom?: Array<{ id: string; pertanyaan: string; tipe: 'teks' | 'pilihan'; opsi?: string[] }>;
}

export interface DataUndangan {
  slug: string;
  templateId: string;
  kategori: KategoriTemplate;
  warnaUtama: string;
  fontJudul: string;
  mempelaiPria: Mempelai;
  mempelaiWanita: Mempelai;
  coverSambutan: string;
  acara: AcaraUndangan[];
  loveStory?: Array<{ judul: string; tanggal: string; cerita: string }>;
  galeriFoto?: string[];
  videoUrl?: string;
  musikUrl?: string;
  rsvp: RSVPConfig;
  amplop: AmplopDigital;
  rundown?: Array<{ jam: string; kegiatan: string }>;
  password?: string; // opsi undangan privat
}

export interface TamuUndangan {
  id: string;
  nama: string;
  nomorWA?: string;
  grup?: string;
  sesi?: string;
  pax: number;
  statusRSVP: 'belum' | 'hadir' | 'tidak';
  jawabanCustom?: Record<string, string>;
  sudahCheckin: boolean;
}

export function buatLinkPersonal(slug: string, namaTamu: string): string {
  return `/undangan/${slug}?to=${encodeURIComponent(namaTamu)}`;
}

export function buatLinkWA(nomorWA: string, pesan: string): string {
  const nomor = nomorWA.replace(/\D/g, '').replace(/^0/, '62');
  return `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
}

export function templatePesanUndangan(namaTamu: string, namaMempelai: string, link: string): string {
  return (
    `Assalamu'alaikum Wr. Wb.\n\n` +
    `Yth. ${namaTamu},\n\n` +
    `Dengan penuh syukur, kami mengundang Bapak/Ibu/Saudara/i ke acara pernikahan kami:\n\n` +
    `${namaMempelai}\n\n` +
    `Buka undangan: ${link}\n\n` +
    `Kehadiran Anda sangat berarti bagi kami. Wassalamu'alaikum Wr. Wb.`
  );
}
