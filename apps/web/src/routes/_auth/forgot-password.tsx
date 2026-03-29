import { createFileRoute, Link } from "@tanstack/react-router"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { useState } from "react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@boilerplate/ui/components/alert"
import { Button } from "@boilerplate/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@boilerplate/ui/components/card"

import { useAppForm } from "@/components/react-form"
import { authClient } from "@/lib/auth/client"

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPasswordPage,
  head: () => ({ meta: [{ title: "Forgot password · Boilerplate" }] }),
})

function ForgotPasswordPage() {
  const [apiError, setApiError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      setApiError(null)
      await authClient.requestPasswordReset(
        { email: value.email.trim(), redirectTo: "/reset-password" },
        {
          onError: ({ error }) => {
            setApiError(error.message ?? "Could not send reset email")
          },
          onSuccess: () => {
            setEmailSent(true)
          },
        },
      )
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>Enter your account email and we will send you a reset link.</CardDescription>
      </CardHeader>
      <CardContent>
        {emailSent ? (
          <Alert>
            <CheckCircle2Icon />
            <AlertTitle>Email sent</AlertTitle>
            <AlertDescription>
              If an account exists for that email, you will receive a password reset link shortly.
            </AlertDescription>
            <AlertAction>
              <Button size="xs" variant="outline" onClick={() => setEmailSent(false)}>
                Send again
              </Button>
            </AlertAction>
          </Alert>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              void form.handleSubmit()
            }}
          >
            <form.AppField
              name="email"
              validators={{
                onSubmit: ({ value }) => {
                  if (!value.trim()) return "Email is required"
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Enter a valid email"
                  return undefined
                },
              }}
            >
              {(field) => <field.TextField label="Email" type="email" autoComplete="email" placeholder="you@example.com" />}
            </form.AppField>

            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Sending link…" : "Send reset link"}
                </Button>
              )}
            </form.Subscribe>

            {apiError && (
              <Alert>
                <AlertCircleIcon />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}
          </form>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link to="/sign-in" className="text-primary underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
