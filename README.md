# Govnor Payne — Portfolio

A single-page React portfolio (bootstrapped with [Create React App](https://github.com/facebook/create-react-app)) built around two libraries that do the heavy lifting for its visuals: **[three.js](https://threejs.org/)** for 3D/WebGL scenes and **[motion](https://motion.dev/)** (the React bindings formerly shipped as `framer-motion`) for everything else that moves. This document explains where and why each is used, how the site was made to work mobile-first, and — since most of it was recent, test-driven work — how the test suite around these libraries is built and why each piece exists.

## Table of contents

- [Three.js in this project](#threejs-in-this-project)
- [Motion in this project](#motion-in-this-project)
- [Mobile-first approach](#mobile-first-approach)
- [Testing Three.js and Motion (and why it's set up this way)](#testing-threejs-and-motion-and-why-its-set-up-this-way)
- [Using Claude Code on this project](#using-claude-code-on-this-project)
- [Available scripts](#available-scripts)

## Three.js in this project

Three.js renders real 3D scenes into a `<canvas>` via WebGL (or, for one component, keeps a 3D transform in sync with plain DOM elements). It's used in three places, each solving a different problem:

### `ParticleCard` ([src/components/experiences/ParticleCard.js](src/components/experiences/ParticleCard.js))

Wraps each skill category (Frontend, Backend, Cloud, Database) in a rotating sphere made of ~900 points, arranged with a Fibonacci-lattice distribution so they read as an even, glowing cloud instead of clumped dots. Clicking it "explodes" the points outward and fades in the real skill list; clicking back reforms the sphere. This is a deliberate landing pattern for mobile: the sphere is a small, cheap-to-render teaser, and the expensive content (a scrollable list) only mounts once the user opts in, keeping the initial paint light on small devices.

### `JobCarousel` ([src/components/experiences/JobCarousel.js](src/components/experiences/JobCarousel.js))

Arranges job history cards in a 3D ring using three's `CSS3DRenderer` — a renderer that positions ordinary DOM elements (not WebGL pixels) in 3D space. That choice matters for accessibility and mobile: because each card is still a real `<button>` in the DOM, it stays keyboard-focusable, screen-reader-visible, and text-selectable, none of which a canvas-drawn card could offer. The ring supports drag-to-rotate (pointer events, not mouse-only), auto-rotates when idle, pauses on hover/focus, and every card dimension (`cardWidth`, `radius`) is derived from the container's actual `clientWidth` at layout time rather than a fixed desktop value — so it resizes itself on rotation instead of relying on a fixed set of breakpoints.

### `ServiceCard` ([src/components/services/ServiceCard.js](src/components/services/ServiceCard.js))

A wireframe icosahedron plus a particle halo sits behind each service card, dimming and shrinking when the card is opened so it doesn't compete with the content. It's the same "ambient 3D, cheap until interacted with" pattern as `ParticleCard`, reused for a different section.

**Why three.js at all, and why hand-rolled instead of `@react-three/fiber`:** these are small, self-contained scenes (a sphere, a ring, an icosahedron) with imperative animation loops that don't map cleanly to declarative JSX, and adding `@react-three/fiber` + `drei` would be a heavier dependency for three isolated effects. Each component manages its own `THREE.Scene`/renderer inside a `useEffect`, and — critically — tears it down completely in the cleanup function (`geometry.dispose()`, `material.dispose()`, `renderer.dispose()`, removing the DOM node, cancelling the animation frame). Skipping that cleanup is the most common way a three.js + React integration leaks memory on route changes or re-renders.

## Motion in this project

`motion/react` provides the `motion.*` components (a `motion.div`, `motion.button`, etc. that accept `initial`/`animate`/`exit`/`transition` props) and `AnimatePresence` (which keeps an exiting element mounted just long enough to finish its exit animation). It's used for:

- **`JobModal`** ([src/components/experiences/JobModal.js](src/components/experiences/JobModal.js)) — the backdrop fades and the panel scales/slides in with `AnimatePresence`, so opening/closing a job's details never feels like a hard cut. It also closes on `Escape`, which matters more on mobile where a backdrop tap is the only other way out.
- **`SkillScroll`** ([src/components/experiences/SkillScroll.js](src/components/experiences/SkillScroll.js)) — the skill detail panel expands with an animated `height: auto`, which `motion` supports (a plain CSS transition can't animate to `auto`).
- **`ParticleCard`** and **`ServiceCard`** — the swap between the "click to open" prompt and the real content uses `AnimatePresence mode="wait"`, so the old view finishes leaving before the new one enters (no overlap flash).
- **`Header`** ([src/components/header/Header.js](src/components/header/Header.js)) — the headline types itself in and clears itself out in a loop, staggering each letter's `opacity`/`blur` via `variants`.
- **`Contact`, `Portfolio`, `ProjectModal`** — entrance and modal transitions follow the same `initial`/`animate`/`exit` pattern for consistency across the site.

**Why `motion` over CSS transitions/keyframes:** several of these (`AnimatePresence`'s exit-before-unmount, staggered `variants`, animating to `height: auto`, spring physics on drag/hover in `ServiceCard`) aren't expressible in plain CSS without a lot of extra JS to fake them. Centralizing on one library also means the touch/drag/hover interactions behave consistently on mobile vs. desktop instead of every component reinventing its own transition logic.

## Mobile-first approach

"Mobile-first" here means two things working together:

1. **Runtime sizing, not just breakpoints.** The 3D components read the actual container size (`mount.clientWidth`/`clientHeight`) on every layout pass and resize the camera, renderer, and card dimensions from that — e.g. `JobCarousel`'s card width is `Math.max(200, Math.min(260, width * 0.4))`, so a card is never wider than a phone screen can comfortably show, and never so small it's illegible on a tablet. This means the experience holds up at arbitrary widths, not just the two breakpoints below.
2. **Breakpoints for layout, not content loss.** Every new/changed component ships with the same pair of `max-width` breakpoints:
   - `1024px` ("tablet") — grids collapse from multi-column to single-column (e.g. `.experience_container` in [experience.css](src/components/experiences/experience.css)), and the carousel's stage height shrinks.
   - `600px` ("phone") — spacing tightens further (gaps, control sizing) so touch targets stay reachable without the layout feeling cramped.

   Nothing is hidden or removed at either breakpoint — every skill, every job, every project is still reachable on a phone, just laid out in a single column with tighter spacing instead of a grid.

If you're changing or adding a component here, the expectation is: build the interaction so it works with a narrow, touch-only viewport first (no hover-only affordances, no fixed pixel widths wider than ~360px), then layer on the two breakpoints above for anything that should look different on a larger screen.

## Testing Three.js and Motion (and why it's set up this way)

The components above were built test-first: a failing test describing the behavior was written before the fix/feature, then the component was changed until it passed. That's the point of TDD here — it's not ceremony, it's what caught two real integration problems (below) before they could break the page for anyone.

If you're new to this repo and wondering "why does this test file need three separate mocks just to click a button?", this section is for you.

### The problem: three.js and jsdom don't get along

Tests run in [Jest](https://jestjs.io/) against [jsdom](https://github.com/jsdom/jsdom), a JavaScript re-implementation of the DOM used because there's no real browser/GPU available in a test run. Running the existing test suite against the current code surfaced three failures, in order, each one hiding the next:

1. **`three` itself wouldn't import.** Modern `three` ships as an ES module; its `require()`-facing entry point (`three.cjs`) internally does `import` from `three.module.js`, which Jest's default CommonJS-only transform can't parse. `three/examples/jsm/renderers/CSS3DRenderer.js` (used by `JobCarousel`) has the same problem — it's raw ESM.
2. **jsdom's `<canvas>` has no drawing context.** `getContext('2d')` and WebGL contexts return `null`/`undefined` in jsdom — there's no native canvas backend — so anything that calls `ctx.createRadialGradient(...)` (both `ParticleCard` and `ServiceCard` build a particle sprite this way) throws immediately.
3. **jsdom doesn't implement `IntersectionObserver`, `ResizeObserver`, or `window.matchMedia`.** `motion` reaches for all three the moment any `motion.*` component mounts (for `whileInView`, layout animations, and `prefers-reduced-motion`), so without stubs, mounting *any* animated component throws.

None of this means the components are broken — it means jsdom is missing browser features these libraries assume exist. The fix in each case is to give the test environment a stand-in for the missing piece, narrow enough that it doesn't hide a real bug.

### What was installed

```bash
npm install --save-dev jest-canvas-mock
```

`jest-canvas-mock` patches `HTMLCanvasElement.prototype.getContext('2d')` with a working (if visually inert) implementation — `createRadialGradient`, `fillRect`, `addColorStop`, etc. all become real, callable methods that record calls instead of throwing. It's imported once in [src/setupTests.js](src/setupTests.js), before any test runs.

### What was mocked, and why each mock is shaped the way it is

- **[src/\_\_mocks\_\_/three.js](src/__mocks__/three.js)** — a manual mock for the whole `three` package. Because Jest's `roots` (via Create React App) is `<rootDir>/src`, a mock file adjacent to `node_modules` doesn't work here — it has to live at `src/__mocks__/three.js` to be picked up automatically for every `import * as THREE from "three"` in the codebase, no `jest.mock()` call needed in individual test files. It re-implements just enough of the API surface (`Scene`, `Group`, cameras, `Clock`, `WebGLRenderer`, `BufferGeometry`, `Points`, `Mesh`, etc.) as plain classes with no-op rendering, so components can mount, run their animation-loop math, and clean up — without ever touching a GPU.
- **[src/\_\_mocks\_\_/three/examples/jsm/renderers/CSS3DRenderer.js](src/__mocks__/three/examples/jsm/renderers/CSS3DRenderer.js)** — a mock for `JobCarousel`'s deep import. Jest's automatic package mocking only matches whole-package specifiers (`"three"`), not subpath imports resolved to a specific file inside `node_modules`, so this one is wired up explicitly via `moduleNameMapper` in `package.json`'s `jest` config instead. Unlike the WebGL mock, this one keeps real behavior where it's cheap to: its `render()` walks the mocked scene graph and appends each card's real DOM element into the renderer's `domElement`, exactly like the real `CSS3DRenderer` does — which is what lets `JobCarousel.test.js` actually query and click a rendered job card.
- **`setupTests.js` polyfills for `IntersectionObserver`, `ResizeObserver`, and `window.matchMedia`** — minimal stand-ins (`observe`/`unobserve`/`disconnect` no-ops; `matches: false` for media queries) so any `motion.*` component can mount without crashing. They don't simulate real viewport intersection — that's out of scope for a unit test — they just stop jsdom's absence of the API from being a hard crash.
- **`"resetMocks": false`** was added to the `jest` config in `package.json`. Create React App defaults `resetMocks` to `true` (wipes every `jest.fn()`'s implementation before each test), but `jest-canvas-mock` implements its canvas context as a `jest.fn()` internally — with `resetMocks: true`, that implementation gets wiped before the *first* test in a file even runs, and `getContext('2d')` silently returns `undefined` again. This was found by writing a one-line debug test and watching `getContext('2d')` return `undefined` instead of a real context — a good example of why "run the test and read the actual failure" beats guessing.

### Test files and what they verify

| File | What it covers |
| --- | --- |
| [src/App.test.js](src/App.test.js) | Smoke test: the whole app tree mounts without throwing. This is the one test that would have caught every issue above — it renders every component this README describes at once. |
| [src/components/experiences/JobModal.test.js](src/components/experiences/JobModal.test.js) | Renders as an accessible `dialog`, closes on the × button, closes on `Escape`. No three.js/canvas mocking needed — it's pure `motion`. |
| [src/components/experiences/SkillScroll.test.js](src/components/experiences/SkillScroll.test.js) | Renders one button per skill, clicking the active skill opens its detail panel, clicking a different skill switches instead of opening. Stubs `Element.prototype.scrollTo`, which jsdom doesn't implement. |
| [src/components/experiences/ParticleCard.test.js](src/components/experiences/ParticleCard.test.js) | Starts as a sphere prompt, reveals its children after materializing, returns to the prompt via the back button. Runs on **real** timers (not `jest.useFakeTimers()`) — see below. |
| [src/components/experiences/JobCarousel.test.js](src/components/experiences/JobCarousel.test.js) | One dot + one card per job, clicking a card opens the right job in a modal, closing the modal removes it, the pause/resume toggle flips its accessible label. This is the one exercising the `CSS3DRenderer` DOM-sync mock. |

**Why real timers, not fake ones, for the animation tests:** `ParticleCard`'s and `JobCarousel`'s modal transitions are gated by `motion`'s own `requestAnimationFrame`-driven exit animations (`AnimatePresence mode="wait"` won't mount the next view until the previous one finishes exiting). `jest.useFakeTimers()` doesn't reliably drive that animation loop to completion — the first attempt at this (using fake timers + `jest.advanceTimersByTime`) left components stuck mid-animation instead of transitioning. Waiting on the real clock (`await screen.findByText(...)`, `await waitForElementToBeRemoved(...)`) costs a few hundred milliseconds per test but verifies the actual transition a user experiences, which is the more honest test.

### Running the tests

```bash
npm test              # interactive watch mode
CI=true npm test      # single run, non-interactive (what CI / this README's verification used)
```

All 5 suites / 14 tests pass as of this writing, confirmed by running the suite three times in a row (`ParticleCard.test.js` and `JobCarousel.test.js` are the ones with real-timer waits, so repeat runs are how flakiness would show up).

## Using Claude Code on this project

The `JobCarousel`/`JobModal`/`ParticleCard` interaction work and this test suite were built with [Claude Code](https://claude.com/claude-code) acting as a pair-programmer, following the same loop each time:

1. **Read first.** Before writing anything, read the component being changed, its CSS, and any sibling components that share patterns — so new code matches existing conventions (e.g. the `useEffect`-managed three.js scene + cleanup pattern already used by `ParticleCard` was reused for `JobCarousel` rather than introducing a new approach).
2. **Write the test, run it, read the actual error.** Every mock and config change documented above (the `three` mock, the `CSS3DRenderer` `moduleNameMapper` entry, `jest-canvas-mock`, the observer/`matchMedia` polyfills, `resetMocks: false`) exists because a test was run, it failed with a specific error, and the fix targeted that exact error — not a guess. This is visible in the progression of failures in the previous section: each fix revealed the next problem underneath it.
3. **Verify, don't assume.** After a fix, the suite was re-run (and, for the animation-timing tests, run multiple times) before considering the work done, rather than trusting that a code change "should" work.

If you're extending this repo with Claude Code, the same loop applies: make the smallest change that could fix or add the behavior, run the real test command, and let the actual failure output — not intuition about how three.js/motion/jsdom "probably" behave — drive the next change.

## Available scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000). Reloads on save.

### `npm test`

Runs the test suite via `react-scripts test` (Jest + React Testing Library) in interactive watch mode. Use `CI=true npm test` for a single non-interactive run.

### `npm run build`

Builds a minified, production-ready bundle into `build/`.

### `npm run eject`

One-way copy of all CRA config (Webpack, Babel, ESLint, and the Jest config referenced above) into the project. Not needed for anything described in this README — the Jest overrides here were made through `package.json`'s `jest` field, which CRA supports without ejecting.
