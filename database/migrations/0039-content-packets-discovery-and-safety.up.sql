-- 0039: Content Packet, discovery terkelola, evidence, dan safety Tutorial.
--
-- Forward-compatible: artikel lama tetap sah tanpa packet. Packet baru selalu
-- terikat tepat pada satu artikel draf/edisi sehingga source dossier, claim
-- map, freshness, review, dan safety tidak jatuh ke owner_notes atau JSON UI.
-- Tidak ada data, taxonomy, atau artikel yang dipublikasikan oleh migrasi ini.

CREATE TABLE __SCHEMA__.content_families (
  id uuid PRIMARY KEY,
  canonical_key text NOT NULL UNIQUE
    CHECK (canonical_key ~ '^[a-z0-9][a-z0-9._-]{2,160}$'),
  label text NOT NULL CHECK (length(trim(label)) BETWEEN 3 AND 200),
  status text NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'SUPERSEDED', 'ARCHIVED')),
  superseded_by uuid REFERENCES __SCHEMA__.content_families(id),
  notes text NOT NULL DEFAULT '' CHECK (length(notes) <= 2000),
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  updated_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (superseded_by IS NULL OR superseded_by <> id),
  CHECK (status <> 'SUPERSEDED' OR superseded_by IS NOT NULL)
);

CREATE INDEX content_families_status_idx
  ON __SCHEMA__.content_families (status, updated_at DESC);

CREATE TABLE __SCHEMA__.content_packets (
  id uuid PRIMARY KEY,
  article_id uuid NOT NULL UNIQUE REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  family_id uuid NOT NULL REFERENCES __SCHEMA__.content_families(id),
  edition_number integer NOT NULL DEFAULT 1 CHECK (edition_number > 0),
  language text NOT NULL DEFAULT 'id' CHECK (language IN ('id', 'en')),
  space_key text NOT NULL CHECK (space_key IN ('explore', 'tutorial')),
  format_profile text NOT NULL CHECK (format_profile IN ('ATLAS', 'PRACTICE')),
  packet_status text NOT NULL DEFAULT 'PROPOSED'
    CHECK (packet_status IN (
      'PROPOSED', 'DOSSIER_READY', 'DRAFT', 'REVIEW', 'APPROVED', 'ARCHIVED'
    )),
  source_dossier_status text NOT NULL DEFAULT 'MISSING'
    CHECK (source_dossier_status IN ('MISSING', 'PARTIAL', 'READY', 'VERIFIED')),
  claim_map_status text NOT NULL DEFAULT 'MISSING'
    CHECK (claim_map_status IN ('MISSING', 'PARTIAL', 'READY')),
  rights_status text NOT NULL DEFAULT 'MISSING'
    CHECK (rights_status IN ('MISSING', 'IDENTIFIED', 'CLEARED', 'RESTRICTED')),
  freshness_policy text NOT NULL DEFAULT 'STABLE'
    CHECK (freshness_policy IN ('STABLE', 'CHECK_PERIODIC', 'VOLATILE')),
  as_of_date date,
  next_review_at date,
  scope_boundary text NOT NULL DEFAULT '' CHECK (length(scope_boundary) <= 3000),
  open_risks text NOT NULL DEFAULT '' CHECK (length(open_risks) <= 3000),
  handoff_note text NOT NULL DEFAULT '' CHECK (length(handoff_note) <= 5000),
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  updated_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (family_id, edition_number, language),
  CHECK (
    (space_key = 'explore' AND format_profile = 'ATLAS') OR
    (space_key = 'tutorial' AND format_profile = 'PRACTICE')
  ),
  CHECK (freshness_policy <> 'VOLATILE' OR as_of_date IS NOT NULL),
  CHECK (freshness_policy <> 'CHECK_PERIODIC' OR next_review_at IS NOT NULL),
  CHECK (
    packet_status <> 'APPROVED' OR (
      source_dossier_status = 'VERIFIED' AND
      claim_map_status = 'READY' AND
      rights_status IN ('CLEARED', 'RESTRICTED')
    )
  )
);

CREATE INDEX content_packets_discovery_idx
  ON __SCHEMA__.content_packets (space_key, packet_status, freshness_policy, updated_at DESC);

CREATE INDEX content_packets_family_idx
  ON __SCHEMA__.content_packets (family_id, language, edition_number DESC);

