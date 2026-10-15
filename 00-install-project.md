# PANDUAN MADEVI

## 1. KONSEP DASAR

**App** = website yang kamu buka di browser. Tidak simpan data sendiri.

**Database (PostgreSQL)** = tempat simpan semua data (artikel, user, order).
Berupa software terpisah yang jalan sebagai service, bukan file di project.

**File SQL** = instruksi tertulis untuk database. Ada 2 jenis:
- Migrasi → bikin tabel kosong (struktur)
- Seed → isi tabel dengan data (konten)

**DATABASE_URL** = alamat database + password.
App baca ini untuk tahu database ada di mana.
- Di Termux: tersimpan di file `.env.local`
- Di Vercel: tersimpan di Environment Variables (dashboard)

**Alur data:**
```
Kamu klik di browser
  → App tanya ke database via DATABASE_URL
    → Database ambil dari tabelnya
      → Kasih ke App → tampil di browser
```

---

## 2. PASANG DI HP (TERMUX)

### A. Persiapan — sekali saja di HP baru

```bash
mkdir ~/madevi
cd ~/madevi
unzip Madevi-App.zip
npm install
npm run db:bootstrap:termux
```

Hasil:
- Cluster PostgreSQL kosong terbuat di system HP
- File `.env.local` otomatis terbuat (isi DATABASE_URL + secret)

### B. Isi database — sekali saja

```bash
npm run db:start
bash 00-Termux/madevi-rebuild.sh
```

Hasil: 182 tabel terbuat + 710 artikel masuk.

Isi `madevi-rebuild.sh`:
1. Jalankan 52 migrasi (bikin tabel)
2. Buat akun owner
3. Masukkan taksonomi
4. Masukkan 710 artikel dari `database/seeds/articles/`

### C. Jalankan website — setiap mau pakai

```bash
npm run db:start
bash 00-Termux/start-dev.sh
```

Buka di browser HP: http://127.0.0.1:3000

### D. Kalau ada file migrasi baru

```bash
npm run db:migrate
```

Otomatis hanya jalankan file yang belum pernah jalan
(dicek via tabel catatan di database).

### E. Kalau ada artikel baru

Tidak perlu rebuild. Langsung tambah via halaman admin
atau INSERT SQL — data langsung masuk database.

---

## 3. PASANG DI WEB (CLOUD)

### Konsep — sama seperti HP, beda tempat

| | HP (Termux) | Web (Cloud) |
|---|---|---|
| Simpan file | sdcard | GitHub |
| App jalan di | HP sendiri | Vercel |
| Database di | PostgreSQL HP | Supabase |
| Alamat DB di | `.env.local` | Env Variables Vercel |
| Buka web via | 127.0.0.1:3100 | URL vercel.app |

### Aturan API di Next.js

File yang ditaruh di `src/app/api/` otomatis jadi URL.
Contoh: file di `src/app/api/admin/init-db/` → URL `/api/admin/init-db`.
Nama folder bebas dipilih, tidak harus `admin`.

### Langkah setup — sekali saja

1. Push kode Madevi-App ke GitHub
2. Buat project database di Supabase, catat connection string
3. Buat project di Vercel, hubungkan ke repo GitHub
4. Di Vercel set Environment Variables:
   - `DATABASE_URL` (connection string Supabase + password)
   - `APP_ENV=production`
   - `APP_ORIGIN` (URL vercel.app)
   - `LOG_LEVEL=info`
   - `MADEVI_DB_SCHEMA=madevi`
   - `NPM_CONFIG_BIN_LINKS=true`
5. Bikin tabel di Supabase — buka sekali URL:
   ```
   https://[url-vercel]/api/admin/init-db?secret=[secret]
   ```
   Endpoint ini baca 52 file migrasi dari app, eksekusi ke Supabase.
   Secret = kata sandi di URL agar tidak sembarang orang bisa buka.
   Secret ditulis di file `route.ts`, bukan di Vercel.
6. Setelah tabel jadi, HAPUS file `src/app/api/admin/init-db/route.ts`
   dari git lalu push — demi keamanan.

### Kalau ada update kode

```bash
git add -A
git commit -m "pesan perubahan"
git push
```

Vercel otomatis deploy ulang. Tidak perlu perintah lain.

### Kalau ada artikel/akun baru

Otomatis via aplikasi (halaman admin / form daftar).
Tidak perlu endpoint init-db — itu hanya untuk bikin tabel awal.

---

## 4. RINGKASAN

- Migrasi = bikin rak. Seed = isi rak. Keduanya tersimpan di database.
- `madevi-rebuild.sh` (HP) dan endpoint init-db (web) = tukang bangun gudang.
  Setelah gudang jadi, tukang boleh pergi.
- Data baru masuk lewat aplikasi normal, tanpa setup tambahan.
- Bootstrap = sekali per HP. Rebuild = sekali untuk isi awal.
- GitHub = lemari arsip file (peran sama seperti sdcard di HP).
