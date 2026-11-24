import { STACK } from "../constants";
import SkillBalls from "./scene/SkillBalls";

const Stack = () => (
  <section className="sec" id="stack">
    <div className="shell">
      <p className="eyebrow">What I reach for</p>
      <h2>Stack.</h2>
      <SkillBalls />
      <dl className="stack">
        {STACK.map(({ title, items }) => (
          <div className="grp" key={title}>
            <dt>{title}</dt>
            <dd>{items}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

export default Stack;
