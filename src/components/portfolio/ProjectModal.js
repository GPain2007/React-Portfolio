import React, { useEffect } from "react";
import { motion } from "motion/react";
import { AiFillGithub, AiOutlineClose } from "react-icons/ai";
import "./ProjectModal.css";

const ProjectModal = ({ project, onClose }) => {
  const { image, title, description, github, demo } = project;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="project_modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="project_modal"
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 40 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="project_modal-close"
          onClick={onClose}
          aria-label="Close project preview"
        >
          <AiOutlineClose />
        </button>

        <div className="project_modal-image">
          {image ? (
            <img src={image} alt={title} />
          ) : (
            <div className="project_modal-placeholder">
              <AiFillGithub />
            </div>
          )}
        </div>

        <h3>{title}</h3>
        <p>{description}</p>

        <div className="project_modal-cta">
          <a href={github} className="btn" target="_blank" rel="noreferrer">
            Github
          </a>
          {demo && (
            <a
              href={demo}
              className="btn btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              Live Demo
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;
