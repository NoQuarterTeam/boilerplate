import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/users")({
  component: Outlet,
  beforeLoad: ({ context }) => {
    if (!context.user.isAdmin) throw redirect({ to: "/dashboard" })
  },
  loader: () => ({ crumb: { label: "Users", url: "/dashboard/users" } }),
  head: () => ({ meta: [{ title: "Users · Boilerplate" }] }),
})
