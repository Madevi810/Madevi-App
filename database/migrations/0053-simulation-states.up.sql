-- Migration 0053: simulation_states — penyimpanan terpusat status simulasi.
-- Fase A3: satu lapisan untuk data dan perilaku dummy (akun, sesi, pesanan,
-- progres belajar, pesan, notifikasi, berkas). Status tersimpan nyata di DB
-- sehingga alur bisa diulang dan konsisten antar halaman.

CREATE TABLE IF NOT EXISTS simulation_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT NOT NULL,           -- 'otp', 'payment', 'order', 'learning', 'message', 'notification', 'file'
  key TEXT NOT NULL,             -- identifier unik dalam scope (mis. user_id, order_id)
  state JSONB NOT NULL DEFAULT '{}',
  label TEXT NOT NULL DEFAULT 'Simulasi',  -- label jujur, selalu 'Simulasi'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,        -- untuk OTP dan sesi sementara
  CONSTRAINT simulation_states_scope_key_unique UNIQUE (scope, key)
);

CREATE INDEX IF NOT EXISTS idx_simulation_states_scope ON simulation_states (scope);
CREATE INDEX IF NOT EXISTS idx_simulation_states_expires ON simulation_states (expires_at)
  WHERE expires_at IS NOT NULL;

COMMENT ON TABLE simulation_states IS
  'A3: penyimpanan terpusat status simulasi. Semua data di sini adalah SIMULASI, bukan transaksi nyata.';
