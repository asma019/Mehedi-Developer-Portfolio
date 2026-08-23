import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowLeft, Compass } from "lucide-react";
import { Magnetic } from "./ui";

/* Three.js is heavy — load the scene as its own chunk after first paint. */
const HeroScene = lazy(() => import("./three/HeroScene"));

const easeOut = [0.22, 1, 0.36, 1] as const;

const parent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const child: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: easeOut },
  },
};

export default function NotFound({ dark }: { dark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.02,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="noise relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-bg px-5"
    >
      {/* Three.js wave scene — same engine as the hero, logos off */}
      <div className="absolute inset-0" aria-hidden>
        <Suspense fallback={null}>
          <HeroScene dark={dark} active={inView && !reduced} reduced={!!reduced} logos={false} />
        </Suspense>
      </div>

      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_62%_at_50%_44%,transparent_30%,var(--bg)_100%)]"
        aria-hidden
      />

      {/* ambient aurora */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: "var(--hero-glow-opacity)" }}
        aria-hidden
      >
        <div className="animate-drift absolute -top-24 left-[18%] h-[340px] w-[340px] rounded-full bg-accent/25 blur-[120px]" />
        <div
          className="animate-drift absolute right-[16%] top-[40%] h-[300px] w-[300px] rounded-full bg-accent-2/16 blur-[120px]"
          style={{ animationDelay: "-7s" }}
        />
      </div>

      <motion.div
        variants={parent}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <motion.p
          variants={child}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-2"
        >
          Error 404 · Page not found
        </motion.p>

        <motion.h1
          variants={child}
          className="text-gradient mt-4 select-none font-display text-[6rem] font-bold leading-none tracking-tight sm:text-[10rem]"
        >
          404
        </motion.h1>

        <motion.h2
          variants={child}
          className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          This page drifted off the wave.
        </motion.h2>

        <motion.p
          variants={child}
          className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg"
        >
          The link may be broken, or the page may have moved. The particles
          are still here though — and so is the rest of the site.
        </motion.p>

        <motion.div
          variants={child}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <a
              href="/"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent via-accent-strong to-accent-2 px-8 py-4 text-[15px] font-semibold text-white shadow-[0_10px_40px_-8px_rgba(124,92,255,0.65)] transition-all duration-300 hover:shadow-[0_16px_54px_-6px_rgba(124,92,255,0.8)] active:scale-95"
            >
              <ArrowLeft
                size={17}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              Back home
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="/#projects"
              className="glass inline-flex items-center gap-2 rounded-full border border-line-strong px-8 py-4 text-[15px] font-medium text-ink transition-all duration-300 hover:border-accent/50 hover:text-accent active:scale-95"
            >
              <Compass size={16} />
              View my work
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>
    </div>
  );
}
