# Supplemental Audit — EMULATOR-001 Focus Preservation After Delete

**Tanggal:** 2026-09-28  
**Auditor:** Agent 3 Auditor  
**Disposition:** **PASS secara statis** untuk perubahan terbaru `canvasRef`/`tabIndex`/focus-after-delete. Tidak ada revisi minimal yang diperlukan dari inspeksi source ini.

## Scope dan basis penerimaan

Audit ini hanya mencakup perubahan terbaru pada:

- `/sdcard/project/Madevi/Madevi_Off/src/components/circuit-emulator.tsx`

Fokus audit: `canvasRef`, `tabIndex={0}`, pemulihan fokus setelah penghapusan, jalur shortcut keyboard dan tombol inspector, keamanan `requestAnimationFrame`, aksesibilitas target fokus, selection/node behavior, kompatibilitas undo/redo, serta preservasi scope. Basis penerimaan adalah `blueprint/qa/items/EMULATOR-001.md`, checkpoint focus-preservation, dan audit recovery/keyboard sebelumnya. Tidak ada source lain, INDEX, QA item, guardrail, atau checkpoint diubah.

## Metode dan batas verifikasi

- Inspeksi source statis dan grep pada TSX target.
- Babel parser `@babel/parser` dengan `sourceType: "module"`, plugin `typescript` dan `jsx`: **PASS** (`BABEL_PARSE_OK`), tanpa diagnostic/exception.
- Tidak menjalankan dev server, browser/runtime, API, database, migration, test runner, lint, build, full typecheck, atau background job.
- **Runtime/browser, full typecheck, dan screen-reader verification: BELUM-DIVERIFIKASI.**

## Ringkasan hasil

| Area | Hasil | Bukti statis |
|---|---|---|
| Stable canvas ref dan focus target | **PASS** | `circuit-emulator.tsx:151`, `815-817` |
| `tabIndex` dan accessible target | **PASS secara statis** | SVG mempertahankan `role="application"`, `tabIndex={0}`, dan bilingual `aria-label` pada `815-817` |
| Keyboard shortcut deletion path | **PASS** | `346-370`, `361-366`; tetap Canvas-scoped dan hanya component/wire |
| Inspector/button deletion path | **PASS** | `473-491`, tombol inspector memanggil `removeSelection` pada `928-940` |
| `requestAnimationFrame` safety | **PASS secara statis** | callback memakai `aliveRef.current` guard pada `488-490`; lifecycle cleanup menandai unmounted pada `153-166` |
| Selection and node behavior | **PASS** | `473-487`; node tetap early-return/non-deletable, selection dibersihkan sesudah delete |
| Undo/redo compatibility | **PASS secara statis** | `removeSelection` tetap melalui `updateCircuit` pada `477-485`; fokus tambahan tidak mengubah circuit/history |
| Scope/payload preservation | **PASS** | perubahan terbatas pada focus target/callback; tidak ada payload, solver, worker, API, atau selection-rule change |
| Parser safety | **PASS** | Babel TSX parser lulus |

## Temuan terperinci

### 1. Target fokus dan aksesibilitas — PASS secara statis

`canvasRef` bertipe `SVGSVGElement | null` diregistrasikan pada SVG canvas (`L151`, `L815`). Canvas memiliki `role="application"`, `tabIndex={0}`, dan accessible name bilingual melalui `aria-label` (`L815-817`). Karena itu target pengganti fokus tetap berada pada canvas yang sudah menjadi scope shortcut, bukan elemen dekoratif atau node yang mungkin dihapus.

`tabIndex={0}` membuat canvas dapat dicapai melalui keyboard focus order. Objek wire dan node tetap memiliki markup focusable existing; perubahan yang diaudit tidak menghapus atau mengganti behavior tersebut. Efektivitas accessibility tree dan screen-reader interaction tetap **BELUM-DIVERIFIKASI** tanpa browser/runtime.

### 2. Jalur shortcut keyboard — PASS

Global `keydown` handler tetap menolak target `INPUT`, `TEXTAREA`, `SELECT`, dan `contenteditable` sebelum memproses shortcut (`L347-353`). Untuk `Delete`/`Backspace`, handler mensyaratkan target berada di dalam ancestor `[role="application"]` dan selection berjenis `component` atau `wire` (`L361-365`). Setelah itu ia memanggil `removeSelection()` yang sama seperti sebelum enhancement.

