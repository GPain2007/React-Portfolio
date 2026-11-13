import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./Portfolio.css";
import { AiFillGithub } from "react-icons/ai";
import ProjectModal from "./ProjectModal";
import data from "./projects";

// Total rotation/spread of the outermost card. Each card's share is scaled by
// how many cards there are, so the fan keeps the same footprint whether it
// holds 5 projects or 10.
const FAN_MAX_ROTATE_DEG = 28;
const FAN_MAX_X = 200;
const FAN_MAX_Y = 52;

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
  const fanSteps = Math.max(mid, 1);

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
        {data.map(({ id, image, title, description, tags, github, demo }, index) => {
          const offset = index - mid;
          const rotate = isMobile ? 0 : (offset / fanSteps) * FAN_MAX_ROTATE_DEG;
          const x = isMobile ? 0 : (offset / fanSteps) * FAN_MAX_X;
          const y = isMobile ? 0 : (Math.abs(offset) / fanSteps) * FAN_MAX_Y;

          const project = { id, image, title, description, tags, github, demo };

          return (
            <motion.article
              key={id}
              className="portfolio_card"
              role="button"
              tabIndex={0}
              aria-label={`Preview ${title}`}
              style={{
                zIndex: Math.round(20 - Math.abs(offset)),
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
                  : { y: y - 45, rotate: 0, scale: 1.08, zIndex: 30 }
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
