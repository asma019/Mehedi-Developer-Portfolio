import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, MoveHorizontal, Rocket } from "lucide-react";
import { experience } from "../data/content";
import { SectionShell, SectionHeading, Reveal } from "./ui";

const GAP = 24;

/* Real brand logos when available — falls back to the monogram medallion.
   Drop new files into public/logos/ and add them here. */
const roleLogos: Record<string, string> = {
  "Zorn Ventures Limited": "/logos/zorn-ventures.png",
  "TechZ IT": "/logos/techzit.png",
  "Independent · Upwork & Fiverr": "/logos/upwork.svg",
};

/* Per-role identity: monogram, accent glow */
const roles = experience.items.map((job, i) => ({
  ...job,
  monogram: ["ZV", "TZ", "IN"][i] ?? "•",
  accent: ["#7c5cff", "#22d3ee", "#34d399"][i] ?? "#7c5cff",
}));

function RoleCard({ job }: { job: (typeof roles)[number] }) {
  const logo = roleLogos[job.company];
  return (
    <div className="card card-hover relative flex h-full w-[85vw] shrink-0 select-none flex-col overflow-hidden rounded-[2rem] p-8 sm:w-[30rem] sm:p-9">
      {/* accent glow + ghost numeral */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-[70px]"
        style={{ backgroundColor: `${job.accent}26` }}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-6 right-4 select-none font-display text-[6.5rem] font-bold leading-none text-ink opacity-[0.05]"
        aria-hidden
      >
        {roles.indexOf(job) + 1}
      </span>

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          {logo ? (
            <img
              src={logo}
              alt={`${job.company} logo`}
              className="h-12 w-12 rounded-2xl object-cover ring-1 ring-white/10"
              style={{ boxShadow: `0 8px 26px ${job.accent}40` }}
            />
          ) : (
            <span
              className="grid h-12 w-12 place-items-center rounded-2xl font-display text-sm font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${job.accent}, ${job.accent}99)`,
                boxShadow: `0 8px 26px ${job.accent}40`,
              }}
            >
              {job.monogram}
            </span>
          )}
          <div>
            <p className="font-display text-[15px] font-semibold tracking-tight text-ink">
              {job.company}
            </p>
            <p className="text-[13px]" style={{ color: job.accent }}>
              {job.role}
            </p>
          </div>
        </div>
        {job.current && (
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[11px] font-medium text-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute h-full w-full animate-ping rounded-full opacity-70"
                style={{ backgroundColor: job.accent }}
              />
              <span
                className="relative h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: job.accent }}
              />
            </span>
            Current
          </span>
        )}
      </div>

      <span
        className="mt-6 h-px w-full"
        style={{
          background: `linear-gradient(to right, ${job.accent}55, transparent 70%)`,
        }}
        aria-hidden
      />

      <p className="relative mt-5 text-[14.5px] font-medium uppercase tracking-[0.14em] text-muted">
        {job.period}
      </p>
      <p className="relative mt-3 text-[15px] leading-relaxed text-muted">{job.summary}</p>

      <ul className="relative mt-4 space-y-2.5">
        {job.points.map((point) => (
          <li key={point} className="flex gap-3 text-[15px] text-muted">
            <span
              className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: job.accent }}
            />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CtaCard() {
  return (
    <div className="relative flex h-full w-[85vw] shrink-0 select-none flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent via-accent-strong to-accent-2 p-[1.5px] sm:w-[30rem]">
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 rounded-[calc(2rem-1.5px)] bg-surface px-9 py-12 text-center">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-accent/20 blur-[80px]"
          aria-hidden
        />
        <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white shadow-[0_10px_32px_rgba(124,92,255,0.5)]">
          <Rocket size={24} />
        </span>
        <h3 className="relative font-display text-2xl font-semibold tracking-tight text-ink">
          Your project could
          <span className="text-gradient block">be next.</span>
        </h3>
        <p className="relative max-w-xs text-[15px] leading-relaxed text-muted">
          Fast WordPress builds, full-stack apps, VPS tuning — delivered with
          clear scope and careful handoff.
        </p>
        <a
          href="#contact"
          className="relative mt-1 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-7 py-3 text-[14.5px] font-semibold text-white shadow-[0_10px_32px_-6px_rgba(124,92,255,0.6)] transition-all duration-300 hover:shadow-[0_14px_44px_-6px_rgba(124,92,255,0.8)] active:scale-95"
        >
          Start a project
          <ArrowRight size={15} />
        </a>
      </div>
    </div>
  );
}

export default function Experience() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const [step, setStep] = useState(1);
  const [maxX, setMaxX] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [index, setIndex] = useState(0);

  const progress = useTransform(x, (v) =>
    maxX > 0 ? Math.min(1, Math.max(0, -v / maxX)) : 0,
  );

  /* Measure card step + travel range (also on resize) */
  useEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      const track = trackRef.current;
      const first = track?.children[0] as HTMLElement | undefined;
      if (!wrap || !track || !first) return;
      const s = first.offsetWidth + GAP;
      const range = Math.max(0, track.scrollWidth - wrap.clientWidth);
      setStep(s);
      setMaxX(range);
      setMaxIndex(Math.round(range / s));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* Live index while dragging (for dots) */
  useEffect(() => {
    return x.on("change", (v) => {
      setIndex((prev) => {
        const next = Math.max(0, Math.min(maxIndex, Math.round(-v / step)));
        return next === prev ? prev : next;
      });
    });
  }, [x, step, maxIndex]);

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(maxIndex, i));
      setIndex(clamped);
      const target = Math.min(clamped * step, maxX);
      animate(x, -target, { type: "spring", stiffness: 240, damping: 30 });
    },
    [maxIndex, step, maxX, x],
  );

  return (
    <SectionShell id="experience" alternate tone="cyan">
      <SectionHeading eyebrow={experience.eyebrow} title={experience.title} />

      <Reveal delay={0.1}>
        <div className="relative mx-auto mt-14 max-w-6xl">
          {/* drag hint */}
          <p className="mb-5 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            <MoveHorizontal size={14} className="text-accent" />
            Drag to explore
          </p>

          {/* carousel */}
          <div
            ref={wrapRef}
            className="cursor-grab overflow-hidden pb-2 active:cursor-grabbing"
            role="region"
            aria-roledescription="carousel"
            aria-label="Career history"
          >
            <motion.div
              ref={trackRef}
              style={{ x }}
              drag="x"
              dragConstraints={{ left: -maxX, right: 0 }}
              dragElastic={0.08}
              onDragEnd={() => goTo(Math.round(-x.get() / step))}
              className="flex gap-6"
            >
              {roles.map((job) => (
                <RoleCard key={job.company} job={job} />
              ))}
              <CtaCard />
            </motion.div>
          </div>

          {/* controls */}
          <div className="mt-7 flex items-center justify-between gap-6">
            <div className="flex gap-2.5">
              <button
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                aria-label="Previous"
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink transition-all duration-300 hover:border-accent/50 hover:text-accent active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowLeft size={17} />
              </button>
              <button
                onClick={() => goTo(index + 1)}
                disabled={index === maxIndex}
                aria-label="Next"
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink transition-all duration-300 hover:border-accent/50 hover:text-accent active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowRight size={17} />
              </button>
            </div>

            {/* progress */}
            <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-line">
              <motion.div
                style={{ scaleX: progress }}
                className="h-full w-full origin-left rounded-full bg-gradient-to-r from-accent via-accent-strong to-accent-2"
              />
            </div>

            {/* dots */}
            <div className="flex shrink-0 gap-2">
              {Array.from({ length: maxIndex + 1 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-6 bg-gradient-to-r from-accent to-accent-2"
                      : "w-2 bg-line-strong hover:bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
