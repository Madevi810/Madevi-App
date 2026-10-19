# Rencana Induk: Explore & Learn (19 Okt 2026)

## Taxonomy & Hierarki
6 level tetap: R(ruang) → D(domain) → K(kategori) → M(materi) → T(topik) → J(judul/artikel)

### 10 Kategori (lantai Bagian 10)
1. **Sains** → Fisika, Kimia, Biologi → tiap ≥5 artikel
2. **Matematika** → Aritmetika, Aljabar, Geometri → tiap ≥5 artikel
3. **Teknologi** → Komputer, Internet, Gadget → tiap ≥5 artikel
4. **Kesehatan** → Tubuh, Nutrisi, Mental → tiap ≥5 artikel
5. **Keuangan** → Menabung, Investasi, Pajak → tiap ≥5 artikel
6. **Bahasa** → Indonesia, Inggris, Menulis → tiap ≥5 artikel
7. **Sejarah** → Indonesia, Dunia, Budaya → tiap ≥5 artikel
8. **Lingkungan** → Alam, Iklim, Sampah → tiap ≥5 artikel
9. **Keterampilan** → Memasak, Berkebun, Kerajinan → tiap ≥5 artikel
10. **Agama & Etika** → Islam, Umum, Karakter → tiap ≥5 artikel

Total: 10 kategori × 3 subkategori × 5 artikel = **150 artikel** (lantai: 10×3×5=150)

## Daftar Item & Target
| Item | Target | Status |
|---|---|---|
| Artikel utuh | 150 | 0 (semua DRAFT, tidak publik) |
| Kategori | 10 | 6 (fallback) |
| Ilustrasi SVG | 30 | 0 |

## UX
- Alur: Landing → Kategori → Subkategori → Daftar artikel → Baca artikel
- Breadcrumb di tiap level. Pencarian global di header.
- Mode baca: ringkas/mendalam (toggle).

## Fitur & Kriteria Terukur
### F-E1: Browser kategori
- **Data**: taxonomy_nodes (Supabase)
- **API**: GET /api/v1/taxonomy
- **Route**: /explore, /explore/[kategori], /explore/[kategori]/[sub]
- **Komponen**: explore-foundation.tsx (reuse)
- **Kriteria**: 10 kategori tampil; klik kategori → subkategori tampil; 0 halaman kosong.

### F-E2: Halaman artikel
- **Data**: articles (status PUBLISHED)
- **API**: GET /api/v1/articles/[slug]
- **Route**: /explore/[kategori]/[sub]/[slug]
- **Kriteria**: Artikel tampil penuh; breadcrumb benar; kontrol font/TTS/mode baca (v15); tombol "membantu" tersimpan.

### F-E3: Kuis singkat per artikel
- **Data**: quiz_questions (tabel baru)
- **Kriteria**: 3 soal per artikel; nilai tersimpan; pembahasan tampil.

### F-E4: Streak harian
- **Data**: user_streaks (tabel baru)
- **Kriteria**: Baca 1 artikel → streak +1; tampil di profil.

## Urutan & Dependensi
1. F-E1 (browser) → 2. F-E2 (artikel) → 3. F-E3 (kuis) → 4. F-E4 (streak)
5. Seed 150 artikel (idempotent) — paralel dengan 1-2, blocking untuk uji F-E2.

## Simulasi
Tidak ada (Explore murni konten).

## Test
- Content floor check: 10 kategori, tiap ≥3 sub, tiap sub ≥5 artikel PUBLISHED.
- Vitest: taxonomy-verify, artikel validation.
- Audit: buka tiap kategori sebagai pengguna; baca 1 artikel penuh.
