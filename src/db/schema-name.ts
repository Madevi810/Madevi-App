export function getDatabaseSchema(source = process.env.MADEVI_DB_SCHEMA ?? 'madevi') {
  if (!/^[a-z][a-z0-9_]{0,47}$/.test(source)) throw new Error('Nama schema database tidak valid');
  return source;
}

export function quotedSchema(source = getDatabaseSchema()) {
  return `"${getDatabaseSchema(source)}"`;
}
