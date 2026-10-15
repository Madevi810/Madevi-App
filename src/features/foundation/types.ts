export type ServiceStatus = 'ok' | 'unavailable';

export interface HealthSnapshot {
  status: 'ok' | 'degraded';
  environment: 'development' | 'test' | 'production-local' | 'production';
  services: {
    application: 'ok';
    database: ServiceStatus;
  };
  checkedAt: string;
}
