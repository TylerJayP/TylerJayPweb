import { buildMailto, contactCardUrl, findProblems, isReady, OTHER_TOPIC, subjectFor } from './contact';

const draft = { name: 'Sam', topic: -1, customSubject: '', message: 'Hi Tyler' };

describe('message drafts', () => {
  it('needs a name and a message', () => {
    expect(findProblems({ ...draft, name: ' ', message: '' })).toEqual({ name: true, message: true });
    expect(isReady(draft)).toBe(true);
  });

  it('picks the subject from the topic, a typed one, or a default', () => {
    expect(subjectFor(draft)).toBe('Hello from your website');
    expect(subjectFor({ ...draft, topic: 0 })).toBe('A role on my team');
    expect(subjectFor({ ...draft, topic: OTHER_TOPIC, customSubject: '  Internship ' })).toBe('Internship');
    expect(subjectFor({ ...draft, topic: OTHER_TOPIC, customSubject: '' })).toBe('Hello from your website');
  });

  it('builds an encoded mailto link signed with the name', () => {
    const href = buildMailto({ ...draft, topic: 1, message: 'Build me a site & more' }, 'me@example.com');
    expect(href).toBe(
      'mailto:me@example.com?subject=A%20project%20idea&body=Build%20me%20a%20site%20%26%20more%0A%0ASam',
    );
  });
});

describe('contactCardUrl', () => {
  it('is a vCard with my details', () => {
    const card = decodeURIComponent(contactCardUrl().split(',')[1]!);
    expect(card.startsWith('BEGIN:VCARD\r\nVERSION:3.0')).toBe(true);
    expect(card).toContain('EMAIL;TYPE=INTERNET:tylerjayp12@gmail.com');
    expect(card.endsWith('END:VCARD')).toBe(true);
  });
});
