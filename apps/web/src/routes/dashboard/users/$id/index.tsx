import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, notFound } from "@tanstack/react-router"

import { Badge } from "@boilerplate/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@boilerplate/ui/components/card"

import { getUserFn } from "./-data"

const userQueryOptions = (id: string) => queryOptions({ queryKey: ["user", id], queryFn: () => getUserFn({ data: Number(id) }) })

export const Route = createFileRoute("/dashboard/users/$id/")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions(params.id))
    if (!user) throw notFound()
    return { crumb: { label: user.name, url: `/dashboard/users/${params.id}` } }
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.crumb.label ?? "User"} · Boilerplate` }] }),
})

function RouteComponent() {
  const params = Route.useParams()
  const { data: user } = useSuspenseQuery(userQueryOptions(params.id))
  if (!user) throw notFound()
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>User record</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {user.isAdmin && <Badge>Admin</Badge>}
          {user.emailVerified ? <Badge variant="default">Verified</Badge> : <Badge variant="outline">Unverified</Badge>}
        </CardContent>
      </Card>
    </div>
  )
}
