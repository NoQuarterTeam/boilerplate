import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useUniwind } from "uniwind"

import { TrpcProvider } from "@/lib/trpc-provider"
import "@/styles.css"

export default function Layout() {
  const { theme } = useUniwind()
  return (
    <SafeAreaProvider>
      <TrpcProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="verify-email" />
          <Stack.Screen name="sign-in" options={{ presentation: "modal", headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ presentation: "modal", headerShown: false }} />
        </Stack>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
      </TrpcProvider>
    </SafeAreaProvider>
  )
}
