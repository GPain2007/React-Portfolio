import {
  createRenderLoop,
  fitDistance,
  isTouchDevice,
  maxPixelRatio,
  observeSize,
  MAX_DELTA,
} from "./renderLoop";

// A controllable IntersectionObserver so tests can move an element on and
// off screen (setupTests.js installs a no-op one by default).
let ioCallback;
class FakeIntersectionObserver {
  constructor(cb) {
    ioCallback = cb;
  }
  observe() {}
  disconnect() {}
}

// Same idea for ResizeObserver.
let roCallback;
class FakeResizeObserver {
  constructor(cb) {
    roCallback = cb;
  }
  observe() {}
  disconnect() {}
}

const sized = (width, height) => {
  const el = document.createElement("div");
  Object.defineProperty(el, "clientWidth", { configurable: true, get: () => width });
  Object.defineProperty(el, "clientHeight", { configurable: true, get: () => height });
  return {
    el,
    resize(w, h) {
      width = w;
      height = h;
    },
  };
};

const setDevicePixelRatio = (value) => {
  Object.defineProperty(window, "devicePixelRatio", { configurable: true, writable: true, value });
};

const originalIO = window.IntersectionObserver;
const originalDPR = window.devicePixelRatio;
const originalRO = window.ResizeObserver;
const originalMatchMedia = window.matchMedia;

afterEach(() => {
  window.IntersectionObserver = originalIO;
  window.ResizeObserver = originalRO;
  window.matchMedia = originalMatchMedia;
  setDevicePixelRatio(originalDPR);
  jest.restoreAllMocks();
});

describe("createRenderLoop", () => {
  test("draws a first frame immediately", () => {
    const frame = jest.fn();
    const loop = createRenderLoop(document.createElement("div"), frame);
    expect(frame).toHaveBeenCalledWith(0);
    loop.stop();
  });

  test("pauses while off screen and resumes when back on screen", () => {
    window.IntersectionObserver = FakeIntersectionObserver;
    const loop = createRenderLoop(document.createElement("div"), jest.fn());
    expect(loop.isRunning()).toBe(true);

    ioCallback([{ isIntersecting: false }]);
    expect(loop.isRunning()).toBe(false);

    ioCallback([{ isIntersecting: true }]);
    expect(loop.isRunning()).toBe(true);

    loop.stop();
    expect(loop.isRunning()).toBe(false);
  });

  test("pauses while the tab is hidden", () => {
    const hidden = jest.spyOn(document, "hidden", "get");
    const loop = createRenderLoop(document.createElement("div"), jest.fn());

    hidden.mockReturnValue(true);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(loop.isRunning()).toBe(false);

    hidden.mockReturnValue(false);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(loop.isRunning()).toBe(true);
    loop.stop();
  });

  test("caps the time step so animations don't jump after a stall", () => {
    const callbacks = [];
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      callbacks.push(cb);
      return callbacks.length;
    });
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    const frame = jest.fn();
    const loop = createRenderLoop(document.createElement("div"), frame);

    callbacks.shift()(1000); // first tick: no previous time
    callbacks.shift()(5000); // 4 seconds later (phone stalled)

    expect(frame).toHaveBeenLastCalledWith(MAX_DELTA);
    loop.stop();
  });
});

describe("observeSize", () => {
  test("only reports real size changes", () => {
    window.ResizeObserver = FakeResizeObserver;
    const box = sized(300, 400);
    const onResize = jest.fn();
    const cleanup = observeSize(box.el, onResize);

    roCallback(); // same size, e.g. phone address bar moved
    expect(onResize).not.toHaveBeenCalled();

    box.resize(300, 520);
    roCallback();
    expect(onResize).toHaveBeenCalledWith(300, 520);

    box.resize(0, 0); // hidden: ignore
    roCallback();
    expect(onResize).toHaveBeenCalledTimes(1);
    cleanup();
  });

  test("does not re-size on window scroll-resize events", () => {
    window.ResizeObserver = FakeResizeObserver;
    const box = sized(300, 400);
    const onResize = jest.fn();
    const cleanup = observeSize(box.el, onResize);

    window.dispatchEvent(new Event("resize"));
    expect(onResize).not.toHaveBeenCalled();
    cleanup();
  });
});

describe("fitDistance", () => {
  test("keeps the original desktop framing for wide cards", () => {
    expect(fitDistance(1.6, 50, 1.5)).toBeCloseTo(3.95, 1);
  });

  test("moves the camera back on narrow phone cards so the sphere isn't clipped", () => {
    const wide = fitDistance(1.6, 50, 1.5);
    const narrow = fitDistance(1.6, 50, 0.6);
    expect(narrow).toBeCloseTo(wide / 0.6, 5);
  });

  test("handles a zero-size container", () => {
    expect(Number.isFinite(fitDistance(1.6, 50, 0))).toBe(true);
  });
});

describe("device helpers", () => {
  test("detects touch devices and caps their pixel ratio", () => {
    window.matchMedia = (query) => ({ matches: query === "(pointer: coarse)" });
    setDevicePixelRatio(3);
    expect(isTouchDevice()).toBe(true);
    expect(maxPixelRatio()).toBe(1.5);
  });

  test("allows 2x on desktop", () => {
    window.matchMedia = () => ({ matches: false });
    setDevicePixelRatio(3);
    expect(isTouchDevice()).toBe(false);
    expect(maxPixelRatio()).toBe(2);
  });
});
