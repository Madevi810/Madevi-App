# KUMPULAN PANDUAN — Madevi

Gabungan file BUKU-PANDUAN-*.md dan README-*.md (kecuali README.md utama).

## Daftar sumber

- `BUKU-PANDUAN-KELANJUTAN.md` — tanpa tanggal
- `README-SOURCE-AREA.md` — tanpa tanggal
- `README-fonts.md` — tanpa tanggal
- `README-taxonomy.md` — tanpa tanggal

> Digabung otomatis pada 16 Okt 2026. Isi tiap file disalin UTUH tanpa perubahan.


---


## Sumber: `BUKU-PANDUAN-KELANJUTAN.md` (tanpa tanggal)


# Buku Panduan Kelanjutan Madevi

Panduan ini membantu Owner dan AI CLI/Agent berikutnya melanjutkan pengembangan Madevi
tanpa bergantung pada satu sesi, langganan, atau model AI. Ini adalah **panduan kesiapan**,
bukan status pekerjaan baru. Status dan lock tetap hanya di
[`Madevi-Control/INDEX.md`](Madevi-Control/INDEX.md).

## Prioritas sebelum berganti alat atau berhenti berlangganan

| Prioritas | Hasil yang perlu tersedia | Keadaan yang diketahui dan batasnya |
|---|---|---|
| Salinan yang dapat dipulihkan | Salinan source, `Madevi-Control`, database, storage, paket konten, dan konfigurasi non-rahasia di lokasi lain; versi source dapat dilacak. | [Checklist rilis](Madevi-Control/memory/RENCANA.md) masih menyebut pemulihan source tanpa Git dan snapshot di `/tmp`. Sebelum memakai Git/arsip bersama, pisahkan `.env`, kredensial, kunci `.pem`, dan data privat. Keberadaan berkas sensitif diketahui dari nama file; isinya tidak diperiksa untuk panduan ini. |
| Bukti restore | Backup berhasil dipulihkan pada lingkungan terisolasi, file dan schema cocok, hasil dicatat. | [Rencana restore](Madevi-Control/memory/RENCANA.md) masih berstatus rancangan; tabel hasil drill kosong. Eksekusi drill memerlukan izin Owner sesuai guardrail. Jangan menyebut backup “teruji” sebelum hasilnya nyata. |
| Handoff satu halaman | Ringkasan item aktif, pemegang lock, kondisi source terakhir, bukti yang lulus, yang belum diverifikasi, risiko, dan tindakan berikutnya. | [INDEX](Madevi-Control/INDEX.md) dan [checkpoint](Madevi-Control/memory/STATUS.md) adalah sumber kanonis. `memory/STATUS.md` memuat riwayat panjang; label lama di sana tidak mengalahkan INDEX. Ringkasan baru harus menunjuk ke sumber tersebut, bukan membuat status kedua. |
| Panduan operasi lokal | Prasyarat Termux/Node/Postgres, lokasi data, cara mulai/berhenti, backup, restore, dan tanda hasil yang benar untuk perangkat berikutnya. | Bahan tersebar pada source, script, dan dokumen kontrol. Tulis perintah yang sudah diverifikasi saja; hal yang belum diuji diberi `BELUM-DIVERIFIKASI`. Larangan operasi sesi saat ini tetap berlaku. |
| Uji agent pengganti | Satu sesi pendek membuktikan CLI pengganti membaca instruksi root, menemukan lock/checkpoint, dan tetap dalam cakupan item. | `AGENTS.md` root mengarahkan agent ke README dan kontrol. Perilaku membaca otomatis berbeda antar-CLI; periksa pada alat yang benar-benar akan dipakai. Dokumen tidak menjalankan agent atau proses background sendiri. |

## Kondisi kerja yang harus dibawa ke agent berikutnya

- Baca [README](README.md) dan [aturan root](AGENTS.md), lalu aturan, INDEX, guardrail,
  workflow, serta checkpoint di `Madevi-Control`. Mulai dari item yang masih aktif; jangan
  menyimpulkan status dari riwayat lama.
- Saat panduan ini ditulis, INDEX mencatat `UX-REDESIGN-002` sebagai `PROSES` dengan lock
  desain. Ini **potret bertanggal 2026-09-26**; agent berikutnya wajib membaca INDEX
  terbaru sebelum bekerja.
- Rencana Agent 1 adalah usul sampai Agent 5 mempromosikannya. Implementasi mengikuti
  blueprint, batas file, dependency, QA, dan izin Owner. Ide spontan tidak menjadi tugas
  aplikasi hanya karena terdengar menarik.
- Jika Owner/Admin memberi instruksi langsung, jeda dan catat checkpoint aman. `next`,
  `lanjut`, atau `next agent` berarti memeriksa ulang INDEX/lock lalu melanjutkan fase
  terakhir yang tertunda, sesuai [workflow](Madevi-Control/WORKFLOW.md).

