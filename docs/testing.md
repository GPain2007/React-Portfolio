# Testing Three.js and Motion (and why it's set up this way)

The site's 3D and animated components (`ParticleCard`, `JobCarousel`, `JobModal`, `SkillScroll`, `ServiceCard`) were built test-first: a failing test describing the behavior was written before the fix/feature, then the component was changed until it passed. That's the point of TDD here — it's not ceremony, it's what caught two real integration problems (below) before they could break the page for anyone.

If you're new to this repo and wondering "why does this test file need three separate mocks just to click a button?", this section is for you.

## The problem: three.js and jsdom don't get along

Tests run in [Jest](https://jestjs.io/) against [jsdom](https://github.com/jsdom/jsdom), a JavaScript re-implementation of the DOM used because there's no real browser/GPU available in a test run. Running the existing test suite against the current code surfaced three failures, in order, each one hiding the next:

1. **`three` itself wouldn't import.** Modern `three` ships as an ES module; its `require()`-facing entry point (`three.cjs`) internally does `import` from `three.module.js`, which Jest's default CommonJS-only transform can't parse. `three/examples/jsm/renderers/CSS3DRenderer.js` (used by `JobCarousel`) has the same problem — it's raw ESM.
2. **jsdom's `<canvas>` has no drawing context.** `getContext('2d')` and WebGL contexts return `null`/`undefined` in jsdom — there's no native canvas backend — so anything that calls `ctx.createRadialGradient(...)` (both `ParticleCard` and `ServiceCard` build a particle sprite this way) throws immediately.
3. **jsdom doesn't implement `IntersectionObserver`, `ResizeObserver`, or `window.matchMedia`.** `motion` reaches for all three the moment any `motion.*` component mounts (for `whileInView`, layout animations, and `prefers-reduced-motion`), so without stubs, mounting _any_ animated component throws.

None of this means the components are broken — it means jsdom is missing browser features these libraries assume exist. The fix in each case is to give the test environment a stand-in for the missing piece, narrow enough that it doesn't hide a real bug.

## What was installed

```bash
npm install --save-dev jest-canvas-mock
```

`jest-canvas-mock` patches `HTMLCanvasElement.prototype.getContext('2d')` with a working (if visually inert) implementation — `createRadialGradient`, `fillRect`, `addColorStop`, etc. all become real, callable methods that record calls instead of throwing. It's imported once in [src/setupTests.js](../src/setupTests.js), before any test runs.

## What was mocked, and why each mock is shaped the way it is

- **[src/\_\_mocks\_\_/three.js](../src/__mocks__/three.js)** — a manual mock for the whole `three` package. Because Jest's `roots` (via Create React App) is `<rootDir>/src`, a mock file adjacent to `node_modules` doesn't work here — it has to live at `src/__mocks__/three.js` to be picked up automatically for every `import * as THREE from "three"` in the codebase, no `jest.mock()` call needed in individual test files. It re-implements just enough of the API surface (`Scene`, `Group`, cameras, `Clock`, `WebGLRenderer`, `BufferGeometry`, `Points`, `Mesh`, etc.) as plain classes with no-op rendering, so components can mount, run their animation-loop math, and clean up — without ever touching a GPU.
- **[src/\_\_mocks\_\_/three/examples/jsm/renderers/CSS3DRenderer.js](../src/__mocks__/three/examples/jsm/renderers/CSS3DRenderer.js)** — a mock for `JobCarousel`'s deep import. Jest's automatic package mocking only matches whole-package specifiers (`"three"`), not subpath imports resolved to a specific file inside `node_modules`, so this one is wired up explicitly via `moduleNameMapper` in `package.json`'s `jest` config instead. Unlike the WebGL mock, this one keeps real behavior where it's cheap to: its `render()` walks the mocked scene graph and appends each card's real DOM element into the renderer's `domElement`, exactly like the real `CSS3DRenderer` does — which is what lets `JobCarousel.test.js` actually query and click a rendered job card.
- **`setupTests.js` polyfills for `IntersectionObserver`, `ResizeObserver`, and `window.matchMedia`** — minimal stand-ins (`observe`/`unobserve`/`disconnect` no-ops; `matches: false` for media queries) so any `motion.*` component can mount without crashing. They don't simulate real viewport intersection — that's out of scope for a unit test — they just stop jsdom's absence of the API from being a hard crash.
- **`"resetMocks": false`** was added to the `jest` config in `package.json`. Create React App defaults `resetMocks` to `true` (wipes every `jest.fn()`'s implementation before each test), but `jest-canvas-mock` implements its canvas context as a `jest.fn()` internally — with `resetMocks: true`, that implementation gets wiped before the _first_ test in a file even runs, and `getContext('2d')` silently returns `undefined` again. This was found by writing a one-line debug test and watching `getContext('2d')` return `undefined` instead of a real context — a good example of why "run the test and read the actual failure" beats guessing.

## Test files and what they verify

| File                                                                                               | What it covers                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/App.test.js](../src/App.test.js)                                                                 | Smoke test: the whole app tree mounts without throwing. This is the one test that would have caught every issue above — it renders every component on the page at once.                                           |
| [src/components/experiences/JobModal.test.js](../src/components/experiences/JobModal.test.js)         | Renders as an accessible `dialog`, closes on the × button, closes on `Escape`. No three.js/canvas mocking needed — it's pure `motion`.                                                                                      |
| [src/components/experiences/SkillScroll.test.js](../src/components/experiences/SkillScroll.test.js)   | Renders one button per skill, clicking the active skill opens its detail panel, clicking a different skill switches instead of opening. Stubs `Element.prototype.scrollTo`, which jsdom doesn't implement.                  |
| [src/components/experiences/ParticleCard.test.js](../src/components/experiences/ParticleCard.test.js) | Starts as a sphere prompt, reveals its children after materializing, returns to the prompt via the back button. Runs on **real** timers (not `jest.useFakeTimers()`) — see below.                                           |
| [src/components/experiences/JobCarousel.test.js](../src/components/experiences/JobCarousel.test.js)   | One dot + one card per job, clicking a card opens the right job in a modal, closing the modal removes it, the pause/resume toggle flips its accessible label. This is the one exercising the `CSS3DRenderer` DOM-sync mock. |

**Why real timers, not fake ones, for the animation tests:** `ParticleCard`'s and `JobCarousel`'s modal transitions are gated by `motion`'s own `requestAnimationFrame`-driven exit animations (`AnimatePresence mode="wait"` won't mount the next view until the previous one finishes exiting). `jest.useFakeTimers()` doesn't reliably drive that animation loop to completion — the first attempt at this (using fake timers + `jest.advanceTimersByTime`) left components stuck mid-animation instead of transitioning. Waiting on the real clock (`await screen.findByText(...)`, `await waitForElementToBeRemoved(...)`) costs a few hundred milliseconds per test but verifies the actual transition a user experiences, which is the more honest test.

