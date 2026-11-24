import { PROJECTS } from "../constants";
import rich from "./rich";

const Projects = () => (
  <section className="sec" id="work">
    <div className="shell">
      <p className="eyebrow">What I have built</p>
      <h2>Projects.</h2>
      <p className="intro">
        Two things I built end to end, each picked for a decision I had to defend.
      </p>

      <div className="grid">
        {PROJECTS.map(({ name, what, decision, tags, links, note }) => (
          <article className="proj" key={name}>
            <h3>{name}</h3>
            <p className="what">{what}</p>
            <p className="why">
              <b>The decision</b>
              {rich(decision)}
            </p>
            <ul className="tags">
              {tags.map(({ label, tone }) => (
                <li className={tone} key={label}>
                  {label}
                </li>
              ))}
            </ul>
            <div className="go">
              {links.map(({ label, href }) => (
                <a href={href} key={href} target="_blank" rel="noreferrer">
                  {label} ↗
                </a>
              ))}
              {note && <span>{note}</span>}
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
