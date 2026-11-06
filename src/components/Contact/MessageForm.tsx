import type { CSSProperties } from 'react';
import { site } from '../../content/site';
import { revealDelay, useReveal } from '../../hooks/useReveal';
import { classNames } from '../../lib/classNames';
import { type MessageDraft, MESSAGE_TOPICS, OTHER_TOPIC } from '../../lib/contact';
import { ArrowRightIcon } from '../icons';
import { useMessageDraft } from './useMessageDraft';
import styles from './MessageForm.module.css';

/** The "To" address types itself out when the form scrolls in, one character every 34 ms. */
const typeIn = (i: number): CSSProperties => ({ '--rvd': `${640 + i * 34}ms` });

/**
 * A message laid out like an email. There's no server: "Send message" opens the visitor's email app with
 * everything filled in, after checking that they've added a name and a message.
 */
export function MessageForm() {
  const reveal = useReveal('message-form');
  const { draft, problems, ready, hasProblems, status, mailto, update, send } = useMessageDraft();

  return (
    <div ref={reveal.ref} className={classNames(reveal.className, styles.form)}>
      <div className={classNames('rvi', styles.header)} style={revealDelay(2)}>
        <span className={styles.badge}>
          <span className={styles.pulse} aria-hidden="true" />
          New message
        </span>
        <span className={classNames(styles.badge, ready && styles.ready)}>
          {ready ? 'Ready to send' : 'Draft'}
        </span>
      </div>

      <AddressLine />

      <div
        className={classNames('rline', styles.row, problems.name && styles.invalid)}
        style={revealDelay(4)}
      >
        <label htmlFor="message-name" className={classNames('rvi', styles.key)}>
          From
        </label>
        <input
          id="message-name"
          className={classNames('rvi', styles.field)}
          type="text"
          autoComplete="name"
          value={draft.name}
          onChange={(event) => update({ name: event.target.value })}
          placeholder="Your name"
          aria-invalid={problems.name}
        />
      </div>

      <TopicField draft={draft} onChange={update} />

      <div
        className={classNames('rline', styles.row, styles.top, problems.message && styles.invalid)}
        style={revealDelay(6)}
      >
        <label htmlFor="message-body" className={classNames('rvi', styles.key)} style={{ paddingTop: 4 }}>
          Message
        </label>
        <textarea
          id="message-body"
          className={classNames('rvi', styles.field, styles.message)}
          rows={6}
          value={draft.message}
          onChange={(event) => update({ message: event.target.value })}
          placeholder="What are you working on?"
          aria-invalid={problems.message}
        />
      </div>

      <div className={classNames('rline', styles.end)} style={revealDelay(7)}>
        <a className={classNames('rvi', styles.send)} href={mailto} onClick={send}>
          Send message
          <ArrowRightIcon size={16} />
        </a>
        <span className={classNames('rvi', styles.hint)}>
          Opens your email app with all of this filled in.
        </span>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={classNames(styles.status, hasProblems && styles.statusProblem)}
      >
        {status}
      </p>
    </div>
  );
}

/** The "To" line, with my address typing itself out as the form scrolls in. */
function AddressLine() {
  return (
    <div className={classNames('rline', styles.row)} style={revealDelay(3)}>
      <span className={classNames('rvi', styles.key)}>To</span>
      <span className={classNames('rvi', styles.to)}>
        {[...site.email].map((char, i) => (
          <span key={i} className="rty" style={typeIn(i)}>
            {char}
          </span>
        ))}
        <span className="rcaret" aria-hidden="true" />
      </span>
    </div>
  );
}

interface TopicFieldProps {
  draft: MessageDraft;
  onChange: (changes: Partial<MessageDraft>) => void;
}

/** "About": pick a topic for the subject line, or choose Other and type one. */
function TopicField({ draft, onChange }: TopicFieldProps) {
  const toggle = (topic: number) => onChange({ topic: draft.topic === topic ? -1 : topic });

  return (
    <div className={classNames('rline', styles.row, styles.top)} style={revealDelay(5)}>
      <span id="message-about" className={classNames('rvi', styles.key)} style={{ paddingTop: 9 }}>
        About
      </span>
      <div className={classNames('rvi', styles.topics)}>
        <div role="group" aria-labelledby="message-about" className={styles.chips}>
          {MESSAGE_TOPICS.map((topic, i) => (
            <button
              key={topic.label}
              type="button"
              className={styles.chip}
              aria-pressed={draft.topic === i}
              onClick={() => toggle(i)}
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
            onChange={(event) => onChange({ customSubject: event.target.value })}
            placeholder="Type a subject"
          />
        )}
      </div>
    </div>
  );
}
