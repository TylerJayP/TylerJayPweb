# tylerjayp.com

My portfolio site: an intro that "builds" itself and hands over to a video of me, a job-posting matcher,
my projects as the six parts of my TJP mark, my experience, and a 3D business card you can take apart.

Built with **React 19, TypeScript and Vite**, styled with **CSS Modules** on a shared set of design tokens,
tested with **Vitest and Testing Library**, and deployed on **AWS Amplify**.

## Running it

```bash
nvm use            # Node 22 (see .nvmrc)
npm ci
npm run dev        # http://localhost:5173
```

| Script               | What it does                           |
| -------------------- | -------------------------------------- |
| `npm run dev`        | Dev server with hot reload             |
| `npm run build`      | Type-check, then build to `dist/`      |
| `npm run preview`    | Serve the production build locally     |
| `npm test`           | Run the unit and component tests once  |
| `npm run test:watch` | Tests in watch mode                    |
| `npm run lint`       | ESLint (TypeScript, React hooks rules) |
| `npm run format`     | Prettier                               |
| `npm run typecheck`  | TypeScript only, no build              |

CI (`.github/workflows/ci.yml`) runs lint, the format check, the tests and the build on every push and pull
request.

## How it's organized

```
src/
  content/      Everything the page says, as typed data (projects, resume, skills, captions, contact info)
  lib/          Pure logic with unit tests: job matching, the build-terminal timeline, captions,
                scroll-reveal rules, the projects board reducer, the contact email and vCard
  providers/    The theme and scroll-reveal providers, and the contexts they share with their hooks
  hooks/        useTheme, useReveal, the intro sequence, dialogs, the animation loop, reduced motion
  components/   One folder per section, each with its own CSS Module
  styles/       Design tokens (both themes), base styles, and the intro and reveal animations
public/         Screenshots, the intro video, the resume PDF, icons and the link-preview image
```

A few decisions worth knowing about:

- **Content is data.** Components only lay things out. To add a project, add an entry to
  `src/content/projects.ts`; to change what the job matcher recognizes, edit `src/content/skills.ts`.
- **Logic is pure where it can be.** The build terminal is a function of elapsed time (`lib/buildTerminal.ts`),
  so the component just renders whatever frame it returns, and the tests can check any moment of it. The same
  goes for when a block reveals (`lib/reveal.ts`), the projects board (`lib/markBoard.ts`, a reducer) and the
  business card's spring physics (`components/Contact/cardPhysics.ts`).
- **One source for color.** Both themes live in `styles/tokens.css` as CSS variables. Components never hard-code
  a theme color, so switching themes is a single attribute on `<html>`.
- **Animation without a library.** Scroll reveals (`providers/RevealProvider.tsx` + `styles/reveal.css`) are
  a small provider that watches scroll position and toggles classes; the CSS does the motion. The business
  card is split three ways: `cardPhysics.ts` (damped springs, no DOM), `cardElements.ts` (writes the state to
  the DOM each frame) and `useCardRig.ts` (what each button does). React only re-renders when the mode changes.
- **Open to extension.** The card's layers, the job matcher's skills and the projects are lists: adding one
  is a new entry, not a change to the code that renders them.
- **No backend.** The job matcher runs in the browser, and the contact form opens the visitor's email app
  with the message filled in.

## Code style

The tools hold the style, so it stays the same everywhere without anyone checking by eye:

- **Prettier** formats every file, and CI fails if anything isn't formatted. No hand alignment.
- **ESLint** on top of the TypeScript and React hooks rules:
  - every `if` and `else` has braces (`curly`), with no comma tricks (`no-sequences`), chained assignments
    (`no-multi-assign`) or nested ternaries (`no-nested-ternary`)
  - no `!` non-null assertions: missing values are handled, not asserted away
  - no reassigned parameters, strict equality only, at most 4 parameters, cyclomatic complexity of 10 or
    less and nesting 3 deep or less
- **TypeScript strict**, with `noUncheckedIndexedAccess`, so array and record lookups have to deal with
  `undefined`.
- Conditional classes go through `classNames()` (`lib/classNames.ts`), and magic numbers get a named constant
  with a comment saying what they are.

## Accessibility

- Every control is a real button or link with a label; dialogs trap focus, close on Escape and return focus
  to whatever opened them.
- `prefers-reduced-motion` turns off the reveals, the intro animation and the card physics, and the video
  doesn't autoplay.
- The intro video has captions (on by default), and the page works with the keyboard alone.

## Deploying

The site is hosted on AWS Amplify, connected to this repository's `main` branch, with DNS on Route 53.
`amplify.yml` tells Amplify to use Node 22, run `npm ci` and `npm run build`, and publish `dist/`. Every push
to `main` deploys.
