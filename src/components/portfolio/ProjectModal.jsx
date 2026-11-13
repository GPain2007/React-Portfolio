import React, { useEffect } from "react";
import { motion } from "motion/react";
import { AiFillGithub, AiOutlineClose } from "react-icons/ai";
import "./ProjectModal.css";

const ProjectModal = ({ project, onClose }) => {
  const { image, title, description, tags = [], github, demo } = project;

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

        {tags.length > 0 && (
          <ul className="project_modal-tags" aria-label="Technologies">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}

        <div className="project_modal-cta">
          {github ? (
            <a href={github} className="btn" target="_blank" rel="noreferrer">
              Github
            </a>
          ) : (
            <span className="project_modal-private">Private repository</span>
          )}
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
