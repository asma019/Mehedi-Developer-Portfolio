import { motion } from "motion/react";
import { ArrowLeft, Timer } from "lucide-react";
import type { Post } from "../data/posts";
import { Rich } from "./CaseStudy";

/**
 * Inline links in post bodies may be hash routes ("#/contact") - make
 * plain-text paragraphs support [text](href) links without markdown deps.
 */
function LinkedRich({ text }: { text: string }) {
  const pieces = text.split(/(\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return (
    <>
      {pieces.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (m) {
          const [, label, href] = m;
          const external = href.startsWith("http");
          return (
            <a
              key={i}
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="font-semibold text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
            >
              {label}
            </a>
          );
        }
        return <Rich key={i} text={p} />;
      })}
    </>
  );
}

export default function BlogPost({ post }: { post: Post }) {
  const date = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-bg font-sans text-ink">
      <article className="mx-auto w-full max-w-3xl px-5 pt-32 pb-24 sm:px-8 sm:pt-40">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <a
            href="#writing"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} /> All notes
          </a>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <time dateTime={post.date}>{date}</time>
            <span className="inline-flex items-center gap-1.5">
              <Timer size={14} /> {post.readingTime}
            </span>
            <span className="rounded-full border border-accent/25 bg-accent-soft px-3 py-0.5 text-xs font-semibold text-accent">
              Draft
            </span>
          </div>

          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2.6rem] sm:leading-[1.1]">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium text-ink/70">
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="mt-12 border-t border-line pt-10">
          {post.body.map((block, i) => {
            switch (block.type) {
              case "h2":
                return (
                  <motion.h2
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    className="mt-12 first:mt-0 font-display text-2xl font-semibold tracking-tight text-ink"
                  >
                    {block.text}
                  </motion.h2>
                );
              case "list":
                return (
                  <motion.ul
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    className="mt-6 space-y-3"
                  >
                    {block.items.map((li) => (
                      <li key={li} className="flex items-start gap-3 leading-relaxed text-muted">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                        <span><Rich text={li} /></span>
                      </li>
                    ))}
                  </motion.ul>
                );
              case "quote":
                return (
                  <motion.blockquote
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    className="mt-8 rounded-2xl border-l-[3px] border-accent bg-accent-soft/60 py-5 pl-6 pr-5 text-[15.5px] italic leading-relaxed text-ink/80"
                  >
                    <Rich text={block.text} />
                  </motion.blockquote>
                );
              case "code":
                return (
                  <pre
                    key={i}
                    className="mt-8 overflow-x-auto rounded-2xl border border-line bg-surface-2 p-5 font-mono text-[13px] leading-relaxed text-ink/80"
                  >
                    <code>{block.text}</code>
                  </pre>
                );
              default:
                return (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    className="mt-6 leading-relaxed text-muted"
                  >
                    <LinkedRich text={block.text} />
                  </motion.p>
                );
            }
          })}
        </div>

        <div className="mt-16 border-t border-line pt-10 text-center">
          <p className="text-muted">Want this loop run on your site instead of reading about it?</p>
          <a
            href="#contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_40px_-8px_rgba(124,92,255,0.65)] transition-transform hover:scale-[1.03] active:scale-95"
          >
            Get in touch
          </a>
        </div>
      </article>
    </main>
  );
}
