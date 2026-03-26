import { useRouter } from "expo-router"
import { useEffect } from "react"

import { authClient } from "@/lib/auth-client"

export default function VerifyEmail() {
  const { data: session, isPending } = authClient.useSession()

  const router = useRouter()
  useEffect(() => {
    if (isPending) return
    if (session) {
      router.replace("/")
    } else {
      router.replace("/sign-in")
    }
  }, [session, isPending, router])

  return null
}
