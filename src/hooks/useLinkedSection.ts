import { useEffect } from 'react';

/** How far the page may have moved before we count it as the visitor scrolling on their own. */
const SETTLED_PX = 2;

/**
 * Opens the page at the section its address names, so tylerjayp.com/#work lands on Selected Projects.
 *
 * Browsers look for the section as the page arrives, but React draws it a moment later, so on its own the
 * page stays at the top. This jumps there once the page has rendered, and again once the web fonts have
 * loaded and settled the layout, unless the visitor has already started scrolling by then.
 */
export function useLinkedSection(): void {
  useEffect(() => {
    const section = linkedSection(window.location.hash);
    if (!section) {
      return undefined;
    }

    let cancelled = false;
    const jump = () => {
      section.scrollIntoView({ block: 'start', behavior: 'instant' });
      return window.scrollY;
    };
    const landedAt = jump();

    void document.fonts?.ready.then(() => {
      const stillWhereWeLeftIt = Math.abs(window.scrollY - landedAt) <= SETTLED_PX;
      if (!cancelled && stillWhereWeLeftIt) {
        jump();
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);
}

/** The element an address like "#work" points at, or null for an empty hash or one that names nothing. */
export function linkedSection(hash: string): HTMLElement | null {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) {
    return null;
  }
  return document.getElementById(id);
}
