# RENCANA REDESIGN TOTAL MADEVI
Tanggal: 13 Oktober 2026
Status: DRAFT → EKSEKUSI

## 1. HASIL AUDIT DESAIN

### Utang Desain yang Ditemukan
| Masalah | Bukti |
|---------|-------|
| CSS terfragmentasi | 20.377 baris di 7 file (redesign.css 10.843, interface-refresh.css 4.861, madevi-on.css 2.784, dll) |
| Token tidak dipakai | 39 warna hex hardcoded di komponen, hanya 13 pemakaian `var(--)` |
| Konflik aturan | File-file CSS menimpa satu sama lain tanpa hierarki jelas |
| Inkonsistensi visual | Tiap ruang terasa seperti web berbeda |
| Animasi minim/tidak terarah | Tidak ada sistem motion yang kohesif |

### Yang Sudah Bagus (dipertahankan)
- Sistem token di `tokens.css` sudah terstruktur baik (primitive → semantic → component)
- 3 tema sudah ada: light, dark, madevi-on
- Type ramp dengan clamp() sudah responsif
- Z-index scale dan touch target sudah didefinisikan

## 2. VISI DESAIN

**"Premium workspace, bukan website biasa."**

Madevi harus terasa seperti alat kerja profesional (Linear, Notion, Raycast) — bukan seperti template blog atau dashboard admin generik.

### Prinsip
1. **Konsistensi total** — 7 ruang terasa satu produk, bukan 7 web berbeda
2. **Tema = identitas** — tiap tema punya kepribadian visual yang jelas, bukan sekadar invert warna
3. **Konten adalah raja** — chrome UI mundur, konten maju
4. **Gerak bermakna** — animasi hanya untuk feedback dan orientasi, tidak pernah menyela
5. **Tanpa AI slop** — tidak ada gradient ungu-biru generik, tidak ada glow berlebihan, tidak ada card putih membosankan bertumpuk

## 3. SISTEM TEMA (3 KEPRIBADIAN)

### Light — "Kertas Kerja Premium"
- **Suasana**: Editorial, bersih, seperti kertas berkualitas dengan tinta tajam
- **Background**: warm paper `#FAFAF8` → surface `#FFFFFF`
- **Aksen**: teal dalam `#0D9488` (otoritas, bukan dekorasi)
- **Teks**: near-black `#1A1A18` dengan hierarki jelas
- **Border**: hairline halus, nyaris tak terlihat `#E8E8E4`
- **Shadow**: sangat subtle, hanya untuk elevasi nyata
- **Karakter**: tenang, fokus, profesional

### Dark — "Ruang Kerja Malam" (default)
- **Suasana**: Premium dev-tool, seperti Linear/Vercel — dalam tapi tidak hitam pekat
- **Background**: charcoal `#0A0C0B` → surface `#121514`
- **Aksen**: teal terang `#5EEAD4` (bercahaya lembut di gelap)
- **Teks**: off-white `#E8E8E6`
- **Border**: `rgba(255,255,255,0.08)` — garis cahaya halus
- **Shadow**: dalam, memberi rasa lapisan
- **Karakter**: fokus, modern, canggih

### Madevi On — "Identitas Brand"
- **Suasana**: Berani, energik, khas — ungu magenta sebagai signature
- **Background**: deep purple-black `#0D0714` → surface `#1A0F24`
- **Aksen**: gradient ungu→magenta `#8B5CF6` → `#EC4899` (satu-satunya tema yang boleh pakai gradient)
- **Teks**: warm white `#F5F0FA`
- **Elemen khas**: glow halus pada aksen, pola subtle, lebih ekspresif
- **Karakter**: berani, kreatif, memorable — opt-in, hanya saat user mengaktifkan

## 4. TIPOGRAFI

### Hierarki
- **Display**: untuk hero/landing — besar, tight, berani (-0.07em tracking)
- **H1**: judul halaman — jelas, tidak berteriak
- **H2/H3**: judul section — struktur konten
- **Body**: 1rem/1.65 — nyaman dibaca panjang
- **Caption/Micro**: metadata, label — uppercase micro untuk kategori

