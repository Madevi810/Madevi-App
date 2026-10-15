# TOOLS-PORT-001 — Port formula elektronika & utilitas dari zip

**Status:** PASS (verifikasi statis + unit test + runtime API)
**Tanggal:** 2026-10-13
**Pemegang lock:** Operator otonom (mandat Owner 2026-10-13 + KOREKSI-01)
**Lock induk:** EMULATOR-001 (yang memegang `src/services/utilities.ts` sejak 2026-09-28)

## Masalah

Live workspace (Oct 8–9) hanya memiliki 10 formula di `src/services/utilities.ts`
(3 MATH, 5 PHYSICS, 3 FINANCE). Zip terbaru (Oct 13 21:06) sudah memiliki 17 formula
termasuk kategori `ELECTRONICS` baru (hukum_ohm, pembagi_tegangan, kode_warna_resistor)
dan 4 utilitas umum (konversi_suhu, bmi, persen, konversi_panjang).

STATUS.md zip menyebut "Tools: 17 formula live" — klaim itu hanya benar di zip,
tidak di live. Live tidak punya formula elektronika sama sekali.

## Yang dilakukan

### KOREKSI-01: port dari zip, bukan tulis ulang

Pertama kali saya menulis 7 formula dari nol di live. KOREKSI-01 (Muse) menegur ini
sebagai kerja ganda + risiko divergensi. Saya:

1. **Menghapus** ketujuh implementasi buatan saya dari live.
2. **Membaca** implementasi asli dari zip (`content-Madevi.zip` → scratch).
3. **Memport** blok 7 formula tersebut ke live (`sed` insert presisi).
4. **Memverifikasi** `diff` bagian formula live vs zip → **IDENTIK 100%**.

Catatan teknis: saat port, satu baris penutup objek `cicilan_fixed` (`},`) hilang
akibat offset baris yang saya hitung dari versi yang sudah saya modifikasi.
Ditambahkan kembali; typecheck kembali bersih.

### Formula yang dipindahkan (7)

| # | ID | Kategori | Status |
|---|---|---|---|
| 1 | `hukum_ohm` | ELECTRONICS | port-dari-zip |
| 2 | `pembagi_tegangan` | ELECTRONICS | port-dari-zip |
| 3 | `kode_warna_resistor` | ELECTRONICS | port-dari-zip |
| 4 | `konversi_suhu` | PHYSICS | port-dari-zip |
| 5 | `bmi` | PHYSICS | port-dari-zip |
| 6 | `persen` | MATH | port-dari-zip |
| 7 | `konversi_panjang` | PHYSICS | port-dari-zip |

Semua **port-dari-zip**, nol tulis-baru untuk ketujuhnya. Tipe `FormulaDef.category`
diperluas dengan `ELECTRONICS` (mengikuti zip).

## Bukti verifikasi

### Typecheck
`node node_modules/typescript/bin/tsc --noEmit` → **EXIT 0** (0 error).

### Unit test baru
`tests/unit/tools-port-formulas.test.ts` — **14/14 PASS**. Mencakup:
- pendaftaran 17 formula + kategori ELECTRONICS (3);
- hukum_ohm: mencari I (12V/4Ω=3A, P=36W), mencari V (2A×6Ω=12V), mencari R
  (9V/3A=3Ω), dan penolakan input tidak persis-dua-terisi;
- konversi_suhu: 100°C → 212°F / 373.15 K / 80°R;
- pembagi_tegangan: 12V dengan R1=1000Ω R2=2000Ω → 8V; penolakan resistor ≤0;
- kode_warna_resistor: gelang 4-7-pengali2 → 4700 Ω (4.7 kΩ); penolakan angka >9;
- bmi: 60 kg / 170 cm → 20.7612 Normal;
- persen: 25% dari 80 → 20;
- konversi_panjang: 2 m → 2000 mm + 0.002 km + 200 cm + 78.7402 inci + 6.5617 kaki;
- determinisme: input sama → `value` dan `steps` identik untuk semua 7 formula.

### Runtime API
Server live direstart dari `production-local` (build Oct 9) ke mode
`development` karena build production lama tidak memuat perubahan dan disk
hanya tersisa 4.7 GB (build production berisiko gagal).

`GET /api/v1/utilities/rumus` sekarang mengembalikan **17 formula** termasuk
`hukum_ohm`, `pembagi_tegangan`, `kode_warna_resistor`, `konversi_suhu`, `bmi`,
`persen`, `konversi_panjang`. Sebelumnya 10.

`/api/health` → `{"status":"ok","application":"ok","database":"ok"}`.

Eksekusi `POST` memerlukan sesi MEMBER (gate Tools trial), sehingga kebenaran
perhitungan diverifikasi via unit test fungsi murni, bukan via HTTP.

## File yang berubah

- `Madevi_Off/src/services/utilities.ts` — +7 formula (port identik dari zip),
  tipe category +`ELECTRONICS`.
- `Madevi_Off/tests/unit/tools-port-formulas.test.ts` — baru, 14 test.
- `Madevi_Off/tests/unit/env.test.ts` — diperbaiki (lihat KNOWN-ISSUES K-01).
- `Madevi_Off/src/server/env.ts` — diperbaiki (K-01), backup `env.ts.bak-pre-envfix`.
- `Madevi_Off/src/components/dialog-behavior.ts` — focus trap deterministik (K-02).
- `Madevi_Off/tests/unit/prompt03-behavior.test.tsx` — assertion tab order (K-02).
- `Madevi-Control/blueprint/qa/KNOWN-ISSUES-2026-10-13.md` — baru.

## Tidak diubah

Route, API kontrak, auth/CSRF, database, migration, sidebar, header struktur,
tema, data pengguna. Semua perubahan adalah penambahan (additive) kecuali
perbaikan bug env.ts dan dialog-behavior.ts.

## Titik lanjut

Ruang berikutnya sesuai urutan mandat: **Madevi Services** (ruang 5 — usaha
penghasilan Ade). Zip memiliki `standalone-invitation-order.tsx`,
`payment-simulator.tsx`, `oauth-simulation.ts`, route `/pembayaran`,
`/auth/oauth` yang belum ada di live — kandidat port berikutnya.
