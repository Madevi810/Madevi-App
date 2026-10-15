# Workflow dan Handoff 5-Agent

## Dua jalur selama sesi aktif

Agent 1 memelihara blueprint dan mencari usul pengembangan web secara terus-menerus selama
runner tersedia. Agent 2–5 langsung menjalankan siklus item yang siap dari INDEX. Keduanya
dapat berjalan serentak hanya bila ada slot/runner terpisah dan tidak menyentuh irisan file
yang sama. Jika satu agent menjalankan semua peran, ia berganti peran di batas checkpoint.
Tidak ada proses yang dijanjikan hidup saat sesi/perangkat/runner berhenti.

Saat membaca source, mulai dari path item/lock dan gunakan pencarian terarah. Abaikan
`node_modules`, cache, output build, coverage, dan hasil generasi secara default; pindai
bagian tersebut hanya bila kebutuhan item terbukti dan lingkupnya jelas.

Sebelum perubahan material, cocokkan tugas dengan instruksi Owner/Admin atau ID aktif,
rumuskan hasil yang dapat diamati, bukti masalah, batas file, risiko, dan pemeriksaan
yang diizinkan. Selama bekerja, koreksi asumsi bila source membantahnya; jangan
mengejar pekerjaan acak atau temuan di luar lock. Catat temuan lain sebagai usul backlog.
Selesaikan alur yang diminta dan serahkan bukti yang jujur sebelum memilih item berikutnya.

Jika alat yang diperlukan belum ada, nilai apakah kemampuan yang tersedia sudah cukup.
Bila belum, agent boleh memasang alat kerja tepercaya secara otomatis sesuai GUARDRAIL §Operasi
butir 8. Catat alasan, alat/versi/sumber, lokasi, perubahan file, dan cara melepasnya pada
checkpoint. Pemasangan alat agent tidak memperluas lock item atau mengubah dependency runtime
Madevi. Setelah pekerjaan selesai, hentikan proses sementara yang dibuat alat itu.

Untuk solusi yang belum jelas, agent boleh mencoba prototipe kecil di direktori sementara
terpisah dengan data contoh tanpa rahasia. Catat pertanyaan, hasil, dan keterbatasan;
integrasikan hanya melalui lock item yang sah, lalu bersihkan artefak sementara. Jika
lingkungan CLI rusak, lakukan diagnosis dan perbaikan terarah, catat file/alat yang berubah
serta cara memulihkan. Kedua tindakan ini tidak memberi izin test/build/server aplikasi.

## 1. Mulai/lanjut sesi

1. Baca `INDEX.md`, `GUARDRAIL.md`, `CONTROL-PLANE.md`, lalu `memory/STATE.md`,
   `memory/CHECKPOINT.md`, `memory/BACKLOG.md`, dan keputusan relevan.
2. Agent 5 memeriksa lock. Jika lock lama tidak punya checkpoint, tandai konflik/terblokir dan
   pulihkan fakta source sebelum ada agent mengklaim item.
3. Bila item terakhir masih `PROSES`/`REVISI`, lanjutkan fase yang tercatat di checkpoint
   setelah memeriksa fakta pada batas lock. Jangan membuat item baru untuk menghindari
   pekerjaan yang belum selesai.
4. Bila tidak ada fase yang harus dilanjutkan, Agent 2 memilih item `BELUM` yang dependency-nya
   `PASS` dan batas kerjanya tidak bertabrakan dengan lock aktif, menulis lock, lalu
   mengubah status menjadi `PROSES`.

## 2. Siklus satu item

1. **Agent 1:** dapat menambah ide ke backlog, tetapi tidak mengubah item aktif.
2. **Agent 2:** implementasi sesuai `qa/ITEM-TEMPLATE.md`, menulis bukti source/verifikasi yang
   diizinkan pada item INDEX dan checkpoint.
3. **Agent 3:** membuat `qa/audits/<ID>.md` dengan setiap acceptance criteria `PASS`, `FAIL`,
   atau `BELUM-DIVERIFIKASI`. Tidak ada perbaikan source pada fase ini.
4. **Agent 4:** bila ada `FAIL`, mengambil lock yang sama, menandai `REVISI`, memperbaiki
   finding, dan meminta audit ulang. Setelah laporan audit `PASS`, Agent 4 menandai `PASS`.
5. **Agent 5:** mencabut lock, mencatat keputusan/risiko, lalu dapat mempromosikan kandidat
   backlog yang siap ke INDEX bila tidak ada konflik.

