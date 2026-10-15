-- Rollback 0030 (L05). Aman hanya bila belum ada mute/preference/receipt
-- atau key idempotency pesan yang tidak bisa direpresentasikan ulang.
-- Tidak menghapus post, pesan, report, evidence, outbox, maupun audit.

BEGIN;

DROP INDEX IF EXISTS __SCHEMA__.direct_messages_idempotency_idx;
ALTER TABLE IF EXISTS __SCHEMA__.direct_messages DROP COLUMN IF EXISTS idempotency_key;
DROP TABLE IF EXISTS __SCHEMA__.social_notification_receipts;
DROP TABLE IF EXISTS __SCHEMA__.conversation_prefs;
DROP TABLE IF EXISTS __SCHEMA__.social_mutes;

COMMIT;
