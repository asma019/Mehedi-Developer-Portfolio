import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowRight,
  ArrowUpRight,
  Copy,
  Check,
  Download,
  Send,
  AlertCircle,
} from "lucide-react";
import { contact, profile, getEmail } from "../data/content";
import { SectionShell, Reveal, SpotlightCard, Magnetic } from "./ui";

const email = getEmail();

const channels = [
  { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
  { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phoneHref}` },
  { icon: Globe, label: "Website", value: profile.website, href: profile.websiteUrl },
];

const inputCls = (error?: string) =>
  `w-full rounded-xl border bg-surface-2 px-4 py-3 text-[15px] text-ink outline-none transition-all duration-200 placeholder:text-muted/60 focus:border-accent/60 focus:ring-2 focus:ring-accent/20 ${
    error ? "border-red-400/60" : "border-line"
  }`;

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please tell me your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address";
    if (form.message.trim().length < 10) next.message = "Tell me a little more (10+ characters)";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "", website: "" });
        setTimeout(() => setStatus("idle"), 8000);
      } else {
        setStatus("error");
        setServerError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setServerError("Network error — the server could not be reached.");
    }
  };

  return (
    <SectionShell id="contact" className="overflow-hidden">
      {/* aurora glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: "var(--hero-glow-opacity)" }}
        aria-hidden
      >
        <div className="animate-drift absolute bottom-[-30%] left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-accent/30 blur-[130px]" />
        <div
          className="animate-drift absolute bottom-[-22%] left-[18%] h-[320px] w-[320px] rounded-full bg-accent-2/22 blur-[110px]"
          style={{ animationDelay: "-6s" }}
        />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        {/* Left: pitch + actions */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/25 bg-accent-soft px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {contact.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl sm:leading-[1.06]">
              Let's build something
              <span className="text-gradient block">reliable.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              {contact.sub}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <Magnetic>
                <a
                  href={`mailto:${email}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent via-accent-strong to-accent-2 px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_44px_-8px_rgba(124,92,255,0.65)] transition-all duration-300 hover:shadow-[0_16px_54px_-6px_rgba(124,92,255,0.8)] active:scale-95"
                >
                  <Mail size={17} />
                  Email me
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
              </Magnetic>

              <button
                onClick={copyEmail}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-3.5 text-[15px] font-medium transition-all duration-300 active:scale-95 ${
                  copied
                    ? "border-accent/50 bg-accent-soft text-accent"
                    : "glass border-line-strong text-ink hover:border-accent/50 hover:text-accent"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "check" : "copy"}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="grid place-items-center"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </motion.span>
                </AnimatePresence>
                {copied ? "Copied!" : "Copy email"}
              </button>

              <a
                href={profile.cv}
                download
                className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/60 px-5 py-3.5 text-[15px] font-medium text-muted transition-all duration-300 hover:border-accent/50 hover:text-accent active:scale-95"
              >
                <Download size={16} />
                CV
              </a>
            </div>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap gap-2.5"
          >
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.label === "Website" ? "_blank" : undefined}
                rel="noreferrer"
                className="glass flex items-center gap-2.5 rounded-full border border-line px-4.5 py-2.5 text-sm text-muted transition-all duration-300 hover:border-accent/40 hover:text-ink hover:shadow-[0_6px_24px_rgba(0,0,0,0.15)]"
              >
                <c.icon size={15} className="text-accent" />
                {c.value}
              </a>
            ))}
            <span className="glass flex items-center gap-2.5 rounded-full border border-line px-4.5 py-2.5 text-sm text-muted">
              <MapPin size={15} className="text-accent" />
              {profile.location}
            </span>
          </motion.div>

          <Reveal delay={0.35}>
            <div className="mt-9 flex flex-wrap items-center gap-2.5">
              {contact.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-muted transition-all duration-300 hover:border-accent/50 hover:text-ink"
                >
                  {s.label}
                  <ArrowUpRight
                    size={14}
                    className="text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right: form */}
        <Reveal delay={0.15}>
          <SpotlightCard className="rounded-[2rem] p-8 sm:p-10">
            <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
              Send a message
            </h3>
            <p className="mt-1.5 text-sm text-muted">
              Goes straight to my inbox — no email app needed.
            </p>

            <form onSubmit={submit} noValidate className="mt-7 space-y-5">
              {/* honeypot — invisible to humans, catnip for spam bots */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="cf-name" className="mb-2 block text-[13px] font-medium text-ink">
                    Name
                  </label>
                  <input
                    id="cf-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className={inputCls(errors.name)}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="cf-email" className="mb-2 block text-[13px] font-medium text-ink">
                    Email
                  </label>
                  <input
                    id="cf-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className={inputCls(errors.email)}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="cf-message" className="mb-2 block text-[13px] font-medium text-ink">
                  Message
                </label>
                <textarea
                  id="cf-message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="What are you building? Timeline? Budget range?"
                  className={`${inputCls(errors.message)} resize-none`}
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent via-accent-strong to-accent-2 px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_36px_-8px_rgba(124,92,255,0.6)] transition-all duration-300 hover:shadow-[0_14px_46px_-6px_rgba(124,92,255,0.75)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>
                      Sending…
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="grid place-items-center"
                      >
                        <Send size={15} />
                      </motion.span>
                    </>
                  ) : (
                    <>
                      Send message
                      <Send
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {status === "sent" && (
                    <motion.p
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-[13px] text-accent"
                    >
                      <Check size={14} />
                      Message sent — I&apos;ll get back to you soon.
                    </motion.p>
                  )}
                  {status === "error" && (
                    <motion.p
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-[13px] text-red-400"
                    >
                      <AlertCircle size={14} />
                      {serverError}{" "}
                      <a href={`mailto:${email}`} className="underline underline-offset-2">
                        Email me directly
                      </a>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </SpotlightCard>
        </Reveal>
      </div>
    </SectionShell>
  );
}
