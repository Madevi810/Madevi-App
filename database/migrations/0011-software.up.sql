-- Migrasi 0011: Katalog software, versi, file, scanner, unduhan, laporan, dan alat.
-- Prompt 11 — Madevi Offline
-- Executable TIDAK pernah dijalankan server; MIME/ekstensi palsu dan zip bomb ditolak/ditahan.
-- Scanner nyata lokal; guest tidak dapat download.

CREATE TABLE __SCHEMA__.software_catalog (
  id uuid PRIMARY KEY,
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 200),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]{2,120}$'),
  developer text NOT NULL DEFAULT '' CHECK (length(developer) <= 200),
  official_site text NOT NULL DEFAULT '' CHECK (length(official_site) <= 2000),
  license_info text NOT NULL DEFAULT '' ,
  description text NOT NULL DEFAULT '' CHECK (length(description) <= 5000),
  is_test boolean NOT NULL DEFAULT false,
  lifecycle_status text NOT NULL DEFAULT 'ACTIVE' CHECK (lifecycle_status IN ('ACTIVE','DISABLED','ARCHIVED')),
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  updated_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0)
);
CREATE INDEX software_catalog_cursor_idx
  ON __SCHEMA__.software_catalog (name, created_at DESC, id DESC)
  WHERE lifecycle_status = 'ACTIVE';

CREATE TABLE __SCHEMA__.software_platforms (
  id uuid PRIMARY KEY,
  platform text NOT NULL CHECK (platform IN ('WINDOWS','LINUX','MACOS','ANDROID','IOS','OTHER')),
  architecture text NOT NULL CHECK (architecture IN ('X86','X64','ARM32','ARM64','ANY')),
  software_id uuid NOT NULL REFERENCES __SCHEMA__.software_catalog(id) ON DELETE CASCADE,
  UNIQUE (software_id, platform, architecture)
);

CREATE TABLE __SCHEMA__.software_versions (
  id uuid PRIMARY KEY,
  software_id uuid NOT NULL REFERENCES __SCHEMA__.software_catalog(id) ON DELETE CASCADE,
  version text NOT NULL CHECK (version ~ '^\d+\.\d+\.\d+([-.]\w+)?$'),
  release_date date,
  changelog text NOT NULL DEFAULT '' CHECK (length(changelog) <= 5000),
  requirements_system text NOT NULL DEFAULT '' CHECK (length(requirements_system) <= 2000),
  is_test boolean NOT NULL DEFAULT false,
  lifecycle_status text NOT NULL DEFAULT 'ACTIVE' CHECK (lifecycle_status IN ('ACTIVE','DISABLED','ARCHIVED')),
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (software_id, version)
);
CREATE INDEX software_versions_catalog_idx
  ON __SCHEMA__.software_versions (software_id, created_at DESC);

CREATE TABLE __SCHEMA__.software_downloads (
  id uuid PRIMARY KEY,
  version_id uuid NOT NULL REFERENCES __SCHEMA__.software_versions(id) ON DELETE CASCADE,
  storage_object_id uuid REFERENCES __SCHEMA__.storage_objects(id),
  -- Jika file tidak ada di storage (hanya tautan ke situs resmi), null storage_object_id.
  official_download_url text CHECK (official_download_url IS NULL OR length(official_download_url) <= 2000),
  size_bytes bigint CHECK (size_bytes IS NULL OR size_bytes > 0),
  sha256 char(64),
  -- Status keamanan file.
  scan_status text NOT NULL DEFAULT 'UNSCANNED' CHECK (scan_status IN ('UNSCANNED','SCANNING','SAFE','UNSAFE','QUARANTINE')),
  scan_result jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX software_downloads_version_idx
  ON __SCHEMA__.software_downloads (version_id);

CREATE TABLE __SCHEMA__.software_proposed (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 200),
  official_url text NOT NULL CHECK (length(official_url) <= 2000),
  reason text NOT NULL DEFAULT '' CHECK (length(reason) <= 2000),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','ACCEPTED','REJECTED')),
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Rating/review, laporan malware, diskusi instalasi, usulan update.
CREATE TABLE __SCHEMA__.software_reviews (
  id uuid PRIMARY KEY,
  software_id uuid NOT NULL REFERENCES __SCHEMA__.software_catalog(id) ON DELETE CASCADE,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text text NOT NULL DEFAULT '' CHECK (length(review_text) <= 3000),
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (software_id, principal_id)
);

CREATE TABLE __SCHEMA__.software_reports (
  id uuid PRIMARY KEY,
  software_id uuid NOT NULL REFERENCES __SCHEMA__.software_catalog(id) ON DELETE CASCADE,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  report_kind text NOT NULL CHECK (report_kind IN ('MALWARE','DAMAGED','LICENSE')),
  description text NOT NULL DEFAULT '' CHECK (length(description) <= 3000),
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','IN_REVIEW','RESOLVED','DISMISSED')),
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE __SCHEMA__.software_installation_threads (
  id uuid PRIMARY KEY,
  software_id uuid NOT NULL REFERENCES __SCHEMA__.software_catalog(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES __SCHEMA__.software_installation_threads(id),
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  title text NOT NULL CHECK (length(title) BETWEEN 3 AND 200),
  body text NOT NULL CHECK (length(body) BETWEEN 1 AND 5000),
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Riwayat unduhan untuk audit kuota.
CREATE TABLE __SCHEMA__.software_download_log (
  id uuid PRIMARY KEY,
  download_id uuid NOT NULL REFERENCES __SCHEMA__.software_downloads(id),
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  ip_hash text NOT NULL DEFAULT '',
  token_hash text NOT NULL,
  range_start bigint,
  range_end bigint,
  bytes_sent bigint NOT NULL DEFAULT 0 CHECK (bytes_sent >= 0),
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX software_download_log_actor_idx
  ON __SCHEMA__.software_download_log (principal_id, created_at DESC);