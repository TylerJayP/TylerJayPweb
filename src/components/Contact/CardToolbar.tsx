import type { CSSProperties } from 'react';
import { contactCardUrl } from '../../lib/contact';
import { CopyIcon, DownloadIcon, FlipIcon, LayersIcon, ShareIcon } from '../icons';
import type { CardView } from './useCardRig';
import styles from './Contact.module.css';

interface CardToolbarProps {
  view: CardView;
  onToggleApart: () => void;
  onFlip: () => void;
  emailCopied: boolean;
  onCopyEmail: () => void;
  onShare: () => void;
  className?: string;
  style?: CSSProperties;
}

/** The buttons under the business card: take it apart, flip it, copy, save and share. */
export function CardToolbar({
  view,
  onToggleApart,
  onFlip,
  emailCopied,
  onCopyEmail,
  onShare,
  className,
  style,
}: CardToolbarProps) {
  return (
    <div className={className} style={style} role="toolbar" aria-label="My business card">
      <button type="button" className={styles.tool} onClick={onToggleApart} aria-pressed={view.exploded}>
        <LayersIcon />
        <span>{view.exploded ? 'Put together' : 'Take apart'}</span>
      </button>
      <button type="button" className={styles.tool} onClick={onFlip} aria-pressed={view.flipped}>
        <FlipIcon />
        <span>{view.flipped ? 'Front' : 'Flip'}</span>
      </button>
      <span className={styles.separator} aria-hidden="true" />
      <button type="button" className={styles.tool} onClick={onCopyEmail}>
        <CopyIcon />
        <span>{emailCopied ? 'Copied' : 'Copy email'}</span>
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
      <button type="button" className={styles.tool} onClick={onShare}>
        <ShareIcon />
        <span>Share</span>
      </button>
    </div>
  );
}
