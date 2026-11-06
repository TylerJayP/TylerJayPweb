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

export const NO_PROBLEMS: DraftProblems = { name: false, message: false };

export function findProblems(draft: MessageDraft): DraftProblems {
  return { name: !draft.name.trim(), message: !draft.message.trim() };
}

export function hasProblems(problems: DraftProblems): boolean {
  return problems.name || problems.message;
}

export function isReady(draft: MessageDraft): boolean {
  return !hasProblems(findProblems(draft));
}

/** The line under the send button: what's still missing, or that the email app is opening. */
export function formStatus(problems: DraftProblems, sent: boolean): string {
  if (problems.name && problems.message) {
    return 'Add your name and a message first.';
  }
  if (problems.name) {
    return 'Add your name first.';
  }
  if (problems.message) {
    return 'Add a message first.';
  }
  return sent ? 'Your email app should be opening with your message.' : '';
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
  return (await copyWithClipboardApi(text)) || copyWithTextarea(text);
}

async function copyWithClipboardApi(text: string): Promise<boolean> {
  if (!navigator.clipboard?.writeText) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** The older way, for browsers without the Clipboard API: select text in a hidden field and copy it. */
function copyWithTextarea(text: string): boolean {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  try {
    area.select();
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    area.remove();
  }
}
