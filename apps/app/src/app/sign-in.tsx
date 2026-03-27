import { router } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Button, ButtonText } from "@/components/button"
import { useAppForm } from "@/components/react-form"
import { Text } from "@/components/text"
import { authClient } from "@/lib/auth-client"

export default function SignIn() {
  const [error, setError] = useState<string | null>(null)
  const safeAreaInsets = useSafeAreaInsets()

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setError(null)
      await authClient.signIn.email(
        { email: value.email.trim(), password: value.password },
        {
          onError: ({ error: err }) => {
            if (err.status === 403) {
              router.replace("/verify-email")
              return
            }
            setError(err.message ?? "Could not sign in")
          },
          onSuccess: () => {
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
      <View className="flex-1 gap-2 bg-background px-6 pt-6">
        <Text className="text-2xl font-bold">Sign in</Text>
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
            onSubmit: ({ value }) => (!value ? "Password is required" : undefined),
          }}
        >
          {(field) => <field.TextField label="Password" placeholder="••••••••" secureTextEntry autoComplete="password" />}
        </form.AppField>
        {error ? <Text className="mt-1 text-sm text-red-700">{error}</Text> : null}
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <Button className="mt-5" disabled={!canSubmit || isSubmitting} onPress={() => void form.handleSubmit()}>
              {isSubmitting ? <ActivityIndicator color="#fafafa" /> : <ButtonText className="text-center">Log in</ButtonText>}
            </Button>
          )}
        </form.Subscribe>
      </View>
    </KeyboardAvoidingView>
  )
}
