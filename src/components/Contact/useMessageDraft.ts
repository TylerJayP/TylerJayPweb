import { type MouseEvent, useState } from 'react';
import {
  buildMailto,
  findProblems,
  formStatus,
  hasProblems,
  isReady,
  type MessageDraft,
  NO_PROBLEMS,
} from '../../lib/contact';

const EMPTY_DRAFT: MessageDraft = { name: '', topic: -1, customSubject: '', message: '' };

/**
 * The message form's state. Problems only show after a first try at sending, and any edit afterwards
 * clears the "your email app is opening" note.
 */
export function useMessageDraft() {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [triedToSend, setTriedToSend] = useState(false);
  const [sent, setSent] = useState(false);

  const problems = triedToSend ? findProblems(draft) : NO_PROBLEMS;
  const ready = isReady(draft);

  const update = (changes: Partial<MessageDraft>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setSent(false);
  };

  /** The send link's click: lets the mailto link open when the draft is ready, and stops it otherwise. */
  const send = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!ready) {
      event.preventDefault();
    }
    setTriedToSend(!ready);
    setSent(ready);
  };

  return {
    draft,
    problems,
    ready,
    hasProblems: hasProblems(problems),
    status: formStatus(problems, sent),
    mailto: buildMailto(draft),
    update,
    send,
  };
}
