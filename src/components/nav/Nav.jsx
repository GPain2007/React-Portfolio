import React, { useState } from "react";
import "./Nav.css";
import { AiOutlineHome } from "react-icons/ai";
import { SiAboutdotme } from "react-icons/si";
import { MdContacts } from "react-icons/md";
import { BiBook } from "react-icons/bi";
import { RiServiceLine } from "react-icons/ri";
import { FaFolderOpen } from "react-icons/fa";
import { trackEvent } from "../../utils/analytics";

// In page order. Every `href` (other than "#") must match a section id on the
// page; Nav.test.js checks this so a link can't point at a removed section.
export const NAV_LINKS = [
  { href: "#", label: "Home", Icon: AiOutlineHome },
  { href: "#about", label: "About", Icon: SiAboutdotme },
  { href: "#experience", label: "Experience", Icon: BiBook },
  { href: "#services", label: "Services", Icon: RiServiceLine },
  { href: "#portfolio", label: "Portfolio", Icon: FaFolderOpen },
  { href: "#contacts", label: "Contact", Icon: MdContacts },
];

const Nav = () => {
  const [activeNav, setActiveNav] = useState("#");

  const handleNavClick = (section) => {
    setActiveNav(section);
    trackEvent("nav_click", { section });
  };

  return (
    <nav aria-label="Sections">
      {NAV_LINKS.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          aria-label={label}
          title={label}
          onClick={() => handleNavClick(href)}
          className={activeNav === href ? "active" : ""}
        >
          <Icon aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
};
export default Nav;
