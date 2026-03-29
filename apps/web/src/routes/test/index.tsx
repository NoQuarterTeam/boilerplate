import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@boilerplate/ui/components/button"

export const Route = createFileRoute("/test/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1>Testing SSR</h1>

      <Button>Click me</Button>
    </div>
  )
}
