import { clsx, type ClassValue } from 'clsx';

/** Class merger kept compatible with the shadcn/ui component convention. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
