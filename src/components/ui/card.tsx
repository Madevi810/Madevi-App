import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

const cardVariants = cva('mdv-card', {
  variants: {
    variant: {
      default: 'mdv-card--default',
      elevated: 'mdv-card--elevated',
      interactive: 'mdv-card--interactive',
      floating: 'mdv-card--floating',
    },
  },
  defaultVariants: { variant: 'default' },
});

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> & {
    asChild?: boolean;
  };

/** Locally-owned composition primitive following the shadcn Card API style. */
export function Card({ className, variant, asChild = false, ...props }: CardProps) {
  const Comp = asChild ? Slot : 'div';
  return <Comp data-slot="card" className={cn(cardVariants({ variant }), className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-header" className={cn('mdv-card__header', className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-content" className={cn('mdv-card__content', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-footer" className={cn('mdv-card__footer', className)} {...props} />;
}

export { cardVariants };
