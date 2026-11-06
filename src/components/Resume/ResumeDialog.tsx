import { type ReactNode, type RefObject, useRef } from 'react';
import { resume } from '../../content/resume';
import { site } from '../../content/site';
import { useExitAnimation, useModal } from '../../hooks/useDialog';
import { classNames } from '../../lib/classNames';
import { CloseIcon, CodeIcon, DownloadIcon, LinkedInIcon, MailIcon } from '../icons';
import styles from './ResumeDialog.module.css';

interface ResumeDialogProps {
  open: boolean;
  onClose: () => void;
}

const EXIT_MS = 200;

/** My resume as a readable sheet over the page, with the PDF one click away. */
export function ResumeDialog({ open, onClose }: ResumeDialogProps) {
  const { mounted, closing } = useExitAnimation(open, EXIT_MS);
  const container = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useModal(open, { containerRef: container, initialFocusRef: closeButton, onClose });

  if (!mounted) {
    return null;
  }

  return (
    <div
      ref={container}
      className={classNames(styles.wrap, closing && styles.closing)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
    >
      <div className={styles.backdrop} onClick={onClose} />
      <article className={styles.paper}>
        <ResumeBar closeButton={closeButton} onClose={onClose} />
        <div className={styles.body}>
          <ResumeHeader />
          <div className={styles.grid}>
            <div>
              <ExperienceSection />
              <ProjectsSection />
            </div>
            <aside className={styles.side}>
              <SkillsSection />
              <EducationSection />
            </aside>
          </div>
        </div>
      </article>
    </div>
  );
}

interface ResumeBarProps {
  closeButton: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

/** The bar along the top: when it was updated, the PDF download and the close button. */
function ResumeBar({ closeButton, onClose }: ResumeBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.barTitle}>
        <span className={styles.label}>Resume</span>
        <span className={styles.updated}>Updated {site.resumeUpdated}</span>
      </div>
      <div className={styles.barActions}>
        <a
          className={classNames(styles.button, styles.download)}
          href={site.resumePdf}
          download="Tyler-Jay-Perkins-Resume.pdf"
          target="_blank"
          rel="noopener"
        >
          <DownloadIcon />
          <span className={styles.long}>Download PDF</span>
          <span className={styles.short}>PDF</span>
        </a>
        <button
          ref={closeButton}
          type="button"
          className={classNames(styles.button, styles.close)}
          onClick={onClose}
          aria-label="Close resume"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

function ResumeHeader() {
  return (
    <header className={styles.intro}>
      <h2 id="resume-title" className={classNames('display', styles.name)}>
        {site.name}
      </h2>
      <p className={styles.role}>
        {site.role} · {site.location}
      </p>
      <p className={styles.summary}>{resume.summary}</p>
      <div className={styles.links}>
        <a className={styles.link} href={`mailto:${site.email}`}>
          <MailIcon /> {site.email}
        </a>
        <a className={styles.link} href={site.linkedin.url} target="_blank" rel="noopener noreferrer">
          <LinkedInIcon /> LinkedIn
        </a>
        <a className={styles.link} href={site.github.url} target="_blank" rel="noopener noreferrer">
          <CodeIcon size={16} /> GitHub
        </a>
      </div>
    </header>
  );
}

/** A titled part of the resume, labelled by its heading for screen readers. */
function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <h3 id={id} className={styles.heading}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function ExperienceSection() {
  return (
    <Section id="resume-experience" title="Experience">
      {resume.experience.map((job) => (
        <div key={job.role} className={styles.item}>
          <div className={styles.itemTop}>
            <h4 className={styles.itemTitle}>{job.role}</h4>
            <span className={classNames(styles.date, job.current && styles.now)}>{job.date}</span>
          </div>
          <p className={styles.org}>{job.org}</p>
          <Chips items={job.chips} />
          <Bullets items={job.bullets} />
        </div>
      ))}
    </Section>
  );
}

function ProjectsSection() {
  return (
    <Section id="resume-projects" title="Projects">
      {resume.projects.map((project) => (
        <div key={project.name} className={styles.item}>
          <div className={styles.itemTop}>
            <h4 className={styles.itemTitle}>{project.name}</h4>
            <span className={styles.date}>{project.kind}</span>
          </div>
          <Chips items={project.chips} />
          <Bullets items={project.bullets} />
          <p className={styles.note}>{project.note}</p>
        </div>
      ))}
    </Section>
  );
}

function SkillsSection() {
  return (
    <Section id="resume-skills" title="Skills">
      {resume.skills.map((group) => (
        <div key={group.label} className={styles.item}>
          <p className={styles.skillLabel}>{group.label}</p>
          <Chips items={group.chips} />
        </div>
      ))}
    </Section>
  );
}

function EducationSection() {
  return (
    <Section id="resume-education" title="Education">
      {resume.education.map((entry) => (
        <div key={entry.degree} className={styles.item}>
          <h4 className={styles.itemTitle}>{entry.degree}</h4>
          <p className={styles.org}>{entry.school}</p>
          <p className={classNames(styles.date, styles.schoolDate, entry.current && styles.now)}>
            {entry.date}
          </p>
        </div>
      ))}
    </Section>
  );
}

function Chips({ items }: { items: readonly string[] }) {
  if (!items.length) {
    return null;
  }
  return (
    <div className={styles.chips}>
      {items.map((item) => (
        <span key={item} className={styles.chip}>
          {item}
        </span>
      ))}
    </div>
  );
}

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className={styles.bullets}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
