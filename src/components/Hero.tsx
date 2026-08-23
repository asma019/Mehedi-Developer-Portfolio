import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { hero, profile } from "../data/content";
import { Magnetic } from "./ui";

/* Three.js is heavy — load the scene as its own chunk after first paint. */
const HeroScene = lazy(() => import("./three/HeroScene"));

const easeOut = [0.22, 1, 0.36, 1] as const;

const headlineParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};

const lineChild: Variants = {
  hidden: { opacity: 0, y: 44, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: easeOut },
  },
};

export default function Hero({ dark }: { dark: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(true);

  /* Pause the WebGL loop once the hero scrolls away */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.02,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="noise relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden pb-20 pt-32"
    >
      {/* Three.js scene */}
      <div className="absolute inset-0" aria-hidden>
        <Suspense fallback={null}>
          <HeroScene dark={dark} active={inView && !reduced} reduced={!!reduced} />
        </Suspense>
      </div>

      {/* vignette to melt the scene edges into the page (kept soft so the
          side logo badges stay clearly visible) */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_78%_64%_at_50%_44%,transparent_40%,var(--bg)_100%)]"
        aria-hidden
      />

      {/* faint ambient aurora */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: "var(--hero-glow-opacity)" }}
        aria-hidden
      >
        <div className="animate-drift absolute -top-24 left-[6%] h-[360px] w-[360px] rounded-full bg-accent/25 blur-[120px]" />
        <div
          className="animate-drift absolute right-[8%] top-[38%] h-[300px] w-[300px] rounded-full bg-accent-2/16 blur-[120px]"
          style={{ animationDelay: "-7s" }}
        />
      </div>

      {/* Center stage copy */}
      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 mx-auto w-full max-w-4xl px-5 text-center sm:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line-strong glass px-4 py-1.5"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#30d158] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#30d158]" />
          </span>
          <span className="text-[13px] font-medium text-muted">
            {profile.availability}
          </span>
        </motion.div>

        <motion.p
          variants={headlineParent}
          initial="hidden"
          animate="show"
          className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-2"
        >
          {hero.eyebrow}
        </motion.p>

        <motion.h1
          variants={headlineParent}
          initial="hidden"
          animate="show"
          className="mt-5 font-display text-[2.8rem] font-semibold leading-[1.03] tracking-tight text-ink sm:text-7xl lg:text-[5.1rem]"
        >
          <motion.span variants={lineChild} className="block drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
            {hero.headlineA}
          </motion.span>
          <motion.span variants={lineChild} className="text-gradient block">
            {hero.headlineB}
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: easeOut }}
          className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          {hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: easeOut }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <a
              href={hero.primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent via-accent-strong to-accent-2 px-8 py-4 text-[15px] font-semibold text-white shadow-[0_10px_40px_-8px_rgba(124,92,255,0.65)] transition-all duration-300 hover:shadow-[0_16px_54px_-6px_rgba(124,92,255,0.8)] active:scale-95"
            >
              {hero.primaryCta.label}
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={hero.secondaryCta.href}
              className="glass inline-flex items-center rounded-full border border-line-strong px-8 py-4 text-[15px] font-medium text-ink transition-all duration-300 hover:border-accent/50 hover:text-accent active:scale-95"
            >
              {hero.secondaryCta.label}
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-muted sm:block"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-line-strong p-1.5">
          <motion.span
            animate={{ y: [0, 13, 0], opacity: [1, 0.15, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-accent"
          />
        </div>
      </motion.a>
    </section>
  );
}
