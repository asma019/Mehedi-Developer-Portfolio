import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  type Variants,
} from "motion/react";
import { ArrowUp } from "lucide-react";

const easeOut = [0.22, 1, 0.36, 1] as const;

/* ── Scroll reveal ─────────────────────────────────────────── */

/** Soft blur + rise entrance, triggered once when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.8, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: easeOut },
  },
};

/* ── Section scaffolding ───────────────────────────────────── */

export function SectionShell({
  id,
  alternate = false,
  tone = "violet",
  grid = false,
  children,
  className = "",
}: {
  id: string;
  alternate?: boolean;
  tone?: "violet" | "cyan";
  grid?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const orbA = tone === "cyan" ? "bg-accent-2/10" : "bg-accent/10";
  const orbB = tone === "cyan" ? "bg-accent/8" : "bg-accent-2/8";
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 py-24 sm:py-32 ${alternate ? "bg-alt" : "bg-bg"} ${className}`}
    >
      {/* ambient depth: aurora orbs (+ optional dot grid) — clipped so the
          negative-offset orbs never push the page wider on mobile */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className={`absolute -top-36 h-[440px] w-[440px] rounded-full ${orbA} blur-[130px] ${
            alternate ? "right-[-12%]" : "left-[-12%]"
          }`}
        />
        <div
          className={`absolute -bottom-48 h-[400px] w-[400px] rounded-full ${orbB} blur-[130px] ${
            alternate ? "left-[-10%]" : "right-[-10%]"
          }`}
        />
        {grid && (
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(var(--line-strong)_1px,transparent_1px)] [background-size:30px_30px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black_15%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black_15%,transparent_75%)]" />
        )}
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignCls}`}>
      <Reveal>
        <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/25 bg-accent-soft px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2.8rem] sm:leading-[1.06]">
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.16}>
          <p className="mt-4 text-lg leading-relaxed text-muted">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ── Screenshot cover with graceful gradient fallback ──────── */

export function ShotCover({
  shot,
  gradient,
  icon,
  className = "",
  children,
}: {
  shot?: string;
  gradient: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const showShot = !!shot && !failed;

  return (
    <div
      className={`relative overflow-hidden ${showShot ? "" : `bg-gradient-to-br ${gradient}`} ${className}`}
    >
      {showShot ? (
        <>
          <img
            src={shot}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          {/* legibility tint + brand texture */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/5" />
          <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:26px_26px]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.28),transparent_55%)]" />
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:26px_26px]" />
          {icon && <div className="absolute inset-0 grid place-items-center">{icon}</div>}
        </>
      )}
      {children}
    </div>
  );
}

/* ── Spotlight cards (cursor-following radial glow) ────────── */

export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const onMouseMove = (e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return { ref, onMouseMove };
}

export function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  return (
    <div ref={ref} onMouseMove={onMouseMove} className={`spotlight card ${className}`}>
      {children}
    </div>
  );
}

/* ── Magnetic hover wrapper (elements lean toward the cursor) ─ */

export function Magnetic({
  children,
  strength = 0.32,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.25 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className={className}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Cursor accent ring (fine pointers only) ─────────────────
   The user's native cursor is never hidden — a soft ring simply
   trails it and expands over interactive elements. */

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as Element | null;
      setHovering(!!target?.closest("a, button, [data-cursor]"));
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  /* trailing accent ring — complements the native cursor */
  return (
    <motion.div
      style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
      className="pointer-events-none fixed left-0 top-0 z-[99]"
    >
      <motion.div
        animate={{ scale: hovering ? 1.9 : 1 }}
        transition={{ duration: 0.25, ease: easeOut }}
        className="-translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`h-8 w-8 rounded-full border transition-colors duration-200 ${
            hovering ? "border-accent/70" : "border-line-strong"
          }`}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── Floating back-to-top bubble ───────────────────────────── */

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 18, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.9 }}
          transition={{ duration: 0.35, ease: easeOut }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="glass-strong fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-line-strong text-ink shadow-[0_10px_36px_rgba(0,0,0,0.35)] transition-colors duration-300 hover:border-accent/60 hover:text-accent"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
