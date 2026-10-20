import { SITE } from "../data/site";

/**
 * Per-route <head> management. The shell HTML serves one static head,
 * so every content view rewrites title / description / canonical /
 * OG-Twitter tags and swaps its own JSON-LD at route change. Crawlers
 * that run JS (Google) get fully correct metadata per URL.
 */
export type RouteHead = {
  title: string;
  description: string;
  /** canonical path of this view, e.g. "/blog/some-post/" */
  canonical: string;
  /** "website" (default) or "article" */
  ogType?: string;
  jsonLd?: Record<string, unknown>;
};

const META_SELECTORS = [
  'meta[name="description"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:type"]',
  'meta[property="og:url"]',
  'meta[property="og:image:alt"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
];

/**
 * Blog index - default description used when no per-post one applies. */
export const BLOG_HEAD_DESCRIPTION =
  "Practical long-form posts from real client work: WordPress performance audits, hosting and DNS operations, and the client craft nobody writes down.";

/** BlogPosting schema for a single post */
export function postJsonLd(
  p: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    tags: string[];
  },
  siteUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    datePublished: p.date,
    dateModified: p.date,
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${p.slug}/` },
    keywords: p.tags.join(", "),
    isAccessibleForFree: true,
    author: { "@type": "Person", name: SITE.name, url: siteUrl },
  };
}

/** Blog (collection) schema for the /blog index */
export function blogJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE.name} - Blog`,
    url: `${siteUrl}/blog/`,
    inLanguage: "en",
  };
}

/** TechArticle schema for a case study */
export function caseJsonLd(
  c: { slug: string; title: string; summary: string; year: string },
  siteUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: c.title,
    description: c.summary,
    datePublished: `${c.year}-01-01`,
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/case/${c.slug}/` },
    author: { "@type": "Person", name: SITE.name, url: siteUrl },
  };
}

export function applyHead(head: RouteHead, siteUrl: string) {
  // title
  document.title = head.title;

  const site = siteUrl.replace(/\/+$/, "");
  const valueBySelector: Record<string, string> = {
    'meta[name="description"]': head.description,
    'meta[property="og:title"]': head.title,
    'meta[property="og:description"]': head.description,
    'meta[property="og:type"]': head.ogType ?? "website",
    'meta[property="og:url"]': `${site}${head.canonical}`,
    'meta[property="og:image:alt"]': head.title,
    'meta[name="twitter:title"]': head.title,
    'meta[name="twitter:description"]': head.description,
  };

  for (const selector of META_SELECTORS) {
    document
      .querySelector<HTMLMetaElement>(selector)
      ?.setAttribute("content", valueBySelector[selector]);
  }

  // og:image retargeting is unnecessary - the site-wide og-image applies
  // to all views and lives in the static head.

  // canonical
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = `${site}${head.canonical}`;

  // per-route JSON-LD (the static Person/WebSite script in index.html is
  // separate and untouched)
  const ID = "route-jsonld";
  let script = document.getElementById(ID) as HTMLScriptElement | null;
  if (head.jsonLd) {
    if (!script) {
      script = document.createElement("script");
      script.id = ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(head.jsonLd);
  } else if (script) {
    script.remove();
  }
}