Dengan demikian focus-preservation tidak memperluas shortcut ke luar canvas, tidak membuat node/terminal dapat dihapus, dan tidak mengganggu native editing pada control editable. `preventDefault()` tetap hanya berada pada jalur penghapusan yang lolos guard.

### 3. Jalur tombol inspector — PASS

Tombol penghapusan component/wire pada inspector memanggil `removeSelection()` (`L928-940`). Fungsi mengambil selection saat ini, melakukan mutation hanya untuk component atau wire, memanggil `setSelection(null)`, lalu menjadwalkan focus ke `canvasRef` (`L473-491`). Jadi baik shortcut keyboard maupun tombol inspector menggunakan jalur mutation dan focus recovery yang sama; tidak ada jalur delete kedua yang tertinggal tanpa replacement focus.

### 4. `requestAnimationFrame` safety — PASS secara statis

Focus dijadwalkan setelah commit render melalui satu `window.requestAnimationFrame` (`L488`), sehingga callback tidak mencoba fokus sebelum state/render penghapusan diproses. Callback memeriksa `aliveRef.current` sebelum membaca ref dan memanggil `focus({ preventScroll: true })` (`L489`). Lifecycle effect mengubah `aliveRef.current` menjadi `false` saat unmount (`L153-156`), sehingga callback tertunda tidak memfokuskan komponen yang sudah tidak hidup.

Tidak ada `cancelAnimationFrame`, tetapi guard lifecycle mencegah side effect focus setelah unmount. Beberapa delete event yang menjadwalkan callback hanya dapat menghasilkan focus ulang ke target canvas yang sama; tidak tampak perubahan circuit/history dari callback tersebut. Runtime timing dan dukungan browser terhadap `focus({ preventScroll: true })` tetap **BELUM-DIVERIFIKASI**.

### 5. Selection/node behavior — PASS

`removeSelection()` masih melakukan early return untuk selection selain `component` dan `wire` (`L473-486`). Node/terminal selection tidak dihapus. Component deletion memfilter component lalu menjalankan `pruneUnusedNodes`; wire deletion memfilter wire lalu menjalankan normalisasi yang sama. Selection dikosongkan pada delete yang berhasil (`L487`), kemudian focus berpindah ke canvas, bukan ke ID objek yang telah dihapus.

Perubahan terbaru tidak memanggil `setSelection` tambahan yang dapat menghidupkan kembali selection lama dan tidak mengubah aturan pemilihan node/wire/component.

### 6. Undo/redo compatibility — PASS secara statis

Kedua deletion path tetap masuk ke `removeSelection()` dan mutation tetap melalui `updateCircuit` (`L477-485`). Focus callback hanya membaca ref dan memfokuskan DOM; tidak menyentuh `circuitRef`, revision, result, `history`, payload save, atau `future`. Karena itu penghapusan tetap menggunakan jalur commit/history yang telah diaudit sebelumnya dan dapat dipulihkan secara struktural oleh undo. Hasil interaksi nyata setelah undo belum diuji di browser.

### 7. Scope preservation — PASS

Checkpoint menyatakan perubahan dibatasi pada satu file TSX. Inspeksi perubahan yang relevan hanya menambahkan ref canvas, `tabIndex={0}`, dan callback focus-after-delete; shortcut filtering, selection rules, `removeSelection` mutation, solver, worker, API, persistence payload, dan undo/redo contract tetap tidak berubah. Tidak ada bukti scope creep ke file atau subsystem lain.

## Final disposition

**PASS — supplemental static audit untuk `canvasRef`, `tabIndex`, dan focus-after-delete.** Keyboard shortcut deletion, inspector deletion, requestAnimationFrame lifecycle guard, accessible focus target, selection/node behavior, undo compatibility, dan scope preservation lulus inspeksi statis. **Minimal revision required: none.**

**Runtime/browser: BELUM-DIVERIFIKASI. Full typecheck: BELUM-DIVERIFIKASI.** Hasil PASS di atas tidak merupakan klaim end-to-end, screen-reader, atau browser compatibility.
