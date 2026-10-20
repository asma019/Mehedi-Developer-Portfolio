/**
 * Blog posts — rendered at #/blog/<slug> (see App.tsx).
 *
 * The body is a typed block list rather than raw markdown: no parser
 * dependency, and the inline renderer in PostView handles **bold** and
 * `code` spans. Write honestly — anything you wouldn't put on your CV,
 * leave out.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; text: string }
  | { type: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  excerpt: string;
  tags: string[];
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "wordpress-performance-audits",
    title: "How I audit a slow WordPress site",
    date: "2026-10-20",
    readingTime: "6 min",
    excerpt:
      "The order I actually work through — measure first, then caching, images, assets and hosting — and the deltas each step is worth.",
    tags: ["WordPress", "Performance", "Core Web Vitals"],
    body: [
      {
        type: "p",
        text: "Most slow WordPress sites are not slow for one exotic reason. They're slow for three boring reasons stacked on top of each other — and the fix order matters, because caching on top of unoptimized images hides the problem instead of solving it. This is the order I work through on every audit.",
      },
      { type: "h2", text: "1. Measure first — never guess" },
      {
        type: "p",
        text: "Before touching anything, collect numbers: PageSpeed Insights for field data (what real users experienced) and lab data (what the page does on a clean connection). Note TTFB separately — it tells you the split you need between *server work* and *frontend work*. If TTFB is high, hosting and caching come first; if it's fine, the payload and assets are the suspects.",
      },
      {
        type: "quote",
        text: "Auditing without duplicated before/after numbers is just opinions. Take a screenshot of the baseline — you'll want it when you prove what the changes bought.",
      },
      { type: "h2", text: "2. The server: caching and TTFB" },
      {
        type: "p",
        text: "If every request is running a full WordPress bootstrap, nothing else you do will matter for logged-out traffic. In order of preference:",
      },
      {
        type: "list",
        items: [
          "Server-level caching (LiteSpeed Cache on LiteSpeed hosts, FastCGI cache on NGINX) beats any plugin-only setup — it serves before PHP runs.",
          "Page caching plugins (WP Rocket, W3TC) where server-level isn't available.",
          "Object caching (Redis) for logged-in-heavy sites and WooCommerce carts, where full-page cache can't apply.",
        ],
      },
      {
        type: "p",
        text: "A Wordfence-style scanner cron, broken transients gathering in the options table, or a heartbeat API thrashing the admin can drag TTFB on every request — worth checking `WP_CRON` locks and transient counts before blaming the host.",
      },
      { type: "h2", text: "3. Images: the usually-biggest win" },
      {
        type: "p",
        text: "This is where most of the bytes live. Convert to WebP (or AVIF where the host supports it), resize uploads to their actual display width instead of serving a 4000px original into a 800px slot, and lazy-load below-the-fold media natively with `loading=\"lazy\"`. Careful with one thing: lazy-loading the hero image makes LCP *worse* — keep the LCP candidate eager and preloaded.",
      },
      { type: "h2", text: "4. Render-blocking assets" },
      {
        type: "p",
        text: "Plugins and themes each add their own CSS and JS. Critical CSS inline for the fold, defer the rest, and audit the list: a page builder theme + page builder + slider + two popup plugins can easily push parse-blocking JS past a megabyte before the paint starts. Every plugin you can delete is bandwidth and main-thread time you get back permanently.",
      },
      { type: "h2", text: "5. Database clutter" },
      {
        type: "p",
        text: "Post revisions, orphaned transients and expired action-scheduler rows slow the very queries the page cache was protecting. A scheduled cleanup plus limiting `WP_POST_REVISIONS` keeps a busy site's options table from becoming a dumping ground.",
      },
      { type: "h2", text: "6. Know when it's the host" },
      {
        type: "p",
        text: "Sometimes the code is fine and the box is small: a shared host with 1 write-weighted PHP worker will never serve WooCommerce checkout bursts, no matter how well the theme is tuned. If TTFB stays high after caching is properly in place, it's a hosting problem — move or upgrade, then re-measure.",
      },
      { type: "h2", text: "The wrap-up" },
      {
        type: "p",
        text: "Re-run the same measurements, save the after-numbers next to the before, and hand the client a one-page summary of what changed and why. An audit that ends with 'it loads faster' is fine — one that ends with a comparison sheet and a maintenance plan is the one clients come back for.",
      },
      {
        type: "p",
        text: "**This post is a working draft** — I tune the flow as I revise it. If you'd rather have someone run this loop on your site than read about it, [get in touch](#/contact).",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
