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
            <h3>Full-Stack Development</h3>
          </div>

          <ul className="service_list">
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>Building scalable web applications with React and Node.js</p>
            </li>
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>
                Designing and maintaining back-end services and APIs with
                Python
              </p>
            </li>
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>
                Applying OOP, data structures, and algorithms to build
                efficient, maintainable systems
              </p>
            </li>
          </ul>
        </article>
        {/* END OF FULL-STACK DEVELOPMENT */}
        <article className="service">
          <div className="service_head">
            <h3>Cloud, DevOps &amp; QA</h3>
          </div>

          <ul className="service_list">
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>
                Deploying and troubleshooting applications on AWS and
                Microsoft Azure
              </p>
            </li>
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>
                Conducting root cause analysis to improve reliability and
                performance
              </p>
            </li>
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>
                Automated testing with Python and Selenium, plus Git-based
                version control
              </p>
            </li>
          </ul>
        </article>
        {/* END OF CLOUD, DEVOPS & QA */}
        <article className="service">
          <div className="service_head">
            <h3>AI-Enhanced Engineering</h3>
          </div>

          <ul className="service_list">
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>
                Leveraging tools like ChatGPT, Claude, Gemini, and Copilot to
                accelerate development and automate workflows
              </p>
            </li>
            <li>
              <AiOutlineCheck className="service_list-icon" />
              <p>
                Practicing responsible AI use and AI governance in applied
                technical environments
              </p>
            </li>
          </ul>
        </article>
        {/* END OF AI-ENHANCED ENGINEERING */}
      </div>
    </section>
  );
};
export default Services;
