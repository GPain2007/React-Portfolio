import React from "react";
import "./Portfolio.css";
import IMG1 from "../../assets/IMG1.png";

const Portfolio = () => {
  const data = [
    {
      id: 1,
      image: IMG1,
      title: "Musicology",
      github: "https://github.com/GPain2007/musician-networking-app",
      demo: "https://musicology-umekev.herokuapp.com/",
    },
  ];
  return (
    <section id="portfolio">
      <h5>My Recent Work</h5>
      <h2>Portfolio</h2>

      <div className="container portfolio_container">
        {data.map(({ id, image, title, github, demo }) => {
          return (
            <article key={id} className="portfolio_item">
              <div className="portfolio_item-image"></div>
              <h3>Portfolio Title</h3>
              <img src={image} alt={title} />
              <div className="portfolio_item-cta">
                <a href={github} className="btn" target={"_blank"}>
                  Github
                </a>
                <a href={demo} className="btn btn-primary" target={"_blank"}>
                  Live Demo
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
export default Portfolio;
