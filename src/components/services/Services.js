import React from "react";
import "./Services.css";

import { AiOutlineCheck } from "react-icons/ai";

const Services = () => {
  return (
    <section id="services">
      <h5>What I Offer</h5>
      <h2>Services</h2>

      <div className="container services_container">
        <article className="service">
          <div className="service_head">
            <h3>UI/UX Design</h3>
          </div>

          <ul className="service_list">
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>
                Using CSS and Bootstrap to create wonderfully dynamic designed
                applications{" "}
              </p>
            </li>
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>Using anywhere from HTML to React to desgin your website </p>
            </li>
          </ul>
        </article>
        {/* END OF UI/UX */}
        <article className="service">
          <div className="service_head">
            <h3>Web Development</h3>
          </div>

          <ul className="service_list">
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>Building with React to build web pages.</p>
            </li>
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>Development through OOP</p>
            </li>
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>Development through TDD</p>
            </li>
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>Using CRUD and MERN best development practices</p>
            </li>
          </ul>
        </article>
        {/* END OF UI/UX */}
        <article className="service">
          <div className="service_head">
            <h3>Content Creation</h3>
          </div>

          <ul className="service_list">
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>Creating your websites and apps for current consumers</p>
            </li>
          </ul>
        </article>
        {/* END OF UI/UX */}
      </div>
    </section>
  );
};
export default Services;
