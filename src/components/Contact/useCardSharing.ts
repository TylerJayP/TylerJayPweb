import { useCallback, useEffect, useRef, useState } from 'react';
import { site } from '../../content/site';
import { copyText } from '../../lib/contact';

const SHARE_TEXT = `${site.name} · Software developer in Salt Lake City · ${site.email} · ${site.github.label}`;

export type ShareStatus = 'idle' | 'email' | 'card' | 'failed' | 'shared';

/** What each status says, and whether it clears itself after a moment. */
const STATUS: Record<ShareStatus, { message: string; clears: boolean }> = {
  idle: { message: '', clears: false },
  email: { message: 'Email copied.', clears: true },
  card: { message: 'Card details copied, ready to paste.', clears: true },
  failed: { message: "Couldn't copy. Flip the card and select the text.", clears: false },
  shared: { message: 'Shared.', clears: false },
};

const CLEAR_AFTER_MS = 1800;

/** Copying my email and sharing my card, with a short status message for each. */
export function useCardSharing() {
  const [status, setStatus] = useState<ShareStatus>('idle');
  const clearTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(clearTimer.current), []);

  const show = useCallback((next: ShareStatus) => {
    window.clearTimeout(clearTimer.current);
    setStatus(next);
    if (STATUS[next].clears) {
      clearTimer.current = window.setTimeout(() => setStatus('idle'), CLEAR_AFTER_MS);
    }
  }, []);

  const copy = useCallback(
    async (text: string, kind: 'email' | 'card') => {
      const copied = await copyText(text);
      show(copied ? kind : 'failed');
    },
    [show],
  );

  const copyEmail = useCallback(() => copy(site.email, 'email'), [copy]);

  /** Uses the device's share sheet where there is one, and copies the details where there isn't. */
  const share = useCallback(async () => {
    if (!navigator.share) {
      await copy(SHARE_TEXT, 'card');
      return;
    }
    try {
      await navigator.share({ title: site.name, text: SHARE_TEXT });
      show('shared');
    } catch {
      // The visitor closed the share sheet: nothing to report.
    }
  }, [copy, show]);

  return { status, message: STATUS[status].message, copyEmail, share };
}
