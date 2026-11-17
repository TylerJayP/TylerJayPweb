import { render } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { linkedSection, useLinkedSection } from './useLinkedSection';

function Page() {
  useLinkedSection();
  return (
    <main>
      <section id="intro">Intro</section>
      <section id="work">Selected Projects</section>
    </main>
  );
}

describe('useLinkedSection', () => {
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    Element.prototype.scrollIntoView = scrollIntoView;
  });

  afterEach(() => {
    scrollIntoView.mockClear();
    window.history.replaceState(null, '', '/');
  });

  it('jumps to the section the address names', () => {
    window.history.replaceState(null, '', '/#work');
    render(<Page />);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' });
    expect(scrollIntoView.mock.contexts[0]).toHaveProperty('id', 'work');
  });

  it('stays at the top when the address names no section', () => {
    window.history.replaceState(null, '', '/#resume');
    render(<Page />);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('stays at the top without a hash', () => {
    render(<Page />);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});

describe('linkedSection', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('finds the element a hash points at', () => {
    document.body.innerHTML = '<section id="contact"></section>';
    expect(linkedSection('#contact')).toHaveProperty('id', 'contact');
  });

  it('returns null for an empty hash or an id that is not on the page', () => {
    expect(linkedSection('')).toBeNull();
    expect(linkedSection('#')).toBeNull();
    expect(linkedSection('#nowhere')).toBeNull();
  });
});
