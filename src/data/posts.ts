/**
 * Blog posts - served at the real path /blog/<slug>, index at /blog.
 *
 * The body is a typed block list rather than raw markdown: no parser
 * dependency, and the inline renderer in PostView handles **bold** and
 * `code` spans. Write like you talk; anything you wouldn't put on your
 * CV, leave out.
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
    readingTime: "7 min",
    excerpt:
      "The order I actually work through: measure first, then caching, images, assets and hosting. Each step is cheap to try, and doing them in the wrong order wastes both.",
    tags: ["WordPress", "Performance", "Core Web Vitals"],
    body: [
      {
        type: "p",
        text: "Most slow WordPress sites are not slow for one exotic reason. They are slow for two or three boring reasons stacked on top of each other, and the order you fix them in matters. Caching an unoptimized page just makes a wasteful page arrive faster. This is the order I work through on every audit.",
      },
      { type: "h2", text: "1. Measure before you touch anything" },
      {
        type: "p",
        text: "Run PageSpeed Insights and note two things separately: TTFB and the rest. TTFB is the server talking time. If it is high, caching and hosting come first. If it is healthy, the payload and assets are your suspects. Take a screenshot of the baseline numbers. When you finish, you will want to prove what the work bought, and \"it feels faster\" does not convince anyone.",
      },
      {
        type: "quote",
        text: "Field data (what real visitors experienced) outranks lab data every time. A perfect lab score on a no-traffic site says very little.",
      },
      { type: "h2", text: "2. The server: caching and TTFB" },
      {
        type: "p",
        text: "If every request runs a full WordPress bootstrap, nothing else you do will matter much for logged-out traffic. Preference order:",
      },
      {
        type: "list",
        items: [
          "Server-level caching (LiteSpeed Cache on LiteSpeed hosts, FastCGI cache on NGINX). It serves before PHP even runs.",
          "A page caching plugin like WP Rocket or W3TC where server-level is not available.",
          "Object caching with Redis for logged-in-heavy sites and WooCommerce carts, where a full-page cache cannot apply.",
        ],
      },
      {
        type: "p",
        text: "While you are in there, check the boring stuff that drags every request: a stuck cron lock, thousands of expired transients parked in the options table, the Heartbeat API firing every 15 seconds in the admin. These do not show up in a plugin list, but they show up in TTFB.",
      },
      { type: "h2", text: "3. Images: the biggest byte, always" },
      {
        type: "p",
        text: "Most of the page weight lives here. Convert uploads to WebP (AVIF where the host supports it), resize them to their real display width instead of serving a 4000px original into an 800px slot, and lazy-load below the fold with `loading=\"lazy\"`. One trap to know: lazy-loading the hero image makes LCP worse, not better. Keep the LCP candidate eager and preloaded.",
      },
      { type: "h2", text: "4. Render-blocking assets" },
      {
        type: "p",
        text: "Every plugin adds its own CSS and JS. Inline the critical CSS for the fold, defer the rest, then audit the list honestly. A page builder theme plus slider plus popup plugin plus chat widget can easily stack a megabyte of parse-blocking JS before the first paint. Every plugin you delete is bandwidth and main-thread time you get back permanently, on every page, forever.",
      },
      { type: "h2", text: "5. Database clutter" },
      {
        type: "p",
        text: "Post revisions, orphaned transients and expired scheduler rows slow down the same queries the cache was protecting. A scheduled cleanup, plus limiting `WP_POST_REVISIONS`, keeps a busy site's tables from growing for no reason.",
      },
      { type: "h2", text: "6. Know when it is the host" },
      {
        type: "p",
        text: "Sometimes the code is fine and the box is small. A shared host with a couple of PHP workers will not survive a WooCommerce checkout burst no matter how well the theme is tuned. If TTFB stays high after caching is genuinely in place, it is a hosting problem. Say so, move or upgrade, then measure again.",
      },
      { type: "h2", text: "The wrap-up" },
      {
        type: "p",
        text: "Run the same measurements, put the after numbers next to the before, and hand over a one-page summary of what changed. That document is the difference between \"we made it faster\" and a client who comes back with their other sites. Some of my longest-running client relationships started from exactly one of these summaries.",
      },
      {
        type: "p",
        text: "This post is a working draft and I am still tightening it. If you would rather have someone run this loop on your site than read about it, [get in touch](/#contact).",
      },
    ],
  },
  {
    slug: "reproducible-support-questions",
    title: "Reproducible support: getting \"it doesn't work\" fixed in one reply",
    date: "2026-10-20",
    readingTime: "8 min",
    excerpt:
      "I have spent years answering hosting and infrastructure tickets. The reports that get fixed fastest all look the same. This is what to include, why it works, and what support engineers privately wish you knew.",
    tags: ["Support", "Debugging", "Hosting"],
    body: [
      {
        type: "p",
        text: "I have answered a lot of hosting and infrastructure tickets from the other side: PowerDNS clusters, VPSes, WHMCS installs, the odd 3 a.m. mail outage. Across thousands of them, one pattern holds without exception. The ticket that gets solved fastest is not the angriest one, the oldest one, or the one from the biggest account. It is the one where the problem was reproducible on the first read.",
      },
      {
        type: "quote",
        text: "A good bug report is a gift of time. You spent ten minutes writing precisely, and the engineer spends ten minutes fixing instead of ten picking their way toward the problem.",
      },
      { type: "h2", text: "The five facts every report needs" },
      {
        type: "p",
        text: "Whatever the product is (a website, a WHMCS module, a DNS zone, a VPS), a support engineer needs the same handful of facts:",
      },
      {
        type: "list",
        items: [
          "What you did, in order, from a clean start. Not \"I tried everything\", the actual steps, reproducible.",
          "What you expected and what you got instead. \"The page should show the customer list; it shows a blank page instead.\"",
          "The exact error text, copied, not paraphrased. \"Server error\" describes nothing; the real line and code describe everything.",
          "When it started and what changed. Nothing you know of changed is still an answer.",
          "Where you saw it: which URL, which browser and OS, which server or panel. One detail you thought was irrelevant is often exactly the missing one.",
        ],
      },
      { type: "h2", text: "Copy the error, capture the timing" },
      {
        type: "p",
        text: "Screenshots of code or output are worse than text every time. Copy the message into the ticket, keep the timestamps, and attach your own note about your timezone if the platform shows server time. Half of all \"it never happened for us\" arguments between a client and a hosting engineer are two clocks pointing at the same incident.",
      },
      { type: "p", text: "One good screenshot is still useful though: a full-page capture of the broken state, including the URL bar. What you want is the state of the world at that moment, not a zoomed crop of the one red box." },
      { type: "h2", text: "Try the boring separations first" },
      {
        type: "p",
        text: "Before you file anything, rule out the two layers that cause most false alarms. Another browser or a private window (this kills cache and extension theories instantly). A second network or device (this kills local DNS and ISP theories). If the problem follows the site, it is server side. If it follows your machine, no ticket was needed. Either way you now know something the engineer would have spent their first reply testing.",
      },
      { type: "h2", text: "Say what you already tried" },
      {
        type: "p",
        text: "The fastest way to shorten a ticket is to list what you already ruled out. \"Cleared cache, tried incognito, and the domain resolves but the PTR is missing\" saves a full round trip. Even better if you can name the pieces you know are relevant: this is a mail deliverability complaint, and the missing rDNS is called out in the first sentence.",
      },
      { type: "h2", text: "For support engineers: the standard that pays back" },
      {
        type: "p",
        text: "On my side of the desk, the same discipline applies in reverse. Reproduce the issue before asking anything. If you cannot reproduce it, that fact is a finding, and the very first reply should ask the smallest question that separates the two halves of reality (\"does it happen from another network?\"). Then ask every open question at once in that same reply. Every extra round trip is a day of someone waiting.",
      },
      {
        type: "p",
        text: "And when you close the ticket, say exactly what was wrong. Not \"resolved internally\" but the actual cause and the actual fix. That one closing paragraph is what makes the next similar ticket 80% mechanical, and it is the difference between a customer who tolerates the next outage and one who stays because they trust you.",
      },
      { type: "h2", text: "A short template you can steal" },
      {
        type: "code",
        text: "Subject: [site name] checkout fails on card save, HTTP 500 since Oct 14\n\nSteps from clean state:\n  1. open https://example.com/product/x\n  2. add to cart\n  3. go to checkout, fill card, click Save\n\nExpected: order completes\nGot: HTTP 500, full text from the console attached\nEnvironment: Chrome 129, Windows 11, from my office ISP\nStarted: Oct 14 morning, right after the plugin update I did Oct 13\nTried: incognito (same), another network (same), cleared site cache (same)\nImpact: about 1 in 20 orders, all cards, all of them since the update",
      },
      {
        type: "p",
        text: "Ten lines. Any engineer reading this walks straight to the plugin update. That is a draft in the right direction. If your team writes tickets like this and you want that energy on your own stack, [my contact form](/#contact) is at the bottom of every page.",
      },
    ],
  },
  {
    slug: "smoother-project-handoffs",
    title: "Handover notes: leaving a project that survives you",
    date: "2026-10-20",
    readingTime: "8 min",
    excerpt:
      "What separates a handoff a client thanks you for from one they quietly redo: the access inventory, the runbook, the walkthrough and the friendly-warmup window.",
    tags: ["Client work", "Documentation", "Process"],
    body: [
      {
        type: "p",
        text: "The handoff is the part of the project clients actually live with. You will be judged, months later, not by how elegant your code was but by what happened the first time something broke at a bad moment and you were, by design, not there. I have inherited other people's abandoned Laravel systems and WordPress sites, and I have handed over my own. The difference between the two experiences is rarely the code. It is whether the handover was designed or just happened.",
      },
      { type: "h2", text: "1. The access inventory, written down" },
      {
        type: "p",
        text: "Before anything else, make a list of every door the project has: domain registrar, DNS, hosting panel, deploy access, database secrets, mail provider, payment gateway, license renewals, analytics, the hosting bill itself. Everything, with who currently holds each key and when each one expires. A surprising number of clients have never seen this list for their own project until the day it matters.",
      },
      {
        type: "quote",
        text: "The most expensive phrase in client work is \"we lost access to the registrar account\"",
      },
      {
        type: "p",
        text: "Transfer credentials properly. A password manager share, or at minimum a one-time secret link, never a plain email thread. And hand over the billing ownership with it: a hosting account in your name that stays in your name is a future awkward month for both of you.",
      },
      { type: "h2", text: "2. The one-page runbook" },
      {
        type: "p",
        text: "Skip the 40-page document nobody reads. One page, in the words of whoever operates the site next, covering exactly this:",
      },
      {
        type: "list",
        items: [
          "How to deploy or publish a change (which repo, which branch, which button).",
          "Where the logs live when something looks wrong.",
          "The three most likely failure modes of this specific system and the first thing to check for each.",
          "What must never be touched (the .env file, the legacy subscriber table, the cron nobody has documented).",
        ],
      },
      { type: "h2", text: "3. Prove the recovery path actually works" },
      {
        type: "p",
        text: "A backup nobody has restored is a rumour. Before you step back, restore one to a staging copy and watch it stand up. Same for the SSL renewal, the cron, and the deploy: if the runbook claims a step works, make it have worked once in front of you. This is the difference between a handover document and an honest one.",
      },
      { type: "h2", text: "4. A walkthrough, then a written echo" },
      {
        type: "p",
        text: "Do one call, walk the client or their operator through the runbook and the panel, let them click through it. Then send the summary in writing the same day. The call builds confidence; the written echo is what they scroll through at midnight three months later when something feels off and they want to check before calling anyone.",
      },
      { type: "h2", text: "5. The friendly window" },
      {
        type: "p",
        text: "Offer a bounded support window after handover: 30 days is fair, two weeks if it is small. Put it in writing with what it covers (questions, small fixes, incidents) and what it does not (new features). This is not just politeness. It is the period when the next small break would otherwise still be your problem, so be in control of it either way. And clients remember the person whose 30-day window did not try to upsell them on the first call.",
      },
      { type: "h2", text: "What it buys you back" },
      {
        type: "p",
        text: "A clean handover feels like work you did not sell. It collects in less obvious currency: the maintenance contract for an inherited site, the referral when their friend needs a build, the emergency call three years later, and the price they happily accept the next time they hire you. Leaving things operable is, in the long run, one of the most commercial things you can do.",
      },
      {
        type: "p",
        text: "Still a working draft, and I will keep tightening it. If you are the one inheriting a project someone else left behind, [that is also a thing I do](/#contact).",
      },
    ],
  },
  {
    slug: "dns-records-that-matter",
    title: "DNS records, explained by someone who runs them for a living",
    date: "2026-10-20",
    readingTime: "9 min",
    excerpt:
      "I operate PowerDNS clusters and built a DNS lookup tool, so here is the plain-language tour of the record types that actually decide whether your site and your mail work, and the propagation myth that wastes half of everyone's afternoon.",
    tags: ["DNS", "Infrastructure", "Email Deliverability"],
    body: [
      {
        type: "p",
        text: "DNS is the invisible layer of every website and every mailbox, and it is the layer people touch least, understand least, and break most expensively. I run PowerDNS clusters behind a few hosting brands and I built Tools.BD mostly out of my own frustration with the tools I kept reaching for in support tickets. Here is the tour I wish clients could read before they email in.",
      },
      { type: "h2", text: "First: which nameservers, then which records" },
      {
        type: "p",
        text: "Every DNS question is really two questions. Which nameservers are authoritative for the domain, and what do the records on those nameservers say. Most \"I changed a record and nothing happened\" stories are at one of those two layers: either the registry still points at the old nameservers, or the change was made on a panel that is no longer the authoritative one. Check the nameservers first, every time.",
      },
      { type: "h2", text: "A and AAAA: where the site lives" },
      {
        type: "p",
        text: "An A record points a hostname at an IPv4 address, AAAA does the same for IPv6. Two things trip people up. First, a CNAME is not allowed at the zone apex (the bare domain), so you cannot CNAME example.com to somehost.example.net the way you can www. Second, a missing AAAA is harmless; a wrong one, pointing an IPv6 visitor at an address nobody serves, gives you the ghost bug where the site works on your desktop but fails on mobile data.",
      },
      { type: "h2", text: "MX: the ride-share queue for mail" },
      {
        type: "p",
        text: "MX records name the mail servers for the domain, each with a numeric priority where LOWER wins (ARMY-style: the lowest number is the first choice). Two classics: pointing MX at a CNAME instead of a real hostname (unwanted and technically invalid); and the copy-paste miss where you leave Google's defaults but point them at the wrong domain. Whatever hears your mail, verify it with a real lookup, not by waiting for a test message that never arrives.",
      },
      { type: "h2", text: "SPF, DKIM and DMARC: mail you can trust" },
      {
        type: "p",
        text: "Email authentication lives in TXT records, and this is where deliverability lives or dies.",
      },
      {
        type: "list",
        items: [
          "SPF declares which servers may send mail as your domain. One valid SPF per domain, all the `include:` mechanisms counted carefully, because there is a hard lookup limit (10) and twee marketing platforms each want five.",
          "DKIM signs the mail with a key published under a selector, something like mail._domainkey.example.com. It is per-mail-service, so switching platforms means adding your new platform's DKIM, not touching the old one.",
          "DMARC tells receivers what to do when the first two fail: quarantine or reject (the policy ladder), and where to send the reports. Start at p=none, read the aggregate reports for a week or two, then step up to quarantine and reject once the reports show what your legitimate senders look like.",
        ],
      },
      {
        type: "p",
        text: "The usual failure is not hostile; it is a business adding a fourth sending platform (CRM, billing, newsletter) and nobody revisits the SPF. Domains with valid SPF but a lookup count over the limit land in the exact same spam folder as those with no SPF at all.",
      },
      {
        type: "quote",
        text: "If you have ever wondered why your invoice emails reach Gmail but your newsletter does not, the answer is almost always in this trio of records.",
      },
      { type: "h2", text: "PTR: the record nobody owns but should" },
      {
        type: "p",
        text: "PTR is the reverse lookup, IP back to name, and it lives with whoever owns the IP, so it lives with your hosting company, not in your DNS panel. Receiving mail servers check it: a sending IP with no PTR, or a PTR that does not match the EHLO name, is a strong spam signal no amount of clean content can fix. If you run your own mail on a VPS, the PTR is one support ticket away, and it is the ticket most senders never think to open.",
      },
      { type: "h2", text: "TTL, and the propagation myth" },
      {
        type: "p",
        text: "Every record has a TTL: how long other servers may keep the answer cached. \"Propagation\" is not a wave washing over the planet. It is just hundreds of resolvers each counting down their own cached copy until it expires. Your change was live the moment you made it. Nobody has waited because the change is not live; they have waited because they already have the old answer and the clock is running.",
      },
      {
        type: "p",
        text: "Practical consequences: lower the TTL to something short (300 or less) a few hours before you plan any move, and remember that negative answers cache too. If a record did not exist an hour ago, resolvers may be holding \"does not exist\" for a while, and your fresh record can be invisible anyway.",
      },
      { type: "h2", text: "A small set of habits that saves hours" },
      {
        type: "list",
        items: [
          "Before changing records, write down the old values. Not in your head, a file. You will want them in an hour at 11 p.m.",
          "Change one thing at a time and re-check between changes. DNS failures love compound changes because you never learn which one did it.",
          "When the behaviour and the zone disagree, suspect the cache, then suspect that the panel you are looking at is not the authoritative nameserver.",
          "Use a real lookup (`dig`, or Tools.BD when you want it human-friendly) instead of trusting any panel's optimistic preview.",
        ],
      },
      {
        type: "p",
        text: "This one gets rewritten occasionally as I learn better ways to explain it. If you are staring at a zone file at midnight, [the contact form](/#contact) is right there, and DNS emergencies are a normal Tuesday for me.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
