import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@boilerplate/ui/components/card"
import { toast } from "@boilerplate/ui/components/sonner"

import { useAppForm } from "@/components/react-form"
import { authClient } from "@/lib/auth/client"

export const Route = createFileRoute("/_auth/sign-in")({
  component: SignInPage,
  head: () => ({ meta: [{ title: "Sign in · Boilerplate" }] }),
})

function SignInPage() {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    onSubmit: async ({ value }) => {
      setApiError(null)
      await authClient.signIn.email(
        { email: value.email.trim(), password: value.password, rememberMe: value.rememberMe, callbackURL: "/dashboard" },
        {
          onError: ({ error }) => {
            if (error.status === 403) {
              toast.error("Please verify your email address", {
                description: "An email has been sent to your inbox again.",
              })
              return
            }
            setApiError(error.message ?? "Could not sign in")
          },
          onSuccess: () => {
            void navigate({ to: "/dashboard" })
          },
        },
      )
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your email and password to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form.AppForm>
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

            <form.AppField
              name="password"
              validators={{
                onSubmit: ({ value }) => (!value ? "Password is required" : undefined),
              }}
            >
              {(field) => (
                <field.TextField label="Password" type="password" autoComplete="current-password" placeholder="••••••••" />
              )}
            </form.AppField>

            <form.AppField name="rememberMe">{(field) => <field.CheckboxField label="Remember me" />}</form.AppField>

            <form.SubmitButton>{(isSubmitting) => (isSubmitting ? "Signing in…" : "Sign in")}</form.SubmitButton>

            <form.FormError>{apiError}</form.FormError>
          </form>
        </form.AppForm>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <Link to="/forgot-password" className="text-primary underline-offset-4 hover:underline">
            Forgot your password?
          </Link>
          <Link to="/sign-up" className="text-primary underline-offset-4 hover:underline">
            Create an account
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