### Aturan
- Maksimal 2 ukuran heading per halaman
- Body text tidak pernah lebih kecil dari 0.875rem
- Line-length optimal: 60-75 karakter untuk artikel

## 5. SISTEM WARNA SEMANTIK

Setiap warna punya **pekerjaan**:
- **Teal** (aksen): aksi primer, link, fokus — SATU aksen per tema
- **Blue**: informasi, navigasi
- **Amber**: peringatan, data penting
- **Red**: bahaya, destruktif, error — hemat pemakaian
- **Green**: sukses, konfirmasi
- **Purple**: HANYA di Madevi On (identitas brand)

**Larangan**: tidak ada warna dekoratif tanpa fungsi. Tidak ada gradient kecuali Madevi On.

## 6. LAYOUT & PENATAAN

### Grid System
- **Container**: max 1280px, padding responsif (16px mobile → 32px desktop)
- **Content**: max 72rem untuk readability
- **Section spacing**: clamp(2rem, 5vw, 4rem) — napas yang konsisten
- **Card grid**: auto-fill minmax(280px, 1fr) — adaptif tanpa breakpoint manual

### Hierarki Halaman (pola konsisten)
1. **Header ruang**: judul + deskripsi singkat (maksimal 2 baris)
2. **Aksi primer**: search/filter di satu baris toolbar
3. **Konten**: grid atau list dengan ritme konsisten
4. **Empty/error/loading**: state yang dirancang, bukan afterthought

### Sidebar
- Navigasi 7 ruang dengan ikon + label + deskripsi singkat
- Active state yang jelas (bukan sekadar bold)
- Collapse di mobile menjadi drawer
- Tidak transparan, solid, sesuai permintaan

### Header
- Logo + search + theme switcher + menu
- Sticky dengan blur backdrop yang subtle
- Tinggi konsisten 64px

## 7. SISTEM KOMPONEN

### Button
- **Primer**: aksen tema, pill atau rounded-lg, hover lift subtle
- **Sekunder**: surface dengan border, hover border-aksen
- **Ghost**: transparan, untuk aksi tersier
- **Destruktif**: merah, hanya untuk aksi berbahaya
- Semua: min-height 44px, transisi 150ms, focus ring jelas

### Card
- **Default**: surface dengan border hairline, radius 16px
- **Hover**: lift 2px + shadow-md (hanya untuk card yang bisa diklik)
- **Interaktif vs statis**: dibedakan secara visual
- Padding konsisten 24px

### Input & Form
- Height 44px+, border yang jelas, focus ring aksen
- Label di atas, tidak placeholder-only
- Error state dengan pesan yang membantu, bukan sekadar merah

### Badge & Tag
- Pill kecil, warna semantik, tidak berteriak
- Status: draft (muted), published (green), archived (gray)

### Tabs
- Underline indicator yang beranimasi, bukan background pill yang berat
- Atau segmented control untuk pilihan 2-4 opsi

### Navigation & Breadcrumb
- Satu breadcrumb otomatis per halaman (sudah diperbaiki)
- Sidebar active state dengan indicator bar

### Loading & Skeleton
- Skeleton pulse yang halus, bukan spinner berputar di tengah halaman kosong
- Layout skeleton meniru layout konten nyata

### Empty & Error State
- Ilustrasi minimal (bukan emoji besar)
- Judul + penjelasan + aksi yang bisa dilakukan
- Error: "coba lagi" yang berfungsi, bukan dead-end

## 8. SISTEM ANIMASI

### Prinsip (sesuai mandat: tidak ada yang muncul tiba-tiba)
- **Feedback**: hover, active, focus — 120-150ms, ease-out
- **Orientasi**: page transition halus, 200-300ms
- **Perhatian**: hanya untuk yang user minta (loading, success)
- **LARANGAN**: tidak ada modal/popup otomatis, tidak ada animasi menyela, tidak ada autoplay

### Per Tema
- **Light/Dark**: minimal, cepat, profesional (150-300ms)
- **Madevi On**: boleh lebih ekspresif (stagger, glow pulse) tapi tetap tidak menyela

### Aksesibilitas
- `prefers-reduced-motion`: matikan semua animasi non-esensial
- Tidak ada animasi yang memicu vestibular disorder

