import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/render';
import { BusinessCard } from './BusinessCard';
import { LAYER_COUNT } from './cardPhysics';
import { useCardRig } from './useCardRig';

function Card() {
  const rig = useCardRig();
  return <BusinessCard rig={rig} />;
}

describe('BusinessCard', () => {
  it('has a label for every layer the physics stacks', () => {
    renderWithProviders(<Card />);
    expect(screen.getAllByRole('listitem')).toHaveLength(LAYER_COUNT);
  });

  it('shows how a layer is made when its label is chosen', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Card />);
    const foil = screen.getByRole('button', { name: /Foil mark/ });
    await user.click(foil);
    await user.click(foil);
    expect(foil).toHaveAttribute('aria-pressed', 'true');
    expect(foil).toHaveTextContent(/stamped in (pink|red) foil/);
  });
});
