// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom implements <canvas> as an element but not its drawing context —
// `getContext('2d')` returns null unless a real (native) canvas backend is
// installed. `ParticleCard` builds a radial-gradient sprite texture on a
// canvas for its Three.js particles, so without a fake 2D context every test
// that mounts it (including `App.test.js`, which renders the whole page)
// crashes with "Cannot read properties of null (reading 'createRadialGradient')".
// `jest-canvas-mock` patches `HTMLCanvasElement.prototype.getContext` with a
// no-op-but-valid implementation so that code path can run in jsdom.
import 'jest-canvas-mock';

// jsdom (Jest's simulated DOM) never implements these three browser APIs,
// because it renders nothing to a screen: there is no viewport to observe
// intersections/resizes against and no OS media-query engine. `motion`
// (the animation library used across the site) reaches for all three the
// moment a component mounts — for `whileInView`, layout animations, and
// `prefers-reduced-motion` respectively — so every test that renders a
// `motion.*` component needs them stubbed out first, or mounting throws.
class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof window.IntersectionObserver === 'undefined') {
  window.IntersectionObserver = MockObserver;
}

if (typeof window.ResizeObserver === 'undefined') {
  window.ResizeObserver = MockObserver;
}

if (typeof window.matchMedia === 'undefined') {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
