'use client';

import { ThemeProvider as CustomThemeProvider } from '@/lib/theme';
import React from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: 'light' | 'dark' | 'system';
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <CustomThemeProvider {...props}>
      {children}
    </CustomThemeProvider>
  );
}
