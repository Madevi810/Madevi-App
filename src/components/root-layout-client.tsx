'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { MotionOrchestrator } from '@/components/motion-orchestrator';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MotionOrchestrator />
      {children}
    </ThemeProvider>
  );
}
