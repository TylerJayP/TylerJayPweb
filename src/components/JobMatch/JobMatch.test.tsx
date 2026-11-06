import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/render';
import { JobMatch } from './JobMatch';

describe('<JobMatch>', () => {
  it('starts with the first sample and its matches', () => {
    renderWithProviders(<JobMatch onHear={() => {}} />);
    expect(screen.getByRole('button', { name: 'Junior .NET developer' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText(/skills I found in this posting match my experience/)).toBeInTheDocument();
  });

  it('matches what the visitor types and lists what is missing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<JobMatch onHear={() => {}} />);
    const box = screen.getByRole('textbox', { name: 'Job description' });
    await user.clear(box);
    await user.type(box, 'React and Kubernetes');
    expect(
      screen.getByText('1 of the 2 skills I found in this posting match my experience'),
    ).toBeInTheDocument();
    expect(screen.getByText(/Not on this site yet:/).parentElement).toHaveTextContent('Kubernetes');
  });

  it('plays the matching clip from the intro', async () => {
    const user = userEvent.setup();
    const onHear = vi.fn();
    renderWithProviders(<JobMatch onHear={onHear} />);
    await user.click(screen.getAllByRole('button', { name: /Hear it/ })[0]!);
    expect(onHear).toHaveBeenCalledWith(expect.closeTo(147.56, 2));
  });

  it('prompts for a posting once cleared', async () => {
    const user = userEvent.setup();
    renderWithProviders(<JobMatch onHear={() => {}} />);
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByText(/Paste a posting above/)).toBeInTheDocument();
  });
});
