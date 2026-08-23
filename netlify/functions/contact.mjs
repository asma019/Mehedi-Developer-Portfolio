/**
 * Netlify function (v2, web-standard) — exposed as /api/contact
 * (see the redirect in netlify.toml). Sends via SMTP (nodemailer).
 * Set SMTP_* / MAIL_* env vars in Netlify → Site settings → Environment variables.
 */
import { handleContact } from "../../server/contact-core.mjs";
import { sendViaSmtp } from "../../server/send-smtp.mjs";

export default async function handler(request) {
  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  return handleContact(request, sendViaSmtp, { ip });
}

export const config = { path: "/api/contact" };
