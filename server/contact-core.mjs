/**
 * Shared contact-form logic — platform agnostic (web-standard
 * Request/Response). Used by the Vercel, Netlify, Cloudflare and
 * Node-server handlers.
 */

const RATE_LIMIT = 5; // messages per IP…
const RATE_WINDOW = 60 * 60 * 1000; // …per hour
const hits = new Map(); // ip → timestamps

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW);
  if (list.length >= RATE_LIMIT) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  return false;
}

/**
 * @param {Request} request
 * @param {(m: {name: string, email: string, message: string}) => Promise<void>} sendMail
 * @param {{ ip?: string }} [opts]
 */
export async function handleContact(request, sendMail, opts = {}) {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed." }, 405);
  }

  const ip = opts.ip || "unknown";
  if (rateLimited(ip)) {
    return json({ ok: false, error: "Too many messages — please try again later." }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const message = String(body?.message || "").trim();
  const website = String(body?.website || "").trim();

  // Honeypot: bots fill every field. Pretend success, send nothing.
  if (website) return json({ ok: true });

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return json(
      { ok: false, error: "Please provide a valid name, email and message (10+ characters)." },
      400,
    );
  }

  try {
    await sendMail({ name, email, message });
    return json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err?.message || err);
    return json(
      { ok: false, error: "Message could not be sent right now. Please email me directly." },
      500,
    );
  }
}