CREATE TABLE __SCHEMA__.content_facet_definitions (
  id uuid PRIMARY KEY,
  facet_key text NOT NULL UNIQUE
    CHECK (facet_key ~ '^[a-z0-9][a-z0-9-]{1,80}$'),
  label text NOT NULL CHECK (length(trim(label)) BETWEEN 2 AND 120),
  scope text NOT NULL DEFAULT 'ALL' CHECK (scope IN ('ALL', 'EXPLORE', 'TUTORIAL')),
  cardinality text NOT NULL DEFAULT 'MULTIPLE' CHECK (cardinality IN ('SINGLE', 'MULTIPLE')),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
  description text NOT NULL DEFAULT '' CHECK (length(description) <= 1000),
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  updated_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE __SCHEMA__.content_facet_values (
  id uuid PRIMARY KEY,
  facet_id uuid NOT NULL REFERENCES __SCHEMA__.content_facet_definitions(id) ON DELETE RESTRICT,
  value_key text NOT NULL CHECK (value_key ~ '^[a-z0-9][a-z0-9-]{1,80}$'),
  label text NOT NULL CHECK (length(trim(label)) BETWEEN 1 AND 120),
  sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (facet_id, value_key),
  UNIQUE (facet_id, id)
);

CREATE INDEX content_facet_values_browse_idx
  ON __SCHEMA__.content_facet_values (facet_id, status, sort_order, label);

CREATE TABLE __SCHEMA__.article_facet_assignments (
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  facet_id uuid NOT NULL REFERENCES __SCHEMA__.content_facet_definitions(id) ON DELETE RESTRICT,
  facet_value_id uuid NOT NULL,
  position integer NOT NULL DEFAULT 0 CHECK (position >= 0),
  assigned_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (article_id, facet_value_id),
  FOREIGN KEY (facet_id, facet_value_id)
    REFERENCES __SCHEMA__.content_facet_values(facet_id, id) ON DELETE RESTRICT
);

CREATE INDEX article_facet_assignments_discovery_idx
  ON __SCHEMA__.article_facet_assignments (facet_id, facet_value_id, article_id);

CREATE TABLE __SCHEMA__.content_relations (
  id uuid PRIMARY KEY,
  source_article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  target_article_id uuid REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  target_taxonomy_node_id uuid,
  target_content_family_id uuid REFERENCES __SCHEMA__.content_families(id) ON DELETE CASCADE,
  relation_type text NOT NULL CHECK (relation_type IN (
    'RELATED', 'PREREQUISITE', 'SEQUEL', 'CONCEPT', 'APPLICATION',
    'SAFETY_REFERENCE', 'SUPERSEDES', 'CONTRADICTS'
  )),
  rationale text NOT NULL CHECK (length(trim(rationale)) BETWEEN 3 AND 1000),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
  position integer NOT NULL DEFAULT 0 CHECK (position >= 0),
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  updated_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (num_nonnulls(target_article_id, target_taxonomy_node_id, target_content_family_id) = 1),
  CHECK (target_article_id IS NULL OR target_article_id <> source_article_id)
);

CREATE INDEX content_relations_source_idx
  ON __SCHEMA__.content_relations (source_article_id, status, relation_type, position);

CREATE INDEX content_relations_article_target_idx
  ON __SCHEMA__.content_relations (target_article_id)
  WHERE target_article_id IS NOT NULL;

CREATE INDEX content_relations_taxonomy_target_idx
  ON __SCHEMA__.content_relations (target_taxonomy_node_id)
  WHERE target_taxonomy_node_id IS NOT NULL;

-- FK komposit di bawah mengikat block dan source pada artikel yang sama dengan
-- claim/evidence-nya; primary key lama tetap dipertahankan untuk semua route lama.
ALTER TABLE __SCHEMA__.article_blocks
  ADD CONSTRAINT article_blocks_article_id_id_key UNIQUE (article_id, id);

ALTER TABLE __SCHEMA__.article_sources
  ADD CONSTRAINT article_sources_article_id_id_key UNIQUE (article_id, id);

CREATE TABLE __SCHEMA__.article_claims (
  id uuid PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  block_id uuid,
  claim_key text NOT NULL CHECK (claim_key ~ '^[a-z0-9][a-z0-9._-]{1,120}$'),
  claim_type text NOT NULL CHECK (claim_type IN (
    'OBSERVATION', 'REFERENCE', 'SYNTHESIS', 'INTERPRETATION', 'INSTRUCTION'
  )),
  statement text NOT NULL CHECK (length(trim(statement)) BETWEEN 3 AND 4000),
  certainty text NOT NULL DEFAULT 'QUALIFIED'
    CHECK (certainty IN ('ESTABLISHED', 'QUALIFIED', 'UNCERTAIN')),
  review_status text NOT NULL DEFAULT 'PENDING'
    CHECK (review_status IN ('PENDING', 'REVIEWED', 'CHALLENGED', 'RETIRED')),
  recheck_at date,
  notes text NOT NULL DEFAULT '' CHECK (length(notes) <= 2000),
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  updated_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (article_id, claim_key),
  UNIQUE (article_id, id),
  FOREIGN KEY (article_id, block_id)
    REFERENCES __SCHEMA__.article_blocks(article_id, id) ON DELETE RESTRICT
);

CREATE INDEX article_claims_review_idx
  ON __SCHEMA__.article_claims (article_id, review_status, claim_type);

CREATE TABLE __SCHEMA__.article_claim_evidence (
  id uuid PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  claim_id uuid NOT NULL,
  source_id uuid NOT NULL,
  evidence_role text NOT NULL CHECK (evidence_role IN ('SUPPORTS', 'QUALIFIES', 'CONTRADICTS')),
  locator text NOT NULL DEFAULT '' CHECK (length(locator) <= 500),
  note text NOT NULL DEFAULT '' CHECK (length(note) <= 2000),
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (claim_id, source_id, evidence_role),
  FOREIGN KEY (article_id, claim_id)
    REFERENCES __SCHEMA__.article_claims(article_id, id) ON DELETE CASCADE,
  FOREIGN KEY (article_id, source_id)
    REFERENCES __SCHEMA__.article_sources(article_id, id) ON DELETE RESTRICT
);

CREATE INDEX article_claim_evidence_source_idx
  ON __SCHEMA__.article_claim_evidence (source_id, claim_id);

CREATE TABLE __SCHEMA__.article_safety_profiles (
  article_id uuid PRIMARY KEY REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  risk_level text NOT NULL CHECK (risk_level IN ('GENERAL', 'CONTROLLED', 'STOP')),
  risk_rationale text NOT NULL CHECK (length(trim(risk_rationale)) BETWEEN 3 AND 2000),
  prerequisites jsonb NOT NULL DEFAULT '[]'::jsonb,
  tools_and_materials jsonb NOT NULL DEFAULT '[]'::jsonb,
  protective_equipment jsonb NOT NULL DEFAULT '[]'::jsonb,
  stop_conditions jsonb NOT NULL DEFAULT '[]'::jsonb,
  recovery_guidance text NOT NULL DEFAULT '' CHECK (length(recovery_guidance) <= 3000),
  professional_escalation text NOT NULL DEFAULT '' CHECK (length(professional_escalation) <= 2000),
  owner_review_required boolean NOT NULL DEFAULT false,
  review_status text NOT NULL DEFAULT 'NOT_REQUIRED'
    CHECK (review_status IN ('NOT_REQUIRED', 'PENDING', 'APPROVED', 'REJECTED')),
  reviewed_by uuid REFERENCES __SCHEMA__.principals(id),
  reviewed_at timestamptz,
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  updated_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (jsonb_typeof(prerequisites) = 'array'),
  CHECK (jsonb_typeof(tools_and_materials) = 'array'),
  CHECK (jsonb_typeof(protective_equipment) = 'array'),
  CHECK (jsonb_typeof(stop_conditions) = 'array'),
  CHECK (risk_level <> 'CONTROLLED' OR owner_review_required),
  CHECK (review_status <> 'APPROVED' OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL)),
  CHECK (review_status = 'NOT_REQUIRED' OR owner_review_required)
);

