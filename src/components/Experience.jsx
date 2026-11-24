import { JOBS } from "../constants";
import rich from "./rich";

const Experience = () => (
  <section className="sec" id="experience">
    <div className="shell">
      <p className="eyebrow">What I have done so far</p>
      <h2>Work experience.</h2>

      <div className="tl">
        {JOBS.map(({ role, company, when, bullets }) => (
          <article className="job" key={company}>
            <div className="job-head">
              <h3>{role}</h3>
              <span className="co">{company}</span>
              <span className="when">{when}</span>
            </div>
            <ul>
              {bullets.map((b) => (
                <li key={b}>{rich(b)}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Experience;