Satu siklus item meliputi seluruh hasil terkait dalam bidang itu. Handoff dan checkpoint
adalah kontrol bukti, bukan alasan membuat rencana implementasi per langkah. Beberapa bidang
dapat berjalan bersamaan dengan lock yang terpisah dan dependency yang sudah terpenuhi.
Setelah handoff, peran berikutnya mulai dari bukti dan checkpoint tanpa menunggu prompt baru,
selama runner masih aktif dan tidak ada gerbang Owner yang wajib. Sesudah PASS, Agent 5
memilih item siap berikutnya. Jika belum ada item siap, Agent 1 memperdalam usul berbukti
dan Agent 5 menilai promosi; jangan membuat pekerjaan atau status palsu agar loop tampak aktif.

## 3. Ambang audit “1%”

- Semua acceptance criteria bertanda **wajib** harus lulus. Satu kegagalan wajib berarti item
  gagal audit, berapa pun persentasenya.
- Jika item memiliki unit terhitung (misalnya 100 route, test case, atau breakpoint), tingkat
  temuan minor = `minor gagal / unit yang diaudit × 100` dan harus `≤ 1%`.
- Untuk kurang dari 100 unit atau penilaian visual yang tidak dapat dihitung, toleransi minor
  adalah **nol** sampai Owner menyetujui metrik lain. Critical/high selalu nol toleransi.
- `BELUM-DIVERIFIKASI` tidak boleh dihitung sebagai `PASS`; ia menghalangi status PASS kecuali
  Owner secara tertulis menerima pengecualian risiko rendah.

## 4. Retry, konflik, dan eskalasi

- Agent 4 memiliki maksimum dua siklus revisi per ID. Kegagalan kedua dipindahkan Agent 5 ke
  `TERBLOKIR` dan dieskalasikan ke Owner dengan bukti, pilihan, dan blast radius.
- Konflik blueprint/guardrail, source yang bertentangan, atau lock ganda dibekukan oleh Agent 5;
  tidak ada override diam-diam.
- Ide baru yang menyentuh item aktif hanya masuk backlog. Ia tidak menjadi requirement baru di
  tengah audit/revisi.

## 5. Graceful-stop dan checkpoint

Checkpoint harus ditulis setelah claim lock, sebelum perubahan berisiko, setelah implementasi,
setelah audit, dan sebelum sesi berhenti. Isinya minimal: ID/fase, file yang disentuh, bukti
yang dilakukan, state aman saat ini, risiko, serta langkah atomik berikutnya.

Jika sesi putus, agent berikutnya tidak langsung melanjutkan perubahan: ia membaca checkpoint,
memverifikasi source pada batas file lock, lalu mengambil alih atau meminta Agent 5 menandai
konflik. Ringkasan chat tidak pernah menggantikan checkpoint file.

Saat menutup tugas, catat proses sementara yang dijalankan dan hentikan milik agent sendiri
bila aman. Jangan memulai task manager atau job background hanya untuk menutup sesi.
Jalur Agent 1 Perencanaan boleh berlanjut bila runner aktif; jalur lain mengikuti handoff
dan checkpoint, tanpa proses tersisa yang tidak diperlukan.

## 6. Jeda oleh instruksi langsung Owner/Admin

- Ketika Owner/Admin berbicara langsung, jeda pekerjaan otonom dan kerjakan instruksi itu
  lebih dulu. Sebelum berpindah, catat pada `memory/CHECKPOINT.md`: item, peran/fase,
  batas lock dan file, perubahan yang sudah terjadi, bukti, risiko, serta tindakan berikutnya.
  Bila diminta berhenti seketika, hentikan tindakan baru dan tulis checkpoint saat aman.
- Jeda tidak membuat status INDEX baru, tidak berarti `PASS`, dan tidak otomatis mencabut
  lock. Agent 5 menangani serah-terima lock bila agent pelaksana berubah. Usul Agent 1 yang
  tertunda tetap usul, bukan item aktif.
- Pesan langsung `next`, `lanjut`, atau `next agent` melanjutkan pekerjaan otonom terakhir
  yang dijeda: baca kembali instruksi Owner/Admin yang masih berlaku, INDEX, checkpoint,
  dan bukti pada batas lock; lanjutkan fase tertunda. Instruksi terbaru yang mengubah atau
  membatalkan pekerjaan didahulukan dan dicatat sebagai keputusan. Gerbang izin Owner
  tetap berlaku untuk tindakan yang memang memerlukannya.
