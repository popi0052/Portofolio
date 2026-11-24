import { useRef, useState } from "react";
import { CONTACT } from "../constants";

const Contact = () => {
  const addrRef = useRef(null);
  const [label, setLabel] = useState("Copy");

  // Clipboard access can be refused (permissions, insecure context). When it is,
  // select the address so the visitor can copy it themselves instead of failing
  // silently.
  const selectAddress = () => {
    const range = document.createRange();
    range.selectNodeContents(addrRef.current);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    setLabel("Select + copy");
    setTimeout(() => setLabel("Copy"), 2200);
  };

  const copy = () => {
    const done = () => {
      setLabel("Copied");
      setTimeout(() => setLabel("Copy"), 1600);
    };
    try {
      navigator.clipboard.writeText(CONTACT.email).then(done, selectAddress);
    } catch {
      selectAddress();
    }
  };

  return (
    <section className="sec" id="contact">
      <div className="shell">
        <p className="eyebrow">Get in touch</p>
        <h2>Contact.</h2>
        <div className="contact-card">
          <p style={{ margin: 0, color: "var(--secondary)" }}>{CONTACT.line}</p>
          <div className="mail">
            <code ref={addrRef}>{CONTACT.email}</code>
            <button className="copy" type="button" onClick={copy}>
              {label}
            </button>
          </div>
          <div className="social">
            {CONTACT.social.map(({ label: name, href }) => (
              <a href={href} key={href} target="_blank" rel="noreferrer">
                {name} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
