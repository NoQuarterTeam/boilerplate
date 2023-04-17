import { type Prisma } from "@boilerplate/database"
import { Tile } from "@boilerplate/ui"
import { json, type LoaderArgs, type SerializeFrom } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Search } from "~/components/Search"
import { Column, Table } from "~/components/Table"
import { db } from "~/lib/db.server"
import { getTableParams } from "~/lib/table"

export const loader = async ({ request }: LoaderArgs) => {
  const { orderBy, search, skip, take } = getTableParams(request, 10, { orderBy: "createdAt", order: "desc" })
  const where = {
    OR: search
      ? [{ email: { contains: search } }, { firstName: { contains: search } }, { lastName: { contains: search } }]
      : undefined,
  } satisfies Prisma.UserWhereInput
  const users = await db.user.findMany({
    orderBy,
    skip,
    take,
    where,
  })
  const count = await db.user.count({ where })
  return json({ users, count })
}

type User = SerializeFrom<typeof loader>["users"][number]

export default function Users() {
  const { users, count } = useLoaderData<typeof loader>()
  return (
    <div className="stack">
      <h1 className="text-4xl">Users</h1>
      <Search />
      <Tile>
        <Table<User> data={users} count={count}>
          <Column<User> sortKey="firstName" header="Name" row={(user) => user.firstName} />
          <Column<User> sortKey="email" header="Email" row={(user) => user.email} />
          <Column<User> sortKey="createdAt" header="Signed up" row={(user) => user.createdAt} />
        </Table>
      </Tile>
    </div>
  )
}
