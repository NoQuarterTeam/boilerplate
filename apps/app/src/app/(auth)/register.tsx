import AsyncStorage from "@react-native-async-storage/async-storage"
import { Link, useRouter } from "expo-router"
import * as React from "react"
import { KeyboardAvoidingView, ScrollView, View } from "react-native"
import { Button } from "../../components/Button"
import { FormError } from "../../components/FormError"
import { FormInput } from "../../components/FormInput"
import { Heading } from "../../components/Heading"

import { api, AUTH_TOKEN } from "../../lib/utils/api"

export default function Register() {
  const queryClient = api.useContext()
  const router = useRouter()
  const login = api.auth.register.useMutation({
    onSuccess: async (data) => {
      await AsyncStorage.setItem(AUTH_TOKEN, data.token)
      queryClient.auth.me.setData(undefined, data.user)
      router.replace("/")
    },
  })
  const handleRegister = async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN)
    login.mutate({ email, password, firstName, lastName })
  }

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")

  return (
    <KeyboardAvoidingView>
      <ScrollView className="h-full space-y-3 px-4 pt-16">
        <Heading className="text-4xl">Register</Heading>
        <View>
          <FormInput label="Email" value={email} onChangeText={setEmail} error={login.error?.data?.zodError?.fieldErrors.email} />
        </View>
        <View>
          <FormInput
            secureTextEntry
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={login.error?.data?.zodError?.fieldErrors.password}
          />
          <View>
            <FormInput
              label="First name"
              value={firstName}
              onChangeText={setFirstName}
              error={login.error?.data?.zodError?.fieldErrors.firstName}
            />
          </View>
          <View>
            <FormInput
              label="Last name"
              value={lastName}
              onChangeText={setLastName}
              error={login.error?.data?.zodError?.fieldErrors.lastName}
            />
          </View>
        </View>
        <View className="space-y-1">
          <View>
            <Button isLoading={login.isLoading} disabled={login.isLoading} onPress={handleRegister}>
              Register
            </Button>
          </View>
          {login.error?.data?.formError && (
            <View>
              <FormError error={login.error.data.formError} />
            </View>
          )}
        </View>
        <Link href="/login" className="mt-6 text-lg">
          Login
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
