/**
 * Sends the contact email via Cloudflare's Email Sending Worker binding.
 * No API token required — the binding is configured in wrangler.toml
 * under [[send_email]] and exposed to the worker as env.EMAIL.
 *
 * This replaces send-resend.mjs when the native Cloudflare Email binding
 * is preferred over the Resend HTTP API.
 */

/**
 * @param {{ name: string, email: string, message: string }} m
 * @param {object} emailBinding — env.EMAIL (the send_email binding)
 */
export async function sendViaEmailBinding({ name, email, message }, emailBinding) {
  if (!emailBinding) {
    throw new Error("EMAIL binding is not configured — add [[send_email]] to wrangler.toml");
  }

  const response = await emailBinding.send({
    to: process.env.MAIL_TO || "hello@mehedims.com",
    from: process.env.MAIL_FROM || "welcome@mehedims.com",
    subject: `Portfolio contact from ${name}`,
    html: `<h1>New contact message</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>`,
    text: `New contact message\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
  });

  if (!response || !response.messageId) {
    throw new Error("Email sending failed — no messageId returned");
  }

  return response;
}
