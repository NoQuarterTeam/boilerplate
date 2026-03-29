# NoQuarter Boilerplate

Full-stack TypeScript boilerplate built around a `TanStack Start` web app, `vite-plus` tooling, an Expo app, shared API/data packages, auth, and email.

## Main Technologies

- Runtime and workspace management: `bun` workspaces, root dependency catalog, Node `>=24`
- Web app: `TanStack Start` on React 19 + Vite, with TanStack Router, TanStack Query, and Nitro
- Mobile app: Expo 55, Expo Router, React Native, Uniwind
- API layer: tRPC, Zod, SuperJSON
- Authentication: Better Auth with the Drizzle adapter, Expo client integration, email/password flows
- Database: Drizzle ORM, Drizzle Kit, PostgreSQL, Neon-compatible connection strings
- UI: Tailwind CSS v4, shadcn/ui, Base UI, Lucide icons
- Email: React Email + Resend
- Tooling: TypeScript, `vite-plus`, Oxlint, Oxfmt

## Repository Structure

```text
apps/
  app/        Expo mobile app
  web/        TanStack Start web app
packages/
  api/        Shared tRPC router and server context
  db/         Drizzle schema, migrations, and database client
  email/      React Email templates
  ui/         Shared UI components and hooks
tooling/
  tailwind/   Shared Tailwind base stylesheet
  typescript/ Shared tsconfig presets
```

## How The Pieces Fit Together

- `apps/web` is a `TanStack Start` app and the main server-rendered frontend. It hosts Better Auth, tRPC endpoints, and email sending.
- `apps/app` talks to the web app for auth and API access. In development it auto-detects the LAN host, with an override via `EXPO_PUBLIC_WEB_URL`.
- `packages/api` contains the shared tRPC router used by both clients.
- `packages/db` owns the Drizzle schema for users, sessions, accounts, verifications, and todos.
- `packages/ui` provides shared shadcn-based components for the web app.
- `packages/email` contains the transactional email templates used by auth flows.

## Web App Architecture

- The web app uses `TanStack Start` for file-based routing, server rendering, and server functions.
- Routing is powered by TanStack Router and data fetching/caching is handled with TanStack Query.
- The Vite build is combined with Nitro for the server output used by `build` and `start`.

## Getting Started

### Requirements

- `bun@1.3.11`
- Node `24+`
- A PostgreSQL database URL

### Install

```sh
bun install
```

### Environment

Create a local env file:

```sh
cp .env.example .env.local
```

Populate the values used by the repo:

- `DATABASE_URL`: primary PostgreSQL connection string
- `DATABASE_URL_POOLER`: optional pooled connection string
- `VITE_WEB_URL`: web app origin, for example `http://localhost:6969`
- `RESEND_API_KEY`: required for auth emails
- `EXPO_PUBLIC_WEB_URL`: optional Expo override when LAN host detection is wrong

## Development

Start the web app:

```sh
bun run --filter @boilerplate/web dev
```

Start the Expo app:

```sh
bun run --filter @boilerplate/app dev
```

If you need database tooling while developing:

```sh
bun run --filter @boilerplate/db db:studio
```

## Scripts

### Root

| Command | Purpose |
| --- | --- |
| `bun run lint` | Run repo-wide linting via `vite-plus` / Oxlint |
| `bun run format` | Format the repo via `vite-plus` / Oxfmt |
| `bun run check` | Run repo-wide checks |

### Web App (`@boilerplate/web`)

| Command | Purpose |
| --- | --- |
| `bun run --filter @boilerplate/web dev` | Start the Vite dev server on port `6969` |
| `bun run --filter @boilerplate/web build` | Production build |
| `bun run --filter @boilerplate/web preview` | Preview the built app |
| `bun run --filter @boilerplate/web start` | Start the Nitro server output |

### Mobile App (`@boilerplate/app`)

| Command | Purpose |
| --- | --- |
| `bun run --filter @boilerplate/app dev` | Start Expo |
| `bun run --filter @boilerplate/app ios` | Launch Expo on iOS |
| `bun run --filter @boilerplate/app android` | Launch Expo on Android |
| `bun run --filter @boilerplate/app web` | Run the Expo web target |
| `bun run --filter @boilerplate/app build:simulator` | EAS iOS simulator build |
| `bun run --filter @boilerplate/app build:dev` | EAS development build |
| `bun run --filter @boilerplate/app build:preview` | EAS preview build |
| `bun run --filter @boilerplate/app build:staging-internal` | Internal staging build |
| `bun run --filter @boilerplate/app build:staging` | Store staging build + submit |
| `bun run --filter @boilerplate/app build:production` | Production build + submit |

### Database (`@boilerplate/db`)

| Command | Purpose |
| --- | --- |
| `bun run --filter @boilerplate/db dev` | Open Drizzle Studio |
| `bun run --filter @boilerplate/db db:generate` | Generate migrations from schema changes |
| `bun run --filter @boilerplate/db db:migrate` | Run migrations |
| `bun run --filter @boilerplate/db db:push` | Push schema directly to the database |
| `bun run --filter @boilerplate/db db:pull` | Pull schema from the database |
| `bun run --filter @boilerplate/db db:studio` | Open Drizzle Studio |

### Email (`@boilerplate/email`)

| Command | Purpose |
| --- | --- |
| `bun run --filter @boilerplate/email dev` | Preview React Email templates locally |

## Tooling Notes

- Dependencies shared across workspaces are pinned in the root workspace catalog.
- `vite.config.ts` configures repo-wide linting and formatting rules through `vite-plus`.
- Tailwind styles are centralized in `tooling/tailwind/base.css`.
- `apps/web/components.json` and `packages/ui/components.json` configure shadcn/ui generation.
- The Drizzle schema uses `snake_case` database columns and lives in `packages/db/src/schema`.

## Current Starter Features

- Email/password auth with verification and reset-password emails
- Shared tRPC API with protected procedures
- Todo CRUD example scoped to the signed-in user
- Admin-only user management screens in the web app
- Shared UI package and email package for cross-app reuse
