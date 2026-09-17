import React from "react";
import { BsLinkedin } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { GrFacebook } from "react-icons/gr";

const HeaderSocials = () => {
  return (
    <div className="header_socials">
      <a href="https://www.linkedin.com/in/bernardpaynejr/" target="_blank">
        <BsLinkedin />
      </a>
      <a href="https://github.com/GPain2007" target="_blank">
        <FaGithub />
      </a>
      <a href="https://facebook.com" target="_blank">
        <GrFacebook />
      </a>
    </div>
  );
};

export default HeaderSocials;
