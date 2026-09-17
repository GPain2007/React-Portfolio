import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./Portfolio.css";
import IMG1 from "../../assets/IMG1.png";
import { AiFillGithub } from "react-icons/ai";
import ProjectModal from "./ProjectModal";

const data = [
  {
    id: 1,
    image: IMG1,
    title: "Musicology",
    description:
      "A networking platform that connects musicians to collaborate, share work, and manage bookings.",
    github: "https://github.com/GPain2007/musician-networking-app",
    demo: "https://musicology-umekev.herokuapp.com/",
  },
  {
    id: 2,
    image: null,
    title: "PerfCompare (Mozilla)",
    description:
      "Debugged and stabilized this open-source Firefox performance-comparison tool, fixing front-end and back-end issues with React, React Native, and Material UI.",
    github: "https://github.com/mozilla/perfcompare",
    demo: null,
  },
  {
    id: 3,
    image: null,
    title: "FoxPuppet (Mozilla)",
    description:
      "Improved reliability of this Python/Selenium browser automation framework through root-cause debugging and optimized wait and error handling.",
    github: "https://github.com/mozilla/FoxPuppet",
    demo: null,
  },
  {
    id: 4,
    image: null,
    title: "New Project",
    description: "Description for the new project goes here.",
    github: null,
    demo: null,
  },
  {
    id: 5,
    image: null,
    title: "Another Project",
    description: "Description for another project goes here.",
    github: null,
    demo: null,
  },
];

// Rotation/spread applied per card, step away from the center card.
const FAN_SPREAD_DEG = 14;
const FAN_X_STEP = 100;
const FAN_Y_STEP = 26;

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

const Portfolio = () => {
  const [activeProject, setActiveProject] = useState(null);
  const isMobile = useIsMobile();
  const mid = (data.length - 1) / 2;

  return (
    <section id="portfolio">
      <h5>My Recent Work</h5>
      <h2>Portfolio</h2>

      <motion.div
        className={`container portfolio_hand${
          isMobile ? " portfolio_hand-stacked" : ""
        }`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.15, delayChildren: 0.1 }}
      >
        {data.map(({ id, image, title, description, github, demo }, index) => {
          const offset = index - mid;
          const rotate = isMobile ? 0 : offset * FAN_SPREAD_DEG;
          const x = isMobile ? 0 : offset * FAN_X_STEP;
          const y = isMobile ? 0 : Math.abs(offset) * FAN_Y_STEP;

          const project = { id, image, title, description, github, demo };

          return (
            <motion.article
              key={id}
              className="portfolio_card"
              role="button"
              tabIndex={0}
              aria-label={`Preview ${title}`}
              style={{
                zIndex: 10 - Math.abs(offset),
                transformOrigin: "50% 100%",
              }}
              variants={{
                hidden: {
                  opacity: 0,
                  rotate: 0,
                  x: 0,
                  y: isMobile ? 30 : 160,
                  scale: 0.82,
                },
                visible: { opacity: 1, rotate, x, y, scale: 1 },
              }}
              transition={{ type: "spring", stiffness: 170, damping: 20 }}
              whileHover={
                isMobile
                  ? { scale: 1.02 }
                  : { y: y - 45, rotate: 0, scale: 1.08, zIndex: 20 }
              }
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveProject(project)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveProject(project);
                }
              }}
            >
              <div className="portfolio_card-image">
                {image ? (
                  <img src={image} alt={title} />
                ) : (
                  <div className="portfolio_card-placeholder">
                    <AiFillGithub />
                  </div>
                )}
              </div>
              <h3>{title}</h3>
              <p className="portfolio_card-desc">{description}</p>
              <span className="portfolio_card-hint">Click to preview</span>
            </motion.article>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
export default Portfolio;
