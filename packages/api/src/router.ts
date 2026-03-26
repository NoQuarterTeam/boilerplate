import type { TRPCRouterRecord } from "@trpc/server"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { desc, eq } from "@boilerplate/db"
import { todosTable } from "@boilerplate/db/schema"
import { db } from "@boilerplate/db/server"

import { createTRPCRouter, protectedProcedure } from "./init"

const todosRouter = {
  list: protectedProcedure.query(async ({ ctx }) => {
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
      .where(eq(todosTable.userId, ctx.user.id))
      .orderBy(desc(todosTable.createdAt))
  }),

  create: protectedProcedure.input(z.object({ title: z.string().trim().min(1) })).mutation(async ({ ctx, input }) => {
    const [row] = await db.insert(todosTable).values({ title: input.title, userId: ctx.user.id }).returning()
    return row
  }),

  setCompleted: protectedProcedure
    .input(z.object({ id: z.number().int(), completed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const [todo] = await db.select().from(todosTable).where(eq(todosTable.id, input.id)).limit(1)
      if (!todo) throw new TRPCError({ code: "NOT_FOUND" })
      if (todo.userId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" })

      const [updated] = await db
        .update(todosTable)
        .set({ completed: input.completed })
        .where(eq(todosTable.id, input.id))
        .returning()
      return updated
    }),

  delete: protectedProcedure.input(z.object({ id: z.number().int() })).mutation(async ({ ctx, input }) => {
    const [todo] = await db.select().from(todosTable).where(eq(todosTable.id, input.id)).limit(1)
    if (!todo) throw new TRPCError({ code: "NOT_FOUND" })
    if (todo.userId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" })

    await db.delete(todosTable).where(eq(todosTable.id, input.id))
    return { ok: true as const }
  }),
} satisfies TRPCRouterRecord

export const appRouter = createTRPCRouter({
  todos: todosRouter,
})
export type AppRouter = typeof appRouter
