import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "motion/react";
import { MapPin, Mail, Briefcase, CalendarClock } from "lucide-react";
import { about, profile } from "../data/content";
import { Reveal, SectionShell, SectionHeading, staggerParent, staggerChild } from "./ui";

const factIcons = [MapPin, Briefcase, CalendarClock, Mail];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

function Portrait() {
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <div className="relative mx-auto w-fit rotate-2 transition-transform duration-700 ease-out hover:rotate-0">
      {/* rotating dashed ring */}
      <div
        className="absolute -inset-7 animate-spin rounded-full border border-dashed border-accent/30 [animation-duration:26s]"
        aria-hidden
      />
      {/* gradient hairline frame */}
      <div className="relative rounded-[2rem] bg-gradient-to-br from-accent via-accent-strong to-accent-2 p-[1.5px] shadow-[0_20px_60px_-12px_rgba(124,92,255,0.35)]">
        <div className="relative aspect-[4/5] w-[16rem] overflow-hidden rounded-[calc(2rem-1.5px)] bg-gradient-to-br from-accent via-[#4a6cf7] to-accent-2 sm:w-[18rem]">
          {photoOk ? (
            <img
              src={profile.photo}
              alt={profile.name}
              onError={() => setPhotoOk(false)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <span className="select-none font-display text-[6.5rem] font-bold tracking-tight text-white/90">
                {profile.initials}
              </span>
            </div>
          )}

          {/* bottom glass info bar */}
          <div className="absolute inset-x-3 bottom-3">
            <div className="glass flex items-center justify-between rounded-2xl border border-white/25 px-4 py-3">
              <div>
                <p className="text-[15px] font-semibold leading-tight text-white">
                  {profile.name}
                </p>
                <p className="text-xs text-white/75">{profile.role}</p>
              </div>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#30d158] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#30d158]" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* halo */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[90px]" />
    </div>
  );
}

export default function About() {
  return (
    <SectionShell id="about" tone="cyan">
      <SectionHeading eyebrow={about.eyebrow} title={about.title} align="left" />

      <div className="mt-14 grid items-start gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
        <div>
          {/* editorial lead */}
          <Reveal delay={0.1}>
            <p className="mb-6 text-xl font-medium leading-relaxed tracking-tight text-ink sm:text-2xl">
              {about.paragraphs[0]}
            </p>
          </Reveal>
          {about.paragraphs.slice(1).map((p, i) => (
            <Reveal key={i} delay={0.16 + i * 0.08}>
              <p className="mb-5 text-lg leading-relaxed text-muted">{p}</p>
            </Reveal>
          ))}

          {/* facts — hairline definition list, no cards */}
          <motion.ul
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-10 divide-y divide-line border-y border-line"
          >
            {about.facts.map((fact, i) => {
              const Icon = factIcons[i % factIcons.length];
              return (
                <motion.li
                  key={fact.label}
                  variants={staggerChild}
                  className="group flex items-start gap-4 py-4 sm:items-center"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-accent transition-all duration-300 group-hover:border-accent/40 group-hover:bg-accent-soft">
                    <Icon size={16} />
                  </span>
                  {/* mobile: label above value · sm+: single row with fixed label column */}
                  <span className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-4">
                    <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted sm:w-32 sm:shrink-0">
                      {fact.label}
                    </span>
                    <span className="mt-1 block text-[15px] font-medium leading-snug text-ink sm:mt-0 sm:min-w-0 sm:flex-1 sm:truncate">
                      {fact.value}
                    </span>
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>

        {/* Portrait */}
        <Reveal delay={0.2} className="lg:sticky lg:top-32">
          <Portrait />
        </Reveal>
      </div>

      {/* stats — single divided strip */}
      <Reveal delay={0.15}>
        <div className="mt-16 grid grid-cols-1 divide-y divide-line rounded-[2rem] border border-line bg-surface/50 backdrop-blur-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {about.stats.map((s) => (
            <div key={s.label} className="px-8 py-9 text-center">
              <p className="text-gradient font-display text-5xl font-semibold tracking-tight">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-[15px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-8 text-center text-[13px] text-muted">
          Remote-first — collaborating with clients across time zones, from
          Bangladesh to the UK and beyond.
        </p>
      </Reveal>
    </SectionShell>
  );
}
