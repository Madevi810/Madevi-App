# INOVASI-1045 + 1145 + 1245 — Rencana 6 Ide (catatan pra-coding)

Sesuai instruksi: catat SEBELU coding (tujuan, alur, desain — maks 15 baris
per item). Verifikasi static saja (INSTRUKSI-02); migrasi ditulis sebagai
file dan diserahkan ke Muse. Nomor migrasi: 0042/0043 sudah dipakai
(kindness/story, shop-bundle), lanjut 0044–0049.

## LINE-LISTEN-001 — "Giliran Dengar" (1045 IDE 1, Sosial Curhat)
Tujuan: curhat terstruktur berbasis giliran — nasihat dilarang sampai
pembicara membuka "Saya butuh saran".
Alur: `listen_sessions` (status ANTRI/BERJALAN/SELESAI, needs_advice,
20 menit server-side) + `listen_responses` (REFLEKSI/SEMANGAT/SARAN);
service tolak SARAN bila needs_advice=false; 6 template refleksi sekali-klik;
maks 12 pendengar, 1 sesi/6 jam, 20 respons/jam; Laporkan reuse INSTRUKSI-03.
Migrasi: 0044-listen-turn.

## SHOP-DUEL-001 — "Duel Produk" (1045 IDE 2, Shop affiliate)
Tujuan: komparasi head-to-head 2 produk afilasi + vote beralasan wajib.
Alur: `product_duels` + `duel_points` (PRO/KONTRA, ≥20 char) +
`duel_votes` (UNIQUE voter, reason ≥30 char); job tutup duel → winner_id →
badge "Pilihan Komunitas" di katalog; produk dari katalog yang ada, DILARANG
mengarang produk; deteksi lonjakan vote → antrean moderasi.
Migrasi: 0045-duel.

## LINE-SIDANG-001 — "Sidang Warga" (1145 IDE 1, grup Line)
Tujuan: musyawarah formal 3 fase TANYA→SANGGAH→VOTING + kuorum 60%.
Alur: `sidang_sessions` (fase, quorum_pct, timer fase server-side) +
`sidang_arguments` (TANYA/JAWAB/SANGGAH/DUKUNG, kind dibatasi per fase) +
`sidang_votes` (anonim, voter_hash=HMAC(user,session), UNIQUE); voting
terkunci sampai ≥2 sanggah; hasil hanya tampil setelah voting tutup
(anti-bandwagon); maks 2 sidang aktif/grup.
Migrasi: 0046-sidang-warga.

## LINE-CLINIC-001 — "Klinik Ide" (1145 IDE 2, Sosial Karya)
Tujuan: kritik karya 3 fase BERTANYA→MEMBEDAH→APRESIASI.
Alur: `clinic_sessions` (work_ref ke post KARYA, 1 klinik per karya) +
`clinic_feedback` (PERTANYAAN/SARAN/APRESIASI, kind divalidasi vs fase);
template sekali-klik per fase; vote "Pilihan Klinik" 1x/user hanya di fase
APRESIASI; timer fase server-side; "Disorot Klinik" mingguan.
Migrasi: 0047-klinik-ide.

## LINE-LINEAGE-001 — "Silsilah Karya" (1245 IDE 1, Sosial Karya)
Tujuan: pohon turunan karya remix + atribusi otomatis cegah pencurian ide.
Alur: `parent_karya_id` di social_posts + `karya_lineage` (ancestor, depth);
remix form isi otomatis; pohon SVG 4 generasi lazy-load; badge Induk Ide
(≥5 turunan) / Kakek Ide (≥25 total); leaderboard "Karya Paling Beranak";
footer atribusi server-side; anti-sirkular; filter "Hanya karya benih".
Migrasi: 0048-silsilah-karya.

## SHOP-PETITION-001 — "Petisi Katalog" (1245 IDE 2, Shop affiliate)
Tujuan: pengguna usulkan produk afiliasi + voting kuorum 50.
Alur: `catalog_petitions` (link WAJIB, alasan ≤300 kata, status
DIUSULKAN/DITINJAU/TERDAFTAR/DITOLAK) + `petition_votes` (UNIQUE, bisa cabut);
progress bar kuorum 50 → DITINJAU + notif admin; admin setuju/tolak dengan
alasan publik; badge Kurator (≥3 TERDAFTAR); deteksi duplikat link via
normalisasi URL (allowlist domain marketplace).
Migrasi: 0049-petition.

Urutan kerja: LISTEN → DUEL → SIDANG → CLINIC → LINEAGE → PETITION
(mengikuti prioritas yang diminta di tiap file).
