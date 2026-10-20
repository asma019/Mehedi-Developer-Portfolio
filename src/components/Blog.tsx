import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Timer } from "lucide-react";
import { posts } from "../data/posts";

/**
 * Blog index - served at the real path /blog (generated as a static file
 * at build, see vite.config.ts) and reachable as #/blog from the app.
 */
export default function Blog() {
  return (
    <main className="min-h-screen bg-bg font-sans text-ink">
      {/* header */}
      <section className="relative overflow-hidden bg-alt pt-32 pb-16 sm:pt-40">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-40 left-1/2 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
        </div>
        <div className="relative mx-auto w-full max-w-4xl px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-accent"
            >
              <ArrowLeft size={16} /> Home
            </a>
            <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.22em] text-accent">
              The Blog
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Notes on running sites that stay up.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              Long-form, practical pieces drawn from the work: WordPress
              performance, hosting and infrastructure, and the client-side
              craft nobody writes documentation for.
            </p>
          </motion.div>
        </div>
      </section>

      {/* post list */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            animate="show"
            className="flex flex-col divide-y divide-line border-y border-line"
          >
            {posts.map((post) => (
              <motion.a
                key={post.slug}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0 },
                }}
                href={`/blog/${post.slug}`}
                className="group relative py-8 transition-colors duration-300 hover:bg-surface/40"
              >
                <span className="absolute left-0 top-0 h-full w-[2.5px] origin-top scale-y-0 bg-gradient-to-b from-accent to-accent-2 transition-transform duration-400 ease-out group-hover:scale-y-100" aria-hidden />

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  <span className="inline-flex items-center gap-1.5">
                    <Timer size={14} /> {post.readingTime}
                  </span>
                  {post.tags.slice(0, 2).map((t) => (
                    <span key={t} className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-ink/70">
                      {t}
                    </span>
                  ))}
                  <span className="rounded-full border border-accent/25 bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                    Draft
                  </span>
                </div>

                <h2 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-2xl">
                  {post.title}
                </h2>
                <p className="mt-2.5 max-w-2xl leading-relaxed text-muted">
                  {post.excerpt}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent opacity-80 transition-opacity group-hover:opacity-100">
                  Read the post
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </motion.a>
            ))}
          </motion.div>

          <p className="mt-10 text-center text-sm text-muted">
            Everything here is a working draft first. Questions about any of it?
            The <a href="/#contact" className="font-semibold text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">contact form</a> is on the home page.
          </p>
        </div>
      </section>
    </main>
  );
}
