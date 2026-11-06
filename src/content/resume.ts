// Content for the site. Edit here to change what the page says; components only lay it out.
import type { Resume } from './types';

/** What the resume dialog shows. The downloadable PDF lives in public/. */
export const resume: Resume = {
  summary:
    "I build full-stack web apps in C# and React, and systems code in C and C++. Right now I'm working on an M.S. in Computer Science at Utah Valley University, where I'm also a teaching assistant for five computer science courses.",
  experience: [
    {
      role: 'Teaching Assistant, Computer Science',
      org: 'Utah Valley University · Orem, Utah',
      date: 'Aug 2026 – Present',
      current: true,
      chips: [
        'C Programming',
        'C++ Software Development',
        'Java Software Development',
        'Database Theory',
        'Analysis of Programming Languages',
      ],
      bullets: [
        'Grade, tutor and teach students across five undergraduate CS courses, one-on-one in person and over Teams.',
        "Compile, run and test every submission against the spec, and hand back the student's own code corrected to show what failed.",
        'Work with several professors and TAs to keep grading consistent across sections and flag commonly missed requirements.',
      ],
    },
    {
      role: 'Assistant Store Manager',
      org: 'K1 Speed · Salt Lake City, Utah',
      date: '2+ years',
      current: false,
      chips: [],
      bullets: ['More than two years in management at an indoor karting center.'],
    },
    {
      role: 'Freelance Full-Stack Developer',
      org: 'Honey Beehavior Analysis (client) · Remote',
      date: 'Jan 2026 – Present',
      current: true,
      chips: [
        'React',
        'Vite',
        'Tailwind CSS',
        'NestJS',
        'TypeScript',
        'PostgreSQL (Neon)',
        'Microsoft Entra ID (MSAL)',
        'Jest',
        'Vitest',
      ],
      bullets: [
        'Built a role-based portal for an ABA therapy practice: RBTs submit requests, daily checklists and receipt-backed reimbursements from their phones, and admins review them in one queue.',
        "Designed a layered NestJS API on PostgreSQL where every status change is one guarded SQL update with its audit row, so two admins can't overwrite each other's decisions.",
        'Every signed-in screen updates live over Server-Sent Events, with optimistic updates and an offline queue that replays checklist work once the phone reconnects.',
        'Microsoft-only sign-in through Entra ID with role-based access for owners, admins and RBTs, backed by 87 automated tests including concurrency and permission tests.',
      ],
    },
    {
      role: 'Software Engineering Intern, Full Stack',
      org: 'Treehouse Strategy & Communication · Remote',
      date: 'Jul – Oct 2021',
      current: false,
      chips: ['React', 'ASP.NET Web API', '.NET Framework 4.7.1', 'Entity Framework', 'Git'],
      bullets: [
        'Built a login system with React, an ASP.NET Web API and Entity Framework.',
        'Worked across development teams in Git and took part in code reviews with senior developers.',
        'Took part in Agile sprints, from daily scrums to sprint planning.',
      ],
    },
  ],
  projects: [
    {
      name: '32-bit Microprocessor Emulator & Assembler',
      kind: 'Systems',
      chips: ['C++', 'Python', 'GoogleTest', 'CMake'],
      bullets: [
        'Emulates a custom 32-bit architecture: 22 registers, byte-addressable little-endian memory and a fetch-decode-execute cycle covering 40 operations.',
        'A two-pass assembler in Python turns 4380 assembly into machine code, resolving labels and encoding all 40 instructions.',
        'Catches invalid instructions, out-of-bounds memory and division by zero, with a GoogleTest suite over instructions, registers and memory.',
      ],
      note: 'Private repository (UVU policy), available on request',
    },
    {
      name: 'Parallel Matrix Multiplication on Bridges-2',
      kind: 'High-performance',
      chips: ['C', 'MPI', 'SLURM', 'Linux'],
      bullets: [
        'Row-wise and column-wise MPI decompositions of dense and sparse matrix multiplication, run as SLURM jobs on the Bridges-2 supercomputer.',
        'Handled uneven splits with MPI_Scatterv and MPI_Gatherv, and measured per-rank load imbalance on sparse inputs.',
        'Both parallel versions match the sequential baseline bit for bit across 222 checks; traced a 5.9–7.1× column-wise speedup to cache behavior.',
      ],
      note: 'Available on request',
    },
    {
      name: 'TrulyOkay, a personal mood journal',
      kind: 'Senior capstone',
      chips: [
        'React + Vite',
        'ASP.NET Core',
        'Entity Framework',
        'MySQL',
        'Azure',
        'Google OAuth',
        'Anthropic API',
      ],
      bullets: [
        'A private, per-user mood journal with Anthropic API prompts tailored to the mood and intensity you pick.',
        'JWT sign-in over HttpOnly cookies with hashed, database-stored tokens, plus Google OAuth 2.0.',
        'Deployed the ASP.NET Core API and its MySQL database on Microsoft Azure.',
      ],
      note: 'Private repository (UVU policy), available on request',
    },
  ],
  skills: [
    {
      label: 'Proficient',
      chips: ['C/C++', 'C#', 'Python', 'Java', 'JavaScript', 'MySQL'],
    },
    {
      label: 'Embedded & parallel',
      chips: ['STM32', 'MPI', 'SLURM'],
    },
    {
      label: 'Tools & frameworks',
      chips: [
        'Git',
        'CMake',
        'GoogleTest',
        'React',
        'ASP.NET',
        'Entity Framework',
        'MSAL',
        'NestJS',
        'PostgreSQL',
        'AWS Amplify',
        'Azure',
        'Anthropic API',
      ],
    },
  ],
  education: [
    {
      degree: 'Master of Computer Science',
      school: 'Utah Valley University',
      date: 'Expected Fall 2028',
      current: true,
    },
    {
      degree: 'B.S. Computer Science',
      school: 'Utah Valley University · Orem, Utah',
      date: 'April 2026',
      current: false,
    },
  ],
};
