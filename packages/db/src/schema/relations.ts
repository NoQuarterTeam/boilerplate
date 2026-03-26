import { defineRelations } from "drizzle-orm"

import * as schema from "."

export const relations = defineRelations(schema, (r) => ({
  usersTable: {
    accounts: r.many.accountsTable(),
    sessions: r.many.sessionsTable(),
    todos: r.many.todosTable(),
  },
  sessionsTable: { user: r.one.usersTable({ from: r.sessionsTable.userId, to: r.usersTable.id }) },
  accountsTable: { user: r.one.usersTable({ from: r.accountsTable.userId, to: r.usersTable.id }) },
  todosTable: {
    creator: r.one.usersTable({ from: r.todosTable.userId, to: r.usersTable.id }),
  },
}))
