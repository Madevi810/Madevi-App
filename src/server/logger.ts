/**
 * L07: satu redactor rekursif berbasis allowlist/denylist dipakai logger,
 * admin audit, API error, threat/backup metadata. Payload, cookie, password,
 * token, secret, URL credential, bukti privat, dan byte file tidak boleh
 * masuk log/audit.
 */
const REDACTED_KEYS =
  /password|passwd|secret|token|cookie|authorization|database_url|api_key|apikey|private_key|bukti|wali|guardian|message|body|payload|file|buffer|bytes|code/i;

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export function redactLogFields(fields: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      REDACTED_KEYS.test(key) ? '[REDACTED]' : redactValue(value),
    ]),
  );
}

function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactValue);
  if (value && typeof value === 'object') {
    return redactLogFields(value as Record<string, unknown>);
  }
  if (typeof value === 'string' && value.length > 2000) return '[TRUNCATED]';
  // URL dengan credential disamarkan.
  if (typeof value === 'string' && /:\/\/[^/]*@/i.test(value)) return '[REDACTED_URL]';
  return value;
}

export function logEvent(level: LogLevel, event: string, fields: Record<string, unknown> = {}) {
  const record = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...redactLogFields(fields),
  };
  const line = JSON.stringify(record);
  if (level === 'error') console.error(line);
  else console.log(line);
}
