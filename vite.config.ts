import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { SITE } from "./src/data/site";
import { posts } from "./src/data/posts";
import { cases } from "./src/data/cases";

/**
 * Fills the %SITE_*% placeholders in index.html from src/data/site.ts -
 * the single source of truth for title/description, shared with llms.txt
 * below, so HTML meta and generated files can't drift apart.
 */
function injectSiteMeta(): Plugin {
  return {
    name: "inject-site-meta",
    transformIndexHtml(html) {
      return html
        .replaceAll("%SITE_TITLE%", SITE.title)
        .replaceAll("%SITE_DESCRIPTION%", SITE.description)
        .replaceAll("%SITE_TAGLINE%", SITE.tagline)
        .replaceAll("%SITE_NAME%", SITE.name);
    },
  };
}

/**
 * Regenerates the domain-dependent SEO files (sitemap.xml, robots.txt,
 * llms.txt) into dist/ at the end of every build, using VITE_SITE_URL
 * from the environment - so any domain set in .env (or the platform's
 * env vars) propagates everywhere with one rebuild.
 */
function generateSeoFiles(): Plugin {
  return {
    name: "generate-seo-files",
    closeBundle() {
      const site = (
        process.env.VITE_SITE_URL || "https://mehedims.com"
      ).replace(/\/+$/, "");
      const today = new Date().toISOString().slice(0, 10);
      const dist = join(process.cwd(), "dist");
      mkdirSync(dist, { recursive: true });

      writeFileSync(
        join(dist, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${site}/blog/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${posts
  .map(
    (p) => `  <url>
    <loc>${site}/blog/${p.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
  )
  .join("\n")}
${Object.values(cases)
  .map(
    (c) => `  <url>
    <loc>${site}/case/${c.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`,
      );

      writeFileSync(
        join(dist, "robots.txt"),
        `# robots.txt - ${site.replace("https://", "")}

User-agent: *
Allow: /

# Explicitly welcome AI / LLM crawlers
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${site}/sitemap.xml
`,
      );

      writeFileSync(
        join(dist, "llms.txt"),
        `# ${SITE.title}

> ${SITE.tagline} 4+ years of experience, 15+ projects delivered for clients worldwide.

Portfolio: ${site}/
Blog: ${site}/blog/
CV (PDF): ${site}/Mehedi-Hasan-CV.pdf

## Blog posts

${posts
  .map((p) => `- [${p.title}](${site}/blog/${p.slug}/) - ${p.excerpt}`)
  .join("\n")}

## Services

- Full-stack web development - React, Next.js, Go, PHP/Laravel, Python, MySQL, PostgreSQL, Redis
- WordPress performance - audits, LiteSpeed caching, Core Web Vitals wins
- Hosting & server operations - NGINX, Caddy, VPS setup (Ubuntu/AlmaLinux/Debian), cPanel, CloudPanel
- DNS infrastructure - PowerDNS clusters, PTR/rDNS management, WHMCS integrations
- Technical support - hosting & cloud troubleshooting with clear, reproducible communication

## Projects

- [Tools.BD](https://tools.bd/) - free network & domain tools: DNS, WHOIS, email-security analysis, ASN/IP/prefix lookup. Built with Go, PostgreSQL, Redis, SSE, Caddy.
- [AsiaBio Link](https://asiabio.link/) - URL shortener for developers and marketers, built in Laravel.
- [BuyAPet UK](https://buyapet.co.uk/) - UK pet classifieds marketplace; theme updates and speed optimization.
- [CodeXSell](https://codexsell.com/) - GPL digital-products marketplace (1800+ themes/plugins, memberships, admin panel), full Laravel build.
- [Zeely Realty](https://zeelyrealty.com/) - real-estate buy/rent broker platform, full Laravel system.
- [Diploma ICU](https://diploma.icu/) - blog and resources for Bangladeshi students; custom WordPress theme and content.
- [Saajkonna](https://saajkonna.com/) - WooCommerce beauty e-commerce, end-to-end speed optimization.
- PowerDNS Cluster - redundant DNS infrastructure with API for hosting brands.
- WHMCS modules - PowerDNS PTR Manager, PowerDNS DNS Manager, and Easy Product Transfer.

## Experience

- Technical Support Engineer - Zorn Ventures Limited (SatisfyHost & BengalCloud brands), 2026-present
- Chief Information Officer - TechZ IT, 2025
- Freelance Web Developer - Upwork & Fiverr, 2021-present

## Profiles

- GitHub: https://github.com/asma019
- LinkedIn: https://www.linkedin.com/in/mehedims1/
- Upwork: https://upwork.com/freelancers/~01f39b319379efc4d6
- Fiverr: https://www.fiverr.com/mehedims1

## Contact

Available for freelance projects. Reach out through the website contact form at ${site}/#contact or via the profiles above.
`,
      );

      // 404.html - Netlify / Cloudflare Pages / Vercel serve this with a
      // real 404 status for unknown paths; the SPA inside renders the
      // styled NotFound view (App checks location.pathname).
      // Real SPA views get their own copy with a proper 200: the app
      // renders Blog / BlogPost when pathname is /blog or /blog/<slug>.
      try {
        const index = readFileSync(join(dist, "index.html"), "utf8");
        writeFileSync(join(dist, "404.html"), index);
        mkdirSync(join(dist, "blog"), { recursive: true });
        writeFileSync(join(dist, "blog", "index.html"), index);
        for (const p of posts) {
          mkdirSync(join(dist, "blog", p.slug), { recursive: true });
          writeFileSync(join(dist, "blog", p.slug, "index.html"), index);
        }
        for (const c of Object.values(cases)) {
          mkdirSync(join(dist, "case", c.slug), { recursive: true });
          writeFileSync(join(dist, "case", c.slug, "index.html"), index);
        }
        console.log("404.html and blog/case index files generated");
      } catch {
        /* index.html missing - skip */
      }

      console.log(`SEO files generated for ${site}`);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), injectSiteMeta(), generateSeoFiles()],
  server: {
    // Allow dev access via mehedims.com subdomains (e.g. working.mehedims.com)
    allowedHosts: [".mehedims.com"],
  },
});
