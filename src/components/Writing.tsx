import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { writing } from "../data/content";
import { SectionShell, SectionHeading, staggerParent, staggerChild } from "./ui";

export default function Writing() {
  return (
    <SectionShell id="writing" alternate tone="cyan" className="!py-20 sm:!py-24">
      <SectionHeading eyebrow={writing.eyebrow} title={writing.title} />

      {/* index rows — a table of contents, not cards */}
      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mx-auto mt-12 max-w-4xl border-t border-line"
      >
        {writing.items.map((post, i) => (
          <motion.article
            key={post.title}
            variants={staggerChild}
            className="group relative cursor-default border-b border-line py-7 transition-colors duration-300 hover:bg-surface/40"
          >
            {/* left accent marker on hover */}
            <span className="absolute left-0 top-0 h-full w-[2.5px] origin-top scale-y-0 bg-gradient-to-b from-accent to-accent-2 transition-transform duration-400 ease-out group-hover:scale-y-100" aria-hidden />

            <div className="flex items-baseline gap-5 pl-2 sm:gap-9 sm:pl-5">
              <span className="font-display text-sm font-semibold tracking-widest text-accent/70">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-xl">
                  {post.title}
                </h3>
                <p className="mt-1.5 max-w-2xl text-[14.5px] leading-relaxed text-muted">
                  {post.excerpt}
                </p>
              </div>

              <ArrowUpRight
                size={19}
                className="mt-1 shrink-0 -translate-x-1 translate-y-1 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
              />
            </div>
          </motion.article>
        ))}
      </motion.div>
    </SectionShell>
  );
}
