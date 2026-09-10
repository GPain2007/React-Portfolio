import React from "react";
import { motion } from "motion/react";
import "./Header.css";
import CTA from "./cta";

import HeaderSocials from "./HeaderSocials";

// Drop your video file in the `public/` folder as `header-video.mp4`
// (and optionally `header-poster.jpg` for the first-frame image).
const VIDEO_SRC = `${process.env.PUBLIC_URL}/header-video.mp4`;
const POSTER_SRC = `${process.env.PUBLIC_URL}/header-poster.jpg`;

const TITLE = "From HVAC Tech to Controls Engineer to Software Engineer";

// Reveal one character at a time, left to right.
const sentence = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.045,
      repeat: Infinity,
      repeatDelay: 1.2,
      repeatType: "mirror",
    },
  },
};

const letter = {
  hidden: { opacity: 0, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.12, ease: "easeOut" },
  },
};

const Header = () => {
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
            animate="visible"
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              repeatDelay: 1.2,
            }}
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
