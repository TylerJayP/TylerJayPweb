import { useEffect } from 'react';
import { revealDelay, useReveal, useRevealEnabled } from '../../hooks/useReveal';
import { classNames } from '../../lib/classNames';
import { RevealWords } from '../common/RevealWords';
import { BusinessCard } from './BusinessCard';
import { CardToolbar } from './CardToolbar';
import { MessageForm } from './MessageForm';
import { useCardRig } from './useCardRig';
import { useCardSharing } from './useCardSharing';
import styles from './Contact.module.css';

export function Contact() {
  const heading = useReveal('contact-heading');
  const rig = useCardRig();
  const sharing = useCardSharing();
  const revealsOn = useRevealEnabled();
  const { introduce, prepare, toggleApart, flip } = rig.actions;
  const card = useReveal('business-card', { onReveal: introduce, onHide: prepare });

  // With scroll reveals on, the card waits taken apart until it scrolls into view and builds itself.
  useEffect(() => {
    if (revealsOn) {
      prepare();
    }
  }, [revealsOn, prepare]);

  return (
    <section id="contact" className={classNames('page-section', styles.section)}>
      <div ref={heading.ref} className={classNames(heading.className, styles.heading)}>
        <div className={styles.titles}>
          <p className="eyebrow rvi" style={revealDelay(0)}>
            Contact
          </p>
          <h2 className={classNames('display', styles.title)}>
            <RevealWords text="Need something built, or someone to build it?" from={1} />
          </h2>
        </div>
        <p className={classNames('rvi', styles.lead)} style={revealDelay(9)}>
          A project, a role, or just an idea. Take my card with you, or write to me right here.
        </p>
      </div>

      <div className={styles.columns}>
        <div ref={card.ref} className={classNames(card.className, styles.cardColumn)}>
          <BusinessCard rig={rig} className="rfade" />
          <CardToolbar
            className={classNames('rvi', styles.dock)}
            style={revealDelay(6)}
            view={rig.view}
            onToggleApart={toggleApart}
            onFlip={flip}
            emailCopied={sharing.status === 'email'}
            onCopyEmail={sharing.copyEmail}
            onShare={sharing.share}
          />
          <p role="status" className={styles.status}>
            {sharing.message}
          </p>
        </div>

        <MessageForm />
      </div>
    </section>
  );
}
