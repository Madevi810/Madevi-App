# Kontrak API Madevi — P07 (Spesifikasi untuk Contract Test)

Status: MENUNGGU-UJI-ADMIN · Domain: Web · Waktu: 2026-09-20 02:55

Dokumen ini adalah **satu sumber kebenaran** perilaku API. Contract test wajib
ditulis dari sini **tanpa menebak** (kriteria lulus P07). P07 melarang gateway
eksternal; semua dijalankan dalam satu aplikasi Next lokal.

## 1. Resolusi akses tunggal

**Satu resolver**: `src/api/access-policy.ts` (`AccessPolicyResolver`).

Route **dilarang** menulis logika akses sendiri. Pola wajib:

```ts
const ctx = await resolver.loadPrincipalContext(auth.principal.id);
const decision = resolver.decideToolsAccess(ctx);
if (!decision.allowed) {
  throw new ApiError('ACCESS_DENIED', policyReasonMessage(decision.reason));
}
```

### 1.1 Sumber data resolver (satu round-trip)

| Aspek         | Sumber                                               | Catatan                                       |
| ------------- | ---------------------------------------------------- | --------------------------------------------- |
| Role aplikasi | `principals_role_view` (0021)                        | `ADMIN`/`USER`; NULL → turun dari `role` lama |
| Paket         | `principal_entitlement_current` (0021)               | fallback `FREE`                               |
| Trial Tools   | `tools_trial_remaining` / `tools_trial_total` (0021) | NULL = belum dipakai                          |
| Status akun   | `approval_status`, `lifecycle_status`                |                                               |
| Ownership     | kolom resource `owner_principal_id`                  | cek per-resource                              |

### 1.2 Matriks keputusan

| Kondisi                     | `decideBase(write)`       | `decideToolsAccess`              | `decideSchoolAccess`   |
| --------------------------- | ------------------------- | -------------------------------- | ---------------------- |
| Tanpa sesi                  | `AUTHENTICATION_REQUIRED` | `AUTHENTICATION_REQUIRED`        | sama                   |
| `lifecycle=DELETED`         | `NOT_FOUND`               | `NOT_FOUND`                      | sama                   |
| `lifecycle=SUSPENDED`       | `ACCOUNT_SUSPENDED`       | `ACCOUNT_SUSPENDED`              | sama                   |
| `approval≠APPROVED` (write) | `NOT_APPROVED`            | `NOT_APPROVED`                   | sama                   |
| Paket PLUS/PRO/LOVE         | ALLOWED                   | ALLOWED (`via:package`)          | PRO/LOVE saja          |
| FREE + sisa trial >0        | ALLOWED                   | ALLOWED (`via:trial, remaining`) | `PACKAGE_INSUFFICIENT` |
| FREE + sisa 0               | ALLOWED                   | `TRIAL_EXHAUSTED`                | `PACKAGE_INSUFFICIENT` |
| ADMIN                       | ALLOWED                   | ALLOWED                          | ALLOWED (bypass)       |

`decideOwnership`: ADMIN bypass; lainnya harus `ctx.id === ownerId`.

`decideContentVisibility`: non-terbit hanya ADMIN; `PUBLIC` bebas; `MEMBER`
wajib login + `APPROVED`.

### 1.3 Alasan = error code stabil

`policyReasonMessage(reason)` memetakan ke pesan **tidak membocorkan** internal
(lihat `access-policy.ts`). Route memakai pesan ini, bukan teks buatan.

## 2. Kontrak respons

### 2.1 Bentuk

Sukses: `{ data, requestId, page? }`.
Error: `{ error: { code, message, fields? }, requestId }`.
Header: `cache-control: no-store`, `x-request-id`.

### 2.2 Error code + status (stabil, tidak boleh berubah)

| code                      | status | Kapan                                        |
| ------------------------- | ------ | -------------------------------------------- |
| `VALIDATION_FAILED`       | 400    | input tidak lulus schema                     |
| `AUTHENTICATION_FAILED`   | 401    | kredensial salah                             |
| `AUTHENTICATION_REQUIRED` | 401    | tidak ada sesi                               |
| `ACCESS_DENIED`           | 403    | kebijakan melarang                           |
| `NOT_FOUND`               | 404    | resource tidak ada / dihapus                 |
| `IDEMPOTENCY_CONFLICT`    | 409    | key dipakai payload berbeda                  |
| `VERSION_CONFLICT`        | 409    | optimistik lock gagal                        |
| `QUOTA_EXCEEDED`          | 409    | kuota habis                                  |
| `PAYLOAD_TOO_LARGE`       | 413    | > batas endpoint                             |
| `RATE_LIMITED`            | 429    | rate limit                                   |
| `DEPENDENCY_UNAVAILABLE`  | 503    | DB/storage lokal turun                       |
| `INTERNAL_ERROR`          | 500    | lainnya (log penuh, user lihat teks generik) |