## 9. REDESIGN PER RUANG

### Beranda (/)
- Hero yang berani tapi bersih — satu pesan jelas
- 7 ruang sebagai kartu navigasi yang setara
- Tidak ada dinding teks

### 1. Explore & Learn
- Browser kategori seperti file explorer modern
- Breadcrumb trail yang jelas
- Kartu artikel dengan metadata (waktu baca, level)
- Reader artikel: tipografi editorial, TOC sticky

### 2. Tutorial & Problem Solve
- Format masalah→solusi yang scannable
- Step-by-step dengan nomor yang jelas
- Kartu "tingkat kesulitan" dan "waktu"
- Print-friendly

### 3. Madevi School
- Terasa seperti sekolah: dashboard jenjang yang jelas
- Kartu kelas dengan progress
- Materi terstruktur: bab → materi → latihan → ujian

### 4. Madevi Line (Sosial)
- Feed seperti sosmed modern tapi bersih
- Composer yang prominent
- Threading komentar yang jelas
- Moderation badge yang tidak mengganggu

### 5. Madevi Services (Jasa)
- Katalog jasa seperti marketplace premium
- Kartu paket dengan harga jelas
- Tab yang tidak berat (underline indicator)
- CTA yang jelas per jasa

### 6. Madevi Shop
- Katalog produk affiliate yang jujur
- Disclosure afiliasi yang elegan, bukan banner kuning
- Wishlist seperti keranjang modern
- Foto produk yang konsisten

### 7. Tools & Equipment
- Kalkulator dengan input yang besar dan jelas
- Hasil yang prominent
- Riwayat perhitungan
- Emulator sirkuit: canvas yang bersih, komponen yang jelas

## 10. TAHAP EKSEKUSI

### Fase 1: Fondasi (Desain System)
- [ ] Audit dan konsolidasi 7 file CSS → 1 sistem kohesif
- [ ] Perbaiki 39 hardcoded colors → token tema
- [ ] Definisikan ulang 3 tema dengan kepribadian jelas
- [ ] Standarkan spacing, radius, shadow per tema

### Fase 2: Komponen Inti
- [ ] Button (4 varian)
- [ ] Card (3 varian: default, interaktif, statis)
- [ ] Input & form elements
- [ ] Badge, tag, status
- [ ] Tabs & navigation
- [ ] Loading, skeleton, empty, error states
- [ ] Sidebar & header

### Fase 3: Per Ruang (7 ruang + beranda)
- [ ] Beranda
- [ ] Explore & Learn
- [ ] Tutorial & Problem Solve
- [ ] Madevi School
- [ ] Madevi Line
- [ ] Madevi Services
- [ ] Madevi Shop
- [ ] Tools & Equipment

### Fase 4: Animasi & Polish
- [ ] Sistem motion per tema
- [ ] Page transitions
- [ ] Micro-interactions
- [ ] prefers-reduced-motion audit

### Fase 5: QA Visual
- [ ] Screenshot 7 ruang × 3 tema (21 screenshot)
- [ ] Responsive check (mobile 360px, tablet 768px, desktop 1280px)
- [ ] Kontras warna WCAG AA
- [ ] Typecheck + build

## 11. KRITERIA SELESAI

1. Tidak ada warna hardcoded di komponen (semua pakai token)
2. 7 file CSS terkonsolidasi menjadi sistem yang kohesif
3. 3 tema punya kepribadian visual yang berbeda dan jelas
4. Semua 7 ruang + beranda lolos screenshot review
5. Tidak ada "AI slop" (gradient generik, glow berlebihan, card monoton)
6. Animasi tidak ada yang menyela atau otomatis
7. Responsive di 3 breakpoint
8. Build sukses, typecheck lolos

## 12. ESTIMASI

- Fase 1 (Fondasi): 1 sesi kerja
- Fase 2 (Komponen): 1-2 sesi kerja
- Fase 3 (Per ruang): 3-4 sesi kerja
- Fase 4 (Animasi): 1 sesi kerja
- Fase 5 (QA): 1 sesi kerja

Total: ~7-9 sesi kerja intensif, dikerjakan paralel dengan subagent.
