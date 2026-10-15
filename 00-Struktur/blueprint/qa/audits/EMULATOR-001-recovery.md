# Supplemental Audit — EMULATOR-001 Local Undo/Redo Recovery

**Tanggal:** 2026-09-28  
**Auditor:** Agent 3 Auditor  
**Scope absolut:** hanya perubahan recovery lokal pada:

- `/sdcard/project/Madevi/Madevi_Off/src/components/circuit-emulator.tsx`
- `/sdcard/project/Madevi/Madevi_Off/src/components/circuit-emulator.module.css`

**Control/acceptance basis:** `/sdcard/project/Madevi/Madevi-Control/blueprint/qa/items/EMULATOR-001.md`, khususnya AC-02 dan AC-07. Tidak ada source, INDEX, QA item, guardrail, atau checkpoint yang diubah.

## Metode dan batas verifikasi

- Inspeksi statis dan grep pada dua file implementation di atas.
- Babel parser `@babel/parser` dengan `sourceType: "module"`, plugin `typescript` dan `jsx`: **PASS**, tanpa diagnostic, untuk `circuit-emulator.tsx`.
- CSS diperiksa sebagai source text statis: **PASS**.
- Tidak menjalankan server, browser, API request, database, migration, test runner, lint, build, full typecheck, atau background job.
- **Runtime/browser verification: BELUM-DIVERIFIKASI.** Dengan demikian laporan ini tidak mengklaim perilaku UI end-to-end, fokus keyboard nyata, breakpoint nyata, atau kompatibilitas API saat runtime.

## Ringkasan hasil

| Area | Hasil statis | Bukti |
|---|---|---|
| Recovery state dan bounded history | **PASS** | TSX L44-45, L140, L198-212 |
| Undo/redo transition | **PASS** | TSX L219-251 |
| Reset saat load/new circuit | **PASS** | TSX L512-540, L616-634 |
| AC-02, kontrol recovery berlabel | **PASS secara statis** | TSX L853-869; CSS L430-438 |
| Shortcut tidak mengganggu input yang ada | **PASS dengan catatan** | TSX L346-356 |
| Payload/API compatibility | **PASS secara inspeksi konsumen** | TSX L570-574, L599-602; tidak ada perubahan payload recovery |
| AC-07 / klaim fitur | **PASS** | Recovery hanya lokal; TSX L232, L731-732, L951-953 |
| Parser/static safety | **PASS** | Babel parser TSX lulus; CSS source text lulus |

## Temuan terperinci

### 1. History model, immutability, dan batas memori — PASS

- `CircuitHistory` hanya menyimpan `past` dan `future` (`circuit-emulator.tsx:44-45`), dan state awal kosong (`L140`).
- Setiap `commitCircuit` normal memasukkan snapshot circuit saat ini ke `past`, mempertahankan paling banyak 50 entry (`L198-203`). `future` dikosongkan pada mutation baru (`L202-203`), sesuai semantik undo/redo.
- Undo mengambil entry terakhir, memindahkan circuit saat ini ke depan `future`, dan membatasi future sampai 50 entry (`L235-241`).
- Redo mengambil `future[0]`, memasukkan circuit saat ini ke `past`, lalu menghapus entry future yang dipakai (`L244-250`).
- `restoreHistory` memperbarui `circuitRef`, React state, revision, hasil solver, selection/wire transient state, dan history secara konsisten (`L219-232`). Tidak tampak mutasi langsung terhadap array snapshot yang disimpan.

**Status:** PASS secara inspeksi statis. Urutan interaksi nyata belum diverifikasi di browser.

### 2. History reset behavior — PASS

- `loadSavedWorkspace` memvalidasi payload lalu mengganti circuit, menghapus hasil solver/transient state, dan mengosongkan `past` serta `future` (`circuit-emulator.tsx:527-540`). Ini mencegah undo menyeberang ke workspace tersimpan sebelumnya.
- `startNewCircuit` melakukan commit awal lalu secara eksplisit mengosongkan history (`L616-634`), sehingga rangkaian baru tidak mewarisi history lama. Commit sebelum reset memang membuat satu snapshot sementara, tetapi snapshot itu langsung tidak terjangkau setelah `setHistory({ past: [], future: [] })`; tidak ada indikasi bug hasil akhir dari urutan ini secara statis.
- `restoreHistory` tidak mengosongkan history secara umum; ini tepat karena undo/redo harus mempertahankan sisi stack yang berlawanan.

**Status:** PASS secara inspeksi statis.

### 3. AC-02: kontrol UI dan aksesibilitas — PASS secara statis

