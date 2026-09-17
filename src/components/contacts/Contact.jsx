import React, { useRef, useState, useEffect } from "react";
import "./Contact.css";
import { motion, AnimatePresence } from "motion/react";
import { MdOutlineEmail } from "react-icons/md";
import { AiOutlinePhone } from "react-icons/ai";
import { AiOutlineWhatsApp } from "react-icons/ai";

import emailjs from "emailjs-com";
import { trackEvent } from "../../utils/analytics";

const CONTACT_OPTIONS = [
  {
    id: "email",
    Icon: MdOutlineEmail,
    label: "Email",
    value: "govnorpayne@gmail.com",
    action: { href: "mailto:govnorpayne@gmail.com", text: "Send A Message" },
  },
  {
    id: "phone",
    Icon: AiOutlinePhone,
    label: "Phone",
    value: "512-876-5899",
  },
  {
    id: "whatsapp",
    Icon: AiOutlineWhatsApp,
    label: "WhatsApp",
    value: "512-876-5899",
    action: {
      href: "https://api.whatsapp.com/send?phone=15128765899",
      text: "Send A Message",
      target: "_blank",
    },
  },
];

const CAROUSEL_MS = 4 * 1000;

const FORM_FIELDS = [
  {
    element: "input",
    name: "name",
    type: "text",
    placeholder: "Your Full Name",
  },
  { element: "input", name: "email", type: "email", placeholder: "Your Email" },
  {
    element: "textarea",
    name: "message",
    rows: 7,
    placeholder: "Your Message",
  },
];

const FIELD_DRAW_DURATION = 1;
const FIELD_DRAW_GAP = 0.3;

const Contact = () => {
  const form = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % CONTACT_OPTIONS.length);
    }, CAROUSEL_MS);
    return () => clearInterval(timer);
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_w9c1bf5",
        "template_lc062vq",
        form.current,
        "AqIYHpELT_gRn9Lne",
      )
      .then(
        (result) => {
          console.log(result.text);
          trackEvent("contact_form_submit", { status: "success" });
        },
        (error) => {
          console.log(error.text);
          trackEvent("contact_form_submit", { status: "error" });
        },
      );
    e.target.reset();
  };

  const { Icon, label, value, action } = CONTACT_OPTIONS[activeIndex];

  return (
    <section id="contacts">
      <h5>Get In Touch</h5>
      <h2>Contact Me</h2>

      <div className="container contact_container">
        <div className="contact_options">
          <div className="contact_carousel">
            <AnimatePresence mode="wait">
              <motion.article
                key={label}
                className="contact_option"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Icon />
                <h4>{label}</h4>
                <h5>{value}</h5>
                {action && (
                  <a href={action.href} target={action.target}>
                    {action.text}
                  </a>
                )}
              </motion.article>
            </AnimatePresence>
          </div>
          <div className="contact_carousel-dots">
            {CONTACT_OPTIONS.map((opt, i) => (
              <button
                type="button"
                key={opt.id}
                className={`contact_dot ${i === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Show ${opt.label} contact info`}
              />
            ))}
          </div>
        </div>
        <div className="contact_form-wrapper">
          <form ref={form} onSubmit={sendEmail}>
            {FORM_FIELDS.map((field, i) => (
              <div className="contact_field" key={field.name}>
                <svg className="contact_field-outline" aria-hidden="true">
                  <motion.rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    rx="8"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: FIELD_DRAW_DURATION,
                      ease: "easeInOut",
                      delay: i * (FIELD_DRAW_DURATION + FIELD_DRAW_GAP),
                    }}
                  />
                </svg>
                {field.element === "textarea" ? (
                  <textarea
                    name={field.name}
                    rows={field.rows}
                    placeholder={field.placeholder}
                    required
                  ></textarea>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    required
                  />
                )}
              </div>
            ))}
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
export default Contact;