**Aturan**: tidak ada error code baru tanpa tambah di sini. Tidak ada code
"berhasil" yang membocorkan struktur internal.

### 2.3 Field privat — DILARANG dikirim

Response API **tidak boleh** mengandung:
`password_hash`, `refresh_token_hash`, `csrf_token_hash`, `relative_path`,
`storageRoot`, `payload_hash` mentah, `photo_object_id` orang lain, atau
`schema` fisik.

Enforcement: `redactLogFields` (logger) + audit tinjauan route. Contract test
wajib menegaskan daftar hitam ini (`contract test A-6`).

## 3. Validasi input per endpoint

| Aspek           | Aturan global                                                           |
| --------------- | ----------------------------------------------------------------------- |
| JSON body       | `parseJsonObject` (default 64KB, bisa 128KB untuk register)             |
| Batas panjang   | `requiredText` min/maks eksplisit per field                             |
| Enum            | daftar literal + `ApiError(fields)` bila salah                          |
| Pagination      | `limit` 1–100; cursor opaque base64url `decodeCursor`                   |
| Sort            | **whitelist** nama kolom per route (tidak terima sembarang)             |
| Tipe file       | allowlist MIME + ekstensi; ukuran via content-length **dan** byte nyata |
| Idempotency-Key | `/^[A-Za-z0-9._:-]{8,128}$/`                                            |

**Catatan sort whitelist**: route yang menerima parameter sort wajib memetakan
string ke kolom yang diizinkan; string lain → `VALIDATION_FAILED`. Ini mencegah
SQL injection via order-by.

## 4. Keamanan lintas-request

| Kontrol          | Implementasi                                                             | Verifikasi |
| ---------------- | ------------------------------------------------------------------------ | ---------- |
| Request ID       | header masuk atau generated; dikembalikan + di audit                     | A-1        |
| Audit event      | setiap tulis via `appendAuditEvent` (actor, object, details, fixture)    | A-2        |
| Rate limit       | `consumeRateLimit` per (principal, bucket); `FOR UPDATE` dalam transaksi | A-3        |
| CSRF             | `assertRequestCsrf` header vs cookie untuk audience                      | A-4        |
| Session rotation | refresh token diputar + `used_refresh_tokens` (P02 fix)                  | A-5        |
| Idempotency      | `beginIdempotentOperation` + payload hash + replay respons               | A-7        |

## 5. Pemisahan route Admin vs User

- User: `/api/v1/*` — audience `MEMBER` (46+ route).
- Admin: `/api/v1/owner/*` — audience `OWNER` + `{ humanActivity: true }` (46 route).
- Login Admin terpisah (`/owner/login`) — `06`.
- **Tidak ada** route User yang menerima parameter role; role hanya dari sesi.

**Rencana transisi legacy**: nilai `OWNER/MEMBER` fisik masih di DB dan session
audience. 0021 menambah `role_kind` (`ADMIN/USER`) + view. Route **tetap**
memakai audience `MEMBER`/`OWNER` untuk cookie hingga 0022 mengisi `role_kind`;
resolver sudah membaca `role_kind` dengan fallback — sehingga perubahan nanti
hanya di cookie, bukan di 46 route. **Tidak ada pintu bypass** karena otorisasi
selalu lewat resolver, bukan parameter request.

> Catatan: helper `src/api/policy.ts` (`requireApproved`, `canReadOwnedRecord`,
> `requirePrincipal`) tetap aktif di **lapis service** (5 service memakainya).
> Resolver P07 adalah lapis route. Jangan hapus `policy.ts`.

## 6. Matriks threat (wajib dijawab oleh setiap tulis)

Setiap endpoint tulis wajib menjawab di `docs` route atau JSDoc:

| Threat                   | Mitigasi wajib                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| **IDOR**                 | ownership via `decideOwnership`; resource dimuat by id **lalu** cek owner, bukan filter pertama |
| **Privilege escalation** | role dari sesi saja; `ADMIN` hanya lewat resolver; tidak ada param role                         |
| **Replay**               | request-id + nonce/CSRF; refresh token satu kali                                                |
| **Double-submit**        | `Idempotency-Key` + payload hash + replay respons                                               |
| **Enumeration**          | pesan login generik; `NOT_FOUND` vs `ACCESS_DENIED` dipakai konsisten                           |
| **Mass assignment**      | whitelist field eksplisit (`bodyText`/`optionalBodyText`), tidak `Object.assign(body)`          |
| **Race condition**       | `inTransaction` + `FOR UPDATE` (rate limit, trial, entitlement)                                 |

