import React from "react";
import "./Header.css";
import CV from "../../assets/Govnor_Payne_Software_Engineering_Resume.docx";

const CTA = () => {
  return (
    <div className="cta">
      <a href={CV} download className="btn">
        Resume
      </a>
    </div>
  );
};
export default CTA;