## Standar kerja agent yang dapat dipercaya

Agent menerima pekerjaan dari instruksi Owner/Admin atau item INDEX yang siap. Ia menjelaskan
masalah dan bukti yang mendasarinya, memeriksa alternatif serta dampak lintas sistem,
melaksanakan perubahan yang diperlukan sampai hasil pengguna selesai, lalu memverifikasi
dengan cara yang diizinkan. Perubahan acak, refactor tanpa kaitan, fitur rekaan, status
terbit palsu, dan klaim “lulus” tanpa pemeriksaan dilarang. Temuan baru di luar cakupan
masuk backlog sebagai usul; jangan diam-diam melebar dari lock aktif.

Jika kemampuan CLI yang tersedia tidak cukup, agent boleh memasang alat kerja yang
dibutuhkan secara otomatis setelah memeriksa sumber, versi, lisensi, kompatibilitas,
biaya, izin, dan dampaknya. Catat pemasangan agar agent berikutnya dapat mengulang atau
melepasnya. Alat untuk agent tidak otomatis menjadi dependency runtime aplikasi;
biaya, akses baru, atau perubahan berisiko tetap mengikuti wewenang Owner.

Agent boleh mencoba prototipe kecil di direktori sementara dan memperbaiki lingkungan
CLI yang rusak secara terarah. Prototipe memakai data contoh tanpa rahasia; hasilnya
baru masuk aplikasi lewat item aktif dan lock. Perbaikan lingkungan menjaga source,
lockfile, data, serta proses Owner dan dicatat untuk handoff. Izin ini tidak mencakup
test/build aplikasi, yang masih mengikuti batas operasi saat ini.

Saat hasil belum dapat diverifikasi, tulis `BELUM-DIVERIFIKASI` dan alasan konkret.
Ketika sesi berhenti, tinggalkan bukti dan checkpoint yang cukup bagi agent lain untuk
melanjutkan. Kerja otonom berlangsung hanya selama runner/perangkat tersedia; buku ini
tidak menggantikan backup, uji restore, atau operator.


---


## Sumber: `README-SOURCE-AREA.md` (tanpa tanggal)


# Madevi_Off — inti source Madevi

Direktori ini hanya berisi aplikasi: source, public assets, database schema/migration/seed,
paket konten lokal, script, test, dan dokumentasi API yang dipakai aplikasi. Aturan, prompt,
agent, riwayat kerja, dan checkpoint sengaja tidak berada di sini.

Kontrol Agent kanonis berada di `/sdcard/project/Madevi/Madevi-Control/`. Paket taxonomy
lokal yang digunakan source berada di `content-local/packages/`.

Runtime data, backup, cache build, secret, dan PGDATA tetap tidak masuk distribusi atau
version control. Produk berjalan lokal di Termux; jangan membuat dependensi API online.


---


## Sumber: `README-fonts.md` (tanpa tanggal)


# Font lokal UX-REDESIGN-002

Font di folder ini dilayani dari perangkat lokal; aplikasi tidak meminta font dari CDN pada
runtime.

| Keluarga | Berkas | Peran | Sumber | Lisensi | Diakses |
|---|---|---|---|---|---|
| Space Grotesk | `space-grotesk-{400,600,700}.ttf` | UI, heading, dan wordmark `MADEVI // ATLAS` | Google Fonts / [repository Google Fonts](https://github.com/google/fonts/tree/main/ofl/spacegrotesk) | SIL Open Font License 1.1, salinan `OFL-Space-Grotesk.txt` | 2026-09-26 |
| Instrument Serif | `instrument-serif-400.ttf` | heading editorial Fieldbook | Google Fonts / [repository Google Fonts](https://github.com/google/fonts/tree/main/ofl/instrumentserif) | SIL Open Font License 1.1, salinan `OFL-Instrument-Serif.txt` | 2026-09-26 |

Fallback aplikasi tetap `Noto Sans` lokal dan font sistem sehingga teks tersedia jika salah satu
berkas gagal termuat.


---


## Sumber: `README-taxonomy.md` (tanpa tanggal)


# Paket taxonomy lokal

File di folder ini adalah sumber paket taxonomy yang diperlukan source Madevi.
Mereka dipindahkan dari kontrol lama di luar proyek agar perintah lokal tidak lagi
bergantung pada folder `Menu/` eksternal.

- `madevi-explore-pilot-v1.json`: paket import taxonomy Explore yang kompatibel
  dengan skrip import saat ini.
- `madevi-multi-root-v2.json`: snapshot paket multi-root untuk reproduksibilitas.
- `madevi-school-draft-v1.json`: input School yang dipakai generator migrasi lama.

Jangan mengubah paket aktif langsung tanpa melalui kontrak taxonomy, validasi, dan
catatan keputusan. Tidak ada data atau API online yang dibaca oleh paket ini.