## Running the tests

```bash
npm test              # interactive watch mode
CI=true npm test      # single run, non-interactive (what CI uses)
```

When this section was written, all 5 original suites / 14 tests passed, confirmed by running the suite three times in a row (`ParticleCard.test.js` and `JobCarousel.test.js` are the ones with real-timer waits, so repeat runs are how flakiness would show up).

## Using Claude Code on this project

The `JobCarousel`/`JobModal`/`ParticleCard` interaction work and this test suite were built with [Claude Code](https://claude.com/claude-code) acting as a pair-programmer, following the same loop each time:

1. **Read first.** Before writing anything, read the component being changed, its CSS, and any sibling components that share patterns — so new code matches existing conventions (e.g. the `useEffect`-managed three.js scene + cleanup pattern already used by `ParticleCard` was reused for `JobCarousel` rather than introducing a new approach).
2. **Write the test, run it, read the actual error.** Every mock and config change documented above (the `three` mock, the `CSS3DRenderer` `moduleNameMapper` entry, `jest-canvas-mock`, the observer/`matchMedia` polyfills, `resetMocks: false`) exists because a test was run, it failed with a specific error, and the fix targeted that exact error — not a guess. This is visible in the progression of failures in the previous section: each fix revealed the next problem underneath it.
3. **Verify, don't assume.** After a fix, the suite was re-run (and, for the animation-timing tests, run multiple times) before considering the work done, rather than trusting that a code change "should" work.

If you're extending this repo with Claude Code, the same loop applies: make the smallest change that could fix or add the behavior, run the real test command, and let the actual failure output — not intuition about how three.js/motion/jsdom "probably" behave — drive the next change.


## Tests added later

| File | What it covers |
| --- | --- |
| [src/components/portfolio/Portfolio.test.js](../src/components/portfolio/Portfolio.test.js) | Project data is valid (unique ids/titles, real descriptions, no placeholder projects, https links only); one card per project; click or Enter opens the preview and Escape closes it; the preview hides the GitHub button for private repos and lists technologies. |
| [src/components/nav/Nav.test.js](../src/components/nav/Nav.test.js) | Every nav link is labelled and points at a section that exists on the page; clicking marks it active and sends a `nav_click` analytics event. |
| [src/utils/renderLoop.test.js](../src/utils/renderLoop.test.js) | 3D render loop pauses off screen and while the tab is hidden, caps time steps after a stall, ignores same-size resize events, fits the camera to narrow cards, and caps pixel ratio on touch devices. |
| [src/utils/analytics.test.js](../src/utils/analytics.test.js) | `trackEvent` is a no-op without `gtag` and forwards name/params when it is loaded. |

## Using Claude Code on this project
The `JobCarousel`/`JobModal`/`ParticleCard` interaction work and this test suite were built with [Claude Code](https://claude.com/claude-code) acting as a pair-programmer, following the same loop each time:

1. **Read first.** Before writing anything, read the component being changed, its CSS, and any sibling components that share patterns — so new code matches existing conventions (e.g. the `useEffect`-managed three.js scene + cleanup pattern already used by `ParticleCard` was reused for `JobCarousel` rather than introducing a new approach).
2. **Write the test, run it, read the actual error.** Every mock and config change documented above (the `three` mock, the `CSS3DRenderer` `moduleNameMapper` entry, `jest-canvas-mock`, the observer/`matchMedia` polyfills, `resetMocks: false`) exists because a test was run, it failed with a specific error, and the fix targeted that exact error — not a guess. This is visible in the progression of failures in the previous section: each fix revealed the next problem underneath it.
3. **Verify, don't assume.** After a fix, the suite was re-run (and, for the animation-timing tests, run multiple times) before considering the work done, rather than trusting that a code change "should" work.

If you're extending this repo with Claude Code, the same loop applies: make the smallest change that could fix or add the behavior, run the real test command, and let the actual failure output — not intuition about how three.js/motion/jsdom "probably" behave — drive the next change.
