-- Taksonomi awal 3 ruang konten (TUTORIAL-001, EXPLORE-001, SCHOOL-001)
-- Dibuat 2026-10-13 oleh operator otonom (mandat Owner)
-- Hierarki: R > D > K > M > SM/T > ST > J
-- local_code format: ^(R|D|K|M|SM|T|ST|J)[1-9][0-9]*$

INSERT INTO madevi.taxonomy_revisions (id, status, source_hash, source_manifest, expected_node_count, loaded_node_count, promoted_at)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ACTIVE', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '[{"file": "TAKSONOMI-AWAL"}]', 23, 23, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============ R1: Tutorial & Problem Solve ============
INSERT INTO madevi.taxonomy_nodes (revision_id, node_id, parent_id, level, local_code, path_code, name, slug, path_slug, sort_order, source_file, source_line, metadata)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1111111-1111-1111-1111-111111111111', NULL, 'R', 'R1', 'R1', 'Tutorial & Problem Solve', 'tutorial-problem-solve', 'tutorial-problem-solve', 1, 'TAKSONOMI-AWAL', 1, '{"room": "tutorial"}')
ON CONFLICT DO NOTHING;

INSERT INTO madevi.taxonomy_nodes (revision_id, node_id, parent_id, level, local_code, path_code, name, slug, path_slug, sort_order, source_file, source_line, metadata)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'D', 'D1', 'R1.D1', 'Kehidupan Sehari-hari', 'kehidupan-sehari-hari', 'tutorial-problem-solve/kehidupan-sehari-hari', 1, 'TAKSONOMI-AWAL', 2, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b3333333-3333-3333-3333-333333333333', 'b1111111-1111-1111-1111-111111111111', 'D', 'D2', 'R1.D2', 'Pekerjaan & Karier', 'pekerjaan-karier', 'tutorial-problem-solve/pekerjaan-karier', 2, 'TAKSONOMI-AWAL', 3, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b4444444-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', 'D', 'D3', 'R1.D3', 'Teknologi & Gadget', 'teknologi-gadget', 'tutorial-problem-solve/teknologi-gadget', 3, 'TAKSONOMI-AWAL', 4, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b5555555-5555-5555-5555-555555555555', 'b1111111-1111-1111-1111-111111111111', 'D', 'D4', 'R1.D4', 'Kesehatan & Mental', 'kesehatan-mental', 'tutorial-problem-solve/kesehatan-mental', 4, 'TAKSONOMI-AWAL', 5, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b6666666-6666-6666-6666-666666666666', 'b1111111-1111-1111-1111-111111111111', 'D', 'D5', 'R1.D5', 'Belajar & Pendidikan', 'belajar-pendidikan', 'tutorial-problem-solve/belajar-pendidikan', 5, 'TAKSONOMI-AWAL', 6, '{}')
ON CONFLICT DO NOTHING;

-- ============ R2: Explore & Learn ============
INSERT INTO madevi.taxonomy_nodes (revision_id, node_id, parent_id, level, local_code, path_code, name, slug, path_slug, sort_order, source_file, source_line, metadata)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1111111-1111-1111-1111-111111111111', NULL, 'R', 'R2', 'R2', 'Explore & Learn', 'explore-learn', 'explore-learn', 2, 'TAKSONOMI-AWAL', 10, '{"room": "explore"}')
ON CONFLICT DO NOTHING;

INSERT INTO madevi.taxonomy_nodes (revision_id, node_id, parent_id, level, local_code, path_code, name, slug, path_slug, sort_order, source_file, source_line, metadata)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'D', 'D6', 'R2.D6', 'Biologi & Kehidupan', 'biologi-kehidupan', 'explore-learn/biologi-kehidupan', 1, 'TAKSONOMI-AWAL', 11, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'D', 'D7', 'R2.D7', 'Fisika', 'fisika', 'explore-learn/fisika', 2, 'TAKSONOMI-AWAL', 12, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c4444444-4444-4444-4444-444444444444', 'c1111111-1111-1111-1111-111111111111', 'D', 'D8', 'R2.D8', 'Kimia', 'kimia', 'explore-learn/kimia', 3, 'TAKSONOMI-AWAL', 13, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c5555555-5555-5555-5555-555555555555', 'c1111111-1111-1111-1111-111111111111', 'D', 'D9', 'R2.D9', 'Matematika', 'matematika', 'explore-learn/matematika', 4, 'TAKSONOMI-AWAL', 14, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c6666666-6666-6666-6666-666666666666', 'c1111111-1111-1111-1111-111111111111', 'D', 'D10', 'R2.D10', 'Astronomi & Antariksa', 'astronomi-antariksa', 'explore-learn/astronomi-antariksa', 5, 'TAKSONOMI-AWAL', 15, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c7777777-7777-7777-7777-777777777777', 'c1111111-1111-1111-1111-111111111111', 'D', 'D11', 'R2.D11', 'Teknologi', 'teknologi', 'explore-learn/teknologi', 6, 'TAKSONOMI-AWAL', 16, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c8888888-8888-8888-8888-888888888888', 'c1111111-1111-1111-1111-111111111111', 'D', 'D12', 'R2.D12', 'Sejarah & Peradaban', 'sejarah-peradaban', 'explore-learn/sejarah-peradaban', 7, 'TAKSONOMI-AWAL', 17, '{}')
ON CONFLICT DO NOTHING;

