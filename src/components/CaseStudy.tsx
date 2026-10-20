import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import type { CaseData } from "../data/cases";
import { ShotCover } from "./ui";

/** Minimal inline renderer for **bold** and `code` spans. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? (
          <strong key={i} className="font-semibold text-ink">{p.slice(2, -2)}</strong>
        ) : p.startsWith("`") ? (
          <code key={i} className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
            {p.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export default function CaseStudy({ data }: { data: CaseData }) {
  return (
    <main className="min-h-screen bg-bg font-sans text-ink">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-alt pt-32 pb-20 sm:pt-40">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-40 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
          <motion.a
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            href="#projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} /> All work
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-8"
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent">
              {data.kind} · {data.year}
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl sm:leading-[1.08]">
              {data.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              {data.summary}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href={data.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_36px_-10px_rgba(124,92,255,0.7)] transition-transform hover:scale-[1.03] active:scale-95"
              >
                Visit site <ArrowUpRight size={16} />
              </a>
              <span className="text-sm text-muted">{data.role}</span>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {data.stack.map((t) => (
                <span key={t} className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium text-ink/70">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* cover */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="group mt-12 overflow-hidden rounded-[2rem] border border-line shadow-2xl"
          >
            <ShotCover shot={data.shot} gradient={data.gradient} className="aspect-[16/9]">
              <span className="absolute bottom-4 right-5 rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                {data.name}
              </span>
            </ShotCover>
          </motion.div>
        </div>
      </section>

      {/* ── Verified numbers row — hidden while `metrics` is empty ── */}
      {data.metrics.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 sm:grid-cols-3 sm:px-8">
            {data.metrics.map((m) => (
              <div key={m.label} className="card rounded-2xl p-7 text-center">
                <p className="font-display text-4xl font-bold text-accent">{m.value}</p>
                <p className="mt-2 text-sm font-medium text-ink/80">{m.label}</p>
                {m.note && <p className="mt-1 text-xs text-muted">{m.note}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Narrative ── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
          {data.sections.map((s, i) => (
            <motion.div
              key={s.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.04 }}
              className="mt-14 first:mt-0"
            >
              <h2 className="flex items-center gap-3 font-display text-2xl font-semibold tracking-tight text-ink">
                <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                {s.heading}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="mt-5 leading-relaxed text-muted">{p}</p>
              ))}
              {s.bullets && (
                <ul className="mt-6 space-y-3">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-[15px] leading-relaxed text-muted">
                      <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent" aria-hidden>
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}

          {/* results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="mt-16 rounded-[1.5rem] border border-accent/20 bg-accent-soft p-8 sm:p-10"
          >
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">Where it landed</h2>
            <ul className="mt-6 space-y-3.5">
              {data.results.map((r) => (
                <li key={r} className="flex items-start gap-3 leading-relaxed text-ink/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA */}
          <div className="mt-16 flex flex-col items-center gap-4 pb-8 text-center">
            <p className="text-lg font-medium text-ink">Need a tool, platform or rescue like this?</p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_40px_-8px_rgba(124,92,255,0.65)] transition-transform hover:scale-[1.03] active:scale-95"
            >
              Get in touch
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
