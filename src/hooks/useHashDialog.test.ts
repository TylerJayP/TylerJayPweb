import { act, renderHook } from '@testing-library/react';
import type { MouseEvent } from 'react';
import { useHashDialog } from './useHashDialog';

const goTo = (hash: string) => {
  window.history.replaceState(null, '', `/${hash}`);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
};

describe('useHashDialog', () => {
  afterEach(() => window.history.replaceState(null, '', '/'));

  it('starts open when the page loads with the hash', () => {
    window.history.replaceState(null, '', '/#resume');
    const { result } = renderHook(() => useHashDialog('#resume'));
    expect(result.current.open).toBe(true);
  });

  it('opens when the hash changes later', () => {
    const { result } = renderHook(() => useHashDialog('#resume'));
    expect(result.current.open).toBe(false);
    act(() => goTo('#resume'));
    expect(result.current.open).toBe(true);
  });

  it('ignores other hashes', () => {
    const { result } = renderHook(() => useHashDialog('#resume'));
    act(() => goTo('#contact'));
    expect(result.current.open).toBe(false);
  });

  it('takes the hash off the address when it closes', () => {
    window.history.replaceState(null, '', '/#resume');
    const { result } = renderHook(() => useHashDialog('#resume'));
    act(() => result.current.close());
    expect(result.current.open).toBe(false);
    expect(window.location.hash).toBe('');
  });

  it('opens from a link without following it', () => {
    const { result } = renderHook(() => useHashDialog('#resume'));
    const preventDefault = vi.fn();
    act(() => result.current.openFromLink({ preventDefault } as unknown as MouseEvent));
    expect(preventDefault).toHaveBeenCalled();
    expect(result.current.open).toBe(true);
  });
});
