# LINE-PORT-001 — Port visual redesign Madevi Line dari zip

**Status:** PASS untuk bagian visual (typecheck bersih).
**Tanggal:** 2026-10-13
**Pemegang lock:** Operator otonom (mandat Owner, KOREKSI-01: port dari zip)

## Ringkasan

Madevi Line di live memakai komponen sosial lama. Zip membawa **REDESIGN
13 Okt 2026 — hanya visual, logika & API tidak diubah** (komentar asli zip).
Bagian visual aman di-port; bagian fitur (postType CURHAT/KARYA + guest view)
**TIDAK di-port** karena butuh migrasi database (lihat "Belum di-port").

## File yang di-port

- `src/styles/social-redesign.css` (byte-identik; class `.line-*`)
- `src/components/social-feed.tsx` (byte-identik)
- `src/components/social-tabs.tsx` (byte-identik)
- `src/app/layout.tsx` — tambah import `social-redesign.css`

Semua file di atas identik 100% dengan zip.

## Fitur visual zip yang sekarang live

1. **social-feed**: ikon inline SVG (PaletteIcon, HeartIcon, LikeIcon, dll —
   tanpa emoji), class `.line-composer`, `.line-actions`, `.line-comment*`,
   `.line-avatar`, `.line-badge--curhat` / `.line-badge--karya`.
2. **social-tabs**: `initials()` untuk avatar teks, ikon UsersIcon/PostIcon,
   `.line-*` cards untuk FriendsTab, MyPostsTab, NotificationsTab.
3. CSS `.line-*` lengkap (composer quota, action counts, danger action,
   badge safe/muted, comment thread, dll).

## Keputusan: live menang (tidak di-port)

- `src/components/social-dashboard.tsx` — live memakai `tabGroups` terstruktur:
  "Ruang Saya" (Feed/Postingan/Notifikasi), "Teman & Pesan" (Teman/Pesan),
  "Komunitas" (Grup) + `BreadcrumbBar`. Zip memakai `TAB_ORDER` datar tanpa
  pengelompokan. Live lebih sesuai visi pemisahan aktivitas, dipertahankan.
- Dashboard hanya mengimpor `FriendsTab`, `MyPostsTab`, `NotificationsTab`
  dari social-tabs — ketiganya ada di versi zip, kompatibel.

## Bukti verifikasi (statistik, per INSTRUKSI-02: tanpa runtime)

### 1. Typecheck
`tsc --noEmit` → **EXIT=0** (0 error)

### 2. Kompatibilitas import
`social-dashboard.tsx` (live) mengimpor `{ FriendsTab, MyPostsTab,
NotificationsTab }` dari `./social-tabs` — ketiga export ada di versi zip
(baris 79, 176, 281). Tidak ada import yang putus. ✓

### 3. Isolasi style
`social-redesign.css` hanya berisi selector `.line-*` (24+ selector utama:
`.line-action`, `.line-avatar`, `.line-badge`, `.line-comment*`,
`.line-composer`, `.line-center`, ...). Class `.social-*` milik dashboard
live TIDAK ditimpa — kedua sistem berdampingan tanpa konflik. ✓

## Belum di-port (butuh verifikasi runtime oleh Muse)

Zip menambahkan **2 fitur fungsional** yang melampaui redesign visual.
Keduanya butuh perubahan database + service + API + UI secara serentak.
Tidak boleh di-port sebagian (akan menghasilkan kode yang tidak konsisten).

### A. postType CURHAT / KARYA
Visi Owner: 2 tipe postingan — SOSIAL KARYA (share ide/karya/inovasi) dan
SOSIAL CURHAT (keluarkan isi hati/masalah).

Bukti di zip (yang sengaja TIDAK di-port):
- `src/app/api/v1/social/posts/route.ts` baris 45:
  `const postType = body.postType === 'CURHAT' ? 'CURHAT' : 'KARYA';`
  + `postType` ikut di-insert.
- `src/services/social.ts` versi live: `createPost` TIDAK menerima `postType`
  (signature: body, linkUrl, attachmentIds, groupId, audiencePolicy).
- **Database live: kolom `post_type` TIDAK ADA** di tabel `social_posts`
  (diverifikasi via `information_schema.columns` — hasil kosong).

→ Butuh migrasi database baru (tambah kolom `post_type`), update service,
update API, baru UI. Ranah Muse (runtime + DB restore).

### B. LineGuestView (guest preview Madevi Line) — SUDAH DI-PORT
Zip: `src/app/sosial/page.tsx` memakai
`<PrivateRoute guestContent={<LineGuestView />}>`.

Yang dilakukan:
- `src/components/line-guest-view.tsx` — port byte-identik dari zip.
- `src/components/private-route.tsx` — tambah prop opsional `guestContent`.
  Perilaku default TIDAK berubah: bila `guestContent` tidak diberikan, guest
  tetap melihat `private-route__gate` + `AuthCard` (kode lama dipertahankan).
  Bila diberikan, guest melihat konten tersebut sebagai pengganti gate.
- `src/app/sosial/page.tsx` — port dari zip (pakai `guestContent`).

Verifikasi: `tsc --noEmit` EXIT=0. Perubahan auth boundary bersifat
additive-opt-in; gate lama tidak dihapus. **Disarankan Muse memverifikasi
render guest `/sosial` saat runtime.**

## Catatan
- Komentar zip asli: "REDESIGN 13 Okt 2026: hanya visual. Logika & API tidak
  diubah." — bagian visual di-port sesuai KOREKSI-01; bagian fitur ditunda
  dengan alasan tercatat di atas.
- Tabel `.line-badge--curhat` / `.line-badge--karya` sudah ada di CSS — siap
  dipakai saat fitur postType aktif.
