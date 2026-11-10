import { screen, within } from '@testing-library/react';
import type { Project } from '../../content/types';
import { renderWithProviders } from '../../test/render';
import { ProjectDetail } from './ProjectDetail';

const sample: Project = {
  piece: 'T bar',
  path: 'M0 0H10V10Z',
  iconViewBox: '0 0 10 10',
  anchor: [0, 0],
  ball: [10, 10],
  loose: {
    x: 0,
    y: 0,
    rotate: 0,
  },
  name: 'Sample',
  kind: 'Tool',
  status: 'On GitHub',
  live: true,
  description: 'A project used by these tests.',
  why: 'To check what the detail shows.',
  stack: ['C#'],
  screenshots: [],
};

function renderProject(project: Project) {
  const noop = () => {};
  renderWithProviders(
    <ProjectDetail project={project} number={1} shot={0} onSelectShot={noop} onOpenShots={noop} />,
  );
}

describe('<ProjectDetail>', () => {
  it("opens a public project's links in a new tab", () => {
    renderProject({
      ...sample,
      links: [
        {
          label: 'Code on GitHub',
          url: 'https://github.com/TylerJayP/Sample',
        },
      ],
    });
    const links = within(screen.getByRole('list', { name: 'Links' })).getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName('Code on GitHub');
    expect(links[0]).toHaveAttribute('href', 'https://github.com/TylerJayP/Sample');
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows no links for a project without any', () => {
    renderProject(sample);
    expect(screen.queryByRole('list', { name: 'Links' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sample' })).toBeInTheDocument();
  });
});
