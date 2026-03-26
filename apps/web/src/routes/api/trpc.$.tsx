import { createFileRoute } from "@tanstack/react-router"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { appRouter, createTRPCContext } from "@boilerplate/api"

import { auth } from "@/server/auth"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, trpc-accept, x-trpc-source",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
} as const

async function handler({ request }: { request: Request }) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders })
  const response = await fetchRequestHandler({
    req: request,
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: () => createTRPCContext({ auth: { api: auth.api }, headers: request.headers }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error)
    },
  })
  const headers = new Headers(response.headers)

  for (const [key, value] of Object.entries(corsHeaders)) headers.set(key, value)

  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}
export const Route = createFileRoute("/api/trpc/$")({ server: { handlers: { ANY: handler } } })
