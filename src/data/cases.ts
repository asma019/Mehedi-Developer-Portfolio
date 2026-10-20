/**
 * Case studies — long-form write-ups the project cards can link to.
 * Routes render at #/case/<slug> (see App.tsx).
 *
 * ethically honest scaffolding: every number that isn't verified lives
 * behind a TODO — fill real metrics in `metrics` when you have them and
 * the page renders them automatically.
 */
export type CaseSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type CaseData = {
  slug: string;
  name: string;
  title: string;
  kind: string;
  year: string;
  url: string;
  role: string;
  stack: string[];
  summary: string;
  shot: string;
  gradient: string;
  /** Real, verified numbers only. Empty array = the stats row is hidden. */
  metrics: { label: string; value: string; note?: string }[];
  sections: CaseSection[];
  results: string[];
};

export const cases: Record<string, CaseData> = {
  "tools-bd": {
    slug: "tools-bd",
    name: "Tools.BD",
    title: "Tools.BD — instant DNS, WHOIS & email-security lookups",
    kind: "Network & Domain Tools",
    year: "2026",
    url: "https://tools.bd/",
    role: "Design, build & operations",
    stack: ["Go", "miekg/dns", "PostgreSQL", "Redis", "SSE", "Caddy"],
    summary:
      "A free suite of network utilities — analyse any domain's DNS, WHOIS and email security, or look up ASN, IP address and network prefix details. Built to answer 'what's wrong with this domain?' in seconds, not clicks.",
    shot: "/screens/bd-tools.jpg",
    gradient: "from-[#0071e3] via-[#4a6cf7] to-[#7d4bff]",
    // TODO(mehedi): replace with real, verified numbers — the page hides
    // the stats row while this array is empty.
    metrics: [],
    sections: [
      {
        heading: "The problem",
        body: [
          "Debugging a domain problem usually means chaining a dozen lookups: check propagation, then SPF, then DKIM, then WHOIS… each on a different ad-cluttered page that re-loads the world every time. Support engineers burn hours a week on exactly this loop.",
          "Tools.BD started as a fix for that loop — one place where a domain or IP answers everything, fast enough to use while someone is on the phone with you.",
        ],
      },
      {
        heading: "What the platform does",
        bullets: [
          "Full DNS analysis — A, AAAA, MX, TXT, NS, SOA and Friends. resolves against public resolvers.",
          "Email-security checks — SPF, DKIM and DMARC validation with plain-language verdicts, not raw records.",
          "WHOIS & registration details in a readable layout.",
          "ASN, IP and network-prefix lookups for hosting and routing context.",
        ],
        body: [],
      },
      {
        heading: "How it's built",
        body: [
          "The lookup engine is written in Go on top of miekg/dns — queries run concurrently rather than one record type after another, so a full analysis takes a single round trip of latency.",
          "Every page streams over Server-Sent Events: results appear the moment each record type resolves, instead of one blocking page load. Against popular domains most of the answer is already warm in the Redis cache, backed by PostgreSQL for anything that must persist.",
          "Caddy fronts the whole thing — automatic TLS, HTTP/3 and clean reverse-proxy routing.",
        ],
      },
    ],
    results: [
      "Full domain analysis in a single page-load, streamed as results resolve.",
      "Warm-cache lookups return instantly for domains you check repeatedly.",
      "Email-security verdicts a non-specialist can act on without reading raw DNS records.",
      // TODO(mehedi): add usage numbers (daily lookups, p95 response) once
      // the platform has been live long enough to measure them.
    ],
  },
};

export function getCase(slug: string): CaseData | undefined {
  return cases[slug];
}

export function hasCase(name: string): CaseData | undefined {
  return Object.values(cases).find((c) => c.name === name);
}
