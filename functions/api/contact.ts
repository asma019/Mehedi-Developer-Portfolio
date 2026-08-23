/**
 * Cloudflare Pages Function — POST /api/contact
 * Workers cannot open raw SMTP sockets, so this uses the Resend HTTP API.
 * Set RESEND_API_KEY / MAIL_FROM / MAIL_TO in Cloudflare → Pages → Settings → Variables.
 */
import { handleContact } from "../../server/contact-core.mjs";
import { sendViaResend } from "../../server/send-resend.mjs";

interface PagesEventContext {
  request: Request;
}

export const onRequestPost = async ({ request }: PagesEventContext) => {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "unknown";
  return handleContact(request, sendViaResend, { ip });
};

export const onRequest = async ({ request }: PagesEventContext) => {
  if (request.method === "POST") return onRequestPost({ request });
  return new Response(JSON.stringify({ ok: false, error: "Method not allowed." }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};
