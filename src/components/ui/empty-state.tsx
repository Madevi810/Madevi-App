import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

/**
 * EmptyState — tampilan konsisten saat tidak ada data.
 * Ukuran proporsional: sm untuk panel kecil, md default, lg untuk halaman penuh.
 */
export function EmptyState({ icon, title, description, action, size = 'md', className }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn('mdv-empty-state', `mdv-empty-state--${size}`, className)}
    >
      {icon && <div className="mdv-empty-state__icon" aria-hidden>{icon}</div>}
      <h3 className="mdv-empty-state__title">{title}</h3>
      {description && <p className="mdv-empty-state__description">{description}</p>}
      {action && <div className="mdv-empty-state__action">{action}</div>}
    </div>
  );
}