## 7. Contract test yang harus dapat ditulis dari dokumen ini

| ID   | Assertion                                                               |
| ---- | ----------------------------------------------------------------------- |
| A-1  | Setiap respons punya `requestId` di body + `x-request-id`               |
| A-2  | Setiap endpoint tulis menulis `audit_events` (actor tercatat)           |
| A-3  | Bucket rate limit terisi; kelebihan → `RATE_LIMITED` 429                |
| A-4  | POST tanpa CSRF → `ACCESS_DENIED`; header+cookie tidak cocok → sama     |
| A-5  | Refresh memutar token; token lama → `AUTHENTICATION_FAILED`             |
| A-6  | Response **tidak** mengandung satu pun field daftar hitam §2.3          |
| A-7  | Idempotency-Key sama + payload beda → `IDEMPOTENCY_CONFLICT`            |
| A-8  | `decideToolsAccess`: FREE+sisa 0 → `TRIAL_EXHAUSTED`; PLUS → ALLOWED    |
| A-9  | `decideSchoolAccess`: FREE/PLUS → `PACKAGE_INSUFFICIENT`; PRO → ALLOWED |
| A-10 | `decideOwnership`: user lain punya id → `NOT_OWNER`                     |
| A-11 | Error code ↔ status tabel §2.2 tepat                                    |
| A-12 | Route Admin menolak sesi MEMBER dan sebaliknya                          |

## 8. Audit statis P07

- `AccessPolicyResolver` 5 metode keputusan + 1 loader; semuaVia `quotedSchema`.
- `policyReasonMessage` 11 alasan; tidak ada teks internal (nama tabel/kolom).
- Tidak ada SQL string concatenation dari input pengguna di resolver.
- Resolver membaca **hanya** tabel 0021 + `principals`; tidak menulis.

## 9. Sisa risiko

1. **`policy.ts` BUKAN dead code.** Audit pertama keliru (hanya scan
   `src/app/api/`). Nyatanya 5 service memakainya: `requireApproved` di
   `moderation.ts`, `social.ts`, `records.ts`, `outbox.ts`, `storage.ts`;
   `canReadOwnedRecord` + `requirePrincipal` di `records.ts`. **Dipertahankan
   utuh.** Resolver P07 TIDAK menggantikannya — resolver adalah lapisan route,
   helper lama adalah lapisan service. Keduanya hidup berdampingan.
   **Koreksi penting:** laporan ini membenarkan klaim salah sebelumnya.
2. **Dual sumber antara `policy.ts` (service) + `access-policy.ts` (route).**
   Sementara diperlukan karena migrasi bertahap. Konsolidasi setelah semua
   route memakai resolver (P08+), bukan sekarang.
3. **Belum ada enforcement otomatis §2.3** (daftar hitam field). Saat ini
   mengandalk audit manual + `redactLogFields` (log saja, bukan respons).
   Contract test A-6 belum ada.
4. **Sort whitelist belum terpusat.** Tiap route harus jaga sendiri; beberapa
   route mungkin belum membatasi. Audit per route perlu dilakukan (P19).
5. **`entitlementView` (accounts.ts) masih dipakai `privateProfile`.** Dual
   sumber dengan resolver. Migrasi `privateProfile` ke resolver di P08+ agar
   satu sumber; jangan hapus sebelum aman.
6. **Resolver bergantung 0021 terpasang** (sama seperti P06). Fallback
   `COALESCE(ec.entitlement,'FREE')` melindungi user lama, tapi tabel harus ada.
7. **`humanActivity: true`** hanya di sebagian route Admin. Cek seragam di P16.

## 10. Instruksi uji Admin

1. **Statis**: konfirmasi `AccessPolicyResolver` ada di `src/api/access-policy.ts`.
2. **Statis**: pilih 3 route Admin + 3 route User; konfirmasi semua lewat
   `authenticateRequest` + CSRF, tidak ada yang menulis logika akses inline.
3. **Contract test**: tulis A-1..A-12 dari dokumen ini (P19 atau terpisah);
   jalankan; semua harus lulus. Ini bukti lulus P07.
4. **A-8/A-9/A-10** bisa diuji langsung dengan user simulasi FREE/PLUS/PRO.
5. **A-6**: respons `/api/v1/profile` tidak boleh mengandung `password_hash`
   dll. — periksa via DevTools Network.
6. Putuskan `LULUS-ADMIN`/`DITOLAK-ADMIN`.
