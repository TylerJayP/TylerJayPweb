import type { MouseEvent } from 'react';
import { jobs, schools, type Job, type School } from '../../content/experience';
import { revealDelay, useReveal } from '../../hooks/useReveal';
import { classNames } from '../../lib/classNames';
import { RevealWords } from '../common/RevealWords';
import { ArrowRightIcon, DocumentIcon } from '../icons';
import styles from './Experience.module.css';

interface ExperienceProps {
  onOpenResume: (event: MouseEvent) => void;
}

export function Experience({ onOpenResume }: ExperienceProps) {
  const side = useReveal('experience-heading');
  const educationTitle = useReveal('education-heading');

  return (
    <section id="experience" className={classNames('page-section', styles.section)}>
      <div className={styles.group}>
        <div ref={side.ref} className={classNames(side.className, styles.side)}>
          <h2 className={classNames('display', styles.title)}>
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
          {jobs.map((job, i) => (
            <JobRow key={job.role} job={job} index={i} />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h2
          ref={educationTitle.ref}
          className={classNames(educationTitle.className, 'display', styles.title, styles.side)}
        >
          <RevealWords text="Education" from={1} />
        </h2>
        <div className={styles.list}>
          {schools.map((school, i) => (
            <SchoolRow key={school.degree} school={school} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function JobRow({ job, index }: { job: Job; index: number }) {
  const reveal = useReveal(`job-${index}`);
  return (
    <article ref={reveal.ref} className={classNames(reveal.className, 'rline', styles.job)}>
      <div className={classNames('rvi', styles.top)} style={revealDelay(2)}>
        <h3 className={styles.role}>{job.role}</h3>
        <span className={classNames(styles.date, job.current && styles.current)}>{job.date}</span>
      </div>
      <p className={classNames('rvi', styles.where)} style={revealDelay(3)}>
        {job.where}
      </p>
      <p className={classNames('rvi', styles.summary)} style={revealDelay(4)}>
        {job.summary}
      </p>
    </article>
  );
}

function SchoolRow({ school, index }: { school: School; index: number }) {
  const reveal = useReveal(`school-${index}`);
  return (
    <div ref={reveal.ref} className={classNames(reveal.className, 'rline', styles.school)}>
      <div className="rvi" style={{ ...revealDelay(2), minWidth: 0 }}>
        <h3 className={styles.role}>{school.degree}</h3>
        <p className={styles.where}>{school.school}</p>
      </div>
      <span
        className={classNames('rvi', styles.date, school.current && styles.current)}
        style={revealDelay(3)}
      >
        {school.date}
      </span>
    </div>
  );
}
