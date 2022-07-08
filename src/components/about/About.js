import React from "react";
import "./About.css";
import ME from "../../assets/2.jpeg";
import { BsAward } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { VscFileSubmodule } from "react-icons/vsc";

const About = () => {
  return (
    <section id="about">
      <h5>Get To Know</h5>
      <h1>About Me</h1>

      <div className="container about_container">
        <div className="about_me">
          <div className="about_me-image">
            <img src={ME} alt="About ME" />
          </div>
        </div>
        <div className="about_content">
          <div className="about_cards">
            <article className="about_card">
              <BsAward className="about-icon" />
              <h5>Experience</h5>
              <small>1+ Years Working</small>
            </article>

            <article className="about_card">
              <FiUsers className="about-icon" />
              <h5>Clients</h5>
              <small>50+ Worldwide</small>
            </article>

            <article className="about_card">
              <VscFileSubmodule className="about-icon" />
              <h5>Projects</h5>
              <small>10+ completed</small>
            </article>
          </div>
          <p> Hello this is my paragraph</p>
          <a href="#contact" className="btn btn-primary">
            Let's Talk
          </a>
        </div>
      </div>
    </section>
  );
};
export default About;
