-- Migration 0054: tabel konten Fase 4 (aditif, aman untuk produksi)
-- quiz_questions, user_streaks, line_profiles, line_posts, tool_history

CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artikel_id UUID,
  pertanyaan TEXT NOT NULL,
  opsi JSONB NOT NULL DEFAULT '[]',
  jawaban_benar INTEGER NOT NULL DEFAULT 0,
  pembahasan TEXT,
  urutan INTEGER NOT NULL DEFAULT 0,
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_streaks (
  pengguna_id UUID PRIMARY KEY,
  streak_harian INTEGER NOT NULL DEFAULT 0,
  terakhir_aktif DATE,
  diperbarui_pada TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS line_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_tampilan VARCHAR(100) NOT NULL,
  bio TEXT,
  avatar_svg TEXT,
  level_reputasi INTEGER NOT NULL DEFAULT 0,
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS line_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profil_id UUID NOT NULL REFERENCES line_profiles(id) ON DELETE CASCADE,
  tipe VARCHAR(20) NOT NULL CHECK (tipe IN ('karya', 'curhat')),
  judul VARCHAR(200),
  isi TEXT NOT NULL,
  anonim BOOLEAN NOT NULL DEFAULT FALSE,
  status_moderasi VARCHAR(20) NOT NULL DEFAULT 'menunggu' CHECK (status_moderasi IN ('menunggu', 'disetujui', 'ditolak')),
  suka INTEGER NOT NULL DEFAULT 0,
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS line_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES line_posts(id) ON DELETE CASCADE,
  profil_id UUID NOT NULL REFERENCES line_profiles(id) ON DELETE CASCADE,
  isi TEXT NOT NULL,
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_line_posts_tipe ON line_posts(tipe);
CREATE INDEX IF NOT EXISTS idx_line_posts_profil ON line_posts(profil_id);
CREATE INDEX IF NOT EXISTS idx_quiz_artikel ON quiz_questions(artikel_id);
