# EXPLORE-PORT-001 — Port Explore & Learn design system mdv2 dari zip

**Status:** PASS (typecheck + runtime browser + interaksi)
**Tanggal:** 2026-10-13
**Pemegang lock:** Operator otonom (mandat Owner, KOREKSI-01: port dari zip)

## Ringkasan

Ruang Explore & Learn di live memakai sistem `explore-foundation__*` lama.
Versi zip memakai **design system mdv2** yang lebih kaya: category cards dengan
ikon folder + chevron, skeleton loading grid, filter search, dan load-more
dengan komponen `Button` UI terpusat. Zip menang untuk ruang ini.

## File yang di-port

- `src/components/explore-foundation.tsx` (dasar zip, 563 baris)
- `src/styles/home-explore-redesign.css` (byte-identik; berisi `.mdv2-cat-card`,
  `.mdv2-skeleton`, `.mdv2-load-more`, `.mdv2-search`, dll)
- `src/app/layout.tsx` — tambah import `home-explore-redesign.css`

## Merge retention live

- `BreadcrumbBar` (live) dipertahankan: import + blok render di awal `mdv2-page`.
- `src/components/ui/button.tsx` — SAMA di zip & live, tidak perlu port.

## Fitur zip baru yang sekarang live

1. **Category cards** `.mdv2-cat-card`: ikon Folder + nama + countLabel
   ("N subkategori" / "N artikel", pluralisasi EN benar) + chevron.
2. **SkeletonGrid** `role="status" aria-label="Memuat"` — 6 placeholder
   saat data kategori dimuat (sebelumnya tidak ada loading state).
3. **Filter search** `.mdv2-search` dengan ikon & sr-only label — menyaring
   kategori real-time.
4. **Load-more** `.mdv2-load-more` `aria-live="polite"` dengan Button UI:
   state loading (disabled + "Memuat…"), state error (`role="alert"`).
5. Ikon inline: ChevronIcon, FolderIcon, SearchIcon, EmptyIcon, AlertIcon.
6. Navigasi level: URL sync via useSearchParams, satu tingkat dalam satu waktu.

## Bukti verifikasi

### 1. Typecheck
`tsc --noEmit` → **EXIT=0** (0 error)

### 2. Browser nyata (`/ruang/jelajahi-pengetahuan`)

Load awal:
- `h1`: "Explore & Learn" ✓
- Breadcrumb: "Beranda / Explore & Learn" ✓
- `skeleton: 6` → loading state tampil ✓
- Setelah load: `catCards: 3` ✓
  - "Sains Alam — 1 subkategori"
  - "Teknologi Digital — 1 subkategori"
  - "Bahasa Komunikasi — 1 subkategori"

Interaksi klik card:
- Klik "Sains Alam" → breadcrumb konteks "Kategori / Sains Alam" ✓
- Section "Jalur kategori" + penjelasan "Cara kerja katalog" ✓
- Navigasi satu tingkat, tidak kehilangan konteks ✓

Interaksi filter search:
- Input "teknologi" di level root → `catCards: 1` ("Teknologi Digital") ✓
- Kategori lain disembunyikan real-time ✓

## Catatan
- Slug ruang: `/ruang/jelajahi-pengetahuan` (bukan `explore-learn`).
- Data kategori 3 node berasal dari taxonomy DB nyata — tidak mengarang.
- `/ruang/explore-learn` mengembalikan 404 karena memang bukan slug resmi;
  `resolveSpaceSlug` yang menangani pemetaan legacy.

## INSTRUKSI-02 (2026-10-13): verifikasi runtime di atas adalah arsip
Bukti browser di atas diambil SEBELUM INSTRUKSI-02 diterima (server dev
sementara dijalankan untuk verifikasi). Mulai INSTRUKSI-02, runtime adalah
tugas Muse: server dimatikan permanen, verifikasi hanya statis/unit-level
(tsc + vitest + baca kode). Bukti runtime selanjutnya TIDAK dikumpulkan.
