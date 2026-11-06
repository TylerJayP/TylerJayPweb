/** Contact details and links used across the page. */
export const site = {
  name: 'Tyler Jay Perkins',
  role: 'Software developer',
  location: 'Salt Lake City, Utah',
  email: 'tylerjayp12@gmail.com',
  github: { url: 'https://github.com/TylerJayP', label: 'github.com/TylerJayP' },
  linkedin: { url: 'https://www.linkedin.com/in/tylerjayperkins/', label: 'in/tylerjayperkins' },
  website: { url: 'https://www.tylerjayp.com', label: 'tylerjayp.com' },
  resumePdf: '/Tyler-Jay-Perkins-Resume.pdf',
  resumeUpdated: 'November 2026',
  introVideo: '/media/intro.mp4',
} as const;

/** The TJP monogram as three outline shapes (T, J, P), in a 270 234 1037 635 viewBox. */
export const MARK_VIEWBOX = '270 234 1037 635';
export const MARK_PATHS = [
  'M270 234H862L793 335H607V644H485V335H270Z',
  'M652 370H860V700C860 803 784 869 672 869C560 869 485 803 485 700V683H605V700C605 737 633 767 669 767C705 767 733 737 733 700V447H652Z',
  'M885 234H1130C1228 234 1307 302 1307 386C1307 470 1228 537 1130 537H1015V678H885ZM1015 318V456H1100C1135 456 1163 425 1163 387C1163 349 1135 318 1100 318Z',
] as const;
