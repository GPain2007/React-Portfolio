import React, { useEffect } from "react";
import { motion } from "motion/react";
import { AiOutlineClose } from "react-icons/ai";
import "./JobModal.css";

const JobModal = ({ job, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="job_modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="job_modal-panel"
        initial={{ opacity: 0, scale: 0.85, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 32 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${job.role} at ${job.company}`}
      >
        <button
          type="button"
          className="job_modal-close"
          onClick={onClose}
          aria-label="Close job details"
        >
          <AiOutlineClose />
        </button>

        <span className="job_modal-company">{job.company}</span>
        <h3>{job.role}</h3>
        <div className="job_modal-meta">
          <span>{job.location}</span>
          <span>{job.period}</span>
        </div>

        <ul className="job_modal-points">
          {job.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default JobModal;
