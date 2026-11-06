import { useState, type CSSProperties, type MouseEvent } from 'react';
import { site } from '../../content/site';
import {
  buildMailto,
  findProblems,
  isReady,
  MESSAGE_TOPICS,
  OTHER_TOPIC,
  type MessageDraft,
} from '../../lib/contact';
import { revealDelay, useReveal } from '../../hooks/reveal';
import { ArrowRightIcon } from '../icons';
import styles from './MessageForm.module.css';

const EMPTY_DRAFT: MessageDraft = { name: '', topic: -1, customSubject: '', message: '' };
/** The "To" address types itself out when the form scrolls in, one character every 34 ms. */
const typeIn = (i: number) => ({ '--rvd': `${640 + i * 34}ms` }) as CSSProperties;

/**
 * A message laid out like an email. There's no server: "Send message" opens the visitor's email app with
 * everything filled in, after checking that they've added a name and a message.
 */
export function MessageForm() {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [triedToSend, setTriedToSend] = useState(false);
  const [sent, setSent] = useState(false);
  const reveal = useReveal('cform');

  const problems = triedToSend ? findProblems(draft) : { name: false, message: false };
  const ready = isReady(draft);

  const update = (changes: Partial<MessageDraft>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setSent(false);
  };

  const send = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!ready) {
      event.preventDefault();
      setTriedToSend(true);
      setSent(false);
      return;
    }
    setTriedToSend(false);
    setSent(true);
  };

  let status = sent ? 'Your email app should be opening with your message.' : '';
  if (problems.name || problems.message) {
    status =
      problems.name && problems.message
        ? 'Add your name and a message first.'
        : problems.name
          ? 'Add your name first.'
          : 'Add a message first.';
  }

  return (
    <div ref={reveal.ref} className={`rv ${reveal.className} ${styles.form}`}>
      <div className={`rvi ${styles.header}`} style={revealDelay(2)}>
        <span className={styles.badge}>
          <span className={styles.pulse} aria-hidden="true" />
          New message
        </span>
        <span className={`${styles.badge} ${ready ? styles.ready : ''}`}>
          {ready ? 'Ready to send' : 'Draft'}
        </span>
      </div>

      <div className={`rline ${styles.row}`} style={revealDelay(3)}>
        <span className={`rvi ${styles.key}`}>To</span>
        <span className={`rvi ${styles.to}`}>
          {[...site.email].map((char, i) => (
            <span key={i} className="rty" style={typeIn(i)}>
              {char}
            </span>
          ))}
          <span className="rcaret" aria-hidden="true" />
        </span>
      </div>

      <div className={`rline ${styles.row} ${problems.name ? styles.invalid : ''}`} style={revealDelay(4)}>
        <label htmlFor="message-name" className={`rvi ${styles.key}`}>
          From
        </label>
        <input
          id="message-name"
          className={`rvi ${styles.field}`}
          type="text"
          autoComplete="name"
          value={draft.name}
          onChange={(event) => update({ name: event.target.value })}
          placeholder="Your name"
          aria-invalid={problems.name}
        />
      </div>

      <div className={`rline ${styles.row} ${styles.top}`} style={revealDelay(5)}>
        <span id="message-about" className={`rvi ${styles.key}`} style={{ paddingTop: 9 }}>
          About
        </span>
        <div className={`rvi ${styles.topics}`}>
          <div role="group" aria-labelledby="message-about" className={styles.chips}>
            {MESSAGE_TOPICS.map((topic, i) => (
              <button
                key={topic.label}
                type="button"
                className={styles.chip}
                aria-pressed={draft.topic === i}
                onClick={() => update({ topic: draft.topic === i ? -1 : i })}
              >
                {topic.label}
              </button>
            ))}
          </div>
          {draft.topic === OTHER_TOPIC && (
            <input
              className={styles.field}
              type="text"
              aria-label="Subject"
              value={draft.customSubject}
              onChange={(event) => update({ customSubject: event.target.value })}
              placeholder="Type a subject"
            />
          )}
        </div>
      </div>

      <div
        className={`rline ${styles.row} ${styles.top} ${problems.message ? styles.invalid : ''}`}
        style={revealDelay(6)}
      >
        <label htmlFor="message-body" className={`rvi ${styles.key}`} style={{ paddingTop: 4 }}>
          Message
        </label>
        <textarea
          id="message-body"
          className={`rvi ${styles.field} ${styles.message}`}
          rows={6}
          value={draft.message}
          onChange={(event) => update({ message: event.target.value })}
          placeholder="What are you working on?"
          aria-invalid={problems.message}
        />
      </div>

      <div className={`rline ${styles.end}`} style={revealDelay(7)}>
        <a className={`rvi ${styles.send}`} href={buildMailto(draft)} onClick={send}>
          Send message
          <ArrowRightIcon size={16} />
        </a>
        <span className={`rvi ${styles.hint}`}>Opens your email app with all of this filled in.</span>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`${styles.status} ${problems.name || problems.message ? styles.statusProblem : ''}`}
      >
        {status}
      </p>
    </div>
  );
}
