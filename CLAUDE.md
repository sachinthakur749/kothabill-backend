# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KothaBill is a property and bill management REST API built with Node.js + TypeScript + Express + PostgreSQL.

## Commands

```bash
# Development
npm run dev          # Start with hot reload (ts-node-dev)
npm run build        # Compile TypeScript → dist/
npm start            # Run compiled production build

# Code quality
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix ESLint errors
npm run format       # Prettier format

# Testing
npm test             # Run tests once
npm run test:watch   # Watch mode
npm run test:coverage
```

## Architecture

**Pattern:** MVC with a services layer

```
src/
├── index.ts          # Express app entry, middleware stack
├── config/           # DB pool (pg), Winston logger, Swagger setup
├── controllers/      # HTTP request handlers
├── services/         # Business logic
├── models/           # Data access — raw SQL via pg (NOT Prisma)
├── routes/           # Express routers with swagger-jsdoc annotations
├── middlewares/      # auth.ts (JWT), errorHandler.ts, validation.ts (Zod)
└── utils/            # Response formatting helpers
```

**Middleware stack order** (in `index.ts`): JSON/URL parsing → CORS → Morgan→Winston logging → rate limiting → routes → error handler.

**API structure:** All routes prefixed `/api`; Swagger UI at `/api-docs`.

## Key Technical Decisions

- **Database:** PostgreSQL (Neon) via `pg` driver (`import { Pool } from 'pg'`). The pool is lazily initialized via `getPool()` in `src/config/database.ts` — this is intentional so the pool is only created after `dotenv.config()` runs in `index.ts`. Always import `{ pool }` (which is `getPool`) from `@config/database` and call it as a function: `pool().query(...)`. Never instantiate `new Pool()` directly elsewhere. The design doc mentions Prisma — do not introduce it.
- **Validation:** Zod schemas used in `middlewares/validation.ts`; apply to all incoming request bodies.
- **Auth:** JWT with refresh tokens; middleware in `middlewares/auth.ts`.
- **TypeScript path aliases:** `@/*`, `@config/*`, `@controllers/*`, etc. are configured in `tsconfig.json` — use them for imports.
- **Line width:** 100 characters (Prettier config).

## Environment Setup

Copy `.env.example` to `.env`. Key variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string (includes SSL params) |
| `JWT_SECRET` / `REFRESH_TOKEN_SECRET` | Auth token signing |
| `CORS_ORIGIN` | Allowed origins |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX_REQUESTS` | Rate limiting |
| `LOG_LEVEL` / `LOG_FILE` | Winston logging |

Database is hosted on Neon (serverless PostgreSQL). SSL is configured via `ssl: { rejectUnauthorized: false }` in the pool — do not remove this.
