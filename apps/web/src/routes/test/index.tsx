import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@boilerplate/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@boilerplate/ui/components/card"

import { useAppForm } from "@/components/react-form"

export const Route = createFileRoute("/test/")({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      test: "",
    },
    onSubmit: async () => {},
  })

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>SSR test form</CardTitle>
            <CardDescription>A minimal test page using the same form primitives as sign in.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                void form.handleSubmit()
              }}
            >
              <input />

              <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                )}
              </form.Subscribe>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
