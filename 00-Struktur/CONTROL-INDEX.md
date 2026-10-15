# Indeks Madevi-Control

`Madevi-Control` adalah satu-satunya control plane untuk pekerjaan Madevi dan tidak boleh
diimpor atau dibutuhkan runtime aplikasi. Source kanonis tetap `../Madevi_Off`.

## Mulai di sini

1. [Aturan masuk agent](AGENTS.md)
2. [Indeks pekerjaan aktif](blueprint/INDEX.md) — satu-satunya status item yang berlaku.
3. [Guardrail global](blueprint/GUARDRAIL.md)
4. [Control plane 5-Agent](blueprint/CONTROL-PLANE.md)
5. [Workflow, lock, checkpoint, dan eskalasi](blueprint/WORKFLOW.md)
6. [Master scope](MADEVI-MASTER-AUTONOMOUS-AGENT-SCOPE.md) — mandat produk, keputusan,
   dan riwayat yang tetap relevan.

**Operasi aktif:** Agent 1 memprioritaskan riset/usul blueprint selama runner tersedia;
Agent 2–5 melanjutkan checkpoint terakhir ke implementasi, audit, revisi, dan kontrol.
Aturan lengkap berada di [AGENTS.md](AGENTS.md) dan [workflow](blueprint/WORKFLOW.md).
[Buku panduan kelanjutan](../BUKU-PANDUAN-KELANJUTAN.md) memuat kesiapan backup,
restore, handoff, dan pergantian AI CLI; status kerja tetap hanya di INDEX.

## Blueprint domain

- [Peta induk produk web](blueprint/produk/MASTER-BLUEPRINT-WEB.md),
  [inventaris seluruh halaman](blueprint/produk/INVENTARIS-HALAMAN.md), dan
  [rencana ringkas per bidang](blueprint/produk/ROADMAP-DAN-DEPENDENSI.md) — rancangan Agent 1.
- [Spesifikasi 35 halaman publik/akun](blueprint/produk/SPESIFIKASI-HALAMAN-PUBLIK-DAN-AKUN.md),
  [20 halaman Owner/Admin](blueprint/produk/SPESIFIKASI-OWNER-ADMIN.md), dan
  [isi per ruang](blueprint/produk/RENCANA-ISI-PER-RUANG.md) — target per route dan unit isi,
  bukan status item aktif.
- [Desain UI/UX dan tema](blueprint/desain/UI-UX-DAN-TEMA.md)
- [Fitur workspace dan Tools](blueprint/fitur/WORKSPACE-DAN-TOOLS.md)
- [Artikel, Atlas, dan Jalur Praktik](blueprint/artikel/ATLAS-DAN-JALUR-PRAKTIK.md)
- [Navigasi dan route](blueprint/menu/NAVIGASI-DAN-ROUTE.md)
- [Content Packet dan data](blueprint/data/CONTENT-PACKET.md)
- [Kontrak API lokal](blueprint/api/KONTRAK-API-LOKAL.md)
- [Safety dan akses](blueprint/security/SAFETY-DAN-AKSES.md)
- [Register acceptance criteria](blueprint/qa/ACCEPTANCE-REGISTER.md) dan
  [template item](blueprint/qa/ITEM-TEMPLATE.md)

## State dan bukti

- `memory/STATE.md`, `memory/CHECKPOINT.md`, dan `memory/DECISIONS.md` untuk fakta,
  kelanjutan sesi, serta keputusan Agent 5.
- `memory/BACKLOG.md` untuk intake ide Agent 1 yang belum ditriase.
- `memory/TEST-REPORT.md` sebelum mengklaim hasil verifikasi.
- `blueprint/qa/items/` untuk acceptance criteria per item, dan `blueprint/qa/audits/` untuk
  laporan audit yang menjadi bukti status pass.

[Peta migrasi dokumen sebelumnya](blueprint/LEGACY-MIGRATION.md) menjelaskan blueprint yang
dipertahankan dan dokumen single-agent yang sudah digantikan. Jangan membuat control plane kedua.
