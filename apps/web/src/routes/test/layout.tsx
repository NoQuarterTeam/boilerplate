import { createFileRoute, Outlet } from "@tanstack/react-router"

import { getAuthSessionFn } from "../_auth/-data"

export const Route = createFileRoute("/test")({
  component: Outlet,
  beforeLoad: async () => {
    await getAuthSessionFn()
  },
})
