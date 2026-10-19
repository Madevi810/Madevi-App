# Rencana Induk: Tools & Equipment (19 Okt 2026)

## Daftar Tool (56+ berfungsi + baru)
Existing: 40+ di registry (cicilan, QR, password, BMI, PPN, PPh, suhu, kata, diskon, umur, zakat, mata uang, winrate, air, piket, THR, terbilang, kalender haid, acak nama, lembur, cek-aman-rangkaian, dll).

### Tool Baru (target +16 = 56+)
1. Kalkulator pecahan (tambah/kurang/kali/bagi + langkah)
2. Konversi desimal↔biner↔heksa
3. Kalkulator IP subnet
4. Stopwatch + timer
5. Konversi resep masakan (cup↔gram)
6. Kalkulator cat tembok (luas → liter)
7. Estimasi biaya listrik rumah
8. Kalkulator cicilan motor/mobil (DP, tenor)
9. Konversi mata uang dengan kurs manual
10. Penghitung hari (selisih tanggal)
11. Generator password lanjutan (sudah ada — tingkatkan)
12. Kalkulator BMI anak (percentile)
13. Konversi suhu oven (°C↔°F↔Gas Mark)
14. Kalkulator kebutuhan air (sudah ada — tingkatkan)
15. Pembagi tagihan (split bill)
16. Konversi ukuran baju (US/UK/EU/Asia)

## Fitur & Kriteria Terukur
### F-TL1: ToolRunner generik (sudah ada)
- **Kriteria**: Semua 56+ tool bisa dibuka via /tools/[id]; form tampil; hasil benar.

### F-TL2: Validasi & contoh
- **Kriteria**: Tiap tool: validasi input, pesan galat jelas, contoh terisi, hasil + interpretasi.

### F-TL3: Langkah penyelesaian (matematika)
- **Kriteria**: Tool matematika tampilkan langkah (pola Symbolab).

### F-TL4: Riwayat perhitungan
- **Data**: localStorage (tanpa login)
- **Kriteria**: 10 perhitungan terakhir tersimpan; bisa dibuka ulang.

## Urutan & Dependensi
1. F-TL2 (standarkan semua existing) → 2. 16 tool baru → 3. F-TL3 → 4. F-TL4

## Test
- Content floor check: 56+ tool, tiap dengan penjelasan + contoh.
- Vitest: tiap tool punya test perhitungan.
- Audit: pakai 5 tool acak sebagai pengguna; verifikasi hasil manual.
