import { cva, type VariantProps } from 'class-variance-authority';
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

const inputVariants = cva('mdv-input', {
  variants: {
    variant: {
      default: 'mdv-input--default',
      error: 'mdv-input--error',
      success: 'mdv-input--success',
    },
    size: {
      default: 'mdv-input--default-size',
      sm: 'mdv-input--sm',
      lg: 'mdv-input--lg',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

export type InputProps = InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants>;

export function Input({ className, variant, size, ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      className={cn(inputVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof inputVariants>;

export function Textarea({ className, variant, size, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(inputVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  VariantProps<typeof inputVariants>;

export function Select({ className, variant, size, ...props }: SelectProps) {
  return (
    <select
      data-slot="select"
      className={cn(inputVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { inputVariants };