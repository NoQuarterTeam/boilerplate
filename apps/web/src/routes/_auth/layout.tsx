import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { getAuthSessionFn } from "./-data"

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const session = await getAuthSessionFn()
    if (session?.user) throw redirect({ to: "/dashboard" })
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </main>
  )
}
