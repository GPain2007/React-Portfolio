import React from "react";
import "./experience.css";
import ParticleCard from "./ParticleCard";
import SkillScroll from "./SkillScroll";
import JobCarousel from "./JobCarousel";

const FRONTEND_SKILLS = [
  {
    name: "HTML",
    level: "Experienced",
    description:
      "Markup language for structuring web content. The bones of any website",
  },
  {
    name: "CSS",
    level: "Experienced",
    description:
      "Style sheet language for designing web pages. Making the website pop and come to life.",
  },
  {
    name: "Javascript",
    level: "Experienced",
    description:
      "Programming language for web development. Adds interactivity to websites. Makes them dynamic.",
  },
  {
    name: "React",
    level: "Experienced",
    description:
      "JavaScript library for building user interfaces. Helps in creating dynamic and interactive web applications.",
  },
  {
    name: "Tailwind",
    level: "Advanced",
    description:
      "Utility-first CSS framework for rapid UI development. Speeds up the process of building responsive and modern web interfaces.",
  },
  {
    name: "Bootstrap",
    level: "Advanced",
    description:
      "CSS framework for responsive web design. Makes it easier to create mobile-first and responsive websites.",
  },

  {
    name: "Three.js",
    level: "Intermediate",
    description:
      "JavaScript 3D library for creating 3D graphics in the browser. Enables the development of interactive 3D experiences on the web. It is widely used for games, simulations, and visualizations. Its capabilities allow developers to create immersive 3D environments directly in the browser.",
  },
];

const BACKEND_SKILLS = [
  {
    name: "Node JS",
    level: "Experienced",
    description:
      "JavaScript runtime for server-side development. Allows developers to build scalable and efficient server-side applications using JavaScript.",
  },
  {
    name: "Python",
    level: "Basic",
    description:
      "High-level programming language for general-purpose development. Known for its readability and versatility, making it popular for web development, data analysis, artificial intelligence, and more.",
  },
  {
    name: "Express.js",
    level: "Experienced",
    description:
      "Web application framework for Node.js. Simplifies the process of building robust and scalable server-side applications.",
  },
  {
    name: "Django",
    level: "Intermediate",
    description:
      "Python web framework for building robust web applications. Encourages rapid development and clean, pragmatic design.",
  },
  {
    name: "ArcGIS",
    level: "Intermediate",
    description:
      "Geographic information system for working with maps and spatial data. Enables spatial analysis, visualization, and management of geographic information.",
  },
  {
    name: "Next.js",
    level: "Intermediate",
    description:
      "React framework for server-side rendering and static site generation. Enhances performance and SEO for web applications.",
  },
];
const CLOUD_SKILLS = [
  {
    name: "AWS",
    level: "Intermediate",
    description:
      "Cloud platform for building and managing applications. Provides a wide range of services for computing, storage, and networking.",
  },
  {
    name: "Azure",
    level: "Intermediate",
    description:
      "Microsoft's cloud computing platform for building and managing applications. Offers a comprehensive set of services for computing, storage, and networking.",
  },
  {
    name: "Google Cloud",
    level: "Intermediate",
    description:
      "Google's cloud platform for building and managing applications. Provides a variety of services for computing, storage, and networking.",
  },
];
const DATABASE_SKILLS = [
  {
    name: "MySQL",
    level: "Intermediate",
    description:
      "Relational database management system. Commonly used for structured data and supports SQL for querying.",
  },
  {
    name: "MongoDB",
    level: "Intermediate",
    description:
      "NoSQL database for modern applications. Designed for flexibility and scalability, often used for handling unstructured data.",
  },
  {
    name: "PostgreSQL",
    level: "Intermediate",
    description:
      "Relational database management system. Known for its robustness and support for advanced SQL features.",
  },
  {
    name: "GraphQL",
    level: "Intermediate",
    description:
      "Query language for APIs and runtime for executing those queries. Enables clients to request exactly the data they need and simplifies API development.",
  },
];

