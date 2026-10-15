# 00-Struktur — Pusat Aturan & Arsip Madevi

Folder ini berisi aturan, arsip kerja, dan dokumen kontrol project Madevi.
AI agent yang bekerja di project ini WAJIB membaca `00-Readme.md` di root
project dulu, lalu folder ini.

## File gabungan (hasil ringkasan 16 Okt 2026)

File-file laporan/perbaikan/rencana yang tadinya berserakan sudah digabung
per kelompok TANPA menghilangkan isi. Tiap file gabungan memuat daftar
sumber + isi utuh tiap file sebagai section.

| File | Isi | Jumlah sumber |
|---|---|---|
| `laporan.md` | Laporan hasil kerja per siklus (14–16 Okt 2026) | 4 file |
| `perbaikan.md` | Catatan bug & perbaikan per siklus (14–16 Okt 2026) | 4 file |
| `rencana.md` | Rencana kerja 1-jam (slot 01:05–12:05, 15 Okt 2026) + rencana khusus | 15 file |
| `analisis.md` | Audit besar-besaran + analisis total codebase | 2 file |
| `panduan.md` | Buku panduan kelanjutan + readme sumber area, fonts, taxonomy | 4 file |
| `desain.md` | Spesifikasi desain sidebar & header yang dikunci | 1 file |

Total: 30 file sumber digabung menjadi 6 file. File asli sudah dihapus
setelah diverifikasi isinya masuk utuh ke file gabungan.

## File penting lain

| File | Fungsi |
|---|---|
| `ATURAN-WAJIB.md` | 44 aturan wajib Madevi — dibaca SEBELUM kerja apapun |
| `../00-Agent.md` | Agent utama (1 saja) — rangkuman dari AGENTS-*.md + MADEVI-MASTER-AUTONOMOUS-AGENT-SCOPE.md |
| `CONTROL-INDEX.md` | Indeks kontrol lama |
| `INDEX.md` | Daftar isi folder ini |

## Folder

| Folder | Isi |
|---|---|
| `blueprint/` | Blueprint kerja + 5 peran agent pekerja (`roles/`) — JANGAN diubah sembarangan |
| `kontrak-visual/` | Kontrak visual desain (simulasi HTML v15 = FIX) |
| `memory/` | State, checkpoint, backlog, keputusan agent |

## File arsip lain (tidak digabung)

- `FITUR-INVENTARIS.md` — inventaris fitur per route/komponen/API
- `KONTRAK-API-P07.md` — kontrak API
- `MIGRASI-PENDING.md` — daftar migrasi tertunda
- `Madevi-Blueprint-Teknis.md` — blueprint teknis awal
- `RINGKASAN-SIKLUS.md` — ringkasan siklus kerja
- `dedup-report.md` — laporan deduplikasi
- `rencana-redesign-total-2026-10-13.md` — rencana redesign total
- `CLAUDE.md` — catatan lama (11 byte)
