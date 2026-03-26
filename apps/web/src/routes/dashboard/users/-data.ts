import { createServerFn } from "@tanstack/react-start"

import { count, desc, ilike, or } from "@boilerplate/db"
import { usersTable } from "@boilerplate/db/schema"
import { db } from "@boilerplate/db/server"

import { adminMiddleware } from "@/lib/functions/middleware"
import { tablePaginationSchema } from "@/lib/functions/validators"

export const getUsersFn = createServerFn({ method: "GET" })
  .inputValidator(tablePaginationSchema)
  .middleware([adminMiddleware])
  .handler(async ({ data }) => {
    const offset = (data.page - 1) * data.pageSize
    const searchFilter = data.search
      ? or(ilike(usersTable.name, `%${data.search}%`), ilike(usersTable.email, `%${data.search}%`))
      : undefined

    const listBase = db.select().from(usersTable)
    const listFiltered = searchFilter ? listBase.where(searchFilter) : listBase
    const countBase = db.select({ totalCount: count() }).from(usersTable)
    const countFiltered = searchFilter ? countBase.where(searchFilter) : countBase
    const [users, countResult] = await Promise.all([
      listFiltered.orderBy(desc(usersTable.createdAt)).limit(data.pageSize).offset(offset),
      countFiltered,
    ])

    const totalCount = Number(countResult[0]?.totalCount ?? 0)

    return { users, totalCount, totalPages: Math.ceil(totalCount / data.pageSize) }
  })
