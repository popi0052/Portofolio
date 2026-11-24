import { HERO } from "../constants";
import rich from "./rich";

const Hero = () => (
  <section className="shell hero">
    <div className="rail">
      <span className="bead" aria-hidden="true" />
      <span className="stem" aria-hidden="true" />
    </div>
    <div>
      <h1>
        Hey! I&apos;m <b>{HERO.name}</b>
      </h1>
      <p className="tagline">{HERO.tagline}</p>
      <p className="blurb">{rich(HERO.blurb)}</p>
      <ul className="stats">
        {HERO.stats.map(({ value, note }) => (
          <li key={value}>
            <strong>{value}</strong>
            <small>{note}</small>
          </li>
        ))}
      </ul>
      <div className="cta">
        <a className="btn btn-main" href="#work">
          See the work
        </a>
        <a className="btn btn-ghost" href="#contact">
          Get in touch
        </a>
      </div>
    </div>
  </section>
);

export default Hero;
