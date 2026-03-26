import { notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import z from "zod"

import { db } from "@boilerplate/db/server"

import { adminMiddleware } from "@/lib/functions/middleware"

export const getUserFn = createServerFn({ method: "GET" })
  .inputValidator(z.int())
  .middleware([adminMiddleware])
  .handler(async ({ data }) => {
    const user = await db.query.usersTable.findFirst({ where: { id: data } })
    if (!user) throw notFound()
    return user
  })
