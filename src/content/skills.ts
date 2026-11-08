// Content for the site. Edit here to change what the page says; components only lay it out.
import type { SamplePosting, Skill, SkillGap } from './types';

/**
 * Skills the job matcher looks for. Each pattern is a case-insensitive regular expression; `clipAt` is the
 * second in the intro video where I talk about it.
 */
export const skills: Skill[] = [
  {
    name: 'C#',
    patterns: ['c#', 'c sharp', 'csharp'],
    evidence:
      'Virtual Dyno, OBD2 Telemetry and TrulyOkay are all C#. "I find myself to enjoy C# and creating APIs the most."',
    clipAt: 147.51,
  },
  {
    name: '.NET / ASP.NET',
    patterns: ['\\.net', 'asp\\.net', 'dotnet', 'maui'],
    evidence:
      'ASP.NET Web API at my Treehouse internship, ASP.NET in Virtual Dyno, .NET MAUI in OBD2 Telemetry.',
  },
  {
    name: 'Entity Framework',
    patterns: ['entity framework', '\\bef core\\b', '\\bef\\b'],
    evidence: 'Used at Treehouse, and one of the tools I reach for in CRUD work.',
    clipAt: 153.08,
  },
  {
    name: 'REST APIs',
    patterns: ['\\bapis?\\b', '\\brest', 'web api', '\\bcrud\\b', 'backend', 'back-end', 'back end'],
    evidence:
      "Building APIs is what I enjoy most. ASP.NET Web API at Treehouse, the HoneyABA portal's NestJS API, and the back ends of my own projects.",
    clipAt: 147.51,
  },
  {
    name: 'React',
    patterns: ['react'],
    evidence:
      'React at my Treehouse internship, and the front ends of TrulyOkay, Virtual Dyno and the HoneyABA portal.',
  },
  {
    name: 'JavaScript',
    patterns: ['javascript', '\\bjs\\b', 'node'],
    evidence:
      "The TrulyOkay, Virtual Dyno and HoneyABA portal front ends, and the portal's NestJS API on Node.",
  },
  {
    name: 'TypeScript',
    patterns: ['typescript', '\\btsx?\\b'],
    evidence: "The HoneyABA portal's NestJS API is TypeScript.",
  },
  {
    name: 'SQL',
    patterns: ['\\bsql\\b', 'relational', 'database'],
    evidence:
      'TrulyOkay runs on MySQL and the HoneyABA portal on PostgreSQL, and I TA CS 3520 Database Theory.',
  },
  {
    name: 'PostgreSQL',
    patterns: ['postgres'],
    evidence: "The HoneyABA portal's API is built on PostgreSQL, with Neon as its hosted database.",
    clipAt: 153.08,
  },
  {
    name: 'MySQL',
    patterns: ['mysql'],
    evidence: 'Part of my usual CRUD toolkit.',
    clipAt: 153.08,
  },
  {
    name: 'Docker',
    patterns: ['docker', 'container'],
    evidence: 'Part of my usual back-end toolkit.',
    clipAt: 153.08,
  },
  {
    name: 'C++',
    patterns: ['c\\+\\+', 'cpp'],
    evidence: 'RankQuest and the 32-bit emulator are C++, and I TA CS 3370 C++ Software Development.',
    clipAt: 116.44,
  },
  {
    name: 'C',
    patterns: ['\\bc\\b(?![#+])', '\\bc language\\b'],
    evidence: 'I TA CS 1380, a freshman C course.',
    clipAt: 42.42,
  },
  {
    name: 'Java',
    patterns: ['\\bjava\\b(?!script)'],
    evidence: 'I TA CS 3250 Java Software Development.',
  },
  {
    name: 'Python',
    patterns: ['python'],
    evidence: 'Part of the 32-bit emulator and assembler.',
  },
  {
    name: 'Embedded / hardware',
    patterns: ['embedded', 'firmware', 'microcontroller', 'stm32', 'hardware', '\\becu\\b', 'can bus', 'iot'],
    evidence:
      'My graduate project is my own ECU, with an STM32 board as a virtual motor. OBD2 Telemetry talks to a car over Bluetooth LE.',
    clipAt: 157.92,
  },
  {
    name: 'Bluetooth LE',
    patterns: ['bluetooth', '\\bble\\b'],
    evidence: 'OBD2 Telemetry reads live engine data over Bluetooth LE.',
    clipAt: 65.59,
  },
  {
    name: 'Mobile',
    patterns: ['mobile', 'maui', 'android', '\\bios\\b'],
    evidence: 'OBD2 Telemetry is a .NET MAUI mobile app.',
    clipAt: 65.59,
  },
  {
    name: 'Auth / OAuth',
    patterns: ['oauth', 'authentication', '\\bauth\\b', 'sso', 'role-based', 'rbac', 'permissions'],
    evidence:
      'Google sign-in on TrulyOkay, and Microsoft sign-in (MSAL) with role-based access for owners, admins and RBTs in HoneyABA.',
  },
  {
    name: 'AI / LLMs',
    patterns: ['\\bai\\b', '\\bllms?\\b', 'machine learning', 'anthropic', 'openai', 'agentic', 'generative'],
    evidence:
      'TrulyOkay has AI features built on the Anthropic API, and I built RankQuest with agentic coding.',
    clipAt: 132.42,
  },
  {
    name: 'Azure',
    patterns: ['azure'],
    evidence: 'TrulyOkay was hosted on Azure, and the HoneyABA portal signs in through Microsoft Entra ID.',
    clipAt: 207.22,
  },
  {
    name: 'Git / GitHub',
    patterns: ['\\bgit\\b', 'github', 'version control'],
    evidence: 'My projects live on GitHub under TylerJayP.',
  },
  {
    name: 'Assembly / compilers',
    patterns: ['assembly', 'compiler', 'low-level', 'low level', 'systems programming'],
    evidence: 'I built a 32-bit emulator and assembler, and I TA the compiler class.',
    clipAt: 51.69,
  },
  {
    name: 'Teaching / mentoring',
    patterns: ['mentor', 'teach', 'coach', 'communicat', 'explain'],
    evidence: 'I TA five computer science courses at UVU.',
    clipAt: 27.43,
  },
  {
    name: 'Leadership',
    patterns: ['lead', 'manage', 'supervis', 'ownership'],
    evidence: 'Over two years as an assistant store manager at K1 Speed.',
  },
];