-- K: Sub-cabang Biologi (taksonomi kritis)
INSERT INTO madevi.taxonomy_nodes (revision_id, node_id, parent_id, level, local_code, path_code, name, slug, path_slug, sort_order, source_file, source_line, metadata)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c9999999-9999-9999-9999-999999999999', 'c2222222-2222-2222-2222-222222222222', 'K', 'K1', 'R2.D6.K1', 'Hewan (Animalia)', 'hewan-animalia', 'explore-learn/biologi-kehidupan/hewan-animalia', 1, 'TAKSONOMI-AWAL', 18, '{"taxon": "kingdom"}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c2222222-2222-2222-2222-222222222222', 'K', 'K2', 'R2.D6.K2', 'Tumbuhan (Plantae)', 'tumbuhan-plantae', 'explore-learn/biologi-kehidupan/tumbuhan-plantae', 2, 'TAKSONOMI-AWAL', 19, '{"taxon": "kingdom"}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cabbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c2222222-2222-2222-2222-222222222222', 'K', 'K3', 'R2.D6.K3', 'Mikroorganisme', 'mikroorganisme', 'explore-learn/biologi-kehidupan/mikroorganisme', 3, 'TAKSONOMI-AWAL', 20, '{}')
ON CONFLICT DO NOTHING;

-- ============ R3: Madevi School ============
INSERT INTO madevi.taxonomy_nodes (revision_id, node_id, parent_id, level, local_code, path_code, name, slug, path_slug, sort_order, source_file, source_line, metadata)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd1111111-1111-1111-1111-111111111111', NULL, 'R', 'R3', 'R3', 'Madevi School', 'madevi-school', 'madevi-school', 3, 'TAKSONOMI-AWAL', 30, '{"room": "school"}')
ON CONFLICT DO NOTHING;

INSERT INTO madevi.taxonomy_nodes (revision_id, node_id, parent_id, level, local_code, path_code, name, slug, path_slug, sort_order, source_file, source_line, metadata)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'D', 'D13', 'R3.D13', 'Pendidikan Anak Usia Dini (PAUD)', 'paud', 'madevi-school/paud', 1, 'TAKSONOMI-AWAL', 31, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'D', 'D14', 'R3.D14', 'Sekolah Dasar (SD)', 'sd', 'madevi-school/sd', 2, 'TAKSONOMI-AWAL', 32, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd4444444-4444-4444-4444-444444444444', 'd1111111-1111-1111-1111-111111111111', 'D', 'D15', 'R3.D15', 'Sekolah Menengah Pertama (SMP)', 'smp', 'madevi-school/smp', 3, 'TAKSONOMI-AWAL', 33, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd5555555-5555-5555-5555-555555555555', 'd1111111-1111-1111-1111-111111111111', 'D', 'D16', 'R3.D16', 'Sekolah Menengah Atas (SMA)', 'sma', 'madevi-school/sma', 4, 'TAKSONOMI-AWAL', 34, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd6666666-6666-6666-6666-666666666666', 'd1111111-1111-1111-1111-111111111111', 'D', 'D17', 'R3.D17', 'Sekolah Menengah Kejuruan (SMK)', 'smk', 'madevi-school/smk', 5, 'TAKSONOMI-AWAL', 35, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd7777777-7777-7777-7777-777777777777', 'd1111111-1111-1111-1111-111111111111', 'D', 'D18', 'R3.D18', 'Perguruan Tinggi', 'perguruan-tinggi', 'madevi-school/perguruan-tinggi', 6, 'TAKSONOMI-AWAL', 36, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd8888888-8888-8888-8888-888888888888', 'd1111111-1111-1111-1111-111111111111', 'D', 'D19', 'R3.D19', 'Sekolah Kebutuhan Khusus', 'kebutuhan-khusus', 'madevi-school/kebutuhan-khusus', 7, 'TAKSONOMI-AWAL', 37, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd9999999-9999-9999-9999-999999999999', 'd1111111-1111-1111-1111-111111111111', 'D', 'D20', 'R3.D20', 'Sekolah Agama', 'sekolah-agama', 'madevi-school/sekolah-agama', 8, 'TAKSONOMI-AWAL', 38, '{}')
ON CONFLICT DO NOTHING;
