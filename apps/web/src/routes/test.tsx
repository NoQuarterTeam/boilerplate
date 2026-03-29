import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/test")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1>Testing SSR</h1>
    </div>
  )
}
