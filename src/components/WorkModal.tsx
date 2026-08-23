import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  Wrench,
  Dog,
  Link2,
  GraduationCap,
  Globe,
  Network,
  Send,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { projects } from "../data/content";
import { ShotCover } from "./ui";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Project = {
  name: string;
  kind: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  link: string;
  shot?: string;
  gradient: string;
};

const coverIcons: Record<string, LucideIcon> = {
  "Tools.BD": Wrench,
  "BuyAPet UK": Dog,
  "AsiaBio Link": Link2,
  "CodeXSell": Package,
  "Zeely Realty": LayoutDashboard,
  "Diploma ICU": GraduationCap,
  "Saajkonna": ShoppingCart,
  "PowerDNS Cluster": Network,
  "WHMCS PowerDNS PTR Manager": ArrowLeftRight,
  "WHMCS PowerDNS DNS Manager": Globe,
  "WHMCS Easy Product Transfer": Send,
};

const iconOf = (name: string) => coverIcons[name] ?? Sparkles;

/* ── Big cover art for the preview panel ───────────────────── */
function CoverArt({
  project,
  index,
  tall = false,
}: {
  project: Project;
  index: number;
  tall?: boolean;
}) {
  const Icon = iconOf(project.name);
  return (
    <ShotCover
      shot={project.shot}
      gradient={project.gradient}
      className={`rounded-[1.6rem] ${tall ? "h-36 sm:h-44" : "aspect-[16/9]"}`}
      icon={
        <Icon
          size={tall ? 56 : 96}
          strokeWidth={1}
          className="text-white/90 drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
        />
      }
    >
      <span className="absolute right-4 top-4 rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
        {project.year}
      </span>
      <span
        className={`absolute bottom-2 left-5 select-none font-display font-bold leading-none text-white/60 opacity-30 mix-blend-overlay ${
          tall ? "text-4xl" : "text-7xl"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </ShotCover>
  );
}

function TagRow({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-2">
      {project.tags.map((t) => (
        <span
          key={t}
          className="rounded-md border border-line bg-surface-2/80 px-2.5 py-1 text-xs font-medium text-ink/70"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export default function WorkModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(0);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const all = useMemo<Project[]>(
    () => [...projects.items, ...projects.moreProjects],
    [],
  );
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(all.map((p) => p.category)))],
    [all],
  );
  const list = useMemo(
    () => (filter === "All" ? all : all.filter((p) => p.category === filter)),
    [filter, all],
  );
  const current = list[Math.min(selected, list.length - 1)] ?? all[0];

  const step = (dir: 1 | -1) =>
    setSelected((s) => Math.max(0, Math.min(list.length - 1, s + dir)));

  /* Reset selection when the filter changes */
  useEffect(() => setSelected(0), [filter]);

  /* Keep the active row in view */
  useEffect(() => {
    rowRefs.current[selected]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  /* Scroll lock + keyboard (ESC close, arrows navigate) */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose, list.length]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label="All work"
          className="noise fixed inset-0 z-[70] flex flex-col bg-bg/95 backdrop-blur-2xl"
        >
          {/* ambient aurora */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute -top-32 left-[10%] h-[380px] w-[380px] rounded-full bg-accent/15 blur-[130px]" />
            <div className="absolute -bottom-32 right-[8%] h-[340px] w-[340px] rounded-full bg-accent-2/12 blur-[130px]" />
          </div>

          {/* header */}
          <div className="relative border-b border-line px-5 pb-4 pt-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-baseline gap-4">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  All <span className="text-gradient">work</span>
                </h3>
                <span className="hidden text-sm text-muted sm:inline">
                  {list.length} {list.length === 1 ? "project" : "projects"}
                  {filter !== "All" ? ` · ${filter}` : ""}
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line-strong bg-surface/60 text-ink transition-all duration-300 hover:rotate-90 hover:border-accent/60 hover:text-accent active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* filters — underline tabs */}
            <div className="mt-4 flex gap-1 overflow-x-auto">
              {categories.map((c) => {
                const isActive = filter === c;
                return (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    className={`relative shrink-0 px-3.5 py-2 text-[13.5px] font-medium transition-colors duration-200 ${
                      isActive ? "text-accent" : "text-muted hover:text-ink"
                    }`}
                  >
                    {c}
                    {isActive && (
                      <motion.span
                        layoutId="work-filter-underline"
                        className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-gradient-to-r from-accent to-accent-2"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* body: index list + preview */}
          <div className="relative flex-1 overflow-hidden">
            <div className="grid h-full lg:grid-cols-[380px_1fr]">
              {/* index list */}
              <div className="h-full overflow-y-auto border-line px-4 py-3 sm:px-6 lg:border-r">
                {list.map((p, i) => {
                  const isActive = i === selected;
                  return (
                    <div key={p.name} className="border-b border-line/60 last:border-0">
                      <button
                        ref={(el) => {
                          rowRefs.current[i] = el;
                        }}
                        onClick={() => setSelected(i)}
                        aria-current={isActive}
                        className={`group relative flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition-colors duration-200 ${
                          isActive ? "bg-accent-soft" : "hover:bg-surface/60"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="work-row-bar"
                            transition={{ type: "spring", stiffness: 400, damping: 34 }}
                            className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-gradient-to-b from-accent to-accent-2"
                          />
                        )}
                        <span
                          className={`font-display text-sm font-bold tracking-widest transition-colors ${
                            isActive ? "text-accent" : "text-muted/50 group-hover:text-muted"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block truncate font-display text-[15.5px] font-semibold tracking-tight transition-colors ${
                              isActive ? "text-ink" : "text-ink/85 group-hover:text-ink"
                            }`}
                          >
                            {p.name}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted">
                            {p.kind}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={15}
                          className={`shrink-0 transition-all duration-300 ${
                            isActive
                              ? "translate-x-0 text-accent opacity-100"
                              : "-translate-x-1 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                          }`}
                        />
                      </button>

                      {/* inline preview on mobile/tablet */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: easeOut }}
                            className="overflow-hidden lg:hidden"
                          >
                            <div className="space-y-4 px-4 pb-5 pt-1">
                              <CoverArt project={p} index={i} tall />
                              <p className="text-sm leading-relaxed text-muted">
                                {p.description}
                              </p>
                              <TagRow project={p} />
                              <a
                                href={p.link}
                                {...(p.link.startsWith("http")
                                  ? { target: "_blank", rel: "noreferrer" }
                                  : {})}
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-transform active:scale-95"
                              >
                                View project
                                <ArrowUpRight size={14} />
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* preview panel — desktop */}
              <div className="hidden overflow-y-auto p-8 lg:block xl:p-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.name}
                    initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                    transition={{ duration: 0.4, ease: easeOut }}
                  >
                    <CoverArt project={current} index={selected} />

                    <div className="mt-8 flex flex-wrap items-start justify-between gap-5">
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-accent">
                          {current.kind} · {current.category}
                        </p>
                        <h4 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink xl:text-4xl">
                          {current.name}
                        </h4>
                      </div>
                      <a
                        href={current.link}
                        {...(current.link.startsWith("http")
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                        className="group mt-1 inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-accent via-accent-strong to-accent-2 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_34px_-8px_rgba(124,92,255,0.6)] transition-all duration-300 hover:shadow-[0_14px_44px_-6px_rgba(124,92,255,0.8)] active:scale-95"
                      >
                        View project
                        <ArrowUpRight
                          size={15}
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                    </div>

                    <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted">
                      {current.description}
                    </p>
                    <div className="mt-6">
                      <TagRow project={current} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* footer: note + stepper */}
          <div className="relative border-t border-line px-5 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="min-w-0 flex-1 truncate text-[13px] text-muted sm:text-left">
                {projects.more}
              </p>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-display text-sm font-semibold tracking-widest text-muted tabular-nums">
                  {String(selected + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
                </span>
                <button
                  onClick={() => step(-1)}
                  disabled={selected === 0}
                  aria-label="Previous project"
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-all duration-300 hover:border-accent/50 hover:text-accent active:scale-95 disabled:opacity-35"
                >
                  <ArrowLeft size={15} />
                </button>
                <button
                  onClick={() => step(1)}
                  disabled={selected === list.length - 1}
                  aria-label="Next project"
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-all duration-300 hover:border-accent/50 hover:text-accent active:scale-95 disabled:opacity-35"
                >
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
