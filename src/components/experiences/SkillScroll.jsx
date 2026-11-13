import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./SkillScroll.css";

// Fallback row height (px) for when the DOM can't be measured (e.g. tests).
// The real height is read from the rendered rows, because `3rem` is not
// always 48px (the root font size can differ on phones), and a wrong value
// made the highlighted skill drift away from the one in the middle.
const FALLBACK_ITEM_HEIGHT = 48;

// How long scrolling must pause before we treat it as settled.
const SETTLE_MS = 100;

const SkillScroll = ({ skills }) => {
  const listRef = useRef(null);
  const scrollSettleTimeout = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => () => clearTimeout(scrollSettleTimeout.current), []);

  const itemHeight = () => {
    const first = listRef.current?.querySelector(".skill_scroll-item");
    return first?.offsetHeight || FALLBACK_ITEM_HEIGHT;
  };

  const indexForScroll = () => {
    const list = listRef.current;
    if (!list) return activeIndexRef.current;
    const index = Math.round(list.scrollTop / itemHeight());
    return Math.min(Math.max(index, 0), skills.length - 1);
  };

  // Only react once scrolling has settled, and only close the details if the
  // centered skill actually changed. Closing on every scroll event (including
  // the smooth scroll we start ourselves, and iOS momentum) made the panel
  // snap shut right after it opened.
  const handleScroll = () => {
    clearTimeout(scrollSettleTimeout.current);
    scrollSettleTimeout.current = setTimeout(() => {
      const index = indexForScroll();
      if (index !== activeIndexRef.current) {
        setActiveIndex(index);
        setIsOpen(false);
      }
    }, SETTLE_MS);
  };

  const handleItemClick = (index) => {
    if (index !== activeIndex) {
      listRef.current?.scrollTo({
        top: index * itemHeight(),
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
