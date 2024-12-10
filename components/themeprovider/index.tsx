"use client";

import { ThemeProvider } from "next-themes";

type ThemeProviderProps = {
  children?: React.ReactNode;
};

export function ProviderTheme({ children }: ThemeProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
