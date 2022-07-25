import React from "react";
import "./Footer.css";
import { BsInstagram } from "react-icons/bs";

const Footer = () => {
  return (
    <footer>
      <a href="a" className="footer_logo">
        GPAYNE
      </a>

      <ul className="permalinks">
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#experience">Experience</a>
        </li>
        <li>
          <a href="#portfolio">Portfolio</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>

      <div className="footer_socials">
        <a href="https://instagram.com">
          <BsInstagram />
        </a>
      </div>
    </footer>
  );
};
export default Footer;
