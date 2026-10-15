# Blueprint Teknis Madevi

## 1. Arsitektur Sistem

```
┌─────────────────┐         ┌──────────────────────┐         ┌──────────────┐
│   Next.js        │ ──API──▶│  Laravel (PHP)        │ ──SQL──▶│ PostgreSQL   │
│   (Vercel)        │◀──JSON──│  API + Filament Admin │◀────────│              │
└─────────────────┘         └──────────────────────┘         └──────────────┘
                                      │
                                      ▼
                              ┌──────────────┐
                              │ Redis + Queue │
                              │ Worker        │
                              └──────────────┘
                                      │
                                      ▼
                              ┌──────────────┐
                              │ Storage       │
                              │ (Local/R2/S3) │
                              └──────────────┘
```

**Prinsip pembagian peran:**
- **Next.js** = interface murni. Render halaman, kirim request, terima JSON, render UI. Tidak menyimpan data permanen apapun kecuali proses SSR di server Next.js sendiri (bukan penyimpanan data, cuma proses render).
- **Laravel** = jembatan + otak logic. Terima request dari Next.js atau dari Admin (Filament), proses (validasi, kalkulasi, generator), baca/tulis ke PostgreSQL, kirim balik hasil.
- **PostgreSQL** = gudang data. Semua data terstruktur (artikel, akun, order, hasil generator sebagai metadata) disimpan permanen di sini.
- **Redis + Queue Worker** = penanganan proses berat di background (generator PDF, dll) supaya server utama tidak ke-block.
- **Storage** = tempat file besar (gambar, PDF hasil generate) — PostgreSQL cuma menyimpan path/link ke file ini, bukan file itu sendiri.

---

## 2. Frontend — Next.js

### Struktur Folder
```
madevi-frontend/
├── app/
│   ├── (public)/             # Halaman umum: home, artikel, ruang
│   ├── (auth)/                # Login, register
│   ├── (dashboard)/           # Area user login
│   ├── admin/                 # (opsional, jika admin dibuat di sini, bukan Filament)
│   └── artikel/[kategori]/[slug]/page.tsx   # 1 template, menangani semua artikel
├── components/
├── lib/
│   ├── api/                   # Fungsi fetch ke Laravel
│   └── auth/                  # Token handling (Sanctum)
├── styles/
├── types/                     # Interface TypeScript, matching response Laravel
└── middleware.ts               # Proteksi route (cek token sebelum render)
```

### Prinsip Routing Dinamis
- Satu file template (`[slug]/page.tsx`) menangani **semua** data sejenis — tidak ada file baru dibuat tiap ada data baru.
- URL bersih (clean URL), tidak ada ekstensi `.js`/`.php`/`.html` yang terlihat user — ini standar modern routing (Next.js App Router, Laravel API routes).
- Alur baca data: `Next.js (GET request) → API Laravel → Query Postgres → balik JSON → Next.js render`

### Hosting
- **Vercel** — domain + hosting Next.js, SSR/SSG jalan di sini. Free tier cukup untuk mulai.

---

## 3. Backend — Laravel (PHP) + Octane

**Laravel Octane (Swoole) dipakai sejak awal**, bukan ditunda sampai ada masalah performa:
- Aplikasi tetap hidup di memori antar request (tidak bootstrap ulang tiap request) → throughput jauh lebih tinggi, latency lebih rendah
- Install: `composer require laravel/octane`, lalu `php artisan octane:install` (pilih driver **Swoole**), extension `swoole` perlu di-install di VPS (`pecl install swoole`)
- Jalankan dengan `php artisan octane:start`, dikelola oleh **Supervisor** di VPS (sama seperti queue worker) supaya auto-restart kalau crash
- **Catatan penting saat menulis kode:** hindari static property / singleton yang menyimpan state per-request, karena instance aplikasi bertahan antar request — state yang seharusnya "fresh" bisa bocor ke request berikutnya kalau tidak sengaja disimpan di scope yang salah. Gunakan dependency injection & scoped bindings sesuai rekomendasi dokumentasi Octane.

### Struktur Folder
```
madevi-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/   # ArticleController, AuthController, GeneratorController
│   │   ├── Middleware/        # Auth (Sanctum), CORS
│   │   └── Requests/          # Validasi input
│   ├── Models/                 # Article, User, Order, GeneratorResult, dll
│   ├── Services/                # Logic generator (PdfGeneratorService, CvBuilderService)
│   └── Jobs/                    # Job untuk queue (GeneratePdfJob, dll)
├── routes/
│   └── api.php                  # Semua endpoint /api/...
├── database/
│   ├── migrations/               # Struktur tabel Postgres
│   └── seeders/
├── config/
│   ├── database.php               # Koneksi Postgres
│   └── queue.php                  # Koneksi Redis
└── .env                            # Kredensial DB, Redis, API keys
```

