/**
 * Sends the contact email through the Resend HTTP API.
 * Used on Cloudflare Workers/Pages, which cannot open raw SMTP sockets.
 * Config: RESEND_API_KEY / MAIL_FROM / MAIL_TO   (see .env.example)
 */

/**
 * @param {{ name: string, email: string, message: string }} m
 */
export async function sendViaResend({ name, email, message }) {
  const { RESEND_API_KEY, MAIL_FROM, MAIL_TO } = process.env;
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: MAIL_FROM || "Portfolio <onboarding@resend.dev>",
      to: [MAIL_TO || "hello@mehedims.com"],
      reply_to: email,
      subject: `Portfolio contact from ${name}`,
      text: `${message}\n\n— ${name} (${email})`,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend API error ${res.status}: ${await res.text()}`);
  }
}
