import { NAV } from "../constants";

const Header = () => (
  <nav className="nav">
    <div className="nav-in">
      <div className="brand">
        <i aria-hidden="true" />
        Andrei Popa <span>| Software &amp; AI Engineer</span>
      </div>
      <ul>
        {NAV.map(({ id, label }) => (
          <li key={id}>
            <a href={`#${id}`}>{label}</a>
          </li>
        ))}
      </ul>
    </div>
  </nav>
);

export default Header;
