# Audit CATALOG-VISIBILITY-001 — Pemulihan visibilitas katalog/menu

- **Item:** CATALOG-VISIBILITY-001
- **Tanggal:** 2026-09-28
- **Auditor:** Agent 3 (Audit)
- **Metode:** Inspeksi source dan parser TypeScript/TSX statis saja
- **Hasil:** **PASS secara statis** untuk perubahan yang dibatasi di bawah
- **Runtime:** **BELUM-DIVERIFIKASI** — browser/emulator, server, request API,
  auth, storage/database, migration, test runner, lint, build, dan full
  typecheck tidak dijalankan.

## Batas audit dan sumber

Audit hanya mencakup:

- `/sdcard/project/Madevi/Madevi_Off/src/components/sidebar.tsx`
- `/sdcard/project/Madevi/Madevi_Off/src/components/jasa/invitation-gallery.tsx`
- `/sdcard/project/Madevi/Madevi_Off/src/content/runtime-menu.ts`
- `/sdcard/project/Madevi/Madevi_Off/src/content/service-catalog.ts`
- `/sdcard/project/Madevi/Madevi_Off/src/services/runtime-content.ts`
- `/sdcard/project/Madevi/Madevi_Off/src/app/api/v1/runtime-menu/route.ts`
- `/sdcard/project/Madevi/Madevi_Off/src/app/api/v1/jasa/undangan/route.ts`

Kedua file TSX target berhasil diproses parser TypeScript lokal
(`TS_PARSE_OK`). Tidak ada file source, control, QA lain, guardrail, atau
checkpoint yang diubah oleh audit ini.

## Temuan acceptance

- [x] **Core menu tetap dipertahankan saat runtime mengembalikan array kosong.**
  `sidebar.tsx:98-103` membedakan response sukses berbentuk array dari failure;
  array kosong tidak dianggap error API. Setelah filter, state kosong diarahkan
  ke `runtimeExtensions = null` dan consumer memilih
  `runtimeExtensions ?? RUNTIME_MENU_NODES` (`sidebar.tsx:115-119, 266`).
  `WebsiteMenuItems` selalu merender `MADEVI_SPACES` (`:489-524`), sehingga
  menu inti tidak hilang. Status yang tampil adalah mode lokal/core tersedia,
  bukan klaim package terbit (`:578-581`).

- [x] **Runtime extensions valid yang non-empty tetap dipakai.**
  Response yang sukses dan memiliki setidaknya satu entry valid menyimpan hasil
  filter sebagai `runtimeExtensions` serta menandainya `synced`
  (`sidebar.tsx:104-119`). Validasi mensyaratkan object, id/label/href string,
  kind yang diizinkan, status `ACTIVE`, dan `sortOrder` safe integer. Dalam
  kondisi ini fallback `RUNTIME_MENU_NODES` tidak dipilih; extension aktif
  dirender sebagai subnode dengan href nyata (`:467-476, 525-556`).

- [x] **Failure API/storage tetap jujur dan fail-closed.**
  Response non-OK, shape extension bukan array, `storageUnavailable: true`,
  dan exception fetch mengosongkan runtime extension serta memilih status
  `offline` (`sidebar.tsx:96-103, 120-123`). Fallback yang tersisa hanya
  proyeksi menu lokal dan tidak menjadi bukti status database/package; kontrak
  `runtime-menu.ts:21-24` menyatakan batas ini secara eksplisit. Route runtime
  juga mengembalikan `storageUnavailable: true` pada exception
  (`runtime-menu/route.ts`).

- [x] **Production API data tetap diprioritaskan pada galeri undangan.**
  `InvitationGallery` memakai `json.data` bila response sukses dan array
  tersebut non-empty (`invitation-gallery.tsx:52-56`). Contoh lokal hanya
  dipilih saat API sukses mengembalikan array kosong; exception, non-OK, atau
  shape yang salah tetap menghasilkan state kosong dan pesan katalog tidak
  dapat dimuat (`:54, 57-60, 87-95`). Route sumber katalog memanggil service
  template terbit (`api/v1/jasa/undangan/route.ts`), bukan katalog contoh.

- [x] **Contoh lokal jelas preview-only dan tidak dapat dipesan.**
  `EXAMPLE_TEMPLATES` diberi `isExample: true` (`invitation-gallery.tsx:27-38`)
  dan banner menyatakan contoh lokal hanya untuk pratinjau, belum dapat
  dipesan, serta template terbit baru muncul setelah persetujuan Owner
  (`:125-133`). Tombol preview dan tombol pilih/pesan hanya dibuat untuk
  `!t.isExample` (`:178-189`), sehingga contoh tidak membuka
  `InvitationOrderForm`.

- [x] **Contoh tidak mengklaim PUBLISHED atau harga produksi.**
  Harga contoh tidak diformat sebagai harga produksi; kartu menampilkan
  `Contoh lokal`/`Local example` saat `isExample` (`:174-176`). Copy katalog
  membedakan layout sample dari hasil final (`:135-141`), sementara komentar
  `service-catalog.ts:15-21` menetapkan array tersebut sebagai kontrak desain
  statis, bukan availability/status database, dan harga produksi hanya dari
  registry Admin via API. Walau data source static memiliki field internal
  `status: 'PUBLISHED'`, field itu tidak dirender sebagai status terbit pada
  contoh dan tidak mengaktifkan order.

- [x] **Tidak ada perubahan di luar scope yang diaudit.**
  Inspeksi dibatasi pada fallback sidebar dan contoh lokal galeri. Tidak ada
  perubahan Emulator/solver/API/auth/database migration yang diaudit atau
  dilakukan sebagai bagian dari pekerjaan ini.

## Catatan risiko statis

Validasi client pada sidebar menyaring entry runtime yang invalid; bila tidak
ada entry valid, UI kembali ke proyeksi lokal dan mode offline. Audit ini tidak
memverifikasi payload aktual, urutan hasil, atau perilaku jaringan.

Pada galeri, API success dengan array non-empty dianggap sebagai data produksi
oleh komponen; kontrak route/service menjadi sumber jaminan bahwa data tersebut
adalah template terbit. Validasi runtime/API dan database tidak dilakukan dalam
audit ini.

## Batas verifikasi

Tidak ada emulator, browser, server, request API, auth, database, migration,
test runner, lint, build, atau full typecheck yang dijalankan. Status untuk
seluruh verifikasi tersebut tetap **BELUM-DIVERIFIKASI**; audit ini hanya
menyatakan hasil inspeksi source dan parser statis atas acceptance di atas.
