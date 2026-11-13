import { trackEvent } from "./analytics";

describe("trackEvent", () => {
  afterEach(() => {
    delete window.gtag;
  });

  test("is a silent no-op when gtag hasn't loaded", () => {
    expect(() => trackEvent("anything", { a: 1 })).not.toThrow();
  });

  test("forwards the event name and params to gtag", () => {
    window.gtag = jest.fn();
    trackEvent("contact_form_submit", { status: "success" });
    expect(window.gtag).toHaveBeenCalledWith("event", "contact_form_submit", {
      status: "success",
    });
  });

  test("defaults params to an empty object", () => {
    window.gtag = jest.fn();
    trackEvent("nav_click");
    expect(window.gtag).toHaveBeenCalledWith("event", "nav_click", {});
  });
});
