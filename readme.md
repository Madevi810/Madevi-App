# readme.md — Pengarah Project Madevi

## Untuk AI Agent Siapapun yang Membaca Ini

Kamu adalah AI agent yang akan bekerja di project Madevi.
Sebelum menyentuh kode apapun, baca urutan ini:

1. File ini (`readme.md`) — gambaran project
2. `agent.md` — siapa kamu dan aturan kerjamu
3. `00-Struktur/ATURAN-WAJIB.md` — aturan yang tidak boleh dilanggar
4. `00-Struktur/blueprint/INDEX.md` — status pekerjaan aktif

Jangan ubah struktur folder tanpa perintah eksplisit dari Ade (owner).

---

## Project Ini Apa

**Madevi** adalah aplikasi web full-stack edukasi + jasa digital.

### Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Backend:** Next.js API Routes + Server Actions
- **Database:** PostgreSQL 16 (via `pg` + Drizzle ORM)
- **Styling:** CSS custom (desain v15, tanpa AI slop)

### Konsep

- Tepat **7 ruang induk** di sidebar (Explore & Learn, Tutorial & Problem Solve,
  Madevi School, Madevi Shop, Tools & Equipment, Madevi Services, Madevi Line)
- **Full simulasi:** pembayaran, OAuth, OTP, email — semua simulasi jujur
- **Cloud primer:** database utama di Supabase, deploy di Vercel, kode di GitHub.
  Termux hanya dipakai Ade saat presentasi (jangan hapus `00-Termux/`, jangan
  rusak jalur presentasinya, tapi jangan korbankan pekerjaan utama demi Termux)

### Struktur Folder

```
Madevi-App/
├── 00-Termux/        → script instalasi & jalan di HP
├── 00-Struktur/      → aturan, blueprint, riwayat (untuk AI agent)
├── readme.md      → file ini
├── agent.md       → definisi agent utama
├── 00-install-project.md → panduan instalasi lengkap
├── src/              → kode aplikasi
├── database/         → migrasi, seeds, backup
├── scripts/          → alat bantu
├── tests/            → pengujian otomatis
├── docs/             → dokumentasi
└── public/           → aset statis
```

---

## Yang Diinstal

### Untuk Termux (HP Android)

- Termux (dari F-Droid)
- Node.js 20+ (`pkg install nodejs`)
- PostgreSQL 16 (`pkg install postgresql`)
- Project ini (extract `Madevi-App.zip`)

Perintah setup: lihat `00-install-project.md` bagian Termux.

### Untuk Web (Cloud)

- **GitHub** — simpan kode
- **Vercel** — jalankan aplikasi (auto-deploy dari GitHub)
- **Supabase** — database PostgreSQL cloud

Perintah setup: lihat `00-install-project.md` bagian Web.

---

## Aturan Keras

1. Tepat 7 ruang, tidak tambah tanpa perintah Ade
2. Tidak ada popup/modal/animasi otomatis yang menyela
3. Cloud primer (Vercel + Supabase + GitHub); Termux hanya mode presentasi
4. Ketika Ade bertanya → jawab dulu, jangan langsung kerja
5. Jangan minta Ade kerja manual — semua teknis dikerjakan AI
6. Push HANYA atas perintah eksplisit Ade ("PUSH"/"boleh push"); commit lokal boleh
