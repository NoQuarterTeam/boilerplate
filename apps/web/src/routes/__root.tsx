import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router"
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query"

import type { AppRouter } from "@boilerplate/api"
import { Toaster } from "@boilerplate/ui/components/sonner"

import { DefaultError } from "@/components/default-error"
import { ThemeProvider } from "@/components/theme-provider"
import { TanStackQueryProvider } from "@/lib/integrations/tanstack-query/root-provider"

import appCss from "../styles.css?url"

interface MyRouterContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<AppRouter>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { title: "Boilerplate" }],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  headers: () => ({
    "Cache-Control": "no-cache",
    "CDN-Cache-Control": "no-cache",
    "Vercel-CDN-Cache-Control": "no-cache",
  }),
  errorComponent: (p) => (
    <div className="h-screen w-screen">
      <DefaultError {...p} />
    </div>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <TanStackQueryProvider>
            {children}
            <Toaster />
          </TanStackQueryProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
