# TaskFlow

A full-stack task management web application where users can sign up, log in, and manage their tasks — create, edit, delete, filter, search, and track progress.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/taskflow run dev` — run the frontend (port 21998)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4 + shadcn/ui
- Auth: Clerk (Replit-managed)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/tasks.ts` — Tasks table schema
- `artifacts/api-server/src/routes/tasks.ts` — Task CRUD routes
- `artifacts/taskflow/src/` — React frontend
- `artifacts/taskflow/src/App.tsx` — Root app with Clerk + routing

## Architecture decisions

- Clerk auth via Replit-managed tenant; session cookies on web (no manual token handling)
- All tasks scoped to `userId` from Clerk; enforced server-side via `requireAuth` middleware
- OpenAPI-first: spec gates codegen, which gates the typed React Query hooks
- Single Express server handles both Clerk proxy path (`/api/__clerk`) and task API (`/api/tasks`)
- Row-level security enforced in app layer (userId filter on all queries)

## Product

TaskFlow is a personal task management app with:
- Secure signup/login via Clerk (email + OAuth)
- Full task CRUD — create, edit, delete tasks
- Task statuses: Pending / In Progress / Completed
- Dashboard with stats, search, and status filtering
- Dark glassmorphism UI with blue/cyan accents

## User preferences

- Dark glassmorphism aesthetic (deep navy, electric cyan accents)
- No emojis in UI

## Gotchas

- After any schema change in `lib/db/src/schema/`, run `pnpm run typecheck:libs` then `pnpm --filter @workspace/db run push`
- After any OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen`
- Clerk proxy path `/api/__clerk` is handled by Express before API routes — don't add auth middleware to it
- `proxyUrl` must be passed unconditionally to `<ClerkProvider>` (empty in dev is intentional)
- Set `tailwindcss({ optimize: false })` in vite.config.ts to prevent Clerk themes from breaking in prod

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `clerk-auth` skill for auth customization