/** Skills a posting might ask for that this site has no evidence of yet. */
export const skillGaps: SkillGap[] = [
  {
    name: 'AWS',
    patterns: ['\\baws\\b', 'amazon web services'],
  },
  {
    name: 'Kubernetes',
    patterns: ['kubernetes', '\\bk8s\\b'],
  },
  {
    name: 'Go',
    patterns: ['golang', '\\bgo,', '\\bgo/', '/go\\b'],
  },
  {
    name: 'Rust',
    patterns: ['\\brust\\b'],
  },
  {
    name: 'Angular',
    patterns: ['angular'],
  },
  {
    name: 'Vue',
    patterns: ['\\bvue'],
  },
  {
    name: 'PHP',
    patterns: ['\\bphp\\b'],
  },
  {
    name: 'Ruby',
    patterns: ['\\bruby\\b', 'rails'],
  },
  {
    name: 'Swift',
    patterns: ['\\bswift\\b'],
  },
  {
    name: 'Kotlin',
    patterns: ['kotlin'],
  },
  {
    name: 'GraphQL',
    patterns: ['graphql'],
  },
  {
    name: 'Terraform',
    patterns: ['terraform'],
  },
  {
    name: 'GCP',
    patterns: ['\\bgcp\\b', 'google cloud'],
  },
];

/** Example postings visitors can try. The first one is shown on load. */
export const samplePostings: SamplePosting[] = [
  {
    label: 'Junior .NET developer',
    text: "We're hiring a Junior Software Developer to build and maintain internal web applications. You'll write C# and ASP.NET Core APIs, work with SQL Server and Entity Framework, and build front ends in React. Experience with Git, REST APIs and Azure is a plus. Strong communication skills and a willingness to mentor interns are valued.",
  },
  {
    label: 'Full-stack web',
    text: "Full-stack engineer to build customer-facing features end to end. Our stack is TypeScript, React and Node on the front, with a Postgres database, Docker, and AWS. You'll design REST and GraphQL APIs, handle authentication, and work closely with design.",
  },
  {
    label: 'Embedded software',
    text: 'Embedded Software Engineer to develop firmware for automotive controllers. C and C++ on STM32 microcontrollers, CAN bus, Bluetooth LE, and Python test tooling. Experience with hardware bring-up and debugging low-level systems is required.',
  },
];