- Tombol Undo/Redo adalah elemen `button`, memiliki `type="button"`, visible label Indonesia/English, disabled state berbasis stack, dan title shortcut (`circuit-emulator.tsx:857-867`).
- Container memiliki `aria-label` “Riwayat perubahan”/“Change history” (`L857`), dan CSS memberi layout wrap untuk kontrol (`circuit-emulator.module.css:430-438`).
- Recovery tidak menghapus atau mengganti operasi Canvas existing; perubahan circuit tetap masuk melalui `commitCircuit`/`updateCircuit` (`TSX:198-217`), sehingga add/connect/edit/delete/drag yang memakai jalur tersebut tercatat.
- `restoreHistory` membersihkan selection dan wire mode (`TSX:228-230`), sehingga selection yang menunjuk ID/state lama tidak dibiarkan setelah pemulihan.

**Batas klaim:** bukti ini hanya membuktikan markup dan wiring statis, bukan bahwa screen reader, focus order, pointer interaction, atau keyboard interaction benar-benar bekerja pada browser.

### 4. Input shortcut interference — PASS dengan catatan kecil

- Handler hanya aktif untuk Ctrl/Cmd+Z (`circuit-emulator.tsx:346-348`). Ia mengabaikan target dengan tag `INPUT`, `TEXTAREA`, atau `SELECT` (`L349`), mencakup input nama workspace, saved-circuit select, numeric editor, checkbox, dan input form yang terlihat pada file ini.
- `preventDefault()` hanya dipanggil setelah kombinasi dan target lolos filter (`L350-352`), sehingga native undo pada input yang ada tidak diambil alih.
- Shift+Z diarahkan ke redo dan Z biasa ke undo (`L351-352`). Tidak ada klaim dukungan Ctrl/Cmd+Y pada label; tidak ada mismatch klaim/implementasi di sini.

**Catatan/static risk (bukan FAIL AC):** filter tidak mengecualikan elemen `[contenteditable]` (`L349`). Jika parent/komponen di masa depan menyediakan editor contenteditable yang menerima event bubbling, Ctrl/Cmd+Z dapat dicegat. Tidak ada target contenteditable yang ditemukan dalam dua file scope ini. Rekomendasi hanya untuk future hardening; source tidak diubah sesuai instruksi.

### 5. TypeScript/React logic safety — PASS secara parser/static review

- Babel parser lulus untuk seluruh TSX file (`circuit-emulator.tsx:1-960` dibaca; parser berhasil tanpa exception).
- Callback history memakai functional `setHistory` pada commit (`L200-203`), mengurangi risiko stale state saat mutation beruntun.
- Shortcut effect bergantung pada `history`, `busy`, dan `workspaceBusy` (`L354-356`), sehingga handler closure memperoleh state yang dipakai oleh guard dan operasi undo/redo. Cleanup listener tersedia (`L354-355`).
- Guard `busyRef`/`workspaceBusyRef` mencegah recovery bersamaan dengan solver/workspace operation (`L235-236`, `L244-245`).
- Tidak ada bukti statis tentang TypeScript type error dari parser saja; full typecheck dilarang dan tidak dilakukan. Karena itu “PASS” di sini berarti parser dan struktur yang terlihat, bukan jaminan compiler penuh.

### 6. Payload/API compatibility — PASS secara inspeksi batas enhancement

- Enhancement recovery hanya mengubah circuit state lokal dan tidak menambahkan field payload. POST tetap mengirim `{ kind: 'EMULATOR', title, input: { circuit: validated }, result: {}, isPrivate: true }` (`circuit-emulator.tsx:570-574`).
- Load dan delete endpoint serta CSRF/header tetap berada pada jalur yang sudah ada (`L521`, `L570-574`, `L599-602`); recovery tidak memasukkan history ke URL, body, atau API.
- Karena save memvalidasi `circuitRef.current` saat save (`L559-563`), circuit hasil undo/redo yang dipilih pengguna akan diperlakukan sebagai circuit biasa dan tetap melalui validasi yang sama.

**Status:** PASS secara inspeksi source consumer. API request/runtime compatibility **BELUM-DIVERIFIKASI** sesuai guardrail.

### 7. AC-07: tidak ada klaim melampaui implementasi — PASS

- Status recovery hanya menyebut “Perubahan dipulihkan secara lokal”/“Local change restored” (`circuit-emulator.tsx:232`), bukan version history server, autosave, atau pemulihan lintas sesi.
- UI tetap menyatakan batas model linear DC steady-state dan tidak memodelkan transien, panas, atau kerusakan (`L728-732`), serta disclaimer hasil tetap edukasional (`L951-953`).
- Tidak ditemukan klaim bahwa undo/redo menyediakan recovery database, API recovery, atau dukungan fitur emulator di luar AC-02/AC-07.

**Status:** PASS.

## Final disposition

**PASS — supplemental static audit untuk local undo/redo recovery, dengan catatan hardening contenteditable di atas.** Tidak ada FAIL yang teridentifikasi pada AC-02 atau AC-07 dari dua file yang diaudit. Parser TSX dan pemeriksaan CSS statis lulus.

**Runtime/browser verification: BELUM-DIVERIFIKASI.** M-01 dan seluruh bukti interaksi browser, fokus/accessibility runtime, visual responsive breakpoint, API, serta persistence database tetap tidak diverifikasi dan tidak boleh disimpulkan dari laporan ini.
