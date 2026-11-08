import { type MouseEvent, useCallback, useEffect, useState } from 'react';

/**
 * Open/closed state for a dialog that an address like /#resume opens, whether the page loads with that
 * hash or it changes later. Closing takes the hash back off the address, so a reload doesn't reopen it.
 */
export function useHashDialog(hash: `#${string}`) {
  const [open, setOpen] = useState(() => window.location.hash === hash);

  useEffect(() => {
    const openOnHash = () => {
      if (window.location.hash === hash) {
        setOpen(true);
      }
    };
    window.addEventListener('hashchange', openOnHash);
    return () => window.removeEventListener('hashchange', openOnHash);
  }, [hash]);

  /** For links to the hash: opens the dialog without the page jumping. */
  const openFromLink = useCallback((event: MouseEvent) => {
    event.preventDefault();
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    if (window.location.hash === hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [hash]);

  return { open, openFromLink, close };
}
