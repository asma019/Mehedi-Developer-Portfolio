import { motion } from "motion/react";
import { faq } from "../data/content";
import { SectionShell, SectionHeading, Reveal, staggerParent, staggerChild } from "./ui";

/**
 * FAQ section - quick hiring-intent answers, its own stop between
 * Writing and Contact. Copy lives in content.ts (faq).
 */
export default function Faq() {
  return (
    <SectionShell id="faq" alternate tone="violet" className="!py-20 sm:!py-24">
      <SectionHeading eyebrow={faq.eyebrow} title={faq.title} />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mx-auto mt-12 max-w-4xl space-y-4"
      >
        {faq.items.map((item) => (
          <motion.div
            key={item.q}
            variants={staggerChild}
            className="glass rounded-2xl border border-line p-6 sm:p-7"
          >
            <h3 className="text-[15px] font-semibold text-ink sm:text-base">
              {item.q}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
          </motion.div>
        ))}
      </motion.div>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted">
          Something else on your mind? The{" "}
          <a
            href="#contact"
            className="font-medium text-accent underline-offset-4 hover:underline"
          >
            contact form
          </a>{" "}
          is right below.
        </p>
      </Reveal>
    </SectionShell>
  );
}
