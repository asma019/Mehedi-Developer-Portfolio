import { motion } from "motion/react";
import {
  MonitorSmartphone,
  Database,
  LayoutTemplate,
  Server,
  GaugeCircle,
  Compass,
} from "lucide-react";
import { skills } from "../data/content";
import { SectionShell, SectionHeading, staggerParent, staggerChild } from "./ui";

const icons = [MonitorSmartphone, Database, LayoutTemplate, Server, GaugeCircle, Compass];

/* Per-card accent hues — violet, cyan, blue, green, orange, pink */
const accents = ["#8b5cf6", "#22d3ee", "#3b82f6", "#34d399", "#fb923c", "#f472b6"];

/* Bento spans — every row pairs one wide + one regular card, so the
   chip-heavy Hosting & Servers card flows sideways instead of towering
   over its row-mates:
   row 1: Frontend (wide) + Backend · row 2: WordPress + Hosting (wide)
   row 3: Performance + Ways of Working (wide) */
const spans = [
  "sm:col-span-2",
  "",
  "",
  "sm:col-span-2",
  "",
  "lg:col-span-2",
];

export default function Skills() {
  return (
    <SectionShell id="skills" alternate tone="cyan" grid>
      <SectionHeading eyebrow={skills.eyebrow} title={skills.title} sub={skills.sub} />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skills.groups.map((group, i) => {
          const Icon = icons[i % icons.length];
          const accent = accents[i % accents.length];
          return (
            <motion.div key={group.title} variants={staggerChild} className={spans[i]}>
              {/* HUD panel — corner brackets light up on hover */}
              <div
                className="hud card-hover group relative h-full rounded-2xl border border-line bg-surface/70 p-7 backdrop-blur-sm transition-colors duration-300 hover:border-accent/35"
              >
                {/* corner index */}
                <span className="absolute right-6 top-5 font-display text-sm font-semibold tracking-widest text-muted/40 transition-colors duration-300 group-hover:text-muted/70">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex items-center gap-4">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-xl border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                    style={{
                      color: accent,
                      backgroundColor: `${accent}14`,
                      borderColor: `${accent}33`,
                      boxShadow: `0 0 28px ${accent}12`,
                    }}
                  >
                    <Icon size={20} />
                  </span>
                  <h3 className="font-display text-[17px] font-semibold tracking-tight text-ink">
                    {group.title}
                  </h3>
                </div>
                <p className="mt-3.5 text-[15px] leading-relaxed text-muted">
                  {group.blurb}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-line bg-surface-2/70 px-2.5 py-1.5 font-mono text-[12.5px] font-medium text-ink/75 transition-all duration-200"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `${accent}55`;
                        e.currentTarget.style.color = accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "";
                        e.currentTarget.style.color = "";
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionShell>
  );
}
