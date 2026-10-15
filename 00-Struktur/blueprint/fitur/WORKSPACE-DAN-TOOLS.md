# Blueprint Fitur — Workspace, Tools, dan Alur Nyata

## Kontrak produk

Setiap fitur harus memiliki input → validasi → proses/data lokal → hasil → recovery. Item yang
baru ide atau belum mempunyai proses nyata tidak boleh masuk menu aktif.

## Inventaris yang diwariskan

- Tools aktif: Rumus, PDF, dan Dokumen Karier. Struktur kanonisnya `Group → Family → Tool →
  Operation`; hanya tool `PUBLISHED` tampil sebagai pilihan utama.
- Services, Shop, Line, School, Explore, Tutorial, Tools, dan Profile harus memiliki jalur URL,
  state, dan data/backing nyata masing-masing; tidak ada dashboard/template seragam.
- Shop hanya menampilkan tindakan yang benar-benar tersedia: katalog, simpan, dan pertanyaan
  Owner. Jangan membangun checkout atau afiliasi yang berpura-pura aktif.

## Batas implementasi

- Ketika alur membutuhkan database/API/permission, blueprint `data/`, `api/`, dan `security/`
  terkait harus direferensikan dari item fitur/QA.
- Kandidat Word, Excel, OCR, media, scanner, dan integrasi eksternal tetap backlog sampai
  memenuhi kontrak lokal serta lifecycle yang diwariskan.

## Referensi yang dipertahankan

- `../../memory/TOOLS-AND-EQUIPMENT-ARCHITECTURE.md`
- `../../memory/SIMULATION-REMOVAL-AUDIT.md`
- `../../memory/STATE.md` untuk fakta implementasi saat ini.
