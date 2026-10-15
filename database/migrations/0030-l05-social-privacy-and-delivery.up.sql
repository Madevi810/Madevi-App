-- 0030: Privasi sosial, preference percakapan, receipt notifikasi, idempotency pesan (L05)
-- Pendekatan B rencana L05. Aditif saja; tidak mengubah migration historis.

BEGIN;

-- Mute satu arah: menyembunyikan konten/notifikasi author dari viewer.
CREATE TABLE IF NOT EXISTS __SCHEMA__.social_mutes (
  muter_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  muted_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (muter_principal_id, muted_principal_id),
  CHECK (muter_principal_id <> muted_principal_id)
);

-- Preference percakapan per anggota: arsip/keluar tanpa menghapus bukti lawan bicara.
CREATE TABLE IF NOT EXISTS __SCHEMA__.conversation_prefs (
  conversation_id uuid NOT NULL REFERENCES __SCHEMA__.direct_conversations(id) ON DELETE CASCADE,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  archived_at timestamptz,
  left_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (conversation_id, principal_id)
);

-- Receipt notifikasi sosial per penerima. event_key deterministik
-- `social:<event-id>:<recipient-id>:<type>` menjamin maksimal satu receipt
-- per event (dedupe via UNIQUE), terpisah dari pipeline outbox pengirim.
CREATE TABLE IF NOT EXISTS __SCHEMA__.social_notification_receipts (
  id uuid PRIMARY KEY,
  recipient_principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id) ON DELETE CASCADE,
  event_key text NOT NULL UNIQUE,
  notification_type text NOT NULL,
  actor_principal_id uuid REFERENCES __SCHEMA__.principals(id) ON DELETE SET NULL,
  object_type text NOT NULL,
  object_id uuid,
  summary text NOT NULL DEFAULT '',
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS social_notification_receipts_inbox_idx
  ON __SCHEMA__.social_notification_receipts (recipient_principal_id, created_at DESC, id DESC)
  WHERE read_at IS NULL;

-- Idempotency kirim pesan: retry dengan key sama tidak menggandakan pesan.
ALTER TABLE __SCHEMA__.direct_messages
  ADD COLUMN IF NOT EXISTS idempotency_key text;

CREATE UNIQUE INDEX IF NOT EXISTS direct_messages_idempotency_idx
  ON __SCHEMA__.direct_messages (conversation_id, sender_principal_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

COMMIT;
