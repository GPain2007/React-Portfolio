import React from "react";
import "./Nav.css";
import { AiOutlineHome } from "react-icons/ai";
import { SiAboutdotme } from "react-icons/si";
import { MdContacts } from "react-icons/md";
import { BiBook } from "react-icons/bi";
import { RiServiceLine } from "react-icons/ri";
import { AiFillAudio } from "react-icons/ai";
import { useState } from "react";
import { trackEvent } from "../../utils/analytics";

const Nav = () => {
  const [activeNav, setActiveNav] = useState("#");

  const handleNavClick = (section) => {
    setActiveNav(section);
    trackEvent("nav_click", { section });
  };

  return (
    <nav>
      <a
        href="#"
        onClick={() => handleNavClick("#")}
        className={activeNav === "#" ? "active" : ""}
      >
        <AiOutlineHome />
      </a>
      <a
        href="#about"
        onClick={() => handleNavClick("#about")}
        className={activeNav === "#about" ? "active" : ""}
      >
        <SiAboutdotme />
      </a>
      <a
        href="#contacts"
        onClick={() => handleNavClick("#contacts")}
        className={activeNav === "#contacts" ? "active" : ""}
      >
        <MdContacts />
      </a>
      <a
        href="#experience"
        onClick={() => handleNavClick("#experience")}
        className={activeNav === "#experience" ? "active" : ""}
      >
        <BiBook />
      </a>
      <a
        href="#services"
        onClick={() => handleNavClick("#services")}
        className={activeNav === "#services" ? "active" : ""}
      >
        <RiServiceLine />
      </a>
      <a
        href="#testimonials"
        onClick={() => handleNavClick("#testimonials")}
        className={activeNav === "#testimonials" ? "active" : ""}
      >
        <AiFillAudio />
      </a>
    </nav>
  );
};
export default Nav;
