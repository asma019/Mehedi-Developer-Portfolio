import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  AnimatePresence,
} from "motion/react";
import {
  Sun,
  Moon,
  Menu,
  X,
  User,
  Zap,
  LayoutGrid,
  Briefcase,
  GraduationCap,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { navLinks, profile } from "../data/content";

const linkIcons: Record<string, LucideIcon> = {
  "#about": User,
  "#skills": Zap,
  "#projects": LayoutGrid,
  "#experience": Briefcase,
  "#education": GraduationCap,
  "#contact": Mail,
};

export default function FloatingMenu({
  light,
  onToggleTheme,
}: {
  light: boolean;
  onToggleTheme: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });

  /* Compact after scrolling */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll-spy: the section crossing the viewport's upper-middle band wins */
  useEffect(() => {
    const ids = ["top", ...navLinks.map((l) => l.href.slice(1))];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Escape closes the mobile sheet */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* scroll progress hairline */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2.5px] origin-left bg-gradient-to-r from-accent via-accent-strong to-accent-2"
      />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <motion.nav
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.15 }}
          className={`glass-strong pointer-events-auto mx-auto flex w-fit max-w-full items-center gap-1 rounded-full border transition-all duration-500 ${
            scrolled
              ? "border-line-strong py-1 shadow-[0_14px_44px_rgba(0,0,0,0.4)]"
              : "border-line py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.28)]"
          }`}
          aria-label="Primary"
        >
          {/* Monogram */}
          <a
            href="#top"
            className="ml-1 flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3"
            aria-label="Back to top"
          >
            <img
              src="/favicon.svg"
              alt=""
              className="h-8 w-8 rounded-xl shadow-[0_4px_16px_rgba(124,92,255,0.45)]"
            />
            <span className="hidden font-display text-[15px] font-semibold tracking-tight text-ink xl:inline">
              {profile.name}
            </span>
          </a>

          <span className="hidden h-5 w-px bg-line lg:block" aria-hidden />

          {/* Desktop links with sliding active indicator */}
          <div className="hidden items-center lg:flex">
            {navLinks.map((l) => {
              const isActive = active === l.href;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={`relative rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors duration-200 ${
                    isActive ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="menu-active-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full border border-accent/30 bg-accent-soft"
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </a>
              );
            })}
          </div>

          <span className="h-5 w-px bg-line" aria-hidden />

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
            className="grid h-9 w-9 place-items-center rounded-full border border-transparent text-ink transition-all duration-300 hover:border-accent/40 hover:text-accent active:scale-95"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={light ? "moon" : "sun"}
                initial={{ rotate: -70, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 70, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.25 }}
                className="grid place-items-center"
              >
                {light ? <Moon size={15} /> : <Sun size={15} />}
              </motion.span>
            </AnimatePresence>
          </button>

          {/* Hire me */}
          <a
            href="#contact"
            className="mr-1 hidden rounded-full bg-gradient-to-r from-accent to-accent-2 px-4.5 py-2 text-[13.5px] font-semibold text-white shadow-[0_6px_22px_rgba(124,92,255,0.4)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(124,92,255,0.6)] active:scale-95 sm:inline-flex"
          >
            Hire me
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="mr-1 grid h-9 w-9 place-items-center rounded-full text-ink transition-transform active:scale-95 lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "menu"}
                initial={{ rotate: -60, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 60, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid place-items-center"
              >
                {open ? <X size={17} /> : <Menu size={17} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </motion.nav>

        {/* Mobile sheet */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong pointer-events-auto mx-auto mt-2 w-full max-w-xs rounded-3xl border border-line p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            >
              <div className="flex flex-col">
                {navLinks.map((l, i) => {
                  const Icon = linkIcons[l.href] ?? LayoutGrid;
                  const isActive = active === l.href;
                  return (
                    <motion.a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.3 }}
                      className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[15px] font-medium transition-colors ${
                        isActive
                          ? "bg-accent-soft text-ink"
                          : "text-muted hover:bg-surface-2 hover:text-ink"
                      }`}
                    >
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-xl ${
                          isActive ? "bg-accent text-white" : "bg-accent-soft text-accent"
                        }`}
                      >
                        <Icon size={15} />
                      </span>
                      {l.label}
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                      )}
                    </motion.a>
                  );
                })}
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-2xl bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-center text-[15px] font-semibold text-white"
                >
                  Hire me
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