### Contoh Endpoint API (kontrak Front ↔ Back)
```
GET    /api/artikel                → list artikel
GET    /api/artikel/{kategori}/{slug} → detail artikel
POST   /api/auth/login             → login, return token
POST   /api/generator/cv           → submit data CV → masuk queue
GET    /api/generator/cv/{id}      → cek status/hasil generator
POST   /api/undangan                → submit data undangan → simpan ke Postgres
GET    /api/undangan/{slug}         → ambil data undangan (untuk render halaman web)
```

### Admin Panel — Filament
- Package yang jalan **di dalam** Laravel (bukan aplikasi terpisah) — otomatis ikut ke manapun Laravel di-deploy.
- Diakses via `domain.com/admin`, generate CRUD otomatis dari struktur database (tabel artikel, user, order, dll).
- Alur: Admin isi form artikel di Filament → submit → Laravel simpan langsung ke Postgres. Next.js **tidak** menerima kiriman apapun saat itu — Next.js baru tahu ada data baru saat dia sendiri fetch (GET).

### Hosting
- **1 VPS** (rekomendasi: 8GB RAM, beberapa CPU core, Ubuntu) berisi:
  - Laravel + Octane (Swoole) + Filament Admin
  - PostgreSQL
  - Redis + Queue Worker
- Software yang perlu di-install: PHP, Composer, ekstensi Swoole, Nginx (sebagai reverse proxy ke Octane, bukan Apache), PostgreSQL, Redis, Supervisor (auto-restart Octane & queue worker), SSL (Let's Encrypt/Certbot).
- Domain: root domain (`madevi.com`) → Vercel; subdomain (`api.madevi.com`) atau path (`/admin`) → VPS, diatur lewat DNS + reverse proxy Nginx.

---

## 4. Database — PostgreSQL

### Prinsip Penyimpanan
| Jenis data | Disimpan di |
|---|---|
| Teks/metadata (judul, isi artikel, nama, tanggal, status) | PostgreSQL |
| File besar (gambar, PDF hasil generate) | Storage (Local VPS / Cloudflare R2 / S3) |
| Link/path ke file | PostgreSQL (kolom `*_url` atau `*_path`) |

### Backup & Rollback
| Fungsi | Tools |
|---|---|
| Cache | Redis (terpisah dari Postgres) |
| Backup terjadwal | `pg_dump` via cron di VPS → upload ke cloud storage (Cloudflare R2/S3), **bukan** VPS kedua |
| Rollback struktur tabel | `php artisan migrate:rollback` |
| Rollback data ke backup lama | `pg_restore` dari file backup |
| Tools lihat/edit manual (developer only) | pgAdmin atau Adminer (bukan phpMyAdmin — itu khusus MySQL) |

### Rekomendasi Skala
- **Tahap awal:** Postgres gabung 1 VPS bersama Laravel — hemat, cukup untuk development-menengah.
- **Tahap scale-up:** pisah Postgres ke VPS kedua atau managed DB (Supabase/Neon) kalau traffic besar atau butuh isolasi resource/high-availability.

---

## 5. Sistem Jasa: Generator Undangan / CV / Gambar

### Kategori 1 — Halaman Web Interaktif (Undangan Online, Portfolio)
Hasil akhir berupa **halaman web** (`domain.com/undangan/ade-devi-27sep26`), bukan file download.

```
User isi form (Next.js) → submit → POST /api/undangan (Laravel)
   → Laravel generate slug otomatis (misal "ade-devi-27sep26", + suffix acak kalau slug bentrok)
   → Simpan data (nama, tanggal, foto path, pilihan template) ke Postgres
   → Balikin slug ke user

User/tamu buka domain.com/undangan/ade-devi-27sep26
   → Next.js dynamic route [slug]/page.tsx
   → GET /api/undangan/ade-devi-27sep26 → Laravel query Postgres → balik JSON
   → Next.js render pakai KOMPONEN REACT sesuai template dipilih
```
- **Desain/layout render = Next.js** (React component, CSS, animasi bebas).
- Laravel hanya menyimpan & mengirim data mentah.
- Beberapa pilihan desain = beberapa komponen React (`TemplateElegant.tsx`, `TemplateMinimalis.tsx`, dst), dipilih berdasarkan field `template` di data.

### Kategori 2 — File Hasil Generate (CV PDF, Undangan Cetak, Logo)
Hasil akhir berupa **file** yang didownload/dicetak.

```
User isi form (Next.js) → submit → POST /api/generator/cv (Laravel)
   → Laravel masukkan job ke Redis Queue, langsung balas {status: "processing", job_id}
   → Queue Worker proses: isi template (Blade/HTML) dengan data user → generate PDF/gambar
   → Simpan file hasil ke Storage
   → Simpan path file ke Postgres (tabel generator_hasil, terhubung ke user)
   → Next.js polling/cek status → tampilkan link download saat "done"
```

| Jenis output | Library Laravel |
|---|---|
| PDF (CV, undangan cetak) | DomPDF, Snappy (wkhtmltopdf), atau Browsershot (headless Chrome, hasil lebih presisi) |
| Gambar/logo (PNG, JPG) | Intervention Image, atau Imagick |
| Vektor (SVG) | Template SVG + inject data, atau convert dari HTML via Browsershot |

**Template desain (kosong, reusable) disimpan di Laravel** (folder templates), bukan di Postgres. Postgres hanya menyimpan data isian user dan path hasil generate.

---

## 6. Emulator Circuit Elektronika (Modul Edukasi)

> Fitur ini murni edukasi (belajar konsep elektronika dasar) — **bukan** generator PCB/layout untuk fabrikasi fisik.

### Arsitektur
- **100% berjalan client-side di Next.js/browser.** Simulasi harus real-time (respon instan saat user sambung kabel/drag komponen), sehingga tidak bisa round-trip ke server Laravel tiap perubahan kecil.
- Laravel/Postgres hanya berperan menyimpan/memuat progres user (simpan rangkaian yang sedang dibuat, riwayat, dll) — **bukan** memproses simulasinya.
- Engine perhitungan: algoritma **Modified Nodal Analysis (MNA)** — menghitung tegangan/arus tiap titik rangkaian, dijalankan berulang (30-60x/detik) untuk efek real-time. Bisa adaptasi dari library open-source (mis. turunan CircuitJS2) daripada membangun dari nol.
- Rendering: Canvas 2D untuk animasi standar; Web Worker untuk menjalankan kalkulasi MNA di thread terpisah supaya UI tetap responsif.

### Pengaturan yang Independen
1. **Orientasi:** Portrait / Landscape — auto-adaptasi sesuai device, bisa override manual.
2. **Komponen (4 tingkat):**

| Tingkat | Target | Datasheet | Edit Nilai | Kelengkapan Tipe |
|---|---|---|---|---|
| Dasar | Orang awam | Tidak ada | Terbatas | Komponen dasar saja |
| Standar | Sekolah | Tidak ada | Bisa ubah | Lengkap, tanpa sub-tipe |
| Praktis | Mahasiswa/pekerja magang | Ada, tapi terkunci (tidak bisa dibuka/edit) | Tidak bisa | Hampir lengkap dengan tipe |
| Kompleks | Profesional | Ada, bisa dibuka | Bisa edit spek & nilai | Lengkap + semua tipe |

3. **Grafis (3 level — menentukan SEMUA aspek: animasi, indikator, saran, background, bukan cuma kualitas render):**

| | Low | Medium | High |
|---|---|---|---|
| Animasi arus | Dasar | Ada | Dari kedua titik (lebih detail) |
| Indikator jalan/tidak jalan | ✅ | — | ✅ |
| Status skema (Normal/Tidak valid) | ✅ | — | ✅ |
| Lokasi jalur short ditunjukkan | ❌ | ❌ | ✅ |
| Lokasi jalur arus off ditunjukkan | ❌ | ❌ | ✅ |
| Tanda api di komponen rusak | — | — | ✅ |
| Refresh/pasang ulang komponen rusak | — | ✅ (tanpa tahu lokasi) | ✅ (dengan lokasi) |
| Saran perbaikan (turunkan nilai, polaritas terbalik, ganti komponen) | ❌ | ❌ | ✅ |
| Template background | Hitam putih | RGB + Hitam putih | Bebas, 10 template |

### Editor
- **Schematic by User** — papan/canvas kosong, user bebas drag komponen dari toolbox (sesuai tingkat komponen yang diakses) dan menyambung jalur sendiri. Bukan dari template siap pakai.

### Pemetaan Akses per Tier Langganan
| Tier | Komponen | Grafis |
|---|---|---|
| **Free** | Dasar, Standar | Low, Medium |
| **Plus** | Dasar, Standar, Praktis | Low, Medium |
| **Pro** | Dasar, Standar, Praktis, Kompleks | Low, Medium, High |

*(Harga tiap tier belum ditentukan — hanya beda fitur A/B/C.)*

---

## 7. Ringkasan Peran Tiap Komponen (Cheat Sheet)

| Komponen | Peran |
|---|---|
| **Next.js** | Etalase — tampilan, interaksi user, SSR/SSG. Untuk Emulator Circuit: juga tempat simulasi berjalan (client-side). |
| **Laravel + Octane** | Kurir + otak proses — terima request, validasi, generator (PDF/gambar), koneksi ke Postgres, endpoint API. Octane (Swoole) dipakai sejak awal untuk throughput/latency tinggi. |
| **Filament (Admin)** | Panel kontrol total isi web (artikel, user, order) — satu paket dengan Laravel, di VPS yang sama. |
| **PostgreSQL** | Gudang data permanen — teks, metadata, path file. Bukan tempat menyimpan file besar. |
| **Redis + Queue Worker** | Penanganan proses berat di background (generator) supaya server tidak overload. |
| **Storage (Local/R2/S3)** | Tempat file besar (gambar, PDF hasil generate). |
| **Vercel** | Hosting Next.js. |
| **VPS** | Hosting Laravel + Filament + Postgres + Redis (satu paket). |

---

*Dokumen ini merangkum hasil diskusi arsitektur Madevi — struktur folder, endpoint, dan skema tabel detail perlu dikembangkan lebih lanjut sesuai kebutuhan implementasi masing-masing modul.*
