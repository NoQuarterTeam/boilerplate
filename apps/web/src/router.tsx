import { QueryClient } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import SuperJSON from "superjson"

import { DefaultError } from "./components/default-error"
import { DefaultNotFound } from "./components/default-not-found"
import { makeTRPCClient, TRPCProvider } from "./lib/integrations/trpc"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: { dehydrate: { serializeData: SuperJSON.serialize }, hydrate: { deserializeData: SuperJSON.deserialize } },
  })
  const trpcClient = makeTRPCClient()
  const trpc = createTRPCOptionsProxy({ client: trpcClient, queryClient })

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient, trpc },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: () => null,
    defaultErrorComponent: DefaultError,
    defaultNotFoundComponent: DefaultNotFound,
    defaultOnCatch: (error) => {
      console.error("Router error", error)
    },
    Wrap: (props) => <TRPCProvider trpcClient={trpcClient} queryClient={queryClient} {...props} />,
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
