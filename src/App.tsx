import { useCallback, useEffect, useRef, useState } from "react";
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
import CaseStudy from "./components/CaseStudy";
import BlogPost from "./components/PostView";
import Blog from "./components/Blog";
import { BackToTop, Cursor } from "./components/ui";
import { getCase } from "./data/cases";
import { getPost } from "./data/posts";
import { SITE } from "./data/site";

/** The site is a single page with hash navigation - any real pathname
 *  other than the root, /index.html or /blog is a 404. (/blog is served
 *  as a static index file at build, see vite.config.ts.) */
function isBlogPath(pathname: string) {
  return pathname.replace(/\/+$/, "").toLowerCase() === "/blog";
}

function isHomePath(pathname: string) {
  const p = pathname.replace(/\/+$/, "");
  return p === "" || p === "/" || p === "/index.html";
}

type Route =
  | { view: "case"; slug: string }
  | { view: "post"; slug: string }
  | { view: "blog" }
  | { view: "home"; hash: string };

/** #/case/<slug> and #/blog/<slug> are content views, #/blog is the blog
 *  index. The real /blog path (or #/blog from anywhere) opens the index.
 *  Any other hash (#contact, empty) is an in-page anchor on the home page. */
function parseHash(): Route {
  const raw = typeof window !== "undefined" ? window.location.hash : "";
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const m = raw.match(/^#\/(case|blog)\/([A-Za-z0-9-]+)/);
  if (m) return m[1] === "case" ? { view: "case", slug: m[2] } : { view: "post", slug: m[2] };
  if (raw === "#/blog" || isBlogPath(path)) return { view: "blog" };
  return { view: "home", hash: raw };
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

  const [route, setRoute] = useState<Route>(parseHash);
  const prevView = useRef(parseHash().view);

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

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  /* Content views: scroll to top and retitle. Returning home with a
     section hash (e.g. from "All work" → #projects) scrolls to that
     section after the home view has re-mounted. */
  useEffect(() => {
    const wasView = prevView.current !== "home";
    if (route.view === "home") {
      if (wasView && route.hash) {
        const id = route.hash.slice(1);
        requestAnimationFrame(() =>
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
        );
      }
      document.title = SITE.title;
    } else if (route.view === "blog") {
      window.scrollTo({ top: 0 });
      document.title = `Blog - ${SITE.name}`;
    } else {
      window.scrollTo({ top: 0 });
      const label =
        route.view === "case"
          ? getCase(route.slug)?.title
          : getPost(route.slug)?.title;
      if (label) document.title = `${label} - ${SITE.name}`;
      else document.title = "Not found - Mehedi Hasan";
    }
    prevView.current = route.view;
  }, [route]);

  if (is404) {
    return (
      <MotionConfig reducedMotion="user">
        <Cursor />
        <NotFound dark={!light} />
      </MotionConfig>
    );
  }

  let body: React.ReactNode;
  if (route.view === "case") {
    const data = getCase(route.slug);
    body = data ? (
      <CaseStudy data={data} />
    ) : (
      <NotFound dark={!light} />
    );
  } else if (route.view === "blog") {
    body = <Blog />;
  } else if (route.view === "post") {
    const post = getPost(route.slug);
    body = post ? <BlogPost post={post} /> : <NotFound dark={!light} />;
  } else {
    body = (
      <>
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
      </>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <Cursor />
      <div className="min-h-screen bg-bg font-sans text-ink">
        <FloatingMenu light={light} onToggleTheme={toggleTheme} />
        {body}
        {route.view !== "home" && <Footer />}
      </div>
    </MotionConfig>
  );
}
