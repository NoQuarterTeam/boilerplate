import { router } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, View } from "react-native"

import { Button, ButtonText } from "@/components/button"
import { Input } from "@/components/input"
import { authClient } from "@/lib/auth-client"

const MIN_PASSWORD = 8

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSignUp = async () => {
    setError(null)
    if (password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters`)
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setSubmitting(true)
    try {
      await authClient.signUp.email(
        { email: email.trim(), password, name: name.trim() },
        {
          onError: ({ error: err }) => {
            setError(err.message ?? "Could not create account")
          },
          onSuccess: () => {
            Alert.alert("Check your email", "We sent a verification link. After verifying, you can sign in here.", [
              { text: "OK", onPress: () => router.back() },
            ])
          },
        },
      )
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = name.trim() && email.trim() && password.length >= MIN_PASSWORD && password === confirmPassword && !submitting

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
      <View className="flex-1 gap-2 px-6 pt-4">
        <Text className="text-2xl font-bold">Sign up</Text>
        <Text className="mt-2 text-sm font-semibold text-neutral-700">Name</Text>
        <Input placeholder="Your name" autoComplete="name" value={name} onChangeText={setName} />
        <Text className="mt-2 text-sm font-semibold text-neutral-700">Email</Text>
        <Input
          placeholder="you@example.com"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text className="mt-2 text-sm font-semibold text-neutral-700">Password</Text>
        <Input
          placeholder={`At least ${MIN_PASSWORD} characters`}
          secureTextEntry
          autoComplete="new-password"
          value={password}
          onChangeText={setPassword}
        />
        <Text className="mt-2 text-sm font-semibold text-neutral-700">Confirm password</Text>
        <Input
          placeholder="Repeat password"
          secureTextEntry
          autoComplete="new-password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {error ? <Text className="mt-1 text-sm text-red-700">{error}</Text> : null}
        <Button className="mt-5" disabled={!canSubmit} onPress={() => void handleSignUp()}>
          {submitting ? <ActivityIndicator color="#fafafa" /> : <ButtonText className="text-center">Create account</ButtonText>}
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}
