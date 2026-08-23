import { motion } from "motion/react";
import { GraduationCap, Award, Languages } from "lucide-react";
import { education } from "../data/content";
import { SectionShell, SectionHeading, staggerParent, staggerChild } from "./ui";

export default function Education() {
  return (
    <SectionShell id="education" tone="violet">
      <SectionHeading eyebrow={education.eyebrow} title={education.title} />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-16 grid gap-6 lg:grid-cols-3"
      >
        {/* Degree — diploma frame: solid outer border, dashed inner border,
            circular badge breaking the top edge */}
        <motion.div variants={staggerChild} className="lg:col-span-2">
          <div className="card card-hover relative h-full rounded-3xl p-2">
            <div className="relative flex h-full flex-col items-center rounded-[1.4rem] border border-dashed border-line-strong/70 px-8 pb-9 pt-14 text-center">
              {/* badge breaking the frame */}
              <span className="absolute -top-6 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-white shadow-[0_8px_28px_rgba(124,92,255,0.5)] ring-4 ring-bg">
                <GraduationCap size={22} />
              </span>

              <h3 className="max-w-md font-display text-lg font-semibold leading-snug tracking-tight text-ink">
                {education.degree.degree}
              </h3>
              <p className="mt-1.5 text-[15px] text-muted">{education.degree.school}</p>
              <span className="mt-3 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-accent">
                {education.degree.period}
              </span>

              <span className="mt-7 h-px w-16 bg-gradient-to-r from-transparent via-line-strong to-transparent" aria-hidden />

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Coursework
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {education.degree.courses.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[13px] font-medium text-ink/80 transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          {/* Certification — seal style */}
          <motion.div variants={staggerChild} className="flex-1">
            <div className="card card-hover h-full rounded-3xl p-8">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-white shadow-[0_6px_22px_rgba(124,92,255,0.4)]">
                  <Award size={20} />
                </span>
                <span className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
                  Level 3
                </span>
              </div>
              <h3 className="mt-5 font-display text-[17px] font-semibold leading-snug tracking-tight text-ink">
                {education.certification.title}
              </h3>
              <p className="mt-1.5 text-[15px] text-muted">{education.certification.authority}</p>
              <p className="mt-3 text-[13px] text-muted">{education.certification.period}</p>
              <p className="mt-4 border-t border-dashed border-line pt-4 text-[13px] leading-relaxed text-muted">
                {education.certification.note}
              </p>
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div variants={staggerChild}>
            <div className="card card-hover rounded-3xl p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-accent/20 bg-accent-soft text-accent">
                  <Languages size={19} />
                </span>
                <h3 className="font-display text-[17px] font-semibold tracking-tight text-ink">
                  Languages
                </h3>
              </div>
              <div className="mt-5 space-y-3.5">
                {education.languages.map((lang) => (
                  <div key={lang.name} className="flex items-center justify-between gap-4">
                    <span className="text-[15px] font-medium text-ink">{lang.name}</span>
                    <span className="text-right text-[13px] text-muted">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </SectionShell>
  );
}
