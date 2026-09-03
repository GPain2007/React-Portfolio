import React from "react";
import "./Portfolio.css";
import IMG1 from "../../assets/IMG1.png";
import { AiFillGithub } from "react-icons/ai";

const Portfolio = () => {
  const data = [
    {
      id: 1,
      image: IMG1,
      title: "Musicology",
      description:
        "A networking platform that connects musicians to collaborate, share work, and manage bookings.",
      github: "https://github.com/GPain2007/musician-networking-app",
      demo: "https://musicology-umekev.herokuapp.com/",
    },
    {
      id: 2,
      image: null,
      title: "PerfCompare (Mozilla)",
      description:
        "Debugged and stabilized this open-source Firefox performance-comparison tool, fixing front-end and back-end issues with React, React Native, and Material UI.",
      github: "https://github.com/mozilla/perfcompare",
      demo: null,
    },
    {
      id: 3,
      image: null,
      title: "FoxPuppet (Mozilla)",
      description:
        "Improved reliability of this Python/Selenium browser automation framework through root-cause debugging and optimized wait and error handling.",
      github: "https://github.com/mozilla/FoxPuppet",
      demo: null,
    },
  ];
  return (
    <section id="portfolio">
      <h5>My Recent Work</h5>
      <h2>Portfolio</h2>

      <div className="container portfolio_container">
        {data.map(({ id, image, title, description, github, demo }) => {
          return (
            <article key={id} className="portfolio_item">
              <div className="portfolio_item-image">
                {image ? (
                  <img src={image} alt={title} />
                ) : (
                  <div className="portfolio_item-placeholder">
                    <AiFillGithub />
                  </div>
                )}
              </div>
              <h3>{title}</h3>
              <p className="portfolio_item-desc">{description}</p>
              <div className="portfolio_item-cta">
                <a href={github} className="btn" target={"_blank"} rel="noreferrer">
                  Github
                </a>
                {demo && (
                  <a
                    href={demo}
                    className="btn btn-primary"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
export default Portfolio;
