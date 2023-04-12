import AsyncStorage from "@react-native-async-storage/async-storage"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { View } from "react-native"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { Text } from "../components/Text"
import { api, AUTH_TOKEN } from "../lib/utils/api"

export default function Home() {
  const { data } = api.auth.me.useQuery()
  const router = useRouter()
  const utils = api.useContext()
  const client = useQueryClient()
  const handleLogout = async () => {
    utils.auth.me.setData(undefined, null)
    await AsyncStorage.setItem(AUTH_TOKEN, "")
    client.clear()
  }
  return (
    <View className="px-4 pt-20 ">
      <Heading className="text-4xl">Welcome to the boilerplate</Heading>
      {data ? (
        <View className="space-y-2">
          <Text className="text-2xl">Hey {data.firstName}</Text>
          <Button onPress={handleLogout} variant="outline">
            Log out
          </Button>
        </View>
      ) : (
        <Button onPress={() => router.push("/login")}>Login</Button>
      )}
    </View>
  )
}
