CREATE TABLE __SCHEMA__.taxonomy_revisions (
  id uuid PRIMARY KEY,
  revision_number bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  base_revision_number bigint,
  status text NOT NULL DEFAULT 'STAGING'
    CHECK (status IN ('STAGING', 'ACTIVE', 'RETIRED', 'ABORTED')),
  source_hash char(64) NOT NULL,
  source_manifest jsonb NOT NULL DEFAULT '[]'::jsonb,
  expected_node_count integer NOT NULL CHECK (expected_node_count >= 0),
  loaded_node_count integer NOT NULL DEFAULT 0 CHECK (loaded_node_count >= 0),
  batch_cursor integer NOT NULL DEFAULT 0 CHECK (batch_cursor >= 0),
  validation_report jsonb,
  created_by uuid REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  promoted_at timestamptz,
  CHECK ((status IN ('ACTIVE', 'RETIRED')) = (promoted_at IS NOT NULL))
);
CREATE UNIQUE INDEX taxonomy_one_active_revision_idx
  ON __SCHEMA__.taxonomy_revisions ((status)) WHERE status = 'ACTIVE';
CREATE UNIQUE INDEX taxonomy_one_staging_source_idx
  ON __SCHEMA__.taxonomy_revisions (source_hash) WHERE status = 'STAGING';

CREATE TABLE __SCHEMA__.taxonomy_stable_ids (
  source_key text PRIMARY KEY CHECK (length(source_key) BETWEEN 2 AND 1000),
  node_id uuid NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE __SCHEMA__.taxonomy_nodes (
  revision_id uuid NOT NULL REFERENCES __SCHEMA__.taxonomy_revisions(id) ON DELETE CASCADE,
  node_id uuid NOT NULL,
  parent_id uuid,
  level text NOT NULL CHECK (level IN ('R', 'D', 'K', 'M', 'SM', 'T', 'ST', 'J')),
  local_code text NOT NULL CHECK (local_code ~ '^(R|D|K|M|SM|T|ST|J)[1-9][0-9]*$'),
  path_code text NOT NULL CHECK (path_code ~ '^R[1-5](\.(D|K|M|SM|T|ST|J)[1-9][0-9]*)*$'),
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 500),
  slug text NOT NULL CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  path_slug text NOT NULL CHECK (path_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*(\/[a-z0-9]+(?:-[a-z0-9]+)*)*$'),
  sort_order integer NOT NULL CHECK (sort_order >= 0),
  visibility text NOT NULL DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'OWNER_ONLY')),
  lifecycle_status text NOT NULL DEFAULT 'ACTIVE' CHECK (lifecycle_status IN ('ACTIVE', 'ARCHIVED')),
  empty_marker text CHECK (empty_marker IN ('KOSONG', 'RENCANA_ARTIKEL')),
  source_file text NOT NULL,
  source_line integer NOT NULL CHECK (source_line > 0),
  source_virtual_path text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (revision_id, node_id),
  FOREIGN KEY (revision_id, parent_id)
    REFERENCES __SCHEMA__.taxonomy_nodes(revision_id, node_id)
    DEFERRABLE INITIALLY DEFERRED,
  UNIQUE (revision_id, path_code),
  UNIQUE (revision_id, path_slug)
);
CREATE UNIQUE INDEX taxonomy_sibling_code_idx
  ON __SCHEMA__.taxonomy_nodes (revision_id, COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), local_code);
CREATE UNIQUE INDEX taxonomy_sibling_slug_idx
  ON __SCHEMA__.taxonomy_nodes (revision_id, COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), slug);
CREATE INDEX taxonomy_children_cursor_idx
  ON __SCHEMA__.taxonomy_nodes (revision_id, parent_id, lifecycle_status, sort_order, node_id);
CREATE INDEX taxonomy_search_idx
  ON __SCHEMA__.taxonomy_nodes (revision_id, lower(name) text_pattern_ops);

CREATE TABLE __SCHEMA__.taxonomy_import_batches (
  revision_id uuid NOT NULL REFERENCES __SCHEMA__.taxonomy_revisions(id) ON DELETE CASCADE,
  batch_number integer NOT NULL CHECK (batch_number >= 0),
  batch_hash char(64) NOT NULL,
  first_offset integer NOT NULL CHECK (first_offset >= 0),
  node_count integer NOT NULL CHECK (node_count BETWEEN 1 AND 500),
  applied_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (revision_id, batch_number)
);

CREATE TABLE __SCHEMA__.taxonomy_state (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  active_revision_id uuid REFERENCES __SCHEMA__.taxonomy_revisions(id),
  active_revision_number bigint,
  export_required boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO __SCHEMA__.taxonomy_state (singleton) VALUES (true);

CREATE TABLE __SCHEMA__.taxonomy_aliases (
  alias_path text PRIMARY KEY CHECK (alias_path ~ '^[a-z0-9]+(?:-[a-z0-9]+)*(\/[a-z0-9]+(?:-[a-z0-9]+)*)*$'),
  target_node_id uuid NOT NULL,
  created_in_revision bigint NOT NULL,
  retired_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE __SCHEMA__.taxonomy_change_log (
  id uuid PRIMARY KEY,
  revision_number bigint NOT NULL,
  actor_principal_id uuid REFERENCES __SCHEMA__.principals(id),
  action text NOT NULL CHECK (action IN ('IMPORT', 'ADD', 'EDIT', 'REORDER', 'MOVE', 'ARCHIVE', 'RESTORE', 'PROMOTE', 'EXPORT')),
  node_id uuid,
  impact jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX taxonomy_change_revision_idx
  ON __SCHEMA__.taxonomy_change_log (revision_number DESC, created_at DESC);
