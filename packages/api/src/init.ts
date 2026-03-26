import { initTRPC, TRPCError } from "@trpc/server"
import type { Auth } from "better-auth"
import superjson from "superjson"

import type { User } from "@boilerplate/db/schema"
import { db } from "@boilerplate/db/server"

type AuthSessionApi = Pick<Auth["api"], "getSession">

export const createTRPCContext = async (opts: { headers: Headers; auth: { api: AuthSessionApi } }) => {
  const authApi = opts.auth.api
  const session = await authApi.getSession({ headers: opts.headers })
  return { authApi, session, db, user: null as User | null }
}

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create({ transformer: superjson })

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

const requireUser = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED" })
  const user = await ctx.db.query.usersTable.findFirst({ where: { id: Number(ctx.session.user.id) } })
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" })
  return next({ ctx: { ...ctx, user } })
})

export const protectedProcedure = t.procedure.use(requireUser)

const requireAdminUser = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Not signed in" })
  if (!ctx.user.isAdmin) throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" })
  return next({ ctx: { ...ctx, user: ctx.user } })
})

export const adminProcedure = protectedProcedure.use(requireAdminUser)
