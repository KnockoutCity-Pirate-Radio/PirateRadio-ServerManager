# Pirate Radio: Server Manager

> A web-based admin dashboard for the Knockout City Private Servers.

[![Bun](https://img.shields.io/badge/runtime-Bun-black?logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![CI](https://github.com/KnockoutCity-Pirate-Radio/PirateRadio-ServerManager/actions/workflows/ci.yml/badge.svg)](https://github.com/KnockoutCity-Pirate-Radio/PirateRadio-ServerManager/actions/workflows/ci.yml)

## What Is This?

**Pirate Radio: Server Manager** is an internal admin dashboard for operators of a Knockout City Private Server instance. It connects directly to the server's PostgreSQL database and provides a browser-based UI to inspect and manage the live server.

> **Note:** This tool has no authentication layer. It is intended for trusted operator use on a private network — do not expose it to the public internet.

## Features

- **Dashboard** — Live view of connected players with ping and region info, aggregate stats (lowest/highest/average ping, total user count), and a maintenance-mode alert banner. Auto-refreshes every 10 seconds.
- **User Management** — Browse all registered accounts with XP, MMR, currency balances (Style Chips / Holo Bux), crew membership, allowlist flags, and active matchmaking state. Search by username. Remove matchmaking cooldown penalties.
- **Crew Browser** — View all crews with member lists, captain identification, join timestamps, member counts, and visibility flags.
- **News Management** — Full CRUD for in-game news entries. Supports multi-slot layout, platform targeting, per-item priority, and full localisation (11 languages per item).
- **Maintenance Windows** — Schedule deny-login periods with start/end times. Per-period localised messages are shown to blocked players. A maintenance allowlist lets specific players still log in during downtime.
- **Matchmaking Tunables** — Inspect and live-edit numeric server tunables (MMR weights, queue timeouts, cooldown scaling, crew settings, etc.) with tag filtering and fuzzy search. Changes persist immediately to the database.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TanStack Router (file-based), PandaCSS |
| Backend | Hono.js, Drizzle ORM |
| Database | PostgreSQL |
| Runtime | Bun |
| Language | TypeScript 5.9 (strict) |
| Linting | Biome |
| Build | Vite 7 |

## Prerequisites

- A running Knockout City private server with its PostgreSQL database (`viper` schema)
- [Bun](https://bun.sh) v1.1+ **or** Docker + Docker Compose

## Quick Start

### Option A — Docker Compose (Recommended)

```bash
cp .env.example .env
# Edit .env if needed (see Configuration below)
docker compose up
```

The dashboard will be available at **http://localhost:3001**.

### Option B — Manual (Development)

```bash
# 1. Install dependencies (also runs PandaCSS codegen automatically)
bun install

# 2. Copy and configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# 3. Start the API server (port 3001) and Vite dev server (port 3000) in parallel
bun run dev
```

Open **http://localhost:3000** for the dev server (hot-reloading). The API runs on port 3001 and is proxied automatically.

### Option C — Add to the ServerDocker Compose (Production)

The recommended production setup is to run the Server Manager as an additional service inside the [ServerDocker](https://github.com/kocxyz/ServerDocker) compose file. This way it shares the same Docker network as the `postgres` service and needs no exposed database port.

Add the following service to `compose.yaml` in your ServerDocker directory:

```yaml
  server-manager:
    image: ghcr.io/knockoutcity-pirate-radio/pirate-radio-server-manager:latest
    # Alternatively, build from source:
    # build: /path/to/pirate-radio-server-manager
    environment:
      DATABASE_URL: postgres://postgres:postgres@postgres:5432/koc
      NODE_ENV: production
    ports:
      - '3001:3001'
    depends_on:
      - postgres
    restart: unless-stopped
```

Then bring it up alongside the server:

```bash
docker compose up -d
```

The dashboard will be available at **http://localhost:3001**. Since `server-manager` is in the same compose project as `postgres`, it resolves the `postgres` hostname directly — no extra network configuration needed.

> **Tip:** If you changed the default `POSTGRES_USER`, `POSTGRES_PASSWORD`, or `POSTGRES_DB` values in the ServerDocker compose, update the `DATABASE_URL` accordingly.

## Configuration

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string pointing at the Knockout City server database. Example: `postgres://postgres:postgres@postgres:5432/koc` |

Copy `.env.example` to `.env` and fill in your values. The `.env` file is gitignored and will never be committed.

## Development

```bash
bun run dev          # Start API (port 3001) + Vite dev server (port 3000)
bun run lint         # Biome lint
bun run check        # Biome lint + format check
bun run typecheck    # TypeScript strict typecheck (tsc --noEmit)
bun run test         # Vitest unit tests
bun run build        # Vite production build + tsc
```

### Project Structure

```
server/
  app.ts                # Hono entry point — listens on port 3001
  db/
    index.ts            # Drizzle + postgres.js client init
    schema.ts           # Full database schema (40+ tables)
  routes/api/           # One file per API resource
    crews.ts
    users.ts
    stats.ts
    news.ts
    maintenance.ts
    tunables.ts

src/
  routes/               # TanStack file-based frontend routes
    index.tsx           # Dashboard (/)
    crew/               # Crew browser (/crew)
    user/               # User management (/user)
    news/               # News editor (/news)
    maintenance/        # Maintenance windows (/maintenance)
    tunables/           # Tunable editor (/tunables)
  ui/                   # Custom component library (PandaCSS + Ark UI)
  data/                 # Static data: tunable definitions, currencies, languages, shared types
  components/           # Feature-specific React components
```

### Code Style

This project uses [Biome](https://biomejs.dev/) for linting and formatting:

- Single quotes
- No semicolons
- 100-character line limit
- 2-space indentation
- Kebab-case filenames

Run `bun run check` before submitting a PR.

## API Reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/stats` | Connected players, ping stats, total user count |
| `GET` | `/api/users` | All users with XP, MMR, cooldown, funds, crew, allowlist |
| `GET` | `/api/users/search?q=` | Search users by username (up to 25 results) |
| `DELETE` | `/api/users/:id/cooldown` | Remove matchmaking penalty for a user |
| `GET` | `/api/crews` | All crews with members and captain info |
| `GET` | `/api/news` | All news entries with items and localised text |
| `POST` | `/api/news` | Create a news entry |
| `PUT` | `/api/news/:name` | Replace all items for a news entry |
| `DELETE` | `/api/news/:name` | Delete a news entry |
| `GET` | `/api/maintenance` | All deny-login periods |
| `POST` | `/api/maintenance` | Create a deny-login period |
| `DELETE` | `/api/maintenance/:id` | Delete a deny-login period |
| `GET` | `/api/maintenance/allowlist` | Users always allowed during maintenance |
| `POST` | `/api/maintenance/allowlist` | Add user to maintenance allowlist |
| `DELETE` | `/api/maintenance/allowlist/:userId` | Remove user from allowlist |
| `GET` | `/api/tunables` | All numeric server tunables |
| `PUT` | `/api/tunables` | Upsert one or more tunables |