#!/bin/bash
# ============================================================================
# Madevi DB rebuild — SATU perintah untuk pulihkan database.
#
# Cara pakai (di Termux, dari folder 00-Termux):
#   bash madevi-rebuild.sh
#
# Struktur project:
#   Madevi-App/              <- root project
#   ├── 00-Termux/           <- script ini ada di sini
#   │   ├── madevi-rebuild.sh
#   │   └── start-dev.sh
#   ├── database/
#   │   ├── migrations/      <- 52 migrasi
#   │   ├── seeds/
#   │   │   ├── articles/    <- 120 file batch SQL + taksonomi
#   │   │   └── taxonomy/    <- JSON taksonomi
#   │   └── backup/
#   ├── src/                 <- source code aplikasi
#   └── .env.local           <- DATABASE_URL (dibuat oleh db:bootstrap)
# ============================================================================
set -euo pipefail

# Lokasi script ini = 00-Termux/, root project = satu level di atas
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SEED_DIR="$ROOT/database/seeds/articles"
PROJECT="$ROOT"

echo "=== Madevi DB Rebuild ==="
echo "Root : $ROOT"
echo "Seed : $SEED_DIR"

# 1. Cek folder seed otomatis
if [ ! -d "$SEED_DIR" ]; then
  echo "FATAL: folder database/seeds/articles/ tidak ditemukan di $ROOT" >&2
  exit 1
fi

BATCH_COUNT=$(ls "$SEED_DIR"/artikel-batch*.sql 2>/dev/null | wc -l)
echo "Ditemukan $BATCH_COUNT file batch artikel"

if [ ! -f "$PROJECT/.env.local" ]; then
  echo "PERINGATAN: $PROJECT/.env.local tidak ada."
  echo "Jalankan dulu: npm run db:bootstrap:termux"
  exit 1
fi

# 2. Ambil kredensial dari .env.local
export $(grep -E "^DATABASE_URL=" "$PROJECT/.env.local" | xargs)
if [ -z "${DATABASE_URL:-}" ]; then
  echo "FATAL: DATABASE_URL tidak ada di .env.local" >&2
  exit 1
fi

PSQL="psql $DATABASE_URL"

# 3. Migrasi
echo "--- Menjalankan migrasi ---"
cd "$PROJECT"
npm run db:migrate

# 3b. Pastikan principal owner seed ada (FK articles.created_by/updated_by menunjuk ke UUID ini)
echo "--- Pastikan principal owner ---"
$PSQL << 'SQLEOF'
INSERT INTO madevi.principals (id, business_code, kind, role, approval_status, entitlement_status, social_status, display_name)
VALUES ('f7125028-187e-44e0-b95b-88b69b8d5c9a', 'OWNER-SEED', 'OWNER', 'OWNER', 'APPROVED', 'NONE', 'ENABLED', 'Pemilik Madevi')
ON CONFLICT (id) DO NOTHING;
SQLEOF

# 4. Taksonomi dasar (error dicatat ke rebuild-errors.log, tidak disembunyikan)
echo "--- Load taksonomi ---"
$PSQL -f "$SEED_DIR/taksonomi-awal.sql" 2>> "$SCRIPT_DIR/rebuild-errors.log" || echo "  WARN: taksonomi-awal.sql ada error (cek rebuild-errors.log)"
$PSQL -f "$SEED_DIR/taksonomi-level2.sql" 2>> "$SCRIPT_DIR/rebuild-errors.log" || echo "  WARN: taksonomi-level2.sql ada error (cek rebuild-errors.log)"

# 5. Artikel batch (urut berdasarkan nomor)
echo "--- Load $BATCH_COUNT batch artikel ---"
FAILED_BATCH=0
for f in $(ls "$SEED_DIR"/artikel-batch*.sql | sort -t'-' -k3 -n); do
  if ! $PSQL -f "$f" 2>> "$SCRIPT_DIR/rebuild-errors.log"; then
    echo "  GAGAL: $(basename $f) (cek rebuild-errors.log)"
    FAILED_BATCH=$((FAILED_BATCH + 1))
  fi
done
if [ "$FAILED_BATCH" -gt 0 ]; then
  echo "  $FAILED_BATCH batch gagal dimuat!"
fi

# 6. Artikel rebuild dasar
if [ -f "$ROOT/database/backup/artikel-rebuild.sql" ]; then
  echo "--- Load artikel dasar ---"
  $PSQL -f "$ROOT/database/backup/artikel-rebuild.sql" > /dev/null 2>&1 || true
fi

# 7. Perbaiki path_slug (wajib untuk route Indonesia)
echo "--- Perbaiki slug taksonomi ---"
$PSQL << 'SQLEOF'
UPDATE madevi.taxonomy_nodes SET path_slug='jelajahi-pengetahuan' WHERE path_code='R2';
UPDATE madevi.taxonomy_nodes SET path_slug='tutorial-problem-solve' WHERE path_code='R1';
UPDATE madevi.taxonomy_nodes SET path_slug='pendidikan-sekolah' WHERE path_code='R3';
UPDATE madevi.taxonomy_nodes SET path_slug = 'jelajahi-pengetahuan' || substring(path_slug from 13) WHERE path_slug LIKE 'explore-learn/%';
SQLEOF

# 7b. Aktifkan revision taksonomi (wajib — tanpa ini API taxonomy error "belum dipromosikan")
echo "--- Aktifkan revision taksonomi ---"
$PSQL << 'SQLEOF'
UPDATE madevi.taxonomy_state
SET active_revision_id = (
  SELECT id FROM madevi.taxonomy_revisions
  WHERE status = 'ACTIVE'
  ORDER BY promoted_at DESC NULLS LAST, id
  LIMIT 1
),
updated_at = NOW()
WHERE singleton = true;
SQLEOF

# 8. Verifikasi
echo "--- Verifikasi ---"
NODES=$($PSQL -t -c "SELECT COUNT(*) FROM madevi.taxonomy_nodes;" | tr -d ' ')
ARTICLES=$($PSQL -t -c "SELECT COUNT(*) FROM madevi.articles;" | tr -d ' ')
ACTIVE_REV=$($PSQL -t -c "SELECT active_revision_id FROM madevi.taxonomy_state WHERE singleton = true;" | tr -d ' ')
echo "Hasil: $NODES node taksonomi, $ARTICLES artikel"
echo "Active revision: ${ACTIVE_REV:-KOSONG (ERROR!)}"
if [ -z "$ACTIVE_REV" ]; then
  echo "FATAL: revision taksonomi tidak aktif — API taxonomy akan error" >&2
  exit 1
fi
echo "=== Selesai ==="
