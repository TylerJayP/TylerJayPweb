/** Shapes of the site's content. Everything under src/content is plain data typed by these. */

export interface Screenshot {
  /** Full-size image, opened in the lightbox. */
  src: string;
  /** Small version for the thumbnail strip. */
  thumb: string;
  width: number;
  height: number;
  /** Fill behind the image, matching the app's own background. */
  background: string;
  /** CSS object-position for the in-page preview. */
  position: string;
  title: string;
  caption: string;
}

export interface Project {
  /** Which part of the TJP mark this project is ("T bar", "J hook", ...). */
  piece: string;
  /** SVG path of that part, in the mark's coordinate space. */
  path: string;
  /** viewBox that frames the part on its own, for the parts-list icon. */
  iconViewBox: string;
  /** Where the leader line leaves the part, and where its numbered ball sits. */
  anchor: readonly [number, number];
  ball: readonly [number, number];
  /** Offset and rotation of the part while it is loose (not yet placed). */
  loose: { x: number; y: number; rotate: number };
  name: string;
  kind: string;
  status: string;
  /** Shipped or otherwise usable; shown in the accent color. */
  live: boolean;
  description: string;
  why: string;
  stack: string[];
  screenshots: Screenshot[];
}

export interface ResumeExperience {
  role: string;
  org: string;
  date: string;
  current: boolean;
  chips: string[];
  bullets: string[];
}

export interface ResumeProject {
  name: string;
  kind: string;
  chips: string[];
  bullets: string[];
  note: string;
}

export interface SkillGroup {
  label: string;
  chips: string[];
}

export interface Education {
  degree: string;
  school: string;
  date: string;
  current: boolean;
}

export interface Resume {
  summary: string;
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: SkillGroup[];
  education: Education[];
}

export interface Skill {
  name: string;
  /** Case-insensitive regular expressions that count as a mention. */
  patterns: string[];
  /** The project or job that shows it. */
  evidence: string;
  /** Second in the intro video where I talk about it, if I do. */
  clipAt?: number;
}

export interface SkillGap {
  name: string;
  patterns: string[];
}

export interface SamplePosting {
  label: string;
  text: string;
}

export interface Cue {
  start: number;
  end: number;
  text: string;
}
