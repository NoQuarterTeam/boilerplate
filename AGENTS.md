# Project Instructions

## Code Style

- Use TypeScript for all new files
- Prefer functional components in React
- Use snake_case for database columns
- Don't create uncessary functions or variables, only if they are shared.
- Always infer types from functions rather than typing the return
- Always use the database schema to infer the type of the data.

## Architecture

- Follow the repository pattern
- Keep business logic in service layers

## Dependencies

- Pin shared package versions in the root `package.json` **workspaces.catalog** and depend on them with **`"catalog:"`** in each workspace `package.json`. Do not add ad hoc semver ranges (for example `^1.5.6`) in apps or packages for anything that should be centralized—**Better Auth** (`better-auth`, `@better-auth/expo`, `@better-auth/core`, `@better-auth/drizzle-adapter`, and any other `@better-auth/*` you introduce) must always go through the catalog so web and Expo stay aligned.
