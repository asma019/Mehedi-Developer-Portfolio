/**
 * Generates public/Mehedi-Hasan-CV.pdf — a clean one-page CV rendered
 * directly to PDF bytes (no dependencies). Rerun after editing content:
 *   node scripts/generate-cv.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ── Content (mirrors src/data/content.ts) ───────────────────── */
const cv = {
  name: "Mehedi Hasan",
  role: "Web Developer & Support Engineer",
  location: "Khulna, Bangladesh",
  email: "hello@mehedims.com",
  phone: "+880 1957 594446",
  website: "mehedims.com",
  profile:
    "Web developer and technical support engineer working at the intersection of frontend development, WordPress systems, hosting operations and practical user support. 4+ years building fast, reliable websites that stay reliable long after launch.",
  experience: [
    {
      company: "Zorn Ventures Limited",
      role: "Technical Support Engineer",
      period: "May 2026 — Present",
      summary:
        "Supporting the SatisfyHost and BengalCloud brands — helping customers resolve hosting and cloud-service issues through clear, dependable technical guidance.",
      points: [
        "Hosting & cloud troubleshooting across VPS, cPanel and custom PowerDNS infrastructure",
        "Built and operate a redundant PowerDNS cluster for the SatisfyHost and BengalCloud brands",
        "Developed WHMCS modules — PowerDNS PTR & DNS managers and easy product transfer",
        "Clear, reproducible communication that turns tickets into solutions",
      ],
    },
    {
      company: "TechZ IT",
      role: "Chief Information Officer",
      period: "2025",
      summary:
        "Led overall IT strategy, infrastructure management and digital transformation initiatives to improve system performance, security and scalability.",
      points: [
        "Oversaw development teams and technology operations",
        "Ensured efficient project delivery, cloud integration and alignment with business goals",
        "Directed infrastructure upgrades that improved security, uptime and scalability",
        "Led digital transformation initiatives across the company's service lines",
      ],
    },
    {
      company: "Independent · Upwork & Fiverr",
      role: "Freelance Web Developer",
      period: "2021 — Present",
      summary:
        "Delivering responsive websites, custom interfaces and technical improvements for remote clients worldwide.",
      points: [
        "15+ full-stack web applications and sites using Next.js, Laravel and React",
        "Architected a comprehensive academic ERP with Python and MySQL",
        "Specialised in WordPress speed optimisation and robust VPS management",
        "Launched my own products end to end — from Tools.BD network utilities to Laravel SaaS platforms",
      ],
    },
  ],
  education: {
    degree: "Diploma in Engineering — Computer Science Technology",
    school: "Mangrove Institute of Science and Technology",
    period: "2023 — 2027 (expected)",
    cert: "NSDA — Web Design and Development for Freelancing, Level 3 (result published December 2025)",
  },
  skills: [
    ["Frontend", "React, Next.js, TypeScript, Tailwind CSS, UI Systems, API Integration"],
    ["Backend & Data", "Node.js, Go, PHP, Laravel, Python, MySQL, PostgreSQL, Redis"],
    ["WordPress & CMS", "WordPress, LiteSpeed & Caching, Performance Audits, Ghost"],
    ["Hosting & Servers", "NGINX, Caddy, PowerDNS, VPS Setup, Ubuntu/AlmaLinux/Debian, cPanel, CloudPanel, WHMCS, AWS/Azure/DigitalOcean/Linode"],
    ["Performance & Growth", "Web Performance, Core Web Vitals, SEO, Technical Support"],
  ],
  languages: "Bengali — Native proficiency · English — Professional working proficiency",
};

/* ── Minimal PDF writer ─────────────────────────────────────── */

// Map the few non-ASCII chars we use into WinAnsi bytes.
const WIN_ANSI = {
  "\u2014": "\x97", "\u2013": "\x96", "\u00b7": "\xb7", "\u2022": "\x95",
  "\u2018": "\x91", "\u2019": "\x92", "\u201c": "\x93", "\u201d": "\x94",
  "\u00a9": "\xa9", "\u00e9": "\xe9",
};
const esc = (s) =>
  s.replace(/[\u2014\u2013\u00b7\u2022\u2018\u2019\u201c\u201d\u00a9\u00e9]/g, (c) => WIN_ANSI[c])
   .replace(/\\/g, "\\\\")
   .replace(/\(/g, "\\(")
   .replace(/\)/g, "\\)");

const W = 595, H = 842, M = 44; // A4, side margin
const dark = [0.06, 0.06, 0.09];
const accent = [0.42, 0.24, 1.0];
const gray = [0.43, 0.43, 0.45];
const body = [0.11, 0.11, 0.12];

