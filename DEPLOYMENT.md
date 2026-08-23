# Deployment Guide

The site is a Vite SPA that deploys to **Vercel, Netlify, Cloudflare
(Pages/Workers), Render and Heroku** from the same GitHub repo. The
contact form (`POST /api/contact`) works on every platform, and all SEO
links (canonical, sitemap, robots.txt, llms.txt, structured data) follow
the `VITE_SITE_URL` you set — one env var runs the site on any domain.

## Environment variables

Copy `.env.example` → `.env` for local runs; set the same vars in your
platform's dashboard for deployments.

| Variable | What it does |
|---|---|
| `VITE_SITE_URL` | Canonical domain, e.g. `https://mehedims.com` — used in ALL SEO files/meta at build time |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_SECURE` | SMTP server for the contact form (Vercel, Netlify, Render, Heroku) |
| `MAIL_FROM` | From header, e.g. `"Portfolio Contact <you@example.com>"` |
| `MAIL_TO` | Inbox that receives contact messages |
| `RESEND_API_KEY` | Cloudflare only (Workers can't open SMTP sockets) — free tier at https://resend.com |
| `PORT` | Used by `node server.js` (Render/Heroku set it automatically) |

### SMTP examples
- **Gmail** — `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`,
  `SMTP_SECURE=false`, `SMTP_PASS` = an App Password
  (create at https://myaccount.google.com/apppasswords)
- **Zoho** — `smtp.zoho.com`, port `465`, `SMTP_SECURE=true`
- **Brevo / SendGrid / Mailgun** — use the SMTP credentials from their dashboards

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

## Cloudflare (Pages / Workers)

1. https://dash.cloudflare.com → Workers & Pages → Create → Pages →
   Connect to Git.
2. Build command `npm run build`, output dir `dist`. `wrangler.toml`
   and `functions/api/contact.ts` are picked up automatically.
3. Settings → Variables: set `VITE_SITE_URL`, `MAIL_FROM`, `MAIL_TO`
   and **`RESEND_API_KEY`** (Workers cannot use raw SMTP — the form sends
   through Resend's HTTP API; free tier works).
4. CLI alternative: `npx wrangler pages deploy dist --project-name mehedi-portfolio`.

## Render

1. https://render.com → New → Blueprint → point at the repo
   (`render.yaml` is auto-detected).
2. Fill in the env vars when prompted (SMTP set).
3. Deploys as a Node web service running `node server.js`, which serves
   `dist/` and the contact API.

## Heroku

1. `heroku create your-app-name`
2. `heroku config:set VITE_SITE_URL=https://your-app.herokuapp.com SMTP_HOST=... SMTP_PORT=587 SMTP_USER=... SMTP_PASS=... MAIL_TO=...`
3. `git push heroku main` — the `Procfile` starts `node server.js`.

---

## Local production test

```bash
npm run build
npm start          # http://localhost:3000
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello from curl"}'
```

With placeholder SMTP values in `.env` the endpoint answers
`{"ok":false,"error":"Message could not be sent right now..."}` — that
proves the wiring; fill real SMTP credentials to receive the email.

## Rebuilding SEO for a new domain

```bash
VITE_SITE_URL=https://newdomain.com npm run build
```

`sitemap.xml`, `robots.txt`, `llms.txt` and all meta/JSON-LD in
`index.html` are regenerated for that domain automatically.