const JOB_EXPERIENCE = [
  {
    role: "Software Engineer",
    company: "SkipForward",
    location: "Austin, TX",
    period: "Apr 2026 – Present",
    points: [
      "Design, develop, test, and maintain scalable backend applications and software solutions using modern engineering practices.",
      "Apply data structures, algorithms, object-oriented design, testing, debugging, and code review practices to create reliable, reusable systems.",
      "Analyze complex technical problems, identify root causes, and implement solutions that improve application performance and scalability.",
      "Integrate cloud technologies, APIs, analytics, automation, and AI-driven workflows while collaborating across engineering teams.",
    ],
  },
  {
    role: "Facilities Supervisor – HVAC Instrument & Controls",
    company: "University of Texas at Austin",
    location: "Austin, TX",
    period: "2025 – Present",
    points: [
      "Monitor and optimize multi-vendor networked automation systems including Johnson Controls Metasys, Trane, and Honeywell.",
      "Review and modify control sequences, troubleshoot communications, support commissioning, and optimize system performance.",
      "Coordinate with facilities staff, IT, and vendors on automation infrastructure, networking, and technical integrations.",
      "Provide Metasys and Reliant Controls training and lead team members in HVAC and instrumentation/controls diagnostics and repair.",
    ],
  },
  {
    role: "Software Engineer / Technology Specialist",
    company: "EcoRise",
    location: "Austin, TX",
    period: "Jan 2023 – Aug 2025",
    points: [
      "Designed, debugged, and implemented Python- and React-based applications, dashboards, and data visualization solutions.",
      "Developed APIs, analytics tools, ETL workflows, and cloud integrations using Plotly, ArcGIS, AWS, Azure, Git/GitHub, and Jupyter.",
      "Performed root-cause analysis across web applications, deployments, user access, cloud services, and system performance issues.",
      "Created technical documentation, supported stakeholders, and communicated technical concepts to faculty, staff, students, and organizational users.",
    ],
  },
  {
    role: "Open Source Software Engineer",
    company: "Mozilla",
    location: "Austin, TX",
    period: "Aug 2022 – Present",
    points: [
      "Resolved PerfCompare issues using React, React Native, Material UI, Python, code tracing, state analysis, and API integration testing.",
      "Improved FoxPuppet browser automation using Python and Selenium WebDriver, refining selectors, waits, error handling, and session management.",
      "Analyzed stack traces and runtime behavior to improve application stability, performance, automation reliability, and maintainability.",
    ],
  },
  {
    role: "Junior Software Engineer",
    company: "Softkodes",
    location: "Effurun, Nigeria",
    period: "Jul 2022 – Jan 2023",
    points: [
      "Developed modular, production-ready React, Node.js, and Python web and backend applications in an Agile environment.",
      "Collaborated with analysts, architects, and QA teams to design, test, debug, and deliver end-to-end software solutions.",
    ],
  },
  {
    role: "Chief Building Engineer",
    company: "CBRE",
    location: "Austin, TX",
    period: "2014 – 2020",
    points: [
      "Led building automation installation, programming, diagnostics, and maintenance across Class A commercial facilities.",
      "Managed engineering teams, emergency response, preventive maintenance, vendor coordination, and controls upgrades.",
      "Applied systems troubleshooting, networking, technical leadership, and root-cause analysis in operational environments.",
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience">
      <h5>What Skills I Have</h5>
      <h2>My Experience</h2>

      <div className="container experience_container">
        <ParticleCard title="Frontend Development">
          <div className="experience_content">
            <SkillScroll skills={FRONTEND_SKILLS} />
          </div>
        </ParticleCard>
        {/* END OF FRONTEND */}
        <ParticleCard title="Backend Development">
          <div className="experience_content">
            <SkillScroll skills={BACKEND_SKILLS} />
          </div>
        </ParticleCard>
        <ParticleCard title="Cloud Development">
          <div className="experience_content">
            <SkillScroll skills={CLOUD_SKILLS} />
          </div>
        </ParticleCard>
        <ParticleCard title="Database Development">
          <div className="experience_content">
            <SkillScroll skills={DATABASE_SKILLS} />
          </div>
        </ParticleCard>
      </div>

      <div className="job_history">
        <h5>Where I've Worked</h5>
        <h2>Job Experience</h2>
        <JobCarousel jobs={JOB_EXPERIENCE} />
      </div>
    </section>
  );
};
export default Experience;
