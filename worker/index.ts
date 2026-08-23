/**
 * Cloudflare Worker entry — serves the static site from dist/ (assets
 * binding) and handles POST /api/contact via the Cloudflare Email
 * Sending Worker binding (no external API token required).
 *
 * Static assets are matched first by the platform; this worker only
 * sees requests that don't match a file (i.e. /api/contact and any
 * fallbacks).
 */
import { handleContact } from "../server/contact-core.mjs";
import { sendViaEmailBinding } from "../server/send-email-binding.mjs";

interface Env {
  MAIL_FROM?: string;
  MAIL_TO?: string;
  EMAIL: {
    send: (params: {
      to: string;
      from: string;
      subject: string;
      html?: string;
      text?: string;
    }) => Promise<{ messageId: string }>;
  };
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Expose dashboard variables to the shared sender via process.env
    for (const key of ["MAIL_FROM", "MAIL_TO"] as const) {
      const value = env[key];
      if (value && !process.env[key]) process.env[key] = value;
    }

    const url = new URL(request.url);
    if (url.pathname === "/api/contact") {
      const ip =
        request.headers.get("cf-connecting-ip") ||
        (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
        "unknown";
      return handleContact(request, (m) => sendViaEmailBinding(m, env.EMAIL), { ip });
    }

    // Everything else → static assets (SPA + 404.html fallback)
    return env.ASSETS.fetch(request);
  },
};