CREATE INDEX article_safety_profiles_review_idx
  ON __SCHEMA__.article_safety_profiles (risk_level, review_status, reviewed_at DESC);

CREATE TABLE __SCHEMA__.article_review_records (
  id uuid PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  review_type text NOT NULL CHECK (review_type IN ('EDITORIAL', 'SAFETY', 'RIGHTS', 'TECHNICAL')),
  decision text NOT NULL DEFAULT 'REQUESTED'
    CHECK (decision IN ('REQUESTED', 'APPROVED', 'REJECTED')),
  note text NOT NULL DEFAULT '' CHECK (length(note) <= 4000),
  requested_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  reviewed_by uuid REFERENCES __SCHEMA__.principals(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (
    decision = 'REQUESTED' OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL)
  )
);

CREATE INDEX article_review_records_queue_idx
  ON __SCHEMA__.article_review_records (decision, review_type, created_at DESC);

CREATE TABLE __SCHEMA__.article_aliases (
  id uuid PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  alias_slug text NOT NULL UNIQUE CHECK (alias_slug ~ '^[a-z0-9-]{3,200}$'),
  reason text NOT NULL CHECK (length(trim(reason)) BETWEEN 3 AND 1000),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RETIRED')),
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  retired_at timestamptz
);

CREATE INDEX article_aliases_article_idx
  ON __SCHEMA__.article_aliases (article_id, status);

-- Laporan pembaca harus dapat membedakan risiko/hak/discovery dari koreksi fakta.
ALTER TABLE __SCHEMA__.article_corrections
  DROP CONSTRAINT IF EXISTS article_corrections_issue_type_check;

ALTER TABLE __SCHEMA__.article_corrections
  ADD CONSTRAINT article_corrections_issue_type_check
  CHECK (issue_type IN (
    'FACTUAL', 'TYPO', 'OUTDATED', 'BROKEN_LINK', 'SAFETY', 'RIGHTS', 'DISCOVERY', 'OTHER'
  ));
