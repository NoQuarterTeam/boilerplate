import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import type { ReactNode } from "react"
import superjson from "superjson"

import type { AppRouter } from "@boilerplate/api"

import { FULL_WEB_URL } from "@/lib/config"
import { TRPCProvider } from "@/lib/integrations/trpc/react"

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return ""
    return FULL_WEB_URL
  })()
  return `${base}/api/trpc`
}

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchStreamLink({
      transformer: superjson,
      url: getUrl(),
      fetch(url, opts) {
        return fetch(url, { ...opts, credentials: "include" })
      },
    }),
  ],
})

let context: { queryClient: QueryClient; trpc: ReturnType<typeof createTRPCOptionsProxy<AppRouter>> } | undefined

export function getContext() {
  if (context) return context
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { gcTime: 5000 },
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
  })
  const serverHelpers = createTRPCOptionsProxy({ client: trpcClient, queryClient: queryClient })
  context = { queryClient, trpc: serverHelpers }
  return context
}

export function TanStackQueryProvider({ children }: { children: ReactNode }) {
  const { queryClient } = getContext()

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}
