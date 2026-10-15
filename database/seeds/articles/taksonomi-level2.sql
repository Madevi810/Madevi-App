-- Taksonomi level K/M/T (pendalaman) — 2026-10-13
-- Melanjutkan TAKSONOMI-AWAL: tambah Kategori, Materi, Topik

-- ============ TUTORIAL: D1 Kehidupan → K ============
INSERT INTO madevi.taxonomy_nodes (revision_id, node_id, parent_id, level, local_code, path_code, name, slug, path_slug, sort_order, source_file, source_line, metadata)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b7777777-7777-7777-7777-777777777777', 'b2222222-2222-2222-2222-222222222222', 'K', 'K4', 'R1.D1.K4', 'Rumah Tangga', 'rumah-tangga', 'tutorial-problem-solve/kehidupan-sehari-hari/rumah-tangga', 1, 'TAKSONOMI-AWAL', 40, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b8888888-8888-8888-8888-888888888888', 'b2222222-2222-2222-2222-222222222222', 'K', 'K5', 'R1.D1.K5', 'Keuangan Pribadi', 'keuangan-pribadi', 'tutorial-problem-solve/kehidupan-sehari-hari/keuangan-pribadi', 2, 'TAKSONOMI-AWAL', 41, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b9999999-9999-9999-9999-999999999999', 'b4444444-4444-4444-4444-444444444444', 'K', 'K6', 'R1.D3.K6', 'HP & Smartphone', 'hp-smartphone', 'tutorial-problem-solve/teknologi-gadget/hp-smartphone', 1, 'TAKSONOMI-AWAL', 42, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b4444444-4444-4444-4444-444444444444', 'K', 'K7', 'R1.D3.K7', 'Komputer & Laptop', 'komputer-laptop', 'tutorial-problem-solve/teknologi-gadget/komputer-laptop', 2, 'TAKSONOMI-AWAL', 43, '{}')
ON CONFLICT DO NOTHING;

-- M: Materi (masalah spesifik) di bawah K Tutorial
INSERT INTO madevi.taxonomy_nodes (revision_id, node_id, parent_id, level, local_code, path_code, name, slug, path_slug, sort_order, source_file, source_line, metadata)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1000001-0000-0000-0000-000000000001', 'b7777777-7777-7777-7777-777777777777', 'M', 'M1', 'R1.D1.K4.M1', 'Perbaikan Keran Bocor', 'perbaikan-keran-bocor', 'tutorial-problem-solve/kehidupan-sehari-hari/rumah-tangga/perbaikan-keran-bocor', 1, 'TAKSONOMI-AWAL', 50, '{"format": "masalah-penjelasan-alat-cara-risiko-penyelesaian"}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1000002-0000-0000-0000-000000000002', 'b9999999-9999-9999-9999-999999999999', 'M', 'M2', 'R1.D3.K6.M2', 'HP Tidak Bisa Di-charge', 'hp-tidak-bisa-di-charge', 'tutorial-problem-solve/teknologi-gadget/hp-smartphone/hp-tidak-bisa-di-charge', 1, 'TAKSONOMI-AWAL', 51, '{"format": "masalah-penjelasan-alat-cara-risiko-penyelesaian"}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1000003-0000-0000-0000-000000000003', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'M', 'M3', 'R1.D3.K7.M3', 'Laptop Lemot Setelah Update', 'laptop-lemot-setelah-update', 'tutorial-problem-solve/teknologi-gadget/komputer-laptop/laptop-lemot-setelah-update', 1, 'TAKSONOMI-AWAL', 52, '{"format": "masalah-penjelasan-alat-cara-risiko-penyelesaian"}')
ON CONFLICT DO NOTHING;

-- ============ EXPLORE: D6 Biologi → K sudah ada → M (taksonomi kritis) ============
-- Hewan (K1) → M: Filum contoh (verifikasi: Chordata, Arthropoda, Mollusca adalah filum valid)
INSERT INTO madevi.taxonomy_nodes (revision_id, node_id, parent_id, level, local_code, path_code, name, slug, path_slug, sort_order, source_file, source_line, metadata)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1000001-0000-0000-0000-000000000001', 'c9999999-9999-9999-9999-999999999999', 'M', 'M4', 'R2.D6.K1.M4', 'Chordata (Bertulang Belakang)', 'chordata', 'explore-learn/biologi-kehidupan/hewan-animalia/chordata', 1, 'TAKSONOMI-AWAL', 60, '{"taxon": "phylum", "verified": true}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1000002-0000-0000-0000-000000000002', 'c9999999-9999-9999-9999-999999999999', 'M', 'M5', 'R2.D6.K1.M5', 'Arthropoda (Berbuku-buku)', 'arthropoda', 'explore-learn/biologi-kehidupan/hewan-animalia/arthropoda', 2, 'TAKSONOMI-AWAL', 61, '{"taxon": "phylum", "verified": true}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1000003-0000-0000-0000-000000000003', 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'M', 'M6', 'R2.D6.K2.M6', 'Angiospermae (Berbunga)', 'angiospermae', 'explore-learn/biologi-kehidupan/tumbuhan-plantae/angiospermae', 1, 'TAKSONOMI-AWAL', 62, '{"taxon": "clade", "verified": true}')
ON CONFLICT DO NOTHING;

-- ============ SCHOOL: D14 SD → K (Kelas) ============
INSERT INTO madevi.taxonomy_nodes (revision_id, node_id, parent_id, level, local_code, path_code, name, slug, path_slug, sort_order, source_file, source_line, metadata)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd1000001-0000-0000-0000-000000000001', 'd3333333-3333-3333-3333-333333333333', 'K', 'K8', 'R3.D14.K8', 'Kelas 1 SD', 'kelas-1-sd', 'madevi-school/sd/kelas-1-sd', 1, 'TAKSONOMI-AWAL', 70, '{"grade": 1}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd1000002-0000-0000-0000-000000000002', 'd3333333-3333-3333-3333-333333333333', 'K', 'K9', 'R3.D14.K9', 'Kelas 2 SD', 'kelas-2-sd', 'madevi-school/sd/kelas-2-sd', 2, 'TAKSONOMI-AWAL', 71, '{"grade": 2}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd1000003-0000-0000-0000-000000000003', 'd3333333-3333-3333-3333-333333333333', 'K', 'K10', 'R3.D14.K10', 'Kelas 3 SD', 'kelas-3-sd', 'madevi-school/sd/kelas-3-sd', 3, 'TAKSONOMI-AWAL', 72, '{"grade": 3}')
ON CONFLICT DO NOTHING;

-- M: Mata pelajaran Kelas 1 SD
INSERT INTO madevi.taxonomy_nodes (revision_id, node_id, parent_id, level, local_code, path_code, name, slug, path_slug, sort_order, source_file, source_line, metadata)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd2000001-0000-0000-0000-000000000001', 'd1000001-0000-0000-0000-000000000001', 'M', 'M7', 'R3.D14.K8.M7', 'Matematika Kelas 1', 'matematika-kelas-1', 'madevi-school/sd/kelas-1-sd/matematika-kelas-1', 1, 'TAKSONOMI-AWAL', 80, '{"subject": "matematika"}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd2000002-0000-0000-0000-000000000002', 'd1000001-0000-0000-0000-000000000001', 'M', 'M8', 'R3.D14.K8.M8', 'Bahasa Indonesia Kelas 1', 'bahasa-indonesia-kelas-1', 'madevi-school/sd/kelas-1-sd/bahasa-indonesia-kelas-1', 2, 'TAKSONOMI-AWAL', 81, '{"subject": "bahasa-indonesia"}')
ON CONFLICT DO NOTHING;
