import { ArrowUpRight, Download, Mail, MapPin, Phone } from "lucide-react";
import { contact, getEmail, navLinks, profile } from "../data/content";

const email = getEmail();

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-alt">
      {/* top aurora glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 left-1/2 h-[300px] w-[620px] -translate-x-1/2 rounded-full bg-accent/12 blur-[120px]" />
      </div>

      {/* giant watermark */}
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-4 select-none text-center sm:-bottom-9"
        aria-hidden
      >
        <span className="font-display text-[19vw] font-bold leading-none tracking-tight text-ink opacity-[0.045]">
          MEHEDI
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <img
                src="/favicon.svg"
                alt=""
                className="h-9 w-9 rounded-xl shadow-[0_4px_16px_rgba(124,92,255,0.45)]"
              />
              <span className="font-display text-lg font-semibold tracking-tight text-ink">
                {profile.name}
              </span>
            </a>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted">
              {profile.tagline} WordPress, hosting and cloud operations experience
              behind every build.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-muted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute h-full w-full animate-ping rounded-full bg-[#30d158] opacity-60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[#30d158]" />
              </span>
              {profile.availability}
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Footer">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[15px] text-muted transition-colors duration-200 hover:text-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Socials
            </h3>
            <ul className="mt-5 space-y-3">
              {contact.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 text-[15px] text-muted transition-colors duration-200 hover:text-ink"
                  >
                    {s.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + CV */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-3 text-[15px] text-muted">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-accent"
                >
                  <Mail size={15} className="text-accent" />
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${profile.phoneHref}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-accent"
                >
                  <Phone size={15} className="text-accent" />
                  {profile.phone}
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5">
                <MapPin size={15} className="text-accent" />
                {profile.location}
              </li>
            </ul>
            <a
              href={profile.cv}
              download
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-all duration-300 hover:border-accent/50 hover:text-accent active:scale-95"
            >
              <Download
                size={15}
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              />
              Download CV
            </a>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-line pt-7 text-[13px] text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {profile.name} · Designed & built in Khulna,
            Bangladesh
          </p>
          <a
            href={profile.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
          >
            {profile.website}
          </a>
        </div>
      </div>
    </footer>
  );
}
