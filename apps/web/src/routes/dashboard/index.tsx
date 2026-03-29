import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@boilerplate/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@boilerplate/ui/components/card"

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Overview · Boilerplate" }] }),
  component: DashboardHomePage,
})

function DashboardHomePage() {
  const { user } = Route.useRouteContext()

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Todos</CardTitle>
            <CardDescription>View your todos list.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button nativeButton={false} variant="outline" size="sm" render={<Link to="/dashboard/todos" />}>
              Open todos
              <ArrowRightIcon />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{user.isAdmin ? "Admin" : "Account"}</CardTitle>
            <CardDescription>
              {user.isAdmin ? "Open the Admin section to manage users." : "Use the sidebar to manage your todos."}
            </CardDescription>
          </CardHeader>
          {user.isAdmin ? (
            <CardContent>
              <Button nativeButton={false} variant="outline" size="sm" render={<Link to="/dashboard/users" />}>
                Manage users
                <ArrowRightIcon />
              </Button>
            </CardContent>
          ) : null}
        </Card>
      </div>
    </div>
  )
}
