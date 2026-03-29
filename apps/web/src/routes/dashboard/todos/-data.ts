import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

import { desc, eq } from "@boilerplate/db"
import { todosTable } from "@boilerplate/db/schema"
import { db } from "@boilerplate/db/server"

import { authMiddleware } from "@/lib/functions/middleware"

export const listTodosFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(({ context }) => {
    return db
      .select({
        id: todosTable.id,
        title: todosTable.title,
        completed: todosTable.completed,
        createdAt: todosTable.createdAt,
        updatedAt: todosTable.updatedAt,
        userId: todosTable.userId,
      })
      .from(todosTable)
      .where(eq(todosTable.userId, context.user.id))
      .orderBy(desc(todosTable.createdAt))
  })

export type TodoListItem = Awaited<ReturnType<typeof listTodosFn>>[number]

export const createTodoFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.object({ title: z.string().trim().min(1) }))
  .handler(async ({ context, data }) => {
    const [row] = await db.insert(todosTable).values({ title: data.title, userId: context.user.id }).returning()
    return row
  })

export const setTodoCompletedFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.object({ id: z.number().int(), completed: z.boolean() }))
  .handler(async ({ context, data }) => {
    const [todo] = await db.select().from(todosTable).where(eq(todosTable.id, data.id)).limit(1)
    if (!todo) throw new Error("Todo not found")
    if (todo.userId !== context.user.id) throw new Error("Forbidden")

    const [updated] = await db.update(todosTable).set({ completed: data.completed }).where(eq(todosTable.id, data.id)).returning()
    return updated
  })

export const deleteTodoFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.object({ id: z.number().int() }))
  .handler(async ({ context, data }) => {
    const [todo] = await db.select().from(todosTable).where(eq(todosTable.id, data.id)).limit(1)
    if (!todo) throw new Error("Todo not found")
    if (todo.userId !== context.user.id) throw new Error("Forbidden")

    await db.delete(todosTable).where(eq(todosTable.id, data.id))
    return { ok: true as const }
  })
