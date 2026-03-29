import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { AlertCircleIcon } from "lucide-react"
import { useState } from "react"
import * as z from "zod"

import { Alert, AlertDescription, AlertTitle } from "@boilerplate/ui/components/alert"
import { Button } from "@boilerplate/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@boilerplate/ui/components/card"
import { toast } from "@boilerplate/ui/components/sonner"

import { useAppForm } from "@/components/react-form"
import { authClient } from "@/lib/auth/client"

const MIN_PASSWORD = 8

export const Route = createFileRoute("/_auth/reset-password")({
  validateSearch: z.object({
    token: z.string().optional().catch(undefined),
    error: z.string().optional().catch(undefined),
  }),
  head: () => ({ meta: [{ title: "Reset password · Boilerplate" }] }),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const navigate = useNavigate()
  const { token, error } = Route.useSearch()
  const [apiError, setApiError] = useState<string | null>(null)

  const form = useAppForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setApiError(null)

      if (!token) {
        setApiError("Missing reset token. Request a new password reset link.")
        return
      }

      await authClient.resetPassword(
        { token, newPassword: value.newPassword },
        {
          onError: ({ error }) => {
            setApiError(error.message ?? "Could not reset password")
          },
          onSuccess: async () => {
            const session = await authClient.getSession()
            if (session.data?.session) {
              void navigate({ to: "/dashboard" })
              return
            }

            toast.success("Password has been reset")
            void navigate({ to: "/sign-in" })
          },
        },
      )
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Set a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          <form.AppField
            name="newPassword"
            validators={{
              onSubmit: ({ value }) => {
                if (!value) return "Password is required"
                if (value.length < MIN_PASSWORD) return `At least ${MIN_PASSWORD} characters`
                return undefined
              },
            }}
          >
            {(field) => (
              <field.TextField
                label="New password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                description={`At least ${MIN_PASSWORD} characters`}
              />
            )}
          </form.AppField>

          <form.AppField
            name="confirmPassword"
            validators={{
              onSubmit: ({ value, fieldApi }) => {
                if (!value) return "Confirm your password"
                const pw = fieldApi.form.getFieldValue("newPassword")
                if (value !== pw) return "Passwords do not match"
                return undefined
              },
            }}
          >
            {(field) => (
              <field.TextField label="Confirm password" type="password" autoComplete="new-password" placeholder="••••••••" />
            )}
          </form.AppField>

          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" className="w-full" disabled={!token || !canSubmit || isSubmitting}>
                {isSubmitting ? "Resetting password…" : "Reset password"}
              </Button>
            )}
          </form.Subscribe>

          {error && (
            <Alert>
              <AlertCircleIcon />
              <AlertTitle>Invalid or expired link</AlertTitle>
              <AlertDescription>Request a new reset link and try again.</AlertDescription>
            </Alert>
          )}

          {apiError && (
            <Alert>
              <AlertCircleIcon />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t pt-4">
        <p className="text-center text-sm text-muted-foreground">
          Need a new link?{" "}
          <Link to="/forgot-password" className="text-primary underline-offset-4 hover:underline">
            Request password reset
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
