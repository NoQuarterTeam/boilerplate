import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@boilerplate/ui/components/card"
import { toast } from "@boilerplate/ui/components/sonner"

import { useAppForm } from "@/components/react-form"
import { authClient } from "@/lib/auth/client"

export const Route = createFileRoute("/_auth/sign-up")({
  component: SignUpPage,
  head: () => ({ meta: [{ title: "Sign up · Boilerplate" }] }),
})

const MIN_PASSWORD = 8

function SignUpPage() {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)

  const form = useAppForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setApiError(null)
      await authClient.signUp.email(
        {
          email: value.email.trim(),
          password: value.password,
          name: value.name.trim(),
          callbackURL: "/verify-email",
        },
        {
          onError: ({ error }) => {
            setApiError(error.message ?? "Could not create account")
          },
          onSuccess: () => {
            toast.success("Account created", { description: "Please check your email for a verification link." })
            void navigate({ to: "/verify-email", search: { email: value.email.trim() } })
          },
        },
      )
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Sign up with your email. You will need to verify it before signing in.</CardDescription>
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
              name="name"
              validators={{
                onSubmit: ({ value }) => (!value.trim() ? "Name is required" : undefined),
              }}
            >
              {(field) => <field.TextField label="Name" autoComplete="name" placeholder="Jane Doe" />}
            </form.AppField>

            <form.AppField
              name="password"
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
                  label="Password"
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
                  const pw = fieldApi.form.getFieldValue("password")
                  if (value !== pw) return "Passwords do not match"
                  return undefined
                },
              }}
            >
              {(field) => (
                <field.TextField label="Confirm password" type="password" autoComplete="new-password" placeholder="••••••••" />
              )}
            </form.AppField>

            <form.SubmitButton>{(isSubmitting) => (isSubmitting ? "Creating account…" : "Create account")}</form.SubmitButton>
            <form.FormError>{apiError}</form.FormError>
          </form>
        </form.AppForm>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <Link to="/sign-in" className="text-primary underline-offset-4 hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
