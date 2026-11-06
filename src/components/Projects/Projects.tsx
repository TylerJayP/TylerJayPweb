import { useState } from 'react';
import { projects } from '../../content/projects';
import { wrapIndex } from '../../lib/format';
import { initialPlacement, placeAll, placePart } from '../../lib/markBoard';
import { revealDelay, useReveal } from '../../hooks/reveal';
import { RevealWords } from '../common/RevealWords';
import { Lightbox } from './Lightbox';
import { MarkBoard } from './MarkBoard';
import { PartsList } from './PartsList';
import { ProjectDetail } from './ProjectDetail';
import styles from './Projects.module.css';

/** Selected Projects: open a project to snap its part of my mark into place. */
export function Projects() {
  const [current, setCurrent] = useState(0);
  const [placed, setPlaced] = useState(initialPlacement);
  const [shot, setShot] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const heading = useReveal('hwork');
  const board = useReveal('board');
  const parts = useReveal('parts');
  const detail = useReveal('proj');

  const project = projects[current]!;
  const shotCount = project.screenshots.length;

  const open = (index: number) => {
    setPlaced((before) => placePart(before, index));
    if (index !== current) setShot(0);
    setCurrent(index);
  };

  const reset = () => {
    setCurrent(0);
    setShot(0);
    setPlaced(initialPlacement());
  };

  const selectShot = (index: number) => setShot(wrapIndex(index, shotCount));

  return (
    <section id="work" className={`page-section ${styles.section}`}>
      <div ref={heading.ref} className={`rv ${heading.className} ${styles.heading}`}>
        <h2 className={`display ${styles.title}`}>
          <RevealWords text="Selected Projects" />
        </h2>
        <p className={`rvi ${styles.lead}`} style={revealDelay(3)}>
          My mark comes in six parts, one for each project. Open a project and its part snaps into place. Open
          all six to put the mark together.
        </p>
      </div>

      <div className={styles.bench}>
        <MarkBoard
          projects={projects}
          placed={placed}
          current={current}
          onPick={open}
          onPlaceAll={() => setPlaced(placeAll())}
          onReset={reset}
          revealRef={board.ref}
          revealClass={board.className}
        />
        <PartsList
          projects={projects}
          placed={placed}
          current={current}
          onPick={open}
          revealRef={parts.ref}
          revealClass={parts.className}
        />
      </div>

      <div ref={detail.ref} className={`rv rline ${detail.className} ${styles.details}`}>
        <ProjectDetail
          key={current}
          project={project}
          number={current + 1}
          shot={shot}
          onSelectShot={selectShot}
          onOpenShots={() => setLightboxOpen(true)}
        />
      </div>

      <Lightbox
        open={lightboxOpen && shotCount > 0}
        projectName={project.name}
        screenshots={project.screenshots}
        current={shot}
        onStep={(delta) => selectShot(shot + delta)}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}
