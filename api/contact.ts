/**
 * Vercel serverless function — POST /api/contact
 * Web-standard Request/Response; sends via SMTP (nodemailer).
 * Set SMTP_* / MAIL_* env vars in Vercel → Project → Settings → Environment Variables.
 */
import { handleContact } from "../server/contact-core.mjs";
import { sendViaSmtp } from "../server/send-smtp.mjs";

export default async function handler(request: Request): Promise<Response> {
  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  return handleContact(request, sendViaSmtp, { ip });
}
