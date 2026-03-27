import { router } from "expo-router"
import { useEffect } from "react"
import { ActivityIndicator, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Button, ButtonText } from "@/components/button"
import { Text } from "@/components/text"
import { authClient } from "@/lib/auth-client"

export default function VerifyEmail() {
  const { data: session, isPending } = authClient.useSession()
  const safeAreaInsets = useSafeAreaInsets()

  const verified = Boolean(session?.user?.emailVerified)

  useEffect(() => {
    if (isPending) return
    if (verified) router.replace("/")
  }, [isPending, verified])

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-background" style={{ paddingBottom: safeAreaInsets.bottom }}>
        <ActivityIndicator />
      </View>
    )
  }

  if (verified) {
    return (
      <View className="flex-1 items-center justify-center bg-background" style={{ paddingBottom: safeAreaInsets.bottom }}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View
      className="flex-1 justify-center gap-4 bg-background px-6"
      style={{ paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }}
    >
      <Text className="text-2xl font-bold">Check your email</Text>
      <Text className="text-base leading-[22px] text-muted-foreground">
        We sent you a verification link. Open it on this device—when you tap the link, your email is verified and you'll be signed
        in here automatically.
      </Text>
      <Button variant="outline" onPress={() => router.dismissTo("/")}>
        <ButtonText className="text-center">Back to home</ButtonText>
      </Button>
    </View>
  )
}
