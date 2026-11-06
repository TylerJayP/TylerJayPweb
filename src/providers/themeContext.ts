import { createContext } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

/** Shared by ThemeProvider and useTheme. */
export const ThemeContext = createContext<ThemeContextValue | null>(null);
