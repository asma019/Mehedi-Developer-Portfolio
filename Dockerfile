# ──────────────────────────────────────────────────────────────
# Multi-arch build: works on x86-64 (AMD64), ARM64 (Raspberry Pi
# 4/5 aarch64) and ARM32v7 (Raspberry Pi 3/4 with a 32-bit OS).
# Docker picks the matching variant of node:22-bookworm-slim for
# the host CPU automatically — one file, every architecture.
# The app itself is pure JavaScript, so the build output (dist/)
# and runtime behaviour are identical on all of them.
# ──────────────────────────────────────────────────────────────

# ---- stage 1: build the static site --------------------------
FROM node:22-bookworm-slim AS build

WORKDIR /app

# Install ALL dependencies (dev deps are needed for the Vite build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the source and build (npm run build = tsc -b && vite build)
COPY . .
RUN npm run build

# ---- stage 2: slim runtime ----------------------------------
FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Only production dependencies at runtime (nodemailer for /api/contact)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Prebuilt site + the Node server (static serving + contact API)
COPY --from=build /app/dist ./dist
COPY server.js ./
COPY server ./server

# Deplo / Docker set PORT per environment; server.js reads it
EXPOSE 3000
CMD ["node", "server.js"]
