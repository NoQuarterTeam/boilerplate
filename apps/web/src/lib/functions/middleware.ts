import { redirect } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"

import { db } from "@boilerplate/db/server"

import { ensureSession } from "@/server/sessions"

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await ensureSession()
  const user = await db.query.usersTable.findFirst({
    where: { id: session.user.id },
  })

  if (!user) throw redirect({ to: "/sign-in" })

  return next({ context: { ...session, user } })
})

export const adminMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (!context.user.isAdmin) throw redirect({ to: "/dashboard" })

    return next({
      context: { ...context, user: { ...context.user, isAdmin: true as const } },
    })
  })
