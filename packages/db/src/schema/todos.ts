import { boolean, index, integer, pgTable, text } from "drizzle-orm/pg-core"

import { usersTable } from "./auth-schema"
import { baseColumns } from "./shared"

export const todosTable = pgTable(
  "todos",
  {
    ...baseColumns,
    title: text("title").notNull(),
    completed: boolean("completed").default(false).notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (table) => [index("todos_user_id_idx").on(table.userId)],
)

export type Todo = typeof todosTable.$inferSelect
