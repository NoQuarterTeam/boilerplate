import { createFileRoute, Link } from "@tanstack/react-router"
import { AlertCircleIcon, MailCheckIcon } from "lucide-react"
import { useMemo, useState } from "react"
import * as z from "zod"

import { Alert, AlertDescription, AlertTitle } from "@boilerplate/ui/components/alert"
import { Button } from "@boilerplate/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@boilerplate/ui/components/card"
import { toast } from "@boilerplate/ui/components/sonner"

import { useAppForm } from "@/components/react-form"
import { authClient } from "@/lib/auth/client"

export const Route = createFileRoute("/_auth/verify-email")({
  validateSearch: z.object({
    email: z.string().optional().catch(undefined),
  }),
  component: VerifyEmailPage,
  head: () => ({ meta: [{ title: "Verify your email · Boilerplate" }] }),
})

function VerifyEmailPage() {
  const { email: emailFromSearch } = Route.useSearch()
  const defaultEmail = emailFromSearch?.trim() ?? ""
  const formKey = useMemo(() => defaultEmail || "empty", [defaultEmail])

  return <VerifyEmailForm key={formKey} defaultEmail={defaultEmail} introUsesPrefilledEmail={Boolean(defaultEmail)} />
}

function VerifyEmailForm({ defaultEmail, introUsesPrefilledEmail }: { defaultEmail: string; introUsesPrefilledEmail: boolean }) {
  const [apiError, setApiError] = useState<string | null>(null)

  const form = useAppForm({
    defaultValues: {
      email: defaultEmail,
    },
    onSubmit: async ({ value }) => {
      setApiError(null)
      await authClient.sendVerificationEmail(
        { email: value.email.trim(), callbackURL: "/dashboard" },
        {
          onError: ({ error }) => {
            setApiError(getVerificationEmailErrorMessage(error))
          },
          onSuccess: () => {
            toast.success("Verification email sent")
          },
        },
      )
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          We sent a verification link to your inbox. Open it to activate your account, or request another email below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <Alert>
            <MailCheckIcon />
            <AlertTitle>Check your inbox</AlertTitle>
            <AlertDescription>
              {introUsesPrefilledEmail
                ? `We sent a link to ${defaultEmail}. If you do not see it, try spam or resend.`
                : "If you already signed up, enter your email below to resend the verification link."}
            </AlertDescription>
          </Alert>

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
                  {isSubmitting ? "Sending…" : "Resend verification email"}
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
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <Link to="/sign-in" className="text-primary underline-offset-4 hover:underline">
            Back to sign in
          </Link>
          <Link to="/sign-up" className="text-primary underline-offset-4 hover:underline">
            Create an account
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

function getVerificationEmailErrorMessage(error: { message?: string } | undefined) {
  return error?.message ?? "Could not send verification email"
}
