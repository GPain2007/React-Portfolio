import React, { useRef } from "react";
import "./Contact.css";
import { MdOutlineEmail } from "react-icons/md";
import { AiOutlinePhone } from "react-icons/ai";
import { AiOutlineWhatsApp } from "react-icons/ai";

import emailjs from "emailjs-com";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_w9c1bf5",
        "template_lc062vq",
        form.current,
        "AqIYHpELT_gRn9Lne"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    e.target.reset();
  };
  return (
    <section id="contacts">
      <h5>Get In Touch</h5>
      <h2>Contact Me</h2>

      <div className="container contact_container">
        <div className="contact_options">
          <article className="contact_option">
            <MdOutlineEmail />
            <h4> Email</h4>
            <h5>govnorpayne@gmail.com</h5>
            <a href="mailto:govnorpayne@gmail.com">Send A Message</a>
          </article>
          <article className="contact_option">
            <AiOutlinePhone />
            <h4>Phone</h4>
            <h5>512-876-5899</h5>
          </article>
          <article className="contact_option">
            <AiOutlineWhatsApp />
            <h4>Phone</h4>
            <h5>512-876-5899</h5>
            <a
              href="https://api.whatsapp.com/send?phone=15128765899"
              target={"_blank"}
            >
              Send A Message
            </a>
          </article>
        </div>
        <form ref={form} onSubmit={sendEmail}>
          <input
            type={"text"}
            name="name"
            placeholder="Your Full Name"
            required
          />
          <input
            type={"email"}
            name="email"
            placeholder="Your Email"
            required
          />
          <textarea
            name="message"
            rows={"7"}
            placeholder="Your Message"
            required
          ></textarea>
          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};
export default Contact;
