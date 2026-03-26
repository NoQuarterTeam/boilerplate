import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { TrpcProvider } from "@/lib/trpc-provider"
import "@/styles.css"

export default function Layout() {
  return (
    <SafeAreaProvider>
      <TrpcProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="verify-email" />
          <Stack.Screen name="sign-in" options={{ presentation: "modal", headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ presentation: "modal", headerShown: false }} />
        </Stack>
        <StatusBar style="dark" />
      </TrpcProvider>
    </SafeAreaProvider>
  )
}
