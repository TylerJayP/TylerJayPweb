import { useRef } from 'react';
import { resume } from '../../content/resume';
import { site } from '../../content/site';
import { useExitAnimation, useModal } from '../../hooks/useDialog';
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

  if (!mounted) return null;

  return (
    <div
      ref={container}
      className={`${styles.wrap} ${closing ? styles.closing : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
    >
      <div className={styles.backdrop} onClick={onClose} />
      <article className={styles.paper}>
        <div className={styles.bar}>
          <div className={styles.barTitle}>
            <span className={styles.label}>Resume</span>
            <span className={styles.updated}>Updated {site.resumeUpdated}</span>
          </div>
          <div className={styles.barActions}>
            <a
              className={`${styles.button} ${styles.download}`}
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
              className={`${styles.button} ${styles.close}`}
              onClick={onClose}
              aria-label="Close resume"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <header className={styles.intro}>
            <h2 id="resume-title" className={`display ${styles.name}`}>
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

          <div className={styles.grid}>
            <div>
              <section className={styles.section} aria-labelledby="resume-experience">
                <h3 id="resume-experience" className={styles.heading}>
                  Experience
                </h3>
                {resume.experience.map((job) => (
                  <div key={job.role} className={styles.item}>
                    <div className={styles.itemTop}>
                      <h4 className={styles.itemTitle}>{job.role}</h4>
                      <span className={`${styles.date} ${job.current ? styles.now : ''}`}>{job.date}</span>
                    </div>
                    <p className={styles.org}>{job.org}</p>
                    <Chips items={job.chips} />
                    <Bullets items={job.bullets} />
                  </div>
                ))}
              </section>

              <section className={styles.section} aria-labelledby="resume-projects">
                <h3 id="resume-projects" className={styles.heading}>
                  Projects
                </h3>
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
              </section>
            </div>

            <aside className={styles.side}>
              <section className={styles.section} aria-labelledby="resume-skills">
                <h3 id="resume-skills" className={styles.heading}>
                  Skills
                </h3>
                {resume.skills.map((group) => (
                  <div key={group.label} className={styles.item}>
                    <p className={styles.skillLabel}>{group.label}</p>
                    <Chips items={group.chips} />
                  </div>
                ))}
              </section>

              <section className={styles.section} aria-labelledby="resume-education">
                <h3 id="resume-education" className={styles.heading}>
                  Education
                </h3>
                {resume.education.map((entry) => (
                  <div key={entry.degree} className={styles.item}>
                    <h4 className={styles.itemTitle}>{entry.degree}</h4>
                    <p className={styles.org}>{entry.school}</p>
                    <p className={`${styles.date} ${styles.schoolDate} ${entry.current ? styles.now : ''}`}>
                      {entry.date}
                    </p>
                  </div>
                ))}
              </section>
            </aside>
          </div>
        </div>
      </article>
    </div>
  );
}

function Chips({ items }: { items: readonly string[] }) {
  if (!items.length) return null;
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
