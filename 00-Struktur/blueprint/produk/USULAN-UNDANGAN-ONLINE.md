# Usulan Fitur: Sistem Rendering Undangan Online (Dynamic Web)

**Status:** Usulan (Masuk Backlog)  
**Pengusul:** Agent 1  
**Arsitektur Target:** Murni Next.js (App Router, Server Components untuk fetch data, React Client Components untuk layout interaktif).

---

### ID/route kanonis dan alias:
- **Kanonis:** `/undangan/[slug]`
- **Alias:** Tidak ada alias eksternal, nama slug harus unik per pesanan (contoh: `/undangan/ade-devi-27sep26`).

### Pelaku, kebutuhan, dan keputusan yang dibantu:
- **Pelaku:** Pengguna publik / tamu undangan.
- **Kebutuhan:** Membuka undangan digital yang interaktif secara instan di peramban web (Mobile/Desktop) dengan animasi yang mulus.
- **Keputusan:** Mengetahui detail waktu dan lokasi acara, serta mengisi formulir konfirmasi kehadiran (RSVP).

### Data/sumber serta pemiliknya:
- **Penyimpanan:** Data struktur undangan (nama mempelai, waktu, peta, foto profil, pilihan *template*) ditarik dari database PostgreSQL tabel `orders_invitation` atau tabel turunan terpublikasi.
- **Pemilik Data:** Pemesan jasa (Owner pesanan). Data yang ditampilkan telah disetujui (publish) oleh admin/owner layanan lokal.

### Struktur halaman: heading → konteks → pilihan → workspace/isi → hasil → bantuan:
- **Heading & Konteks:** Halaman ini *standalone*, tidak dibungkus oleh `PublicShell` standar Madevi (tidak ada navigasi header utama), agar menyerupai website mandiri.
- **Isi (Berdasarkan Template):** 
  - Komponen sampul (Cover) dengan nama dan animasi pembuka.
  - Detail acara (Akad/Resepsi) dan tautan kalender.
  - Galeri atau kutipan.
- **Hasil (Tindakan):** Widget pengisian form RSVP (Kirim nama dan kehadiran).
- **Bantuan:** Footer kecil "Dibuat melalui layanan Madevi".

### Tindakan utama dan hasil server/data yang membuktikannya:
1. **Fetch Data:** Next.js Server Component melakukan `GET` ke database berdasarkan parameter `slug`. Jika tidak ditemukan/belum di-publish, mengembalikan halaman `404 Not Found`.
2. **Kirim RSVP:** Tamu mengisi form, dikirim via `POST /api/v1/jasa/undangan/[slug]/rsvp`. Hasil dibuktikan dengan penambahan baris data kehadiran pada antarmuka pelacakan (tracking) milik sang pemesan (`/jasa/tracking`).

### Permission dan keadaan loading/empty/error/forbidden/success/recovery:
- **Loading:** *Streaming/Suspense fallback* dengan spinner atau logo animasi saat fetching detail data.
- **Empty:** 404 jika slug salah.
- **Forbidden:** 403 atau "Undangan belum diterbitkan" jika *status* pesanan di database masih DRAFT/PROSES dan belum diizinkan tayang oleh Admin.
- **Success:** RSVP mencatatkan pesan "Terima kasih atas konfirmasinya".

### URL, search, breadcrumb, back/forward, dan tautan keluar:
- **URL:** Tidak diindeks publik (`robots: noindex`) kecuali diputuskan lain oleh pemesan, agar privasi nama mempelai/lokasi terjaga dari mesin pencari generik.
- **Tautan keluar:** Hanya tombol peta (*Google Maps redirect*) dan tombol simpan ke kalender.

### Konten yang perlu ditulis, diverifikasi, diberi tanggal, dan direview Owner:
- **Template Komponen:** Membangun *React components* statis yang bersifat *reusable* (contoh: `<TemplateElegant data={data} />`, `<TemplateMinimalis data={data} />`). Ketersediaan gaya desain (*style*) harus melalui verifikasi Owner Jasa.

### Risiko safety/privasi/harga/legal serta retensi:
- **Privasi:** Perlindungan *brute-force* atau *scraping* nama tamu/undangan. Memastikan endpoint RSVP di-limit berdasarkan IP.
- **Retensi:** Undangan memiliki tenggat waktu aktif (misalnya 1 bulan setelah acara selesai, sistem mengarsipkannya dan URL menjadi tidak aktif/404) untuk membebaskan penyimpanan server.

### Acceptance criteria, bukti statis/runtime, kompatibilitas, dan rollback:
- **AC-01:** Rute `/undangan/[slug]/page.tsx` diimplementasikan tanpa menggunakan `PublicShell` (halaman full-screen murni).
- **AC-02:** Sistem *dynamic routing* merender komponen berbeda (`TemplateA` atau `TemplateB`) bergantung murni pada variabel `data.templateId` dari *database*.
- **AC-03:** *Endpoint* `/api/v1/jasa/undangan/[slug]/rsvp` melindungi dari injeksi (sanitasi teks nama tamu) dan tidak membocorkan data tamu lain (hanya `write-only` bagi publik).
