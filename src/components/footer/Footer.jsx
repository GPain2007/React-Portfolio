import React, { useState } from "react";
import "./Footer.css";
import { BsInstagram } from "react-icons/bs";
import { FaWalking } from "react-icons/fa";

const links = [
  { href: "#", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#contacts", label: "Contact" },
];

const Footer = () => {
  const [activeLink, setActiveLink] = useState("#");

  return (
    <footer>
      <p className="footer_tagline">Your hiring journey ends here</p>

      <ul className="permalinks">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={activeLink === link.href ? "active" : ""}
              onClick={() => setActiveLink(link.href)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="footer_socials">
        <a href="https://instagram.com">
          <BsInstagram />
        </a>
      </div>

      <div className="footer_bottom">
        <span className="footer_figure footer_figure-left" aria-hidden="true">
          <FaWalking />
        </span>
        <small className="footer_copyright">
          GPayne &copy; 2024. All rights reserved.
        </small>
        <span className="footer_figure footer_figure-right" aria-hidden="true">
          <FaWalking />
        </span>
      </div>
    </footer>
  );
};
export default Footer;
