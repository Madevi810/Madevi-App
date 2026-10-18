/**
 * Indeks pencarian statis (Fase A5).
 * Menjangkau seluruh isi baru: tools, simulasi, template undangan,
 * kategori tutorial, jenjang school. Digabung dengan hasil pencarian DB.
 */
import { ALL_TOOLS } from './tools-registry-data';
import { TEMPLATE_UNDANGAN, KATEGORI_LABEL } from './undangan-template';
import { KATEGORI_TUTORIAL_LABEL, type KategoriTutorial } from './tutorial';
import { JENJANG_LABEL, type Jenjang } from './school';
import { DAFTAR_RUANG } from './ruang';

export interface HasilPencarianStatis {
  judul: string;
  deskripsi: string;
  href: string;
  ruang: string;
  skor: number;
}

function skorKecocokan(teks: string, kataKunci: string): number {
  const t = teks.toLowerCase();
  const k = kataKunci.toLowerCase().trim();
  if (!k) return 0;
  if (t === k) return 100;
  if (t.startsWith(k)) return 80;
  const kata = k.split(/\s+/);
  let skor = 0;
  for (const w of kata) {
    if (t.includes(w)) skor += 50;
  }
  // Bonus jika semua kata cocok
  if (kata.every((w) => t.includes(w))) skor += 30;
  return Math.min(100, skor);
}

export function cariStatis(kataKunci: string, batas = 20): HasilPencarianStatis[] {
  const hasil: HasilPencarianStatis[] = [];
  const k = kataKunci.trim();
  if (!k) return hasil;

  // Tools
  for (const t of ALL_TOOLS) {
    const teks = `${t.nameId} ${t.descriptionId} ${t.category}`;
    const skor = skorKecocokan(teks, k);
    if (skor > 0) {
      hasil.push({
        judul: t.nameId,
        deskripsi: t.descriptionId.slice(0, 120),
        href: `/tools/${t.id}`,
        ruang: 'Tools & Equipment',
        skor: skor + 10, // tools diprioritaskan
      });
    }
  }

  // Simulasi
  const sims = [
    { judul: 'Hukum Ohm', deskripsi: 'Simulasi interaktif V = I × R', href: '/simulasi' },
    { judul: 'Gerak Parabola', deskripsi: 'Simulasi lintasan proyektil', href: '/simulasi' },
    { judul: 'Pegas & Osilasi', deskripsi: 'Simulasi animasi pegas', href: '/simulasi' },
    { judul: 'Grafik Fungsi', deskripsi: 'Simulasi y = ax² + bx + c', href: '/simulasi' },
    { judul: 'Skala pH', deskripsi: 'Simulasi asam-basa visual', href: '/simulasi' },
    { judul: 'Pecahan Visual', deskripsi: 'Simulasi belajar pecahan', href: '/simulasi' },
  ];
  for (const s of sims) {
    const skor = skorKecocokan(`${s.judul} ${s.deskripsi} simulasi`, k);
    if (skor > 0) {
      hasil.push({ ...s, ruang: 'Tools & Equipment', skor });
    }
  }

  // Template undangan
  for (const t of TEMPLATE_UNDANGAN) {
    const skor = skorKecocokan(`${t.nama} ${t.deskripsi} ${KATEGORI_LABEL[t.kategori]} undangan`, k);
    if (skor > 0) {
      hasil.push({
        judul: `Template: ${t.nama}`,
        deskripsi: t.deskripsi,
        href: `/undangan/template`,
        ruang: 'Madevi Services',
        skor,
      });
    }
  }

  // Kategori tutorial
  for (const [key, label] of Object.entries(KATEGORI_TUTORIAL_LABEL) as Array<[KategoriTutorial, string]>) {
    const skor = skorKecocokan(`${label} tutorial panduan`, k);
    if (skor > 0) {
      hasil.push({
        judul: `Tutorial: ${label}`,
        deskripsi: `Panduan praktis kategori ${label}`,
        href: `/tutorial/${key}`,
        ruang: 'Tutorial & Problem Solve',
        skor,
      });
    }
  }

  // Jenjang school
  for (const [key, label] of Object.entries(JENJANG_LABEL) as Array<[Jenjang, string]>) {
    const skor = skorKecocokan(`${label} sekolah kelas`, k);
    if (skor > 0) {
      hasil.push({
        judul: `School: ${label}`,
        deskripsi: `Materi dan ujian ${label}`,
        href: `/school/${key}`,
        ruang: 'Madevi School',
        skor,
      });
    }
  }

  // Ruang
  for (const r of DAFTAR_RUANG) {
    const skor = skorKecocokan(`${r.nama} ${r.deskripsi}`, k);
    if (skor > 0) {
      hasil.push({
        judul: r.nama,
        deskripsi: r.deskripsi,
        href: r.href,
        ruang: r.nama,
        skor: skor + 5,
      });
    }
  }

  return hasil
    .sort((a, b) => b.skor - a.skor)
    .slice(0, batas);
}
