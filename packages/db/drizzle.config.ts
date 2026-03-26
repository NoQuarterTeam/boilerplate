import { defineConfig } from "drizzle-kit"

if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL")

export default defineConfig({
  out: "./src/migrations",
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: { url: process.env.DATABASE_URL },
})
