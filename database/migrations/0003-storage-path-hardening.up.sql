ALTER TABLE __SCHEMA__.storage_objects
  DROP CONSTRAINT storage_objects_relative_path_check;
ALTER TABLE __SCHEMA__.storage_objects
  ADD CONSTRAINT storage_objects_relative_path_check
  CHECK (relative_path ~ '^(quarantine|objects)/[0-9a-f-]{36}[.]bin$');
ALTER TABLE __SCHEMA__.storage_objects
  ADD CONSTRAINT storage_objects_original_name_check
  CHECK (
    length(original_name) BETWEEN 1 AND 255
    AND position('/' IN original_name) = 0
    AND position(chr(92) IN original_name) = 0
  );

