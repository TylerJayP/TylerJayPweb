import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTheme } from '../hooks/useTheme';
import { ThemeProvider } from './ThemeProvider';

function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button type="button" onClick={toggleTheme}>
      {theme}
    </button>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => localStorage.clear());

  it('follows the system setting until the visitor chooses', () => {
    render(<ThemeButton />, { wrapper: ThemeProvider });
    expect(screen.getByRole('button')).toHaveTextContent('light');
    expect(localStorage.getItem('tjp-theme')).toBeNull();
  });

  it('remembers a choice and marks the page with it', async () => {
    const user = userEvent.setup();
    render(<ThemeButton />, { wrapper: ThemeProvider });
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('dark');
    expect(localStorage.getItem('tjp-theme')).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
