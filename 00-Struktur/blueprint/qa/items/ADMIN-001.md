# ADMIN-001 — Audit Dashboard Admin

## Scope dan dependency

- **Tujuan pengguna:** Admin dapat membuka setiap halaman di `/owner/*`, melihat state
  loading/empty/error yang jelas, menggunakan tabel di layar sempit, dan menjalankan
  aksi berbahaya hanya setelah konfirmasi eksplisit.
- **Batas perubahan:** Hanya file source di `Madevi_Off/src/app/owner/` dan
  `Madevi_Off/src/components/owner-*.tsx`. Tidak menyentuh auth, session, API route,
  migration, atau CSS token global.
- **Dependency / blueprint terkait:** PROFILE-001 (PASS), `blueprint/GUARDRAIL.md`,
  `blueprint/api/KONTRAK-API-LOKAL.md`.
- **File/kontrak diperkirakan:**
  - `src/app/owner/sosial/page.tsx`
  - `src/app/owner/ujian/page.tsx`
  - `src/app/owner/jalur/page.tsx`
  - `src/app/owner/order/page.tsx`
  - `src/components/owner-moderation-panel.tsx`
  - `src/components/owner-shell.tsx`

## Temuan audit statis (pre-implementasi)

| # | File | Temuan | Tingkat |
|---|---|---|---|
| F-01 | `owner-sosial/page.tsx` | Tidak ada state loading; tidak ada state error — tabel kosong saat gagal tanpa pesan | medium |
| F-02 | `owner-ujian/page.tsx` | Tidak ada state loading; tidak ada state error | medium |
| F-03 | `owner-jalur/page.tsx` | Tidak ada state loading; tidak ada state error | medium |
| F-04 | `owner-sosial`, `owner-ujian`, `owner-jalur` | Tabel tidak dibungkus `.owner-table-wrap` → tidak scrollable di layar sempit | medium |
| F-05 | `owner-sosial`, `owner-ujian`, `owner-jalur` | Root element `<div className="owner-panel">` bukan `<main id="main-content">` — landmark ARIA/skip-to-content tidak konsisten | minor |
| F-06 | `owner-shell.tsx` menu | Group "Ringkasan" dan group "Sistem" sama-sama menyertakan tautan `/owner/operasi` — duplikat tanpa diferensiasi | minor |
| F-07 | `owner-order/page.tsx` | Endpoint `/api/v1/owner/inbox` dipakai untuk halaman Order/Grant — data tidak relevan; endpoint khusus ada di `/api/v1/owner/jasa/orders` | medium |
| F-08 | `owner-moderation-panel.tsx` | Aksi `decide()` POST langsung setelah validasi karakter — tidak ada konfirmasi eksplisit untuk sanction berat (MUTE_30D/PERMANENT_BLOCK) | high |

## Acceptance criteria wajib

- [ ] AC-01 — Setiap halaman Admin menampilkan state loading yang jelas ("Memuat…") sejak fetch dimulai hingga selesai.
- [ ] AC-02 — Setiap halaman Admin menampilkan pesan error yang menjelaskan kegagalan dan menawarkan tombol coba ulang.
- [ ] AC-03 — State kosong (empty) menampilkan pesan deskriptif, bukan tabel kosong diam.
- [ ] AC-04 — Semua tabel Admin dibungkus elemen dengan overflow-x scroll agar dapat digunakan di layar sempit.
- [ ] AC-05 — Setiap halaman Admin memiliki `<main id="main-content">` sebagai landmark utama.
- [ ] AC-06 — Aksi dengan sanction berat (MUTE_30D / PERMANENT_BLOCK) memerlukan konfirmasi teks eksplisit sebelum POST dikirim.
- [ ] AC-07 — Halaman Order/Grant menggunakan endpoint yang relevan (`/api/v1/owner/jasa/orders`), bukan inbox.
- [ ] AC-08 — Tidak ada route atau tautan yang diduplikasi tanpa diferensiasi di menu shell Admin.

## Acceptance criteria terukur

| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | 6 halaman owner | Inspeksi statis: cek state loading, error, dan empty di setiap page | 0 halaman tanpa ketiga state | belum |
| M-02 | 3 tabel baru | Inspeksi statis: cek wrapper `.owner-table-wrap` | 0 tabel tanpa wrapper | belum |
| M-03 | 1 aksi berbahaya | Inspeksi statis: cek konfirmasi eksplisit PERMANENT_BLOCK/MUTE_30D | 0 aksi tanpa konfirmasi | belum |
| M-04 | 1 menu duplikat | Inspeksi statis: cek OWNER_MENU di owner-shell | 0 duplikat | belum |

## Verifikasi yang diizinkan

- **Statis:** parser TypeScript transpile (node --input-type=module), balance brace, inspeksi
  manual tiap acceptance criteria.
- **Runtime (jika Owner mengizinkan):** buka browser lokal, buka setiap halaman `/owner/*`,
  verifikasi state loading/empty/error, responsive di layar ≤375 px, dan konfirmasi moderasi.
- **Yang sengaja tidak dijalankan:** npm run dev, npm test, lint, proses background, request API
  live — sesuai arahan Owner yang masih berlaku.

## Risiko dan rollback

- **Risiko:** perubahan `owner-shell.tsx` (menu) dapat memengaruhi deep link yang disimpan
  pengguna jika tautan dihapus; mitigasi: tautan yang ada tetap dipertahankan, hanya label
  atau section yang diklarifikasi.
- **Compatibility/migration:** tidak ada schema atau API change; hanya perubahan UI/state.
- **Recovery:** semua perubahan UI; revert per-file aman tanpa migrasi.
