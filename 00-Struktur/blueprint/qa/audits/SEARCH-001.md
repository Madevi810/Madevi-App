# Audit SEARCH-001 — Search Permission-Aware, Filter, Zero-Result

**Auditor:** Agent-3  
**Tanggal:** 2026-09-25T03:06Z  
**Item:** SEARCH-001 — Verifikasi search permission-aware, filter ruang/kategori, pemulihan zero-result  
**Metode:** Statis — 41 check (script Node.js regex + sinkronisasi kontrak + brace balance)

---

## Ringkasan

**Tidak ada temuan yang memerlukan perbaikan source.** Semua 41 check lulus. Implementasi
pencarian sudah sesuai kontrak L06: permission-aware di tiga layer (route, service SQL,
proyektor), filter ruang/kategori tersanitasi whitelist, dan UI overlay memiliki
zero-result, error, debounce, abort, dan pagination yang lengkap.

---

## Acceptance criteria wajib — semua PASS

| ID | Kriteria | Status | Bukti |
|---|---|---|---|
| AC-01 | `currentPrincipal` dari session, bukan param user | **PASS** | Route memanggil `currentPrincipal(request)` → `getSessionPrincipal` |
| AC-02 | MEMBER tidak bocor ke tamu | **PASS** | `canReadMember=false` → `AND access_level = 'PUBLIC'` di SQL |
| AC-03 | MEMBER = login+APPROVED+entitlement/OWNER | **PASS** | Logic tiga kondisi eksplisit di service |
| AC-04 | Block sosial PROFILE/POST | **PASS** | `social_blocks` JOIN di SQL utama dan fallback |
| AC-05 | is_test hanya fixture | **PASS** | `is_test = false OR $N = true` (fixture flag) |
| AC-06 | Fallback pra-0031 tetap block | **PASS** | `legacyBlock` via object_id |
| AC-07 | Filter whitelist space+category | **PASS** | `ALLOWED_SPACES`, `ALLOWED_TYPES` dengan `.filter()` sebelum masuk query |
| AC-08 | Limit 1–100 | **PASS** | `Math.min(Math.max(rawLimit, 1), 100)` |
| AC-09 | Cursor tamper → SearchError | **PASS** | `catch` dalam `decodeCursor` melempar `SearchError` |
| AC-10 | Zero-result pesan + saran filter | **PASS** | `results.length === 0` + pesan "Tidak ditemukan. Coba kata kunci lain atau filter ruang berbeda." |
| AC-11 | Error + retry + debounce + abort | **PASS** | `setRetryKey`, `AbortController`, `setTimeout(300)` |
| AC-12 | Highlight escape (no innerHTML) | **PASS** | `HighlightedText` pakai React `<mark>` node, regex escaped |
| AC-13 | targetHref whitelist server | **PASS** | `resolveSearchTarget` + `SEARCH_TARGET_ALLOWLIST` |
| AC-14 | Entry tanpa target fail-closed | **PASS** | `if (!computed) continue` |
| AC-15 | SPACES overlay sinkron kontrak | **PASS** | 7/7 key match: explore, tutorial, school, line, services, shop, tools |

## Acceptance criteria terukur

| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | 31 check regex | Script Node.js | 0 FAIL | **31/31 PASS** |
| M-02 | 10 deep check | Script Node.js lanjutan | 0 FAIL | **10/10 PASS** |
| M-03 | 7 SPACES keys | Sinkronisasi kontrak vs overlay | 0 missing | **SINKRON** |
| M-04 | 4 file | Brace balance | 0 unbalanced | **4/4 PASS** |

## BELUM-DIVERIFIKASI (runtime)

- Hasil pencarian hanya PUBLIC saat tamu login — BELUM-DIVERIFIKASI (dev server dilarang Owner).
- Filter ruang benar-benar memfilter hasil di browser — BELUM-DIVERIFIKASI.
- Zero-result state terlihat saat DB kosong — BELUM-DIVERIFIKASI.
- Abort bekerja saat query diketik cepat — BELUM-DIVERIFIKASI.
- Fallback pra-0031 aktif jika migration 0031 belum dijalankan (lihat risiko di QA item).

**Justifikasi:** semua BELUM-DIVERIFIKASI bersifat medium (pola sudah ada di source); Owner melarang runtime. Wajib diverifikasi saat izin berubah.

## Temuan minor (tidak menghalangi PASS)

- Regex D-09 dalam script audit awal menghasilkan false-negative karena menangkap `'id'` dari `language?: 'id' | 'en'` di kontrak. Setelah regex diperbaiki, hasil SINKRON sempurna. Tidak ada perubahan source diperlukan.

---

## Keputusan

**AUDIT: PASS** — Tidak ada perubahan source diperlukan. Tidak ada temuan FAIL.  
Item siap ditandai PASS oleh Agent-4.
