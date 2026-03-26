import { expoClient } from "@better-auth/expo/client"
import { createAuthClient } from "better-auth/react"
import * as SecureStore from "expo-secure-store"

import { getWebBaseUrl } from "@/lib/config"

export const authClient = createAuthClient({
  baseURL: getWebBaseUrl(),
  plugins: [expoClient({ scheme: "boilerplate", storagePrefix: "boilerplate", storage: SecureStore })],
})
