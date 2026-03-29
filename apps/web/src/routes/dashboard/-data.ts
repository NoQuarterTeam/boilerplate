import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

import { authMiddleware } from "@/lib/functions/middleware"
import { signOut } from "@/server/sessions"

export const signOutFn = createServerFn({ method: "POST" }).handler(async () => {
  await signOut()
  throw redirect({ to: "/sign-in" })
})

export const getCurrentUserFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(({ context }) => context.user)
