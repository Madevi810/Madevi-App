# Supplemental Audit — EMULATOR-001 Keyboard Follow-up

**Tanggal:** 2026-09-28  
**Auditor:** Agent 3 Auditor  
**Scope absolut:** hanya perubahan terbaru pada `/sdcard/project/Madevi/Madevi_Off/src/components/circuit-emulator.tsx` untuk:

- filtering shortcut pada target `contenteditable`;
- penghapusan komponen/kabel dengan `Delete`/`Backspace` yang dibatasi ke Canvas;
- pembaruan hint keyboard.

Control/acceptance basis adalah `blueprint/qa/items/EMULATOR-001.md` dan temuan recovery audit sebelumnya. Tidak ada source, INDEX, QA item, guardrail, atau checkpoint yang diubah.

## Metode dan batas verifikasi

- Inspeksi source statis dan grep pada file TSX yang diaudit.
- Babel parser `@babel/parser` dengan `sourceType: "module"`, plugin `typescript` dan `jsx`: **PASS**, tanpa exception/diagnostic.
- Tidak menjalankan dev server, browser/runtime, API, database, test runner, lint, build, atau full typecheck.
- **Browser/runtime: BELUM-DIVERIFIKASI.**
- **Full typecheck: BELUM-DIVERIFIKASI.**

## Ringkasan disposition

| Area | Hasil | Dasar inspeksi |
|---|---|---|
| Filtering shortcut untuk input dan `contenteditable` | **PASS** | `circuit-emulator.tsx:346-352` |
| Interferensi input/native editing | **PASS** | `circuit-emulator.tsx:347-355` |
| Scope `Delete`/`Backspace` ke Canvas | **PASS** | `circuit-emulator.tsx:360-365`, Canvas `role="application"` pada L812 |
| Selection behavior | **PASS** secara statis | hanya `component`/`wire` dihapus; node tidak dihapus |
| Undo/history compatibility | **PASS** secara statis | penghapusan melewati `removeSelection` → `updateCircuit` → `commitCircuit` |
| Hint text dan claim akurasi | **PASS** | `circuit-emulator.tsx:886-888` |
| Accessibility/keyboard markup | **PASS** secara statis | Canvas role/label; komponen/kabel memiliki `role="button"`, `tabIndex`, dan label |
| Parser safety | **PASS** | Babel parser lulus |

## Temuan terperinci

### 1. Contenteditable shortcut filtering — PASS

`handleHistoryShortcut` membaca `event.target` sebagai `HTMLElement` dan menganggap target editable bila berupa `INPUT`, `TEXTAREA`, `SELECT`, atau `target?.isContentEditable` (`L347-352`). Karena guard ini berada sebelum blok Ctrl/Cmd+Z maupun blok Delete/Backspace, shortcut tidak diambil alih ketika fokus berada pada editor contenteditable. Ini memperbaiki catatan hardening dari audit recovery sebelumnya.

Tidak ditemukan `contentEditable` lain pada file saat inspeksi; pemeriksaan tetap menilai guard terhadap target contenteditable yang mungkin dirender di dalam scope komponen.

### 2. Input interference dan event scope — PASS

`preventDefault()` untuk Ctrl/Cmd+Z hanya dipanggil setelah target lolos filter editable (`L353-357`). Dengan demikian undo native pada field angka, nama workspace, select, checkbox, atau contenteditable tidak secara statis terlihat dicegat. Shortcut tetap memasang listener global `window`, tetapi penghapusan dibatasi oleh `target?.closest('[role="application"]')` (`L360-364`). Target Canvas SVG dan descendant SVG dapat memenuhi ancestor tersebut; target di luar Canvas tidak memenuhi guard.

Catatan batas: event propagation/focus aktual di browser belum diuji, sehingga hasil ini adalah PASS inspeksi statis, bukan jaminan runtime.

### 3. Delete/Backspace and selection behavior — PASS

Blok penghapusan hanya menerima `Delete` atau `Backspace`, hanya setelah target berada di dalam Canvas, dan hanya bila `selection?.kind` adalah `component` atau `wire` (`L360-365`). Node/terminal yang terpilih tidak dihapus oleh shortcut. `removeSelection` juga secara eksplisit hanya memfilter komponen atau kabel; selection lain dikembalikan tanpa perubahan (`L472-486`). Setelah penghapusan berhasil, selection dikosongkan (`L486`).

Canvas memakai `role="application"` dan label yang menjelaskan operasi keyboard (`L811-814`). Komponen, kabel, dan node yang dapat dipilih memiliki `role="button"` dan `tabIndex` (`L677-689`, `L828-836`, `L844-852`), sehingga jalur fokus dan selection memiliki dasar markup aksesibel secara statis.

### 4. Undo compatibility — PASS secara statis

Penghapusan keyboard memanggil `removeSelection`, yang memanggil `updateCircuit`; jalur tersebut menggunakan `commitCircuit` dan mencatat circuit sebelumnya ke `history.past`, mengosongkan `future`, lalu memperbarui circuit (`L198-217`, `L472-486`). Karena itu penghapusan melalui Delete/Backspace mengikuti jalur mutation yang sama dengan tombol hapus dan dapat dipulihkan lewat undo secara struktural. `pruneUnusedNodes` juga dipakai pada kedua bentuk penghapusan, sehingga tidak ada jalur shortcut terpisah yang melewati normalisasi circuit.

Urutan interaksi nyata, native browser undo, dan hasil render setelah undo belum diverifikasi di browser.

### 5. Hint text and claim accuracy — PASS

Hint terbaru menyatakan bahwa pengguna dapat memilih komponen atau kabel lalu menekan Delete untuk menghapusnya (`L886-888`). Klaim ini sesuai dengan handler; Backspace juga diimplementasikan walaupun tidak disebutkan pada hint. Hint tidak mengklaim penghapusan terminal/node, dan memang node tidak dihapus oleh handler. Hint wire mode juga tetap menjelaskan pemilihan dua terminal, bukan shortcut yang tidak tersedia.

### 6. Accessibility and remaining risks — PASS secara statis, runtime BELUM-DIVERIFIKASI

Canvas memiliki accessible name, objek interaktif memiliki keyboard focusability dan label, serta shortcut tidak mengganggu target editable. `role="application"` memberi scope yang dapat dikenali oleh handler, tetapi efektivitas semantik/accessibility tree, screen reader announcement, focus retention setelah penghapusan, dan perilaku browser untuk descendant SVG belum dapat dibuktikan tanpa runtime. Hal-hal tersebut tetap **BELUM-DIVERIFIKASI**, bukan FAIL statis.

## Final disposition

**PASS — supplemental static audit untuk contenteditable filtering, Canvas-scoped Delete/Backspace removal, dan updated hint text.** Tidak ditemukan FAIL dari inspeksi event-scope, input interference, selection behavior, undo compatibility, accessibility markup, atau claim accuracy.

**Browser/runtime: BELUM-DIVERIFIKASI.**  
**Full typecheck: BELUM-DIVERIFIKASI.**  
Parser Babel TSX: **PASS**.
