import HeroScene from "./components/scene/HeroScene";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Stack from "./components/Stack";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const App = () => (
  <>
    <HeroScene />
    <div className="layer">
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Stack />
        <Contact />
        <Footer />
      </main>
    </div>
  </>
);

export default App;
