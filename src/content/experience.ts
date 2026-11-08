/** The Experience and Education lists on the page (the resume dialog has the longer versions). */

export interface Job {
  role: string;
  where: string;
  date: string;
  current?: boolean;
  summary: string;
}

export const jobs: Job[] = [
  {
    role: 'Teaching Assistant',
    where: 'Utah Valley University · Orem, Utah',
    date: 'Aug 2026 – now',
    current: true,
    summary:
      'I grade, tutor and teach for CS 1380 Modern Programming Essentials, CS 3250 Java Software Development, CS 3370 C++ Software Development, CS 3520 Database Theory and CS 4450 Analysis of Programming Languages.',
  },
  {
    role: 'Assistant Store Manager',
    where: 'K1 Speed · Salt Lake City, Utah',
    date: '2+ years',
    summary: 'More than two years in management at an indoor karting center.',
  },
  {
    role: 'Freelance Developer',
    where: 'HoneyABA Portal',
    date: '2026',
    summary:
      "Built a role-based portal for an ABA therapy practice. RBTs submit requests, work through assigned task checklists and file reimbursements, while admins build forms and task templates, review submissions and manage the team. Sign-in is Microsoft-only through MSAL, limited to the practice's work accounts.",
  },
  {
    role: 'Software Engineering Intern',
    where: 'Treehouse Strategy & Communication · Remote',
    date: 'Jul – Oct 2021',
    summary: 'Worked across a React front end and an ASP.NET Web API back end built on Entity Framework.',
  },
];

export interface School {
  degree: string;
  school: string;
  date: string;
  current?: boolean;
}

export const schools: School[] = [
  {
    degree: 'M.S. Computer Science',
    school: 'Utah Valley University',
    date: 'Expected 2028',
    current: true,
  },
  { degree: 'B.S. Computer Science', school: 'Utah Valley University', date: 'April 2026' },
];
