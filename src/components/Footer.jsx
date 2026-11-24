const Footer = () => (
  <footer className="shell">
    <p>
      Built with React, Vite and three.js. One scene for the whole page instead of
      fifteen canvases: it pauses when the tab is hidden, and holds still when the
      system asks for reduced motion.
    </p>
    <p>
      © {new Date().getFullYear()} Andrei Popa —{" "}
      <a href="https://github.com/popi0052/Portofolio" target="_blank" rel="noreferrer">
        source on GitHub ↗
      </a>
    </p>
  </footer>
);

export default Footer;
