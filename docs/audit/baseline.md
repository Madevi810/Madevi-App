# Baseline Audit — Fase 0.2 (19 Okt 2026)

## Klaim vs Kenyataan

| Klaim (INDEX.md lama) | Kenyataan (cek nyata 19 Okt 2026) | Status |
|---|---|---|
| 702 artikel di Supabase | API publik `/api/v1/articles` → `data: []` (kosong). Semua artikel berstatus DRAFT, tidak tampil publik. | ⚠️ KLAIM PERLU KOREKSI: artikel ada di DB tapi tidak terlihat pengguna |
| 43 node taxonomy | API `/api/v1/taxonomy` → root nodes tampil (R1 Tutorial, dst). Struktur ada. | ✅ Sesuai |
| 40+ tools berfungsi | ToolRunner + `/tools/[id]` ada di kode; belum diuji di production | ⚠️ Perlu uji nyata |
| 7 ruang tampil baru | Landing tiap ruang ada; isi masih contoh statis/fallback di beberapa | ⚠️ Sebagian |
| Build sukses | `next build` lokal 0 error (19 Okt 2026) | ✅ Sesuai |
| Push otomatis | DILARANG mulai 19 Okt 2026 — hanya atas perintah eksplisit Ade | 🔄 Aturan berubah |

## Temuan Dasar (Fase 0.4)
- [x] Teks loading sesuai lingkungan — sudah diperbaiki (A1-1)
- [x] Duplikasi "Madevi" — tidak ada duplikasi visual (A1-3)
- [x] noindex dipertahankan (A1-4)
- [x] Footer "© 2027" — sesuai v15
- [ ] Data Explore tampil di Vercel — MASIH BERMASALAH: artikel DRAFT tidak tampil publik

## Peta Kode (Fase 0.3)
- Route aktif: `src/app/` — 7 ruang + admin + API v1 (30+ grup endpoint)
- Komponen: `src/components/` — ui/, sim/, undangan/, line/, school/, tools/, tutorial/, ruang/
- Service: `src/services/` — 15+ modul (sim-fisika, undangan, tutorial, school, line, dll)
- Kontrak: `src/contracts/` — tools-registry, dll
- Migration: `database/migrations/` — 53+ file
- Kandidat usang: CSS lama 27rb baris (konsolidasi bertahap, jangan hapus massal)

## Database yang Dipakai
- Produksi: Supabase (Madevi-Dev, ap-southeast-1) — via API Vercel
- Lokal: tidak ada PostgreSQL jalan (DATABASE_URL localhost refused)
- Catatan: perubahan skema WAJIB aditif sampai Siklus Rilis (Bagian 8)
