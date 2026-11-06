import { useEffect, useRef, useState } from 'react';
import { site } from '../../content/site';
import { contactCardUrl, copyText } from '../../lib/contact';
import { revealDelay, useReveal, useRevealEnabled } from '../../hooks/reveal';
import { RevealWords } from '../common/RevealWords';
import { CopyIcon, DownloadIcon, FlipIcon, LayersIcon, ShareIcon } from '../icons';
import { BusinessCard } from './BusinessCard';
import { MessageForm } from './MessageForm';
import { useCardRig } from './useCardRig';
import styles from './Contact.module.css';

const SHARE_TEXT = `${site.name} · Software developer in Salt Lake City · ${site.email} · ${site.github.label}`;
const STATUS_MS = 1800;

type CardStatus = '' | 'email' | 'card' | 'failed' | 'shared';

const STATUS_TEXT: Record<CardStatus, string> = {
  '': '',
  email: 'Email copied.',
  card: 'Card details copied, ready to paste.',
  failed: "Couldn't copy. Flip the card and select the text.",
  shared: 'Shared.',
};

export function Contact() {
  const heading = useReveal('contact');
  const rig = useCardRig();
  const revealsOn = useRevealEnabled();
  const card = useReveal('ccard', { onReveal: rig.actions.introduce, onHide: rig.actions.prepare });
  const [status, setStatus] = useState<CardStatus>('');
  const statusTimer = useRef(0);

  // With scroll reveals on, the card waits taken apart until it scrolls into view and builds itself.
  const { prepare } = rig.actions;
  useEffect(() => {
    if (revealsOn) prepare();
  }, [revealsOn, prepare]);

  useEffect(() => () => window.clearTimeout(statusTimer.current), []);

  const showStatus = (next: CardStatus) => {
    setStatus(next);
    window.clearTimeout(statusTimer.current);
    if (next === 'email' || next === 'card')
      statusTimer.current = window.setTimeout(() => setStatus(''), STATUS_MS);
  };

  const copy = async (text: string, kind: 'email' | 'card') =>
    showStatus((await copyText(text)) ? kind : 'failed');

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: site.name, text: SHARE_TEXT });
        showStatus('shared');
      } catch {
        // dismissed: nothing to report
      }
      return;
    }
    await copy(SHARE_TEXT, 'card');
  };

  const { view, actions } = rig;

  return (
    <section id="contact" className={`page-section ${styles.section}`}>
      <div ref={heading.ref} className={`rv ${heading.className} ${styles.heading}`}>
        <div className={styles.titles}>
          <p className="eyebrow rvi" style={revealDelay(0)}>
            Contact
          </p>
          <h2 className={`display ${styles.title}`}>
            <RevealWords text="Need something built, or someone to build it?" from={1} />
          </h2>
        </div>
        <p className={`rvi ${styles.lead}`} style={revealDelay(9)}>
          A project, a role, or just an idea. Take my card with you, or write to me right here.
        </p>
      </div>

      <div className={styles.columns}>
        <div ref={card.ref} className={`rv ${card.className} ${styles.cardColumn}`}>
          <BusinessCard rig={rig} className="rfade" />
          <div
            className={`rvi ${styles.dock}`}
            style={revealDelay(6)}
            role="toolbar"
            aria-label="My business card"
          >
            <button
              type="button"
              className={styles.tool}
              onClick={actions.toggleApart}
              aria-pressed={view.exploded}
            >
              <LayersIcon />
              <span>{view.exploded ? 'Put together' : 'Take apart'}</span>
            </button>
            <button type="button" className={styles.tool} onClick={actions.flip} aria-pressed={view.flipped}>
              <FlipIcon />
              <span>{view.flipped ? 'Front' : 'Flip'}</span>
            </button>
            <span className={styles.separator} aria-hidden="true" />
            <button type="button" className={styles.tool} onClick={() => copy(site.email, 'email')}>
              <CopyIcon />
              <span>{status === 'email' ? 'Copied' : 'Copy email'}</span>
            </button>
            <a
              className={styles.tool}
              href={contactCardUrl()}
              download="tyler-jay-perkins.vcf"
              aria-label="Save my contact card"
            >
              <DownloadIcon strokeWidth={1.6} />
              <span>Save</span>
            </a>
            <button type="button" className={styles.tool} onClick={share}>
              <ShareIcon />
              <span>Share</span>
            </button>
          </div>
          <p role="status" className={styles.status}>
            {STATUS_TEXT[status]}
          </p>
        </div>

        <MessageForm />
      </div>
    </section>
  );
}
