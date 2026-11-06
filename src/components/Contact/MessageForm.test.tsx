import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/render';
import { MessageForm } from './MessageForm';

describe('<MessageForm>', () => {
  it('will not send until there is a name and a message', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MessageForm />);
    await user.click(screen.getByRole('link', { name: /Send message/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Add your name and a message first.');
    expect(screen.getByRole('textbox', { name: 'From' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('builds the email from what was typed', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MessageForm />);
    await user.type(screen.getByRole('textbox', { name: 'From' }), 'Sam');
    await user.click(screen.getByRole('button', { name: 'A role' }));
    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'We are hiring');
    expect(screen.getByText('Ready to send')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Send message/ })).toHaveAttribute(
      'href',
      'mailto:tylerjayp12@gmail.com?subject=A%20role%20on%20my%20team&body=We%20are%20hiring%0A%0ASam',
    );
  });

  it('asks for a subject when the topic is Other', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MessageForm />);
    expect(screen.queryByRole('textbox', { name: 'Subject' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Other' }));
    expect(screen.getByRole('textbox', { name: 'Subject' })).toBeInTheDocument();
  });
});
