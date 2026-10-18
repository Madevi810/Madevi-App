import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

const badgeVariants = cva('mdv-badge', {
  variants: {
    variant: {
      default: 'mdv-badge--default',
      success: 'mdv-badge--success',
      warning: 'mdv-badge--warning',
      danger: 'mdv-badge--danger',
      info: 'mdv-badge--info',
      neutral: 'mdv-badge--neutral',
    },
    size: {
      sm: 'mdv-badge--sm',
      md: '',
      lg: 'mdv-badge--lg',
    },
  },
  defaultVariants: { variant: 'neutral', size: 'md' },
});

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

/**
 * Status badge kecil: lolos/gagal, kategori, label.
 * Ukuran proporsional: sm untuk inline teks, md default, lg untuk header.
 */
export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
