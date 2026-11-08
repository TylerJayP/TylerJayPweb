import { useReducer, useState } from 'react';
import { projects } from '../../content/projects';
import { useReveal, revealDelay } from '../../hooks/useReveal';
import { classNames } from '../../lib/classNames';
import { boardReducer, initialBoard } from '../../lib/markBoard';
import { RevealWords } from '../common/RevealWords';
import { Lightbox } from './Lightbox';
import { MarkBoard } from './MarkBoard';
import { PartsList } from './PartsList';
import { ProjectDetail } from './ProjectDetail';
import styles from './Projects.module.css';

/** Selected Projects: open a project to snap its part of my mark into place. */
export function Projects() {
  const [board, dispatch] = useReducer(boardReducer, undefined, initialBoard);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const heading = useReveal('work-heading');
  const detail = useReveal('project-detail');

  const project = projects[board.current];
  if (!project) {
    return null;
  }
  const shotCount = project.screenshots.length;
  const open = (index: number) => dispatch({ type: 'open', project: index });
  const showShot = (shot: number) => dispatch({ type: 'showShot', shot, shotCount });

  return (
    <section id="work" className={classNames('page-section', styles.section)}>
      <div ref={heading.ref} className={classNames(heading.className, styles.heading)}>
        <h2 className={classNames('display', styles.title)}>
          <RevealWords text="Selected Projects" />
        </h2>
        <p className={classNames('rvi', styles.lead)} style={revealDelay(3)}>
          My mark comes in six parts, one for each project. Open a project and its part snaps into place. Open
          all six to put the mark together.
        </p>
      </div>

      <div className={styles.bench}>
        <MarkBoard
          projects={projects}
          placed={board.placed}
          current={board.current}
          onPick={open}
          onPlaceAll={() => dispatch({ type: 'placeAll' })}
          onReset={() => dispatch({ type: 'reset' })}
        />
        <PartsList projects={projects} placed={board.placed} current={board.current} onPick={open} />
      </div>

      <div ref={detail.ref} className={classNames(detail.className, 'rline', styles.details)}>
        <ProjectDetail
          key={board.current}
          project={project}
          number={board.current + 1}
          shot={board.shot}
          onSelectShot={showShot}
          onOpenShots={() => setLightboxOpen(true)}
        />
      </div>

      <Lightbox
        open={lightboxOpen && shotCount > 0}
        projectName={project.name}
        screenshots={project.screenshots}
        current={board.shot}
        onStep={(delta) => showShot(board.shot + delta)}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}
