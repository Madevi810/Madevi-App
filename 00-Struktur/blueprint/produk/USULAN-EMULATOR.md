# Usulan Fitur: Emulator Circuit Elektronika (Modul Edukasi)

**Status:** PROSES — item aktif `EMULATOR-001` pada `../INDEX.md`; kontrak implementasi lokal dibatasi seperti di bawah.  
**Pengusul awal:** Agent 1 (ide Owner di Blueprint Teknis).  
**Arsitektur yang dipilih Owner:** Next.js App Router / React Client Component / Web Worker dan API PostgreSQL lokal yang sudah ada. Tidak mengimplementasikan Laravel, Laravel Octane, Filament, Redis/queue, VPS, Vercel, atau layanan eksternal.

---

### ID/route kanonis dan alias:
- **Kanonis:** `/alat-bantu/emulator` atau `/belajar/emulator` (tergantung penempatan di struktur menu utama).
- **Alias:** `/emulator` (redirect kanonis).

### Pelaku, kebutuhan, dan keputusan yang dibantu:
- **Pelaku:** Siswa sekolah, mahasiswa, pekerja magang, hingga profesional (berdasarkan tier akses).
- **Kebutuhan:** Membutuhkan lingkungan yang aman dan *real-time* untuk belajar, merangkai, dan menguji konsep elektronika dasar tanpa risiko perangkat keras fisik terbakar/rusak.
- **Keputusan:** Memutuskan nilai komponen (resistor, kapasitor), memvalidasi arus/tegangan (Modified Nodal Analysis), dan mendiagnosis kesalahan jalur (*short circuit*, arus mati).

### Data/sumber serta pemiliknya:
- **Penyimpanan Lokal/Server:** State skema (posisi komponen, nilai, sambungan) disimpan berwujud struktur JSON di PostgreSQL (melalui API rute Next.js).
- **Pemilik Data:** Akun pengguna yang login (Privat). *Guest* tidak bisa menyimpan *progress*.
- **Mesin Komputasi:** Berjalan 100% *client-side* (browser) menggunakan *Web Worker* agar UI tidak terhenti (freeze) saat menghitung iterasi matrix MNA 60x/detik.

### Struktur halaman: heading → konteks → pilihan → workspace/isi → hasil → bantuan:
- **Heading & Konteks:** Header standar `PublicShell` Madevi dengan *breadcrumb* `Alat Bantu > Emulator Elektronika`.
- **Pilihan (Sidebar/Toolbox):** Menu *drag-and-drop* yang terbagi menjadi komponen Dasar, Standar, Praktis, dan Kompleks. Ketersediaan komponen dikunci berdasarkan *Tier* langganan (Free, Plus, Pro).
- **Workspace (Canvas):** Area menggambar skema interaktif (HTML5 Canvas). Memiliki kontrol untuk orientasi (Portrait/Landscape) dan grafis (Low/Medium/High).
- **Hasil:** Overlay indikator *real-time* (animasi arus bergerak, pop-up tanda peringatan jika ada komponen terbakar atau *short circuit*).
- **Bantuan:** Tooltip saran perbaikan otomatis (khusus High Graphics/Pro) yang menyarankan penggantian nilai arus atau polaritas komponen.

### Tindakan utama dan hasil server/data yang membuktikannya:
1. **Drag-and-Drop & Sambung Kabel:** Aksi murni di UI browser. 
2. **Kalkulasi Real-time:** Tidak menyentuh server; hasil arus dibuktikan secara visual dari *Web Worker*.
3. **Simpan Workspace:** Menekan tombol "Simpan Skema", mengirim payload JSON ke `POST /api/v1/utilities/workspace` dengan `kind="EMULATOR"`.
4. **Muat Workspace:** `GET /api/v1/utilities/workspace/{id}` menarik JSON skema lama dan me-render ulang posisi komponen di Canvas.

### Permission dan keadaan loading/empty/error/forbidden/success/recovery:
- **Loading:** *Skeleton loading* saat menarik library Web Worker (jika dipecah ke *chunk* terpisah).
- **Empty:** Papan (Canvas) kosong dengan tulisan instruksi *watermark* "Seret komponen dari kiri ke sini".
- **Error (Simulasi):** State visual "komponen meledak/terbakar" disertai alasan (e.g. "Tegangan melebihi toleransi"). 
- **Error (Jaringan):** Notifikasi *toast* jujur: "Gagal menyimpan skema ke server. Periksa koneksi Anda."
- **Forbidden:** Klik pada komponen kelas "Pro" bagi *Free tier* akan menampilkan modal penawaran peningkatan (*upgrade*) tanpa melempar pengguna keluar dari emulator.
- **Success:** Simpan berhasil; tanda hijau kecil muncul.

### URL, search, breadcrumb, back/forward, dan tautan keluar:
- **URL:** Tidak menggunakan path berlapis (*shallow routing*) saat modifikasi, kecuali membuka file lama: `/alat-bantu/emulator?fileId=xyz`.
- **Tautan Keluar:** Harus memiliki peringatan "Keluar tanpa menyimpan?" (*beforeunload event*).

### Konten yang perlu ditulis, diverifikasi, diberi tanggal, dan direview Owner:
- **Teks Edukasi:** Definisi *tooltip* tiap komponen (Resistor, Dioda, Op-Amp) harus faktual.
- **Matriks Akses Langganan:** Penentuan pasti komponen mana yang tergolong "Dasar" (Free) hingga "Kompleks" (Pro). Membutuhkan review Owner.

### Risiko safety/privasi/harga/legal serta retensi:
- **Risiko Keamanan/DDoS:** Server tidak menghitung sirkuit, sehingga aman dari eksploitasi beban komputasi. Hanya menyimpan payload JSON (harus dibatasi maksimal mis. 500 KB per skema untuk mencegah injeksi payload besar).
- **Retensi:** Skema disimpan tanpa kadaluwarsa selama pengguna aktif, tunduk pada kuota workspace harian/bulanan pengguna.

### Acceptance criteria, bukti statis/runtime, kompatibilitas, dan rollback:
- **AC-01:** Rute `/alat-bantu/emulator` memuat *canvas* dan tidak menyebabkan *client-side exception*.
- **AC-02:** Komputasi simulasi (MNA) berjalan dalam *Web Worker*, dibuktikan secara statis dengan inspeksi ketiadaan *blocking thread* di antarmuka utama.
- **AC-03:** Tombol komponen dirender dengan state *disabled* (terkunci) jika properti *tier*-nya tidak memenuhi syarat akun yang sedang login.
- **Rollback:** Jika *engine* MNA terlalu kompleks pada tahap awal, dapat digulung balik (rollback) dengan cara mencopot rute emulator sementara dari *Inventaris* tanpa merusak modul alat bantu lainnya (Rumus, PDF, CV).
