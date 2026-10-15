# JASA-PORT-001 — Port komponen Madevi Services dari zip (5 jalur layanan)

**Status:** PASS (typecheck + runtime browser + query database)
**Tanggal:** 2026-10-13
**Pemegang lock:** Operator otonom (mandat Owner, KOREKSI-01: port dari zip, jangan tulis ulang)

## Ringkasan

Ruang Madevi Services sebelumnya hanya 3 jalur (LAYOUTS, CUSTOM, PCB).
Sekarang **5 jalur** sesuai visi Owner: Layouts, Desain Kustom, Layout PCB,
**Desain Logo**, **Undangan Digital**.

## File yang di-port (byte-identik dengan zip)

- `src/lib/theme-values.ts` (dependency baru)
- `src/components/jasa/career-panel.tsx`
- `src/components/jasa/invitation-gallery.tsx`
- `src/components/jasa/invitation-online.tsx`
- `src/components/jasa/invitation-order-form.tsx`
- `src/components/jasa/logo-service-panel.tsx`
- `src/components/jasa/pcb-order-form.tsx`
- `src/components/jasa/rumus-panel.tsx`
- `src/styles/jasa-redesign.css`

## File hasil merge (zip + retention live)

- `src/components/jasa-page.tsx` — dasar zip (5 tab, priceNote, panel LOGO + UNDANGAN),
  ditambah `BreadcrumbBar` milik live dipertahankan.
- `src/app/layout.tsx` — tambah import `jasa-redesign.css`.
- `src/components/jasa/standalone-invitation-order.tsx` — hapus prop usang
  `showEmptyCatalogForm` (tidak ada di versi zip `InvitationGallery`).

## Keputusan: live menang (tidak di-port)

- `src/app/jasa/undangan/order/page.tsx` — live sudah pakai
  `StandaloneInvitationOrder` (form lengkap); zip masih placeholder TODO.

## Bukti verifikasi

### 1. Typecheck
`tsc --noEmit` → **EXIT=0** (0 error)

### 2. HTTP (dev server, setelah restart mode development)
```
tab=layouts   HTTP=200
tab=custom    HTTP=200
tab=pcb       HTTP=200
tab=logo      HTTP=200
tab=undangan  HTTP=200
```

### 3. Browser nyata (React hydration)
- Navigasi 5 jalur: "Madevi Layouts | Desain Kustom | Layout PCB | Desain Logo | Undangan Digital"
- Tab UNDANGAN: panel "05 · UNDANGAN DIGITAL", paket "Satu paket berisi 2 template desain",
  "Mulai dari Rp30rb", langkah 1-2-3 (pilih template → isi detail → URL + PDF)
- Tab LOGO: panel "Jasa Logo & Banner" — galeri karya, jenis Logo/Banner,
  form brief, kontak admin@madevi.local
- `pathCount: 5`, `panelLogo: true`

### 4. Flow order undangan end-to-end
Browser: isi form (groom/bride/date/city/venue) → submit → response:
```
"Permintaan Terkirim!"
Status: Menunggu pemeriksaan Admin
Private: /jasa/undangan/order?token=ca0fdcca...
Final:   /undangan/budi-santoso-sari-dewi-20122026-4e7c
```

### 5. Query database (PostgreSQL `madevi_off`)
```sql
SELECT status, public_slug, package_format FROM invitation_orders
ORDER BY created_at DESC LIMIT 3;
```
```
PENDING_APPROVAL | budi-santoso-sari-dewi-20122026-4e7c | ONLINE
PENDING_APPROVAL | budi-santoso-sari-dewi-20122026      | ONLINE
PENDING_APPROVAL | budi-santoso-sari-dewi-020261220     | ONLINE
```
Order benar-benar tersimpan, status mesin statusnya sesuai (PENDING_APPROVAL).

## Catatan
- API `POST /api/v1/jasa/undangan/order` menerima field `packageFormat`,
  `groomName`, `brideName` (snake_case). Form browser mengirim skema yang sama
  sehingga 200/201. Test curl awal dengan field `groom`/`bride` (salah skema)
  mengembalikan 500 → itu kesalahan payload test, bukan bug server.
- Halaman `/undangan/[slug]` hanya menampilkan order berstatus APPROVED; order
  baru menampilkan status menunggu — perilaku yang diharapkan.
