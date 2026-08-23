/**
 * Sends the contact email over SMTP with nodemailer.
 * Config: SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_SECURE /
 *         MAIL_FROM / MAIL_TO   (see .env.example)
 *
 * Used on Vercel, Netlify, Render and Heroku.
 */
import nodemailer from "nodemailer";

/** @param {string} text */
const esc = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * @param {{ name: string, email: string, message: string }} m
 */
export async function sendViaSmtp({ name, email, message }) {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
    MAIL_FROM,
    MAIL_TO,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASS)");
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const subject = `Portfolio contact from ${name}`;
  const text = `${message}\n\n— ${name} (${email})`;
  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px">
      <h2 style="margin:0 0 12px">New portfolio message</h2>
      <p style="margin:0 0 12px"><strong>From:</strong> ${esc(name)} &lt;<a href="mailto:${esc(email)}">${esc(email)}</a>&gt;</p>
      <p style="white-space:pre-wrap;line-height:1.6;margin:0">${esc(message)}</p>
    </div>`;

  await transport.sendMail({
    from: MAIL_FROM || SMTP_USER,
    to: MAIL_TO || SMTP_USER,
    replyTo: `${name} <${email}>`,
    subject,
    text,
    html,
  });
}
