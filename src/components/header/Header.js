import React from "react";
import "./Header.css";
import CTA from "./cta";

import HeaderSocials from "./HeaderSocials";

// Drop your video file in the `public/` folder as `header-video.mp4`
// (and optionally `header-poster.jpg` for the first-frame image).
const VIDEO_SRC = `${process.env.PUBLIC_URL}/header-video.mp4`;
const POSTER_SRC = `${process.env.PUBLIC_URL}/header-poster.jpg`;

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
          <CTA className="cta" />
          <HeaderSocials />
        </div>
      </div>
    </header>
  );
};
export default Header;
