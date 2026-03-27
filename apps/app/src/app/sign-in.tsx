import { router } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Button, ButtonText } from "@/components/button"
import { Input } from "@/components/input"
import { Text } from "@/components/text"
import { authClient } from "@/lib/auth-client"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async () => {
    setError(null)
    setSubmitting(true)
    try {
      await authClient.signIn.email(
        { email: email.trim(), password },
        {
          onError: ({ error: err }) => {
            if (err.status === 403) {
              return Alert.alert("Please verify your email", "Check your inbox for a verification link.")
            }
            setError(err.message ?? "Could not sign in")
          },
          onSuccess: () => {
            router.back()
          },
        },
      )
    } finally {
      setSubmitting(false)
    }
  }
  const safeAreaInsets = useSafeAreaInsets()

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ paddingBottom: safeAreaInsets.bottom, flex: 1 }}
    >
      <View className="flex-1 gap-2 bg-background px-6 pt-6">
        <Text className="text-2xl font-bold">Sign in</Text>
        <Text className="mt-2 text-sm font-semibold">Email</Text>
        <Input
          placeholder="you@example.com"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text className="mt-2 text-sm font-semibold">Password</Text>
        <Input placeholder="••••••••" secureTextEntry autoComplete="password" value={password} onChangeText={setPassword} />
        {error ? <Text className="mt-1 text-sm text-red-700">{error}</Text> : null}
        <Button className="mt-5" disabled={submitting || !email.trim() || !password} onPress={() => void handleLogin()}>
          {submitting ? <ActivityIndicator color="#fafafa" /> : <ButtonText className="text-center">Log in</ButtonText>}
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}
