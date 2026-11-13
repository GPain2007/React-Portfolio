import IMG1 from "../../assets/IMG1.png";

// Projects shown in the Portfolio section, most relevant first.
// To add a project, append an object with a unique `id`. `image`, `github`
// and `demo` are optional: a card without an image shows a GitHub icon, and
// the preview only shows the buttons that have a link (private repos should
// leave `github` as null).
const projects = [
  {
    id: 1,
    image: null,
    title: "GotNext",
    description:
      "A platform for basketball players, from amateur to pro, to queue up for pickup games so everyone gets a fair turn on the court. Web frontend, backend, identity service, infrastructure, and native iOS (Swift) and Android (Kotlin) apps.",
    tags: ["React", "Node.js", "Swift", "Kotlin", "Cloudflare"],
    github: null,
    demo: null,
  },
  {
    id: 2,
    image: null,
    title: "HBM Flower City",
    description:
      "A live website for an Austin wedding florist: animated home page with testimonials, service offerings, a photo gallery with a full-screen lightbox, and an embedded inquiry form.",
    tags: ["React", "Vite", "Framer Motion", "Sass", "Vitest"],
    github: "https://github.com/GPain2007/hbmAnimated",
    demo: null,
  },
  {
    id: 3,
    image: null,
    title: "Oh..I KNOW A GUY! Lawn Service",
    description:
      "A single-page site for an Austin lawn care and landscaping business, with service cards, scrolling customer reviews, and a free-estimate form emailed straight to the owner.",
    tags: ["React", "EmailJS", "Jest", "GitHub Actions"],
    github: "https://github.com/GPain2007/Know_A_Guy_Static",
    demo: null,
  },
  {
    id: 4,
    image: null,
    title: "Secure Notes API (CI/CD Pipeline)",
    description:
      "A FastAPI notes service used to demonstrate a security-first GitHub Actions pipeline: linting, tests, static analysis, dependency auditing, secret scanning, CodeQL, and container scanning.",
    tags: ["Python", "FastAPI", "GitHub Actions", "CodeQL", "Trivy"],
    github: "https://github.com/GPain2007/secure-cicd-pipeline-demo",
    demo: null,
  },
  {
    id: 5,
    image: null,
    title: "PerfCompare (Mozilla)",
    description:
      "Debugged and stabilized this open-source Firefox performance-comparison tool, fixing front-end and back-end issues with React, React Native, and Material UI.",
    tags: ["React", "Material UI", "Open Source"],
    github: "https://github.com/mozilla/perfcompare",
    demo: null,
  },
  {
    id: 6,
    image: null,
    title: "FoxPuppet (Mozilla)",
    description:
      "Improved reliability of this Python/Selenium browser automation framework through root-cause debugging and optimized wait and error handling.",
    tags: ["Python", "Selenium", "Open Source"],
    github: "https://github.com/mozilla/FoxPuppet",
    demo: null,
  },
  {
    id: 7,
    image: null,
    title: "Sauce Demo Test Suite",
    description:
      "A Page Object Model test suite in Python, pytest, and Selenium covering login, cart, and checkout flows on a demo storefront, running headless by default.",
    tags: ["Python", "pytest", "Selenium", "QA"],
    github: "https://github.com/GPain2007/Pytest_Project",
    demo: null,
  },
  {
    id: 8,
    image: IMG1,
    title: "Musicology",
    description:
      "A networking platform that connects musicians to collaborate, share work, and manage bookings.",
    tags: ["React", "Node.js", "Express"],
    github: "https://github.com/GPain2007/musician-networking-app",
    demo: "https://musicology-umekev.herokuapp.com/",
  },
];

export default projects;
