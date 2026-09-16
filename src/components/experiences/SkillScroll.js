import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
// import { BsPatchCheckFill } from "react-icons/bs";
import "./SkillScroll.css";

const ITEM_HEIGHT = 48; // px — must match .skill_scroll-item height in SkillScroll.css

const SkillScroll = ({ skills }) => {
  const listRef = useRef(null);
  const scrollSettleTimeout = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => () => clearTimeout(scrollSettleTimeout.current), []);

  const syncActiveIndexToScroll = () => {
    const list = listRef.current;
    if (!list) return;
    const index = Math.round(list.scrollTop / ITEM_HEIGHT);
    const clamped = Math.min(Math.max(index, 0), skills.length - 1);
    setActiveIndex(clamped);
  };

  const handleScroll = () => {
    setIsOpen(false);
    clearTimeout(scrollSettleTimeout.current);
    scrollSettleTimeout.current = setTimeout(syncActiveIndexToScroll, 80);
  };

  const handleItemClick = (index) => {
    if (index !== activeIndex) {
      listRef.current?.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: "smooth",
      });
      setActiveIndex(index);
      setIsOpen(false);
      return;
    }
    setIsOpen((open) => !open);
  };

  const activeSkill = skills[activeIndex];

  return (
    <div className="skill_scroll">
      <div className="skill_scroll-viewport">
        <span className="skill_scroll-fade skill_scroll-fade-top" />
        <div
          className="skill_scroll-list"
          ref={listRef}
          onScroll={handleScroll}
        >
          {skills.map((skill, index) => (
            <button
              key={skill.name}
              type="button"
              className={`skill_scroll-item${
                index === activeIndex ? " is-active" : ""
              }`}
              onClick={() => handleItemClick(index)}
              aria-current={index === activeIndex}
              aria-expanded={index === activeIndex && isOpen}
            >
              {skill.name}
            </button>
          ))}
        </div>
        <span className="skill_scroll-fade skill_scroll-fade-bottom" />
      </div>

      <AnimatePresence initial={false}>
        {isOpen && activeSkill && (
          <motion.div
            key={activeSkill.name}
            className="skill_scroll-detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <small className="text-light">{activeSkill.level}</small>
            <p>{activeSkill.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillScroll;
