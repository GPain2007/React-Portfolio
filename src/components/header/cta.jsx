import React from "react";
import "./Header.css";
import CV from "../../assets/Govnor_Payne_Software_Engineering_Resume.pdf";

const CTA = () => {
  return (
    <div className="cta">
      <a href={CV} target="_blank" rel="noopener noreferrer" className="btn">
        Resume
      </a>
    </div>
  );
};
export default CTA;
