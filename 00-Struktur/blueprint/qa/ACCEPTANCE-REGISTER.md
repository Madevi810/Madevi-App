# Register QA dan Audit

## Aturan bukti

- `PASS` berarti semua acceptance criteria wajib lulus dan bukti metode tersedia.
- `FAIL` harus berisi lokasi, dampak, expected/actual, severity, dan langkah reproduksi atau
  alasan inspeksi statis.
- `BELUM-DIVERIFIKASI` bukan pass dan tidak diubah menjadi klaim visual/runtime tanpa bukti.
- Agent 3 menulis laporan audit; Agent 4 memperbaiki; status hanya berada di `../INDEX.md`.

## Register awal

| ID | Blueprint/QA utama | Bukti minimum sebelum PASS |
|---|---|---|
| CTRL-5A-001 | `../CONTROL-PLANE.md`, `../WORKFLOW.md` | struktur, link, status source tunggal, dan guardrail terbaca statis |
| UX-001 | `../desain/UI-UX-DAN-TEMA.md` | audit breakpoint, overlap/z-layer, focus, reduced-motion, tiga tema |
| CONTENT-001 | `../artikel/ATLAS-DAN-JALUR-PRAKTIK.md` | policy/workflow + compatibility 0039, tanpa menerapkan DB tanpa izin |
| PROFILE-001 | `../security/SAFETY-DAN-AKSES.md` | permission/CSRF/negative state dan recovery |
| ADMIN-001 | `../api/KONTRAK-API-LOKAL.md` | route aktif, data-backed state, action berbahaya |
| SEARCH-001 | `../menu/NAVIGASI-DAN-ROUTE.md` | permission-aware filter, zero-result, overlay/dropdown reflow |
| ASSESS-001 | `../data/CONTENT-PACKET.md` | konfigurasi versioned, tidak ada angka UI hardcode |
| SEC-001 | `../security/SAFETY-DAN-AKSES.md` | IDOR/CORS/backup/accessibility/performance evidence |
| RECOVERY-001 | `../../memory/RELEASE-CHECKLIST.md` | drill non-production hanya bila Owner mengizinkan |
| EMULATOR-001 | `../produk/USULAN-EMULATOR.md`, `../../memory/TOOLS-AND-EQUIPMENT-ARCHITECTURE.md` | Solver DC MNA/Web Worker, Canvas editor, validasi batas/topologi, workspace privat + CSRF/ownership, migration source kompatibel, dan bukti statis; tidak mengaktifkan DB/runtime. |

