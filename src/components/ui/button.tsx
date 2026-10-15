import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

const buttonVariants = cva('mdv-button', {
  variants: {
    variant: {
      default: 'mdv-button--default',
      secondary: 'mdv-button--secondary',
      outline: 'mdv-button--outline',
      ghost: 'mdv-button--ghost',
      destructive: 'mdv-button--destructive',
    },
    size: {
      default: '',
      sm: 'mdv-button--sm',
      lg: 'mdv-button--lg',
      icon: 'mdv-button--icon',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

/**
 * A locally-owned shadcn-style primitive. `asChild` preserves semantic links
 * and form controls while every variant shares Madevi's tokens.
 */
export function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...(!asChild ? { type: type ?? 'button' } : {})}
      {...props}
    />
  );
}

export { buttonVariants };