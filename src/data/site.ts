/**
 * ─────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH for site-wide meta strings.
 *  index.html (via %SITE_*% placeholders in vite.config.ts), the
 *  generated llms.txt, and anything app-side reads from here - so
 *  title/description never drift between files.
 * ─────────────────────────────────────────────────────────────────
 */
export const SITE = {
  name: "Mehedi Hasan",
  jobTitle: "Web Developer & Support Engineer",

  /** <title> + og:title / twitter:title + llms.txt heading */
  title: "Mehedi Hasan - Web Developer & Support Engineer",

  /** <meta name="description"> + schema.org description */
  description:
    "Mehedi Hasan is a web developer and technical support engineer from Khulna, Bangladesh - combining frontend craftsmanship with real WordPress, hosting, and cloud operations experience to make websites faster, clearer, and easier to maintain.",

  /** og:description / twitter:description + llms.txt intro */
  tagline:
    "Fast, reliable websites built with React, Next.js and WordPress - backed by real VPS, hosting and cloud operations experience.",

  image: "/og-image.png",
} as const;
