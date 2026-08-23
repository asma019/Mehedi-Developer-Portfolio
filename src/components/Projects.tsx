import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Wrench,
  Dog,
  Link2,
  Package,
  Sparkles,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { projects } from "../data/content";
import { SectionShell, SectionHeading, Reveal, ShotCover, useSpotlight, staggerParent, staggerChild } from "./ui";
import WorkModal from "./WorkModal";

/* Cover icons + glow tints keyed by project name so order changes stay correct */
const coverIcons: Record<string, LucideIcon> = {
  "Tools.BD": Wrench,
  "AsiaBio Link": Link2,
  "BuyAPet UK": Dog,
  "CodeXSell": Package,
};

const glows: Record<string, string> = {
  "Tools.BD": "#4a6cf7",
  "AsiaBio Link": "#a78bfa",
  "BuyAPet UK": "#ff6a3d",
  "CodeXSell": "#a855f7",
};

function ProjectCard({
  project,
  index,
  tilt = "",
  featured = false,
}: {
  project: (typeof projects.items)[number];
  index: number;
  tilt?: string;
  featured?: boolean;
}) {
  const { ref, onMouseMove } = useSpotlight<HTMLAnchorElement>();
  const Icon = coverIcons[project.name] ?? Sparkles;
  const glow = glows[project.name] ?? "#7c5cff";
  const external = project.link.startsWith("http");

  return (
    <motion.a
      ref={ref}
      onMouseMove={onMouseMove}
      variants={staggerChild}
      href={project.link}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      style={{ "--glow-c": `${glow}59`, "--glow-b": `${glow}55` } as React.CSSProperties}
      className={`spotlight card glow-hover group block overflow-hidden rounded-[1.8rem] ${tilt} ${
        featured ? "grid md:grid-cols-[1.05fr_1fr]" : ""
      }`}
    >
      {/* cover — real screenshot with gradient fallback */}
      <ShotCover
        shot={project.shot}
        gradient={project.gradient}
        className={`flex items-center justify-center ${
          featured ? "h-56 md:h-full md:min-h-[19rem]" : "h-48"
        }`}
        icon={
          <Icon
            size={featured ? 84 : 64}
            strokeWidth={1.1}
            className="text-white/90 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-3"
          />
        }
      >
        {/* ghost case-study numeral */}
        <span className="absolute bottom-3 left-5 select-none font-display text-[3.4rem] font-bold leading-none text-white/60 opacity-30 mix-blend-overlay transition-all duration-500 group-hover:opacity-50">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute right-5 top-5 rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {project.year}
        </span>
      </ShotCover>

      <div className={featured ? "flex flex-col justify-center p-8 sm:p-10" : "p-7"}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent">
              {project.kind}
            </p>
            <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {project.name}
            </h3>
          </div>
          <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-300 group-hover:border-accent group-hover:bg-gradient-to-br group-hover:from-accent group-hover:to-accent-2 group-hover:text-white">
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          {project.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:border-accent/40 hover:text-accent"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  const [featured, ...rest] = projects.items;
  const [showAll, setShowAll] = useState(false);

  return (
    <SectionShell id="projects">
      <SectionHeading
        eyebrow={projects.eyebrow}
        title={projects.title}
        sub={projects.sub}
      />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-16 flex flex-col gap-6"
      >
        <ProjectCard project={featured} index={0} featured />

        <div className="grid gap-6 md:grid-cols-3">
          {rest.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={i + 1}
              tilt={["rotate-[-1.4deg]", "rotate-[1.1deg]", "rotate-[-0.7deg]"][i % 3]}
            />
          ))}
        </div>
      </motion.div>

      <Reveal delay={0.15}>
        <div className="mt-12 flex flex-col items-center gap-5">
          <button
            onClick={() => setShowAll(true)}
            className="group inline-flex items-center gap-2.5 rounded-full border border-accent/35 bg-accent-soft px-7 py-3.5 text-[15px] font-semibold text-accent transition-all duration-300 hover:bg-gradient-to-r hover:from-accent hover:to-accent-2 hover:text-white hover:shadow-[0_12px_40px_-8px_rgba(124,92,255,0.65)] active:scale-95"
          >
            <LayoutGrid size={16} className="transition-transform duration-300 group-hover:rotate-90" />
            Show all work
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white">
              {projects.items.length + projects.moreProjects.length}
            </span>
          </button>
          <p className="max-w-xl text-center text-[15px] leading-relaxed text-muted">
            {projects.more}
          </p>
        </div>
      </Reveal>

      <WorkModal open={showAll} onClose={() => setShowAll(false)} />
    </SectionShell>
  );
}
