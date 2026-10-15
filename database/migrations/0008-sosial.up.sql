-- Migrasi 0008: sosial, pertemanan, pesan, grup, dan retensi simulasi.
-- Konten UNKNOWN/UNASSESSED selalu tertahan. Tidak ada data anak nyata.

CREATE TABLE __SCHEMA__.social_posts (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  group_id uuid,
  body text NOT NULL DEFAULT '' CHECK (length(body) <= 10000),
  link_url text CHECK (link_url IS NULL OR length(link_url) <= 2048),
  status text NOT NULL DEFAULT 'PENDING_MODERATION'
    CHECK (status IN ('PENDING_MODERATION','QUARANTINED','PUBLISHED','REJECTED','DELETED')),
  moderation_status text NOT NULL DEFAULT 'UNASSESSED'
    CHECK (moderation_status IN ('UNASSESSED','SAFE','UNSAFE')),
  moderation_reason text NOT NULL DEFAULT '',
  audience_policy text NOT NULL DEFAULT 'ADULT_PUBLIC'
    CHECK (audience_policy IN ('ADULT_PUBLIC','CHILD_FIXTURE_ONLY')),
  is_indexed boolean NOT NULL DEFAULT false,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamptz,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  CHECK ((status = 'DELETED') = (deleted_at IS NOT NULL)),
  CHECK (status <> 'PUBLISHED' OR moderation_status = 'SAFE'),
  CHECK (status <> 'PUBLISHED' OR audience_policy = 'ADULT_PUBLIC' OR is_test)
);

CREATE INDEX social_posts_feed_idx
  ON __SCHEMA__.social_posts (created_at DESC, id DESC) WHERE status = 'PUBLISHED';
CREATE INDEX social_posts_owner_idx
  ON __SCHEMA__.social_posts (principal_id, created_at DESC, id DESC) WHERE status <> 'DELETED';

CREATE TABLE __SCHEMA__.social_post_attachments (
  post_id uuid NOT NULL REFERENCES __SCHEMA__.social_posts(id) ON DELETE CASCADE,
  storage_object_id uuid NOT NULL REFERENCES __SCHEMA__.storage_objects(id),
  position smallint NOT NULL CHECK (position BETWEEN 0 AND 9),
  PRIMARY KEY (post_id, storage_object_id),
  UNIQUE (post_id, position)
);

CREATE TABLE __SCHEMA__.social_comments (
  id uuid PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES __SCHEMA__.social_posts(id) ON DELETE CASCADE,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  parent_comment_id uuid REFERENCES __SCHEMA__.social_comments(id),
  body text NOT NULL CHECK (length(body) <= 5000),
  status text NOT NULL DEFAULT 'PENDING_MODERATION'
    CHECK (status IN ('PENDING_MODERATION','PUBLISHED','REJECTED','DELETED')),
  moderation_status text NOT NULL DEFAULT 'UNASSESSED'
    CHECK (moderation_status IN ('UNASSESSED','SAFE','UNSAFE')),
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamptz,
  CHECK ((status = 'DELETED') = (deleted_at IS NOT NULL)),
  CHECK (status = 'DELETED' OR length(body) >= 1),
  CHECK (status <> 'PUBLISHED' OR moderation_status = 'SAFE')
);

CREATE INDEX social_comments_post_idx
  ON __SCHEMA__.social_comments (post_id, created_at, id) WHERE status = 'PUBLISHED';

CREATE TABLE __SCHEMA__.social_reactions (
  post_id uuid NOT NULL REFERENCES __SCHEMA__.social_posts(id) ON DELETE CASCADE,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  reaction text NOT NULL CHECK (reaction IN ('LIKE','SUPPORT','INSIGHTFUL','THANKS')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id, principal_id)
);

CREATE TABLE __SCHEMA__.saved_social_posts (
  post_id uuid NOT NULL REFERENCES __SCHEMA__.social_posts(id) ON DELETE CASCADE,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id, principal_id)
);

CREATE TABLE __SCHEMA__.social_reports (
  id uuid PRIMARY KEY,
  reporter_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  object_type text NOT NULL CHECK (object_type IN ('POST','COMMENT','MESSAGE','GROUP_POST')),
  object_id uuid NOT NULL,
  reason text NOT NULL CHECK (length(reason) BETWEEN 10 AND 2000),
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','UNDER_REVIEW','RESOLVED','REJECTED')),
  idempotency_key text NOT NULL,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (reporter_principal_id, idempotency_key)
);

CREATE INDEX social_reports_status_idx
  ON __SCHEMA__.social_reports (status, created_at, id);

CREATE TABLE __SCHEMA__.social_blocks (
  blocker_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  blocked_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (blocker_principal_id, blocked_principal_id),
  CHECK (blocker_principal_id <> blocked_principal_id)
);

CREATE TABLE __SCHEMA__.friend_connections (
  member_a_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  member_b_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  requested_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','ACCEPTED','REJECTED','REMOVED')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (member_a_id, member_b_id),
  CHECK (member_a_id::text < member_b_id::text),
  CHECK (requested_by IN (member_a_id, member_b_id))
);

CREATE TABLE __SCHEMA__.message_requests (
  id uuid PRIMARY KEY,
  sender_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  recipient_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  body text NOT NULL CHECK (length(body) BETWEEN 1 AND 1000),
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','ACCEPTED','REJECTED','BLOCKED')),
  befriend_on_accept boolean,
  responded_at timestamptz,
  idempotency_key text NOT NULL,
  is_child_fixture boolean NOT NULL DEFAULT false,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (sender_principal_id, idempotency_key),
  CHECK (sender_principal_id <> recipient_principal_id),
  CHECK (NOT is_child_fixture OR is_test)
);

