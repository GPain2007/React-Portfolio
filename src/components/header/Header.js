import React from "react";
import "./Header.css";
import CTA from "./cta";
import ME from "../../assets/IMG_6280.jpeg";
import HeaderSocials from "./HeaderSocials";

const Header = () => {
  return (
    <header>
      <div className="container header">
        <h5>Hello I'm </h5>
        <h1>Govnor Payne</h1>
        <h5 className="text-light">Fullstack Developer </h5>
        <CTA />
        <HeaderSocials />

        <div className="me">
          <img src={ME} alt="" className="img" />
        </div>
        <a href="#contact" className="scroll_down">
          {" "}
          Scroll Down
        </a>
      </div>
    </header>
  );
};
export default Header;
