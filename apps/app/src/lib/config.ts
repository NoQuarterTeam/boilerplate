import Constants from "expo-constants"

/**
 * Web app URL (Vite dev server or deployed origin). Used for Better Auth and tRPC.
 * Override with EXPO_PUBLIC_WEB_URL when the debugger host heuristic is wrong.
 */
export function getWebBaseUrl() {
  const fromEnv = process.env.EXPO_PUBLIC_WEB_URL?.replace(/\/$/, "")
  if (fromEnv) return fromEnv

  const host =
    Constants.expoConfig?.hostUri?.split(":")[0] ??
    Constants.debuggerHost?.split(":")[0] ??
    (Constants.manifest2 as { extra?: { expoGo?: { debuggerHost?: string } } } | null)?.extra?.expoGo?.debuggerHost?.split(":")[0]

  if (!host) return "http://localhost:6969"
  return `http://${host}:6969`
}