// Rough Helvetica advance widths (fraction of font size).
function textWidth(s, size, bold = false) {
  let w = 0;
  for (const ch of s) {
    if ("iljtfr.,:;'()[]!| ".includes(ch)) w += 0.3;
    else if ("mwMW@".includes(ch)) w += 0.86;
    else if (ch >= "A" && ch <= "Z") w += 0.64;
    else if (ch >= "0" && ch <= "9") w += 0.56;
    else w += 0.51;
  }
  return w * size * (bold ? 1.06 : 1);
}

const ops = [];
let y = H;

const rect = (x, yy, w, h, rgb) =>
  ops.push(`${rgb.join(" ")} rg ${x} ${yy} ${w} ${h} re f`);
const line = (x1, y1, x2, y2, rgb, lw = 0.7) =>
  ops.push(`${rgb.join(" ")} RG ${lw} w ${x1} ${y1} m ${x2} ${y2} l S`);
const text = (s, x, yy, size, rgb, font = "F1") =>
  ops.push(`BT ${rgb.join(" ")} rg /${font} ${size} Tf ${x} ${yy} Td (${esc(s)}) Tj ET`);

function wrap(s, size, maxW, bold = false) {
  const words = s.split(" ");
  const lines = [];
  let cur = "";
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word;
    if (textWidth(test, size, bold) > maxW && cur) {
      lines.push(cur);
      cur = word;
    } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

function section(title) {
  y -= 26;
  text(title.toUpperCase(), M, y, 10, accent, "F2");
  line(M, y - 6, W - M, y - 6, [0.85, 0.85, 0.88], 0.8);
  y -= 16;
}

/* Header band */
rect(0, H - 96, W, 96, dark);
rect(0, H - 100, W, 4, accent);
text(cv.name, M, H - 46, 25, [1, 1, 1], "F2");
text(cv.role, M, H - 66, 11.5, [0.62, 0.51, 1], "F1");
text(`${cv.location}  ·  ${cv.email}  ·  ${cv.phone}  ·  ${cv.website}`, M, H - 84, 8.5, [0.72, 0.72, 0.78]);

/* Profile */
y = H - 128;
section("Profile");
for (const l of wrap(cv.profile, 9.5, W - 2 * M)) {
  text(l, M, y, 9.5, body);
  y -= 13;
}

/* Experience */
section("Experience");
for (const job of cv.experience) {
  text(`${job.company}  —  ${job.role}`, M, y, 10.5, dark, "F2");
  const pw = textWidth(job.period, 8.5);
  text(job.period, W - M - pw, y + 0.5, 8.5, gray, "F3");
  y -= 13;
  for (const l of wrap(job.summary, 9, W - 2 * M - 10)) {
    text(l, M + 10, y, 9, gray);
    y -= 12;
  }
  for (const p of job.points) {
    for (let i = 0; i < wrap(p, 9, W - 2 * M - 22).length; i++) {
      const l = wrap(p, 9, W - 2 * M - 22)[i];
      if (i === 0) text("\u2022", M + 10, y, 9, accent);
      text(l, M + 22, y, 9, body);
      y -= 12;
    }
  }
  y -= 8;
}

/* Education */
section("Education & Certification");
text(cv.education.degree, M, y, 10, dark, "F2");
y -= 13;
text(`${cv.education.school}  ·  ${cv.education.period}`, M, y, 9, gray);
y -= 16;
for (const l of wrap(cv.education.cert, 9, W - 2 * M)) {
  text(l, M, y, 9, body);
  y -= 12;
}

/* Skills */
section("Skills");
for (const [label, items] of cv.skills) {
  const l1 = wrap(`${label}: ${items}`, 9, W - 2 * M);
  text(`${label}:`, M, y, 9, dark, "F2");
  const lw = textWidth(`${label}: `, 9, true);
  text(l1[0].slice(label.length + 2), M + lw, y, 9, body);
  y -= 12;
  for (const l of l1.slice(1)) {
    text(l, M, y, 9, body);
    y -= 12;
  }
  y -= 2;
}

/* Languages */
section("Languages");
for (const l of wrap(cv.languages, 9, W - 2 * M)) {
  text(l, M, y, 9, body);
  y -= 12;
}

/* Footer */
rect(M, 52, 10, 10, accent);
text("CV generated from the portfolio at mehedims.com", M + 18, 56, 8, gray);

/* Assemble the file */
const stream = ops.join("\n");
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> /Contents 4 0 R >>`,
  `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>",
];

let pdf = "%PDF-1.4\n";
const offsets = [0];
for (let i = 0; i < objects.length; i++) {
  offsets.push(pdf.length);
  pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
}
const xref = pdf.length;
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= objects.length; i++) {
  pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

const out = join(root, "public", "Mehedi-Hasan-CV.pdf");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, pdf, "latin1");
console.log(`CV written: ${out} (${(pdf.length / 1024).toFixed(1)} kB)`);
