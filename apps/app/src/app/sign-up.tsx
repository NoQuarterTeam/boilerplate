import { router } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, Platform, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useAppForm } from "@/components/react-form"
import { Text } from "@/components/text"
import { authClient } from "@/lib/auth-client"

const MIN_PASSWORD = 8

export default function SignUp() {
  const [error, setError] = useState<string | null>(null)
  const safeAreaInsets = useSafeAreaInsets()
  const auth = authClient.useSession()

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setError(null)
      await authClient.signUp.email(
        { email: value.email.trim(), password: value.password, name: value.name.trim() },
        {
          onError: ({ error: err }) => {
            setError(err.message ?? "Could not create account")
          },
          onSuccess: async () => {
            await auth.refetch()
            router.dismissAll()
          },
        },
      )
    },
  })

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ paddingBottom: safeAreaInsets.bottom, flex: 1 }}
    >
      <form.AppForm>
        <View className="flex-1 gap-2 bg-background px-6 pt-6">
          <Text className="text-2xl font-bold">Sign up</Text>
          <form.AppField
            name="name"
            validators={{
              onSubmit: ({ value }) => (!value.trim() ? "Name is required" : undefined),
            }}
          >
            {(field) => <field.TextField label="Name" placeholder="Your name" autoComplete="name" />}
          </form.AppField>
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
            {(field) => (
              <field.TextField
                label="Email"
                placeholder="you@example.com"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
              />
            )}
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
                placeholder={`At least ${MIN_PASSWORD} characters`}
                secureTextEntry
                autoComplete="new-password"
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
              <field.TextField label="Confirm password" placeholder="Repeat password" secureTextEntry autoComplete="new-password" />
            )}
          </form.AppField>
          <form.FormError>{error}</form.FormError>
          <form.SubmitButton onPress={() => void form.handleSubmit()}>Create account</form.SubmitButton>
        </View>
      </form.AppForm>
    </KeyboardAvoidingView>
  )
}
