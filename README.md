# Govnor Payne — Portfolio

This is my portfolio and my introduction to the web development and software engineering world. From HVAC, to Controls, to Software Engineering, and everything in between.

[![CI](https://github.com/GPain2007/React-Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/GPain2007/React-Portfolio/actions/workflows/ci.yml)

**Live site:** [gpayneportfolio.com](https://gpayneportfolio.com)

## The path here

| Stage | What I did |
| --- | --- |
| **HVAC** | Chief Building Engineer at CBRE (2014–2020): ran building engineering teams, preventive maintenance and emergency response across Class A commercial buildings. |
| **Controls** | Building automation installation, programming and diagnostics; now Facilities Supervisor for HVAC Instrument & Controls at the University of Texas at Austin, working with Johnson Controls Metasys, Trane and Honeywell systems. |
| **Software** | Junior Software Engineer at Softkodes, Software Engineer at EcoRise, open-source contributor to Mozilla, and Software Engineer at SkipForward. |

The site tells that story: a typed-out headline over a header video, an About section, skills and a 3D job-history carousel, services, the projects below, and a contact form.

## Projects

These are the projects shown in the site's Portfolio section. The data lives in [`src/components/portfolio/projects.js`](src/components/portfolio/projects.js).

| Project | What it is | Built with | Code |
| --- | --- | --- | --- |
| **GotNext** | A platform for basketball players, amateur to pro, to queue up for pickup games so everyone gets a fair turn. Web frontend, backend, identity service, infrastructure, and native iOS and Android apps. | React, Node.js, Swift, Kotlin, Cloudflare | Private |
| **HBM Flower City** | Live website for an Austin wedding florist: animated home page, offerings, photo gallery with lightbox, and inquiry form. | React, Vite, Framer Motion, Sass, Vitest | [hbmAnimated](https://github.com/GPain2007/hbmAnimated) |
| **Oh..I KNOW A GUY! Lawn Service** | Single-page site for an Austin lawn care business with services, customer reviews, and a free-estimate form. | React, EmailJS, Jest, GitHub Actions | [Know_A_Guy_Static](https://github.com/GPain2007/Know_A_Guy_Static) |
| **Secure Notes API** | A FastAPI notes service built to demonstrate a security-first CI/CD pipeline. | Python, FastAPI, GitHub Actions, CodeQL, Trivy | [secure-cicd-pipeline-demo](https://github.com/GPain2007/secure-cicd-pipeline-demo) |
| **PerfCompare (Mozilla)** | Debugged and stabilized Mozilla's open-source Firefox performance-comparison tool. | React, Material UI | [mozilla/perfcompare](https://github.com/mozilla/perfcompare) |
| **FoxPuppet (Mozilla)** | Improved reliability of Mozilla's Python/Selenium browser automation framework. | Python, Selenium | [mozilla/FoxPuppet](https://github.com/mozilla/FoxPuppet) |
| **Sauce Demo Test Suite** | Page Object Model test suite covering login, cart and checkout on a demo storefront. | Python, pytest, Selenium | [Pytest_Project](https://github.com/GPain2007/Pytest_Project) |
| **Musicology** | A networking platform that connects musicians to collaborate, share work, and manage bookings. | React, Node.js, Express | [musician-networking-app](https://github.com/GPain2007/musician-networking-app) |

### Adding a project

Add an object to the array in `projects.js`:

```js
{
  id: 9,                       // unique
  image: null,                 // optional: import a screenshot from src/assets
  title: "My New Project",
  description: "One or two sentences about what it does.",
  tags: ["React", "Node.js"],  // shown in the preview
  github: "https://github.com/GPain2007/my-new-project", // null for a private repo
  demo: null,                  // optional live link
}
```

The card fan resizes itself for any number of projects, and the tests check that the new entry is valid.

## What's on the site

| Section | Component | What it does |
| --- | --- | --- |
| Header | `components/header` | Background video, a headline that types itself in a loop, a résumé download, and social links |
| Nav | `components/nav` | Floating icon nav to each section; clicks are reported to Google Analytics |
| About | `components/about` | Short bio whose words scatter and reform on a timer |
| Experience | `components/experiences` | Skills inside clickable 3D particle spheres, plus a 3D job carousel with a details modal |
| Services | `components/services` | Three service cards, each with a 3D wireframe behind it |
| Portfolio | `components/portfolio` | Project cards fanned out like a hand of cards (stacked on phones), each opening a preview |
| Contact | `components/contacts` | Rotating email/phone/WhatsApp cards and a contact form sent through EmailJS |
| Footer | `components/footer` | Section links and copyright |

## Tech stack

- [React 18](https://react.dev/), bootstrapped with [Create React App](https://create-react-app.dev/) (`react-scripts` 5)
- [three.js](https://threejs.org/) for the 3D particle spheres, job carousel and service-card wireframes
- [motion](https://motion.dev/) (formerly Framer Motion) for transitions, modals and the typed headline
- [EmailJS](https://www.emailjs.com/) to send the contact form without a backend
- [react-icons](https://react-icons.github.io/react-icons/)
- Google Analytics 4 (`gtag.js` in `public/index.html`, plus `src/utils/analytics.js` for nav clicks and form submits)
- [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/) for tests, GitHub Actions for CI

## Getting started

Requires **Node.js 20 or newer**.

```bash
git clone https://github.com/GPain2007/React-Portfolio.git
cd React-Portfolio
npm ci
npm start          # http://localhost:3000
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Development server with reload on save |
| `npm test` | Tests in watch mode |
| `CI=true npm test` | One full test run (what CI runs) |
| `npm run build` | Production build into `build/` |

## Tests and CI

Tests live next to the components they cover:

| Test file | Covers |
| --- | --- |
| `src/App.test.js` | The whole page mounts without errors |
| `components/experiences/*.test.js` | Particle cards, skill list, job carousel and job modal |
| `components/portfolio/Portfolio.test.js` | Project data is valid with no placeholders, cards open and close previews, private repos don't show a dead GitHub button |
| `components/nav/Nav.test.js` | Every nav link points at a real section and reports clicks to analytics |
| `utils/analytics.test.js` | The analytics helper is safe when Google Analytics hasn't loaded |

three.js and jsdom don't get along without some mocking. [docs/testing.md](docs/testing.md) explains every mock and config setting and why each exists.

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) installs dependencies, runs the tests and builds the site:

- on every push and pull request to `main`
- every Monday at 13:47 UTC (early Monday morning, Central time), so dependency or environment breakage shows up even in weeks with no commits
- on demand from the Actions tab

If a scheduled run fails, the workflow opens a "Weekly CI check failed" issue (or comments on the open one).

## How it's built

**three.js.** Each 3D component (`ParticleCard`, `JobCarousel`, `ServiceCard`) builds its own scene inside a `useEffect` and fully disposes of geometry, materials and the renderer on cleanup to avoid memory leaks. `JobCarousel` uses `CSS3DRenderer`, so the job cards stay real, keyboard-focusable DOM buttons rather than pixels on a canvas.

**Motion.** Used where CSS can't do the job: exit animations before unmount (`AnimatePresence`), staggered letters in the headline, and animating to `height: auto`.

**Mobile first.** The 3D components size themselves from their container's real width, and every layout collapses to one column at `1024px` and tightens at `600px`. Nothing is hidden on small screens.

**SEO.** `public/index.html` has a real title and description, a canonical URL, Open Graph and Twitter tags, and `Person` structured data. `public/sitemap.xml` and `robots.txt` point crawlers at the homepage.

**Analytics.** GA4 measurement ID `G-EH2YTFW7Z4`, set in two places in `public/index.html`. Enhanced Measurement covers page views, scrolls, outbound links and the résumé download; `trackEvent` adds `nav_click` and `contact_form_submit`.

## Deployment

`npm run build` produces a static site in `build/` that can be served from any static host. The production domain is `https://gpayneportfolio.com` (set as `homepage` in `package.json`).

## Known issues

Open problems are tracked in [GitHub Issues](https://github.com/GPain2007/React-Portfolio/issues). The main ones:

- Several files referenced by the page don't exist yet: `logo192.png`/`logo512.png` (link-preview image and app icons) and `header-poster.jpg`
- The 8 MB header video is fully preloaded on every visit, including on phones
- Create React App is deprecated; moving to Vite and Vitest is planned
- Animations don't respect the visitor's "reduce motion" setting

## Recent changes

This log is kept up to date by a weekly review.

- **2026-11-13:** README rewritten. Placeholder portfolio projects replaced with real ones (GotNext, HBM Flower City, the lawn service site, Secure Notes API, Sauce Demo tests), project data moved to `projects.js`, project tags added to the preview, the GitHub button hidden for private repos. Nav fixed (removed the link to a nonexistent Testimonials section, added Portfolio, added labels). New tests for Portfolio, Nav and analytics. GitHub Actions CI added.
