import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import "./Header.css";
import CTA from "./cta";

import HeaderSocials from "./HeaderSocials";

// Drop your video file in the `public/` folder as `header-video.mp4`
// (and optionally `header-poster.jpg` for the first-frame image).
const VIDEO_SRC = `${process.env.PUBLIC_URL}/header-video.mp4`;
const POSTER_SRC = `${process.env.PUBLIC_URL}/header-poster.jpg`;

const TITLE = "From HVAC Tech to Controls Engineer to Software Engineer";

// Reveal one character at a time, left to right (and hide them right to left).
const sentence = {
  hidden: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.045,
    },
  },
};

// How long to pause once the sentence is fully typed / fully cleared (ms).
const HOLD_AFTER_TYPED = 1800;
const HOLD_AFTER_CLEARED = 500;

// Rough time (ms) for a full type-in / clear-out pass, based on the stagger.
const TYPE_IN_MS = (0.15 + 0.045 * TITLE.length + 0.12) * 1000;
const CLEAR_OUT_MS = 0.02 * TITLE.length * 1000 + 120;

const letter = {
  hidden: { opacity: 0, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.12, ease: "easeOut" },
  },
};

const Header = () => {
  // Loop forever: type the sentence in, hold, clear it out, hold, repeat.
  const [phase, setPhase] = useState("visible");

  useEffect(() => {
    const wait =
      phase === "visible"
        ? TYPE_IN_MS + HOLD_AFTER_TYPED
        : CLEAR_OUT_MS + HOLD_AFTER_CLEARED;
    const id = setTimeout(
      () => setPhase((p) => (p === "visible" ? "hidden" : "visible")),
      wait
    );
    return () => clearTimeout(id);
  }, [phase]);

  return (
    <header>
      <video
        className="header_video"
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="header_overlay" />

      <div className="container header">
        <div className="header_content">
          <motion.h1
            className="header_typed"
            variants={sentence}
            initial="hidden"
            animate={phase}
            aria-label={TITLE}
          >
            {TITLE.split("").map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                variants={letter}
                aria-hidden="true"
              >
                {char}
              </motion.span>
            ))}
            <motion.span
              className="header_caret"
              aria-hidden="true"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            >
              |
            </motion.span>
          </motion.h1>
          <CTA className="cta" />
          <HeaderSocials />
        </div>
      </div>
    </header>
  );
};
export default Header;
