import { ABOUT } from "../constants";

const About = () => (
  <section className="sec" id="about">
    <div className="shell">
      <p className="eyebrow">Introduction</p>
      <h2>Overview.</h2>
      <p className="intro">{ABOUT}</p>
    </div>
  </section>
);

export default About;
