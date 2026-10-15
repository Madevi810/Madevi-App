export type ApiErrorCode =
  | 'VALIDATION_FAILED'
  | 'AUTHENTICATION_FAILED'
  | 'AUTHENTICATION_REQUIRED'
  | 'ACCESS_DENIED'
  | 'NOT_FOUND'
  | 'IDEMPOTENCY_CONFLICT'
  | 'VERSION_CONFLICT'
  | 'QUOTA_EXCEEDED'
  | 'TRIAL_EXHAUSTED'
  | 'PACKAGE_INSUFFICIENT'
  | 'PAYLOAD_TOO_LARGE'
  | 'RATE_LIMITED'
  | 'DEPENDENCY_UNAVAILABLE'
  | 'INTERNAL_ERROR';

const ERROR_STATUS: Record<ApiErrorCode, number> = {
  VALIDATION_FAILED: 400,
  AUTHENTICATION_FAILED: 401,
  AUTHENTICATION_REQUIRED: 401,
  ACCESS_DENIED: 403,
  NOT_FOUND: 404,
  IDEMPOTENCY_CONFLICT: 409,
  VERSION_CONFLICT: 409,
  QUOTA_EXCEEDED: 409,
  TRIAL_EXHAUSTED: 403,
  PACKAGE_INSUFFICIENT: 403,
  PAYLOAD_TOO_LARGE: 413,
  RATE_LIMITED: 429,
  DEPENDENCY_UNAVAILABLE: 503,
  INTERNAL_ERROR: 500,
};

export class ApiError extends Error {
  readonly status: number;

  constructor(
    readonly code: ApiErrorCode,
    message: string,
    readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = ERROR_STATUS[code];
  }
}
