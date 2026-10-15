-- Migrasi 0016: konfigurasi harga akses.
-- Ditambahkan setelah 0013-admin untuk mempertahankan checksum migrasi terpasang.
CREATE TABLE __SCHEMA__.payment_settings (
  key text PRIMARY KEY,
  amount numeric(15, 2) NOT NULL CHECK (amount >= 0),
  active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by uuid REFERENCES __SCHEMA__.principals(id)
);

INSERT INTO __SCHEMA__.payment_settings (key, amount)
VALUES ('BASE_PRICE', 25000);