CREATE INDEX message_requests_recipient_idx
  ON __SCHEMA__.message_requests (recipient_principal_id, status, created_at DESC);

CREATE TABLE __SCHEMA__.direct_conversations (
  id uuid PRIMARY KEY,
  member_a_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  member_b_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  request_id uuid REFERENCES __SCHEMA__.message_requests(id),
  last_message_at timestamptz,
  purged_at timestamptz,
  is_child_fixture boolean NOT NULL DEFAULT false,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (member_a_id, member_b_id),
  CHECK (member_a_id::text < member_b_id::text),
  CHECK (NOT is_child_fixture OR is_test)
);

CREATE INDEX direct_conversations_inactive_idx
  ON __SCHEMA__.direct_conversations (last_message_at) WHERE is_test;

CREATE TABLE __SCHEMA__.direct_messages (
  id uuid PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES __SCHEMA__.direct_conversations(id) ON DELETE CASCADE,
  sender_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  body text NOT NULL DEFAULT '' CHECK (length(body) <= 10000),
  storage_object_id uuid REFERENCES __SCHEMA__.storage_objects(id),
  status text NOT NULL DEFAULT 'QUARANTINED'
    CHECK (status IN ('QUARANTINED','VISIBLE','REJECTED','DELETED_BOTH')),
  moderation_status text NOT NULL DEFAULT 'UNASSESSED'
    CHECK (moderation_status IN ('UNASSESSED','SAFE','UNSAFE')),
  moderation_reason text NOT NULL DEFAULT '',
  is_test boolean NOT NULL DEFAULT false,
  sent_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamptz,
  CHECK (status <> 'VISIBLE' OR moderation_status = 'SAFE'),
  CHECK ((status = 'DELETED_BOTH') = (deleted_at IS NOT NULL))
);

CREATE INDEX direct_messages_conversation_idx
  ON __SCHEMA__.direct_messages (conversation_id, sent_at DESC, id DESC)
  WHERE status <> 'DELETED_BOTH';

CREATE TABLE __SCHEMA__.message_tombstones (
  message_id uuid PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES __SCHEMA__.direct_conversations(id) ON DELETE CASCADE,
  original_sender_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  deleted_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  deleted_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  attachment_was_present boolean NOT NULL,
  reason_code text NOT NULL DEFAULT 'USER_DELETE'
    CHECK (reason_code IN ('USER_DELETE','RETENTION_SIMULATION','SAFETY_ACTION'))
);

CREATE TABLE __SCHEMA__.message_evidence (
  id uuid PRIMARY KEY,
  message_id uuid NOT NULL,
  report_id uuid NOT NULL UNIQUE REFERENCES __SCHEMA__.social_reports(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES __SCHEMA__.direct_conversations(id) ON DELETE CASCADE,
  evidence_body text NOT NULL CHECK (length(evidence_body) <= 10000),
  storage_object_id uuid REFERENCES __SCHEMA__.storage_objects(id),
  captured_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  access_reason text,
  expires_at timestamptz NOT NULL,
  purged_at timestamptz,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX message_evidence_expiry_idx
  ON __SCHEMA__.message_evidence (expires_at) WHERE purged_at IS NULL;

CREATE TABLE __SCHEMA__.public_groups (
  id uuid PRIMARY KEY,
  business_code text NOT NULL UNIQUE CHECK (business_code ~ '^GRP-[A-Z0-9_-]{3,60}$'),
  name text NOT NULL CHECK (length(name) BETWEEN 3 AND 160),
  description text NOT NULL DEFAULT '' CHECK (length(description) <= 2000),
  creator_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  manager_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  status text NOT NULL DEFAULT 'PENDING_OWNER'
    CHECK (status IN ('PENDING_OWNER','APPROVED','REJECTED','ARCHIVED')),
  audience_policy text NOT NULL DEFAULT 'ADULT_PUBLIC'
    CHECK (audience_policy IN ('ADULT_PUBLIC','CHILD_FIXTURE_ONLY')),
  is_indexed boolean NOT NULL DEFAULT false,
  owner_decided_by uuid REFERENCES __SCHEMA__.principals(id),
  owner_decided_at timestamptz,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (NOT (audience_policy = 'CHILD_FIXTURE_ONLY') OR is_test)
);

ALTER TABLE __SCHEMA__.social_posts
  ADD CONSTRAINT social_posts_group_fk
  FOREIGN KEY (group_id) REFERENCES __SCHEMA__.public_groups(id);

CREATE TABLE __SCHEMA__.group_memberships (
  group_id uuid NOT NULL REFERENCES __SCHEMA__.public_groups(id) ON DELETE CASCADE,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','ACTIVE','REJECTED','REMOVED')),
  requested_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  decided_by uuid REFERENCES __SCHEMA__.principals(id),
  decided_at timestamptz,
  PRIMARY KEY (group_id, principal_id)
);

CREATE INDEX group_memberships_queue_idx
  ON __SCHEMA__.group_memberships (group_id, status, requested_at);

CREATE TABLE __SCHEMA__.group_appeals (
  id uuid PRIMARY KEY,
  group_id uuid NOT NULL REFERENCES __SCHEMA__.public_groups(id) ON DELETE CASCADE,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  reason text NOT NULL CHECK (length(reason) BETWEEN 10 AND 2000),
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','UNDER_REVIEW','RESOLVED','REJECTED')),
  idempotency_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (principal_id, idempotency_key)
);

CREATE TABLE __SCHEMA__.social_retention_runs (
  id uuid PRIMARY KEY,
  mode text NOT NULL CHECK (mode = 'SIMULATION_FIXTURE_ONLY'),
  cutoff_at timestamptz NOT NULL,
  conversations_purged integer NOT NULL DEFAULT 0,
  messages_purged integer NOT NULL DEFAULT 0,
  executed_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
