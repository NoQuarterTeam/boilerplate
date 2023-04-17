import { json, type LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { db } from "~/lib/db.server"

export const loader = async ({ request }: LoaderArgs) => {
  const users = await db.user.findMany()
  return json(users)
}

export default function Users() {
  const users = useLoaderData<typeof loader>()
  return (
    <div>
      <h1>Users</h1>
      <div>
        {users.map((user) => (
          <div key={user.id}>
            {user.email} - {user.firstName} {user.lastName} - {user.createdAt}
          </div>
        ))}
      </div>
    </div>
  )
}
