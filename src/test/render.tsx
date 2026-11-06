import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { RevealProvider } from '../hooks/reveal';
import { ThemeProvider } from '../hooks/theme';

function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <RevealProvider held={false}>{children}</RevealProvider>
    </ThemeProvider>
  );
}

/** Renders a component inside the providers the page wraps it in (rerenders keep them too). */
export function renderWithProviders(ui: ReactElement) {
  return render(ui, { wrapper: Providers });
}
