import { useRouter } from "expo-router"
import { useEffect } from "react"

import { authClient } from "@/lib/auth-client"

export default function VerifyEmail() {
  const { data: session, isPending } = authClient.useSession()

  const router = useRouter()
  useEffect(() => {
    if (isPending) return

    router.replace("/")
  }, [session, isPending, router])

  return null
}
