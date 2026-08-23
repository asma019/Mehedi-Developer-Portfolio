import { useCallback, useState } from "react";
import { MotionConfig } from "motion/react";
import FloatingMenu from "./components/FloatingMenu";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Writing from "./components/Writing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import { BackToTop, Cursor } from "./components/ui";

/** The site is a single page with hash navigation — any real pathname
 *  other than the root (or /index.html) is a 404. */
function isHomePath(pathname: string) {
  const p = pathname.replace(/\/+$/, "");
  return p === "" || p === "/" || p === "/index.html";
}

export default function App() {
  // Dark ("Obsidian") is the default; `.light` on <html> opts out.
  const [light, setLight] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("light"),
  );

  const [is404] = useState(
    () => typeof window !== "undefined" && !isHomePath(window.location.pathname),
  );

  const toggleTheme = useCallback(() => {
    setLight((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("light", next);
      try {
        localStorage.setItem("theme", next ? "light" : "dark");
      } catch {
        /* private mode */
      }
      return next;
    });
  }, []);

  if (is404) {
    return (
      <MotionConfig reducedMotion="user">
        <Cursor />
        <NotFound dark={!light} />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <Cursor />
      <div className="min-h-screen bg-bg font-sans text-ink">
        <FloatingMenu light={light} onToggleTheme={toggleTheme} />
        <main>
          <Hero dark={!light} />
          <Marquee />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Education />
          <Writing />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </MotionConfig>
  );
}
