import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import { createTRPCContext } from "@trpc/tanstack-react-query"
import { useState, type ReactNode } from "react"
import superjson from "superjson"

import type { AppRouter } from "@boilerplate/api"

import { authClient } from "@/lib/auth-client"
import { getWebBaseUrl } from "@/lib/config"

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()

export function TrpcProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } }))

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: `${getWebBaseUrl()}/api/trpc`,
          headers() {
            const headers = new Map<string, string>()
            const cookies = authClient.getCookie()
            if (cookies) headers.set("Cookie", cookies)
            return Object.fromEntries(headers)
          },
          fetch(url, opts) {
            return fetch(url, { ...opts, credentials: "omit" })
          },
        }),
      ],
    }),
  )

  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TRPCProvider>
  )
}
