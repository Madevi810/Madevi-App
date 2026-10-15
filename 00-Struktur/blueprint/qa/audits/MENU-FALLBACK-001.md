# Audit MENU-FALLBACK-001 — Pemulihan menu lokal saat extension runtime kosong

- **Item:** MENU-FALLBACK-001
- **Tanggal:** 2026-09-28
- **Auditor:** Agent 3 (Audit)
- **Metode:** Inspeksi statis dan parser TypeScript/TSX saja
- **Hasil:** **PASS secara statis** untuk perilaku fallback yang diaudit
- **Runtime:** **BELUM-DIVERIFIKASI** — browser, server, request API, database,
  test runner, lint, build, dan full typecheck tidak dijalankan.

## Batas audit dan sumber

Audit dibatasi pada perubahan fallback menu dan tidak mencakup Emulator atau
scope lain. File yang diperiksa:

- `/sdcard/project/Madevi/Madevi_Off/src/components/sidebar.tsx`
- `/sdcard/project/Madevi/Madevi_Off/src/content/runtime-menu.ts`
- `/sdcard/project/Madevi/Madevi_Off/src/services/runtime-content.ts`
- `/sdcard/project/Madevi/Madevi_Off/src/app/api/v1/runtime-menu/route.ts`
- checkpoint kontrol `/sdcard/project/Madevi/Madevi-Control/memory/CHECKPOINT.md`

QA/control checkpoint yang tersedia tidak mendefinisikan item terpisah
`MENU-FALLBACK-001`; audit ini adalah bukti bounded terhadap perubahan yang
diminta, bukan promosi status INDEX atau perubahan QA/control item.

Parser Babel lokal berhasil untuk empat file source (`BABEL_PARSE_OK`).

## Temuan acceptance

- [x] **API success + `extensions: []` mempertahankan proyeksi lokal.** Pada
  `sidebar.tsx:98-103`, response sukses dengan array kosong tidak masuk cabang
  API/storage failure. Setelah validasi (`:104-114`), `validExtensions.length > 0`
  menentukan state; untuk kosong, `runtimeExtensions` diset `null` dan `menuSync`
  menjadi `offline` (`:115-123`). Consumer kemudian memilih
  `runtimeExtensions ?? RUNTIME_MENU_NODES` (`:262-268`). Dengan demikian array
  kosong tidak menghapus menu lokal.

- [x] **Extension non-empty yang valid tetap digunakan.** Extension disaring
  berdasarkan object shape, `id`, `label`, string `href`, kind yang diizinkan,
  status `ACTIVE`, dan safe integer `sortOrder` (`sidebar.tsx:104-114`). Jika
  setidaknya satu valid, array hasil filter disimpan sebagai `runtimeExtensions`
  dan sync state menjadi `synced` (`:117-119`); fallback lokal tidak dipilih.
  `WebsiteMenuItems` hanya menampilkan extension aktif yang memiliki href nyata
  (`:467-476`).

- [x] **API failure/storage unavailable tetap fail-closed dan jujur.** Response
  non-OK, shape extension yang bukan array, atau `storageUnavailable: true`
  mengosongkan runtime extension, memilih mode `offline`, dan tidak menganggap
  data itu sebagai package terbit (`sidebar.tsx:96-103`). Exception fetch juga
  melakukan hal yang sama (`:120-123`). Label UI menyatakan “Mode lokal — menu
  inti tetap tersedia”, bukan bahwa package runtime berhasil dibaca
  (`sidebar.tsx:573-581`). Route API sendiri mengembalikan `storageUnavailable:
  true` pada exception dan menjelaskan bahwa extension kosong berarti storage
  tidak terbaca, bukan bukti tidak ada package (`route.ts:23-37`).

- [x] **Published/runtime boundary tetap dipertahankan.** Service hanya
  mengambil package tervalidasi berstatus `PUBLISHED` (`runtime-content.ts:52-56`),
  hanya memproyeksikan package `MENU`, dan menerapkan href `/ruang/...` serta
  policy pilot (`:68-120`). Draft/invalid package tidak dipakai sebagai menu
  aktif. `runtime-menu.ts` secara eksplisit mendokumentasikan
  `RUNTIME_MENU_NODES` sebagai proyeksi kontrak statis untuk kompatibilitas UI,
  bukan bukti status database/package (`:16-25`). Karena itu fallback tidak
  membuat klaim bahwa katalog package telah terbit atau mengarang payload API;
  ia mempertahankan menu lokal yang sudah ada.

## Catatan risiko statis

Validasi client menyaring entry invalid dari response tanpa menampilkan alasan
per-entry. Namun response runtime-menu tidak membawa daftar `invalid`, dan
entry invalid tidak pernah dirender atau dipromosikan sebagai published menu;
ketika tidak ada valid entry, state kembali ke mode lokal/offline. Ini tetap
fail-closed untuk scope fallback, tetapi diagnosis invalid entry aktual belum
dapat diverifikasi tanpa kontrak/API observability tambahan.

`RUNTIME_MENU_NODES` memiliki node sekunder dengan copy UI “Published menu”
(`sidebar.tsx:545-548`). Audit ini tidak mengubahnya: node tersebut berasal dari
proyeksi lokal yang telah ada, bukan hasil fallback change atau klaim database.
Jika Owner menghendaki pembedaan visual yang lebih ketat antara menu lokal dan
package terbit, itu adalah perubahan scope terpisah.

## Batas verifikasi

Tidak ada emulator, browser, server, request API, database, migration, test
runner, lint, build, atau full typecheck yang dijalankan. Audit ini hanya
menyatakan hasil inspeksi source/parser; keberhasilan rendering dan perilaku
runtime tetap **BELUM-DIVERIFIKASI**.
