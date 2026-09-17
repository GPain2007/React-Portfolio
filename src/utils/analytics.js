// GA4's Enhanced Measurement already auto-tracks outbound clicks, file
// downloads, and scroll — this helper is only for events it can't see on its
// own (same-page anchor nav, form submits). Guarded so it's a safe no-op in
// Jest/jsdom, where window.gtag is never loaded (it only exists via the
// script tag in public/index.html).
export const trackEvent = (name, params = {}) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
};
