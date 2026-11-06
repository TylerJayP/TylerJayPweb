import { site } from '../content/site';

/** What a visitor can pick under "About", with the email subject each one sends. */
export const MESSAGE_TOPICS = [
  { label: 'A role', subject: 'A role on my team' },
  { label: 'A project', subject: 'A project idea' },
  { label: 'A class', subject: 'A question about one of your classes' },
  { label: 'Saying hi', subject: 'Hello from your website' },
  { label: 'Other', subject: '' },
] as const;

export const OTHER_TOPIC = MESSAGE_TOPICS.length - 1;
const DEFAULT_SUBJECT = 'Hello from your website';

export interface MessageDraft {
  name: string;
  /** Index into MESSAGE_TOPICS, or -1 for none. */
  topic: number;
  /** Typed subject, used when the topic is "Other". */
  customSubject: string;
  message: string;
}

export interface DraftProblems {
  name: boolean;
  message: boolean;
}

export function findProblems(draft: MessageDraft): DraftProblems {
  return { name: !draft.name.trim(), message: !draft.message.trim() };
}

export function isReady(draft: MessageDraft): boolean {
  const problems = findProblems(draft);
  return !problems.name && !problems.message;
}

export function subjectFor(draft: MessageDraft): string {
  const subject =
    draft.topic === OTHER_TOPIC ? draft.customSubject.trim() : (MESSAGE_TOPICS[draft.topic]?.subject ?? '');
  return subject || DEFAULT_SUBJECT;
}

/** A mailto: link that opens the visitor's email app with the message filled in. */
export function buildMailto(draft: MessageDraft, to: string = site.email): string {
  const name = draft.name.trim();
  const body = draft.message.trim() + (name ? `\n\n${name}` : '');
  return `mailto:${to}?subject=${encodeURIComponent(subjectFor(draft))}&body=${encodeURIComponent(body)}`;
}

/** My contact card as a vCard 3.0 data URL, for the "Save" button. */
export function contactCardUrl(): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Perkins;Tyler Jay;;;',
    `FN:${site.name}`,
    'TITLE:Software Developer',
    `EMAIL;TYPE=INTERNET:${site.email}`,
    `URL:${site.website.url}`,
    `URL:${site.linkedin.url}`,
    `URL:${site.github.url}`,
    'ADR;TYPE=HOME:;;;Salt Lake City;UT;;USA',
    'END:VCARD',
  ];
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`;
}

/** Copies text, falling back to a hidden textarea where the async Clipboard API isn't available. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the older approach
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}
