# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM oven/bun:1 AS builder

WORKDIR /app

COPY . .

# Install all dependencies — prepare hook runs `panda codegen`, which needs the files above.
RUN bun install --frozen-lockfile

RUN bun run build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM oven/bun:1-slim AS production

WORKDIR /app

# Copy only production manifests and install production deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts

# Copy compiled frontend assets from the builder stage
COPY --from=builder /app/dist ./dist

# Copy server source — Bun runs TypeScript directly, no transpile step needed
COPY --from=builder /app/server ./server
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3001

ENV NODE_ENV=production

CMD ["bun", "server/app.ts"]
