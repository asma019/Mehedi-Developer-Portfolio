# Deployment Guide

The site is a Vite SPA that deploys to **Vercel, Netlify, Cloudflare
(Pages/Workers), Render and Heroku** from the same GitHub repo. The
contact form (`POST /api/contact`) works on every platform, and all SEO
links (canonical, sitemap, robots.txt, llms.txt, structured data) follow
the `VITE_SITE_URL` you set - one env var runs the site on any domain.

## Environment variables

Copy `.env.example` → `.env` for local runs; set the same vars in your
platform's dashboard for deployments.

| Variable | What it does |
|---|---|
| `VITE_SITE_URL` | Canonical domain, e.g. `https://mehedims.com` - used in ALL SEO files/meta at build time |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_SECURE` | SMTP server for the contact form (Vercel, Netlify, Render, Heroku) |
| `MAIL_FROM` | From header, e.g. `"Portfolio Contact <you@example.com>"` |
| `MAIL_TO` | Inbox that receives contact messages |
| `RESEND_API_KEY` | Cloudflare only (Workers can't open SMTP sockets) - free tier at https://resend.com |
| `PORT` | Used by `node server.js` (Render/Heroku set it automatically) |

### SMTP examples
- **Gmail** - `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`,
  `SMTP_SECURE=false`, `SMTP_PASS` = an App Password
  (create at https://myaccount.google.com/apppasswords)
- **Zoho** - `smtp.zoho.com`, port `465`, `SMTP_SECURE=true`
- **Brevo / SendGrid / Mailgun** - use the SMTP credentials from their dashboards

---

## Vercel

1. Push this repo to GitHub, then https://vercel.com/new → import it.
2. Framework preset **Vite** is auto-detected (`vercel.json` locks it in).
3. Settings → Environment Variables: add `VITE_SITE_URL` + all `SMTP_*`
   and `MAIL_*` vars.
4. Deploy. The function at `api/contact.ts` serves `/api/contact`.

## Netlify

1. https://app.netlify.com → Add new site → Import from Git.
2. Build command `npm run build`, publish dir `dist` (from `netlify.toml`).
3. Site settings → Environment variables: same vars as above.
4. Deploy. `netlify/functions/contact.mjs` is exposed at `/api/contact`
   by the redirect in `netlify.toml`.

## Cloudflare (Workers + Static Assets)

1. https://dash.cloudflare.com → Workers & Pages → Create → connect your
   Git repo (Workers Builds flow).
2. Build command `npm run build`, deploy command `npx wrangler deploy`
   (the default). `wrangler.toml` + `worker/index.ts` handle everything:
   static assets from `dist/`, styled 404 page, and `/api/contact`.
3. Settings → Variables and Secrets: set `VITE_SITE_URL`, `MAIL_FROM`,
   `MAIL_TO` and **`RESEND_API_KEY`** (Workers cannot use raw SMTP - the
   form sends through Resend's HTTP API; free tier works).
4. CLI alternative: `npx wrangler deploy`.

> Note: if you previously created a **Pages** project with the same name,
> delete it first - this repo now deploys as a Worker with static assets.

## Render

1. https://render.com → New → Blueprint → point at the repo
   (`render.yaml` is auto-detected).
2. Fill in the env vars when prompted (SMTP set).
3. Deploys as a Node web service running `node server.js`, which serves
   `dist/` and the contact API.

## Heroku

1. `heroku create your-app-name`
2. `heroku config:set VITE_SITE_URL=https://your-app.herokuapp.com SMTP_HOST=... SMTP_PORT=587 SMTP_USER=... SMTP_PASS=... MAIL_TO=...`
3. `git push heroku main` - the `Procfile` starts `node server.js`.

---

## Deplo (self-hosted, incl. Raspberry Pi)

On a self-hosted Deplo server (Raspberry Pi or any x86-64/ARM box),
use the repo's **Dockerfile** as the build method instead of the
auto-detect (Railpack) path:

1. Create the app, point it at this repo.
2. In the app's build settings pick **Dockerfile** as the build method.
3. Set the same env vars as the table above (`VITE_SITE_URL`, `SMTP_*`,
   `MAIL_*`); Deplo injects them into the container at run time.
   Deplo assigns the public port; `server.js` reads `PORT`.

Why: Railpack builds are currently broken on ARM hosts — Deplo's agent
requests a `railpack-v…-aarch64-unknown-linux-musl.tar.gz` asset, but
railpack publishes releases under `arm64` naming, so the download 404s
on every ARM machine and every railpack version. A Dockerfile build
skips that step entirely.

The Dockerfile is multi-arch: `node:22-bookworm-slim` publishes
variants for **AMD64 (x86-64), ARM64 (aarch64) and ARM32v7** and Docker
selects the right one for the host CPU, so the same file builds on a
x86-64 VPS and on a Raspberry Pi. (Actual floor: ARM32v7 — Raspberry Pi
Zero/1 are ARMv6 and have no official Node ≥ 20 binaries.)

## Local production test

```bash
npm run build
npm start          # http://localhost:3000
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello from curl"}'
```

With placeholder SMTP values in `.env` the endpoint answers
`{"ok":false,"error":"Message could not be sent right now..."}` - that
proves the wiring; fill real SMTP credentials to receive the email.

## Rebuilding SEO for a new domain

```bash
VITE_SITE_URL=https://newdomain.com npm run build
```

`sitemap.xml`, `robots.txt`, `llms.txt` and all meta/JSON-LD in
`index.html` are regenerated for that domain automatically.
