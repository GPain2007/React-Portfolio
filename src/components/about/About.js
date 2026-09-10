import React, { useState, useEffect, useMemo } from "react";
import "./About.css";

const PARAGRAPH =
  "My name is Govnor Payne. I am a Software Engineer. I went from fixing Chiller and HVAC systems to building complex React applications using modern web technologies. I have contributed to various projects and continuously strive to improve my skills. The evolution of my career has been both challenging and rewarding. Come see what I can do.";

const INTACT_MS = 8 * 1000; // stay together for 8 seconds
const BROKEN_MS = 4 * 1000; // stay broken apart for 4 seconds

const About = () => {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    let reformTimer;
    const breakTimer = setInterval(() => {
      setBroken(true);
      reformTimer = setTimeout(() => setBroken(false), BROKEN_MS);
    }, INTACT_MS + BROKEN_MS);

    return () => {
      clearInterval(breakTimer);
      clearTimeout(reformTimer);
    };
  }, []);

  // Precompute a random scatter vector for each word so it stays stable across renders.
  const words = useMemo(
    () =>
      PARAGRAPH.split(" ").map((word) => ({
        word,
        dx: (Math.random() - 0.5) * 700,
        dy: (Math.random() - 0.5) * 450,
        rot: (Math.random() - 0.5) * 220,
      })),
    [],
  );

  return (
    <section id="about">
      <div className="container about_container">
        <div className="about_content">
          <p className={`about_paragraph ${broken ? "is-broken" : ""}`}>
            {words.map((w, i) => (
              <span
                key={i}
                className="about_word"
                style={
                  broken
                    ? {
                        transform: `translate(${w.dx}px, ${w.dy}px) rotate(${w.rot}deg)`,
                        opacity: 0,
                        transitionDelay: `${i * 0.02}s`,
                      }
                    : { transitionDelay: `${i * 0.02}s` }
                }
              >
                {w.word}{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};
export default About;
