import type { MouseEvent } from 'react';
import { revealDelay, useReveal } from '../../hooks/reveal';
import { RevealWords } from '../common/RevealWords';
import { ArrowRightIcon, DocumentIcon } from '../icons';
import { jobs, schools, type Job, type School } from '../../content/experience';
import styles from './Experience.module.css';

interface ExperienceProps {
  onOpenResume: (event: MouseEvent) => void;
}

export function Experience({ onOpenResume }: ExperienceProps) {
  const side = useReveal('hexp');
  const educationTitle = useReveal('hedu');

  return (
    <section id="experience" className={`page-section ${styles.section}`}>
      <div className={styles.group}>
        <div ref={side.ref} className={`rv ${side.className} ${styles.side}`}>
          <h2 className={`display ${styles.title}`}>
            <RevealWords text="Experience" from={1} />
          </h2>
          <a
            href="#resume"
            onClick={onOpenResume}
            aria-haspopup="dialog"
            className="pill-link rvi"
            style={revealDelay(3)}
          >
            <DocumentIcon />
            See my resume
            <ArrowRightIcon />
          </a>
        </div>
        <div className={styles.list}>
          {jobs.map((job) => (
            <JobRow key={job.key} job={job} />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h2
          ref={educationTitle.ref}
          className={`rv display ${educationTitle.className} ${styles.title} ${styles.side}`}
        >
          <RevealWords text="Education" from={1} />
        </h2>
        <div className={styles.list}>
          {schools.map((school) => (
            <SchoolRow key={school.key} school={school} />
          ))}
        </div>
      </div>
    </section>
  );
}

function JobRow({ job }: { job: Job }) {
  const reveal = useReveal(job.key);
  return (
    <article ref={reveal.ref} className={`rv rline ${reveal.className} ${styles.job}`}>
      <div className={`rvi ${styles.top}`} style={revealDelay(2)}>
        <h3 className={styles.role}>{job.role}</h3>
        <span className={`${styles.date} ${job.current ? styles.current : ''}`}>{job.date}</span>
      </div>
      <p className={`rvi ${styles.where}`} style={revealDelay(3)}>
        {job.where}
      </p>
      <p className={`rvi ${styles.summary}`} style={revealDelay(4)}>
        {job.summary}
      </p>
    </article>
  );
}

function SchoolRow({ school }: { school: School }) {
  const reveal = useReveal(school.key);
  return (
    <div ref={reveal.ref} className={`rv rline ${reveal.className} ${styles.school}`}>
      <div className="rvi" style={{ ...revealDelay(2), minWidth: 0 }}>
        <h3 className={styles.role}>{school.degree}</h3>
        <p className={styles.where}>{school.school}</p>
      </div>
      <span className={`rvi ${styles.date} ${school.current ? styles.current : ''}`} style={revealDelay(3)}>
        {school.date}
      </span>
    </div>
  );
}
