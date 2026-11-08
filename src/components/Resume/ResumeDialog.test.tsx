import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/render';
import { ResumeDialog } from './ResumeDialog';

describe('<ResumeDialog>', () => {
  it('renders nothing while closed', () => {
    renderWithProviders(<ResumeDialog open={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the resume with a PDF link and closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<ResumeDialog open onClose={onClose} />);
    expect(screen.getByRole('dialog', { name: 'Tyler Jay Perkins' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Download PDF/ })).toHaveAttribute(
      'href',
      '/Tyler-Jay-Perkins-Resume.pdf',
    );
    expect(document.documentElement.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('gives the page its scrolling back when it closes', async () => {
    vi.useFakeTimers();
    const { rerender } = renderWithProviders(<ResumeDialog open onClose={() => {}} />);
    rerender(<ResumeDialog open={false} onClose={() => {}} />);
    act(() => vi.advanceTimersByTime(250));
    expect(document.documentElement.style.overflow).toBe('');
    vi.useRealTimers();
  });
});
