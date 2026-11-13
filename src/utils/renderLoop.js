// Shared helpers for the three.js scenes (ParticleCard, ServiceCard,
// JobCarousel). On phones the page has up to seven 3D scenes; letting each
// one render 60 times a second while off screen, re-size on every scroll
// (mobile browsers fire `resize` when the address bar shows or hides), and
// render at 2-3x pixel density is what made the Experience section stutter.

const hasWindow = typeof window !== "undefined";

// True on phones and tablets (a finger, not a mouse, is the main pointer).
export const isTouchDevice = () =>
  hasWindow &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(pointer: coarse)").matches;

// Phones have 3x screens; rendering soft glowing points at 3x costs a lot of
// GPU time for no visible difference, so cap touch devices lower.
export const maxPixelRatio = () =>
  Math.min(hasWindow ? window.devicePixelRatio || 1 : 1, isTouchDevice() ? 1.5 : 2);

// Largest frame step we let animations take. After the tab was hidden or the
// phone stalled, an uncapped delta would make spheres jump ahead in one frame.
export const MAX_DELTA = 0.1;

/**
 * Calls `frame(deltaSeconds)` once per animation frame, but only while
 * `element` is on (or near) the screen and the tab is visible. Returns
 * `{ stop }`, which must be called on unmount.
 */
export function createRenderLoop(element, frame, { rootMargin = "150px" } = {}) {
  let frameId = null;
  let lastTime = null;
  let onScreen = true; // until the observer reports otherwise
  let stopped = false;
  const pageVisible = () => typeof document === "undefined" || !document.hidden;

  const tick = (now) => {
    frameId = requestAnimationFrame(tick);
    const delta = lastTime === null ? 0 : Math.min((now - lastTime) / 1000, MAX_DELTA);
    lastTime = now;
    frame(delta);
  };

  const update = () => {
    const shouldRun = !stopped && onScreen && pageVisible();
    if (shouldRun && frameId === null) {
      lastTime = null;
      frameId = requestAnimationFrame(tick);
    } else if (!shouldRun && frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  };

  let observer = null;
  if (hasWindow && typeof window.IntersectionObserver === "function") {
    observer = new window.IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        update();
      },
      { rootMargin },
    );
    observer.observe(element);
  }

  document.addEventListener("visibilitychange", update);
  // Draw the first frame right away so the scene (and, for CSS3D, its DOM
  // cards) exists before the first animation frame.
  frame(0);
  update();

  return {
    stop() {
      stopped = true;
      update();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
    },
    isRunning: () => frameId !== null,
  };
}

/**
 * Calls `onResize(width, height)` when `element` actually changes size.
 * Uses ResizeObserver, so scrolling on a phone (which fires window `resize`
 * as the address bar moves) doesn't re-size the canvas. Returns a cleanup
 * function.
 */
export function observeSize(element, onResize) {
  let lastWidth = element.clientWidth;
  let lastHeight = element.clientHeight;

  const check = () => {
    const width = element.clientWidth;
    const height = element.clientHeight;
    if (width === 0 || height === 0) return;
    if (Math.abs(width - lastWidth) < 1 && Math.abs(height - lastHeight) < 1) return;
    lastWidth = width;
    lastHeight = height;
    onResize(width, height);
  };

  if (hasWindow && typeof window.ResizeObserver === "function") {
    const observer = new window.ResizeObserver(check);
    observer.observe(element);
    return () => observer.disconnect();
  }
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}

/**
 * Camera distance that keeps a sphere of `radius` fully visible in a
 * perspective camera with vertical field of view `fovDeg`, whatever the
 * container's aspect ratio. Narrow phone cards are taller than wide, so the
 * width, not the height, is usually what limits the fit.
 */
export function fitDistance(radius, fovDeg, aspect, margin = 1.15) {
  const halfFov = (fovDeg * Math.PI) / 360;
  const fitHeight = (radius * margin) / Math.tan(halfFov);
  const safeAspect = aspect > 0 ? aspect : 1;
  return safeAspect >= 1 ? fitHeight : fitHeight / safeAspect;
}
