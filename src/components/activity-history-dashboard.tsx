'use client';

import { useLanguage } from './theme-provider';

export function ActivityHistoryDashboard() {
  const { language } = useLanguage();
  const isId = language === 'id';

  return (
    <section className="account-panel activity-history-panel">
      <h1>{isId ? 'Riwayat Aktivitas' : 'Activity History'}</h1>
      <p className="account-panel__intro">
        {isId
          ? 'Log tindakan, login, dan interaksi Anda di platform.'
          : 'Log of your actions, logins, and interactions on the platform.'}
      </p>

      <div className="account-empty-state">
        <p>
          {isId
            ? 'Belum ada riwayat aktivitas yang tercatat.'
            : 'No activity history recorded yet.'}
        </p>
      </div>
    </section>
  );
}
