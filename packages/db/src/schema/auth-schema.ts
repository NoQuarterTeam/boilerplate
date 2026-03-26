import { boolean, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-orm/zod"
import * as z from "zod"

import { baseColumns } from "./shared"

export const usersTable = pgTable("users", {
  ...baseColumns,
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  isAdmin: boolean("is_admin").default(false).notNull(),
})

export const userSchema = createSelectSchema(usersTable).extend({
  email: z.email().trim().min(3).toLowerCase(),
  name: z.string().trim().min(1),
})

export type User = typeof usersTable.$inferSelect

export const sessionsTable = pgTable(
  "sessions",
  {
    ...baseColumns,
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
)

export const accountsTable = pgTable(
  "accounts",
  {
    ...baseColumns,
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
)

export const verificationsTable = pgTable(
  "verifications",
  {
    ...baseColumns,
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
)
