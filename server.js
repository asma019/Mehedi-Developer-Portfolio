/**
 * Production server for Render / Heroku (and local production testing).
 * - Serves the built site from dist/ with SPA fallback
 * - POST /api/contact → sends the message via SMTP (server/send-smtp.mjs)
 *
 * Start: npm start   (after `npm run build`)
 */
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { handleContact } from "./server/contact-core.mjs";
import { sendViaSmtp } from "./server/send-smtp.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(__dirname, "dist");
const PORT = Number(process.env.PORT) || 3000;

/* ── Tiny .env loader (dev convenience; platforms inject real env vars) ── */
try {
  const env = await readFile(join(__dirname, ".env"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, "");
    if (!(m[1] in process.env)) process.env[m[1]] = value;
  }
} catch {
  /* no .env — fine */
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
  ".ico": "image/x-icon",
};

async function serveFile(res, filePath, cacheControl, status = 200) {
  try {
    const data = await readFile(filePath);
    res.writeHead(status, {
      "Content-Type": MIME[extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": cacheControl || "public, max-age=3600",
      "Content-Length": data.length,
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const path = decodeURIComponent(url.pathname);

  /* ── Contact API ── */
  if (path === "/api/contact" && req.method === "POST") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const request = new Request(`http://localhost${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: Buffer.concat(chunks),
    });
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "unknown";
    const result = await handleContact(request, sendViaSmtp, { ip });
    const body = await result.text();
    res.writeHead(result.status, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
    res.end(body);
    return;
  }

  /* ── Any other method on the API path is not allowed ── */
  if (path === "/api/contact") {
    res.writeHead(405, { "Content-Type": "application/json", Allow: "POST" });
    res.end(JSON.stringify({ ok: false, error: "Method not allowed." }));
    return;
  }

  /* ── Static files + SPA fallback ── */
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(DIST, safe);

  if (filePath.startsWith(DIST)) {
    try {
      const stats = await stat(filePath);
      if (stats.isFile()) {
        const immutable = path.startsWith("/assets/");
        return serveFile(
          res,
          filePath,
          immutable ? "public, max-age=31536000, immutable" : "public, max-age=3600",
        );
      }
    } catch {
      /* fall through to SPA */
    }
    // Directory root → the app
    if (path === "/" || path === "") {
      return serveFile(res, join(DIST, "index.html"), "no-cache");
    }

    // Unknown paths get the styled 404 page with a real 404 status
    // (the SPA inside renders the NotFound view via pathname check).
    return serveFile(res, join(DIST, "404.html"), "no-cache", 404);
  }

  res.writeHead(400, { "Content-Type": "text/plain" });
  res.end("Bad request");
});

server.listen(PORT, () => {
  console.log(`Portfolio server running on http://localhost:${PORT}`);
});
